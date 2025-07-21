const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const transporter = require('../config/email');
const auth = require('../middleware/auth'); // ✅ Make sure you have this!
const checkRole = require('../middleware/requireAdmin'); // ✅ Import the admin checker


// ✅ Test route
router.get('/', (req, res) => {
  res.send('✅ Documents API is running! Use /all or /search.');
});

// ✅ List ALL documents
router.get('/all', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM documents ORDER BY title ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Advanced Search
router.get('/search', async (req, res) => {
  const { keyword, category, type } = req.query;
  let query = `SELECT * FROM documents WHERE 1=1`;
  const values = [];

  if (keyword && keyword.trim() !== '') {
    query += ` AND (
      LOWER(COALESCE(title, '')) LIKE ?
      OR LOWER(COALESCE(description, '')) LIKE ?
      OR LOWER(COALESCE(keywords, '')) LIKE ?
      OR LOWER(COALESCE(applicable_to, '')) LIKE ?
      OR LOWER(COALESCE(issuing_authority, '')) LIKE ?
    )`;
    const like = `%${keyword.toLowerCase()}%`;
    values.push(like, like, like, like, like);
  }
  if (category && category.trim() !== '') {
    query += ` AND LOWER(category) = ?`;
    values.push(category.toLowerCase());
  }
  if (type && type.trim() !== '') {
    query += ` AND LOWER(type) = ?`;
    values.push(type.toLowerCase());
  }

  try {
    const [rows] = await pool.query(query, values);
    res.json(rows);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Get categories
router.get('/categories', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT DISTINCT category FROM documents WHERE category IS NOT NULL AND category != ""');
    res.json(rows);
  } catch (error) {
    console.error('Fetch categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Get types
router.get('/types', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT DISTINCT type FROM documents WHERE type IS NOT NULL AND type != ""');
    res.json(rows);
  } catch (error) {
    console.error('Fetch types error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Get by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM documents WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Fetch by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Create document & notify & log
router.post('/', auth, checkRole, async (req, res) => {
  const {
    title, type, category, issuing_authority,
    description, keywords, applicable_to, external_url, source
  } = req.body;

  if (!title || !external_url) {
    return res.status(400).json({ error: 'Title and external_url are required' });
  }

  try {
    const query = `
      INSERT INTO documents (
        title, type, category, issuing_authority,
        description, keywords, applicable_to, external_url, source
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      title, type, category, issuing_authority,
      description, keywords, applicable_to, external_url, source
    ];
    const [result] = await pool.query(query, values);

    // ✅ Insert audit log
    await pool.query(
      `INSERT INTO audit_logs (user_id, action, target_id, target_type)
       VALUES (?, ?, ?, ?)`,
      [req.user.id, 'Created document', result.insertId, 'document']
    );

    // ✅ Notify subscribers
    const [subscribers] = await pool.query(
      `SELECT u.email FROM notifications n
       JOIN users u ON n.user_id = u.id
       WHERE n.notify_documents = TRUE`
    );

    for (const user of subscribers) {
      await transporter.sendMail({
        from: 'YOUR_EMAIL@gmail.com',
        to: user.email,
        subject: `📄 New Document: ${title}`,
        text: `A new document "${title}" has been added.\nView: ${external_url}`
      });
    }

    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    console.error('Create document error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Update with audit
router.put('/:id', auth, checkRole, async (req, res) => {
  const { id } = req.params;
  const {
    title, type, category, issuing_authority,
    description, keywords, applicable_to, external_url, source
  } = req.body;

  try {
    const query = `
      UPDATE documents
      SET title=?, type=?, category=?, issuing_authority=?, description=?, keywords=?, applicable_to=?, external_url=?, source=?
      WHERE id=?
    `;
    const values = [title, type, category, issuing_authority, description, keywords, applicable_to, external_url, source, id];
    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // ✅ Insert audit log
    await pool.query(
      `INSERT INTO audit_logs (user_id, action, target_id, target_type)
       VALUES (?, ?, ?, ?)`,
      [req.user.id, 'Updated document', id, 'document']
    );

    res.json({ id, ...req.body });
  } catch (error) {
    console.error('Update document error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Delete with audit
router.delete('/:id', auth, checkRole, async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'DELETE FROM documents WHERE id = ?';
    const [result] = await pool.query(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // ✅ Insert audit log
    await pool.query(
      `INSERT INTO audit_logs (user_id, action, target_id, target_type)
       VALUES (?, ?, ?, ?)`,
      [req.user.id, 'Deleted document', id, 'document']
    );

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
