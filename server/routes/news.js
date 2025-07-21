const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const transporter = require('../config/email');
const auth = require('../middleware/auth'); // ✅ same as documents
const checkRole = require('../middleware/requireAdmin'); // ✅ Import the admin checker


// ✅ Test route
router.get('/', (req, res) => {
  res.send('✅ News API is running! Use /all or /search.');
});

// ✅ List ALL news articles
router.get('/all', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM news_updates ORDER BY title ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching news articles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Advanced Search
router.get('/search', async (req, res) => {
  const { keyword, category } = req.query;
  let query = `SELECT * FROM news_updates WHERE 1=1`;
  const values = [];

  if (keyword && keyword.trim() !== '') {
    query += ` AND (
      LOWER(COALESCE(title, '')) LIKE ?
      OR LOWER(COALESCE(content, '')) LIKE ?
      OR LOWER(COALESCE(keywords, '')) LIKE ?
      OR LOWER(COALESCE(author, '')) LIKE ?
    )`;
    const like = `%${keyword.toLowerCase()}%`;
    values.push(like, like, like, like);
  }
  if (category && category.trim() !== '') {
    query += ` AND LOWER(category) = ?`;
    values.push(category.toLowerCase());
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
    const [rows] = await pool.query(
      'SELECT DISTINCT category FROM news_updates WHERE category IS NOT NULL AND category != ""'
    );
    res.json(rows);
  } catch (error) {
    console.error('Fetch categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Get by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM news_updates WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'News article not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Fetch by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Create news & notify & log audit
router.post('/', auth, checkRole, async (req, res) => {
  const {
    title, content, author, publish_date,
    category, keywords, external_url, source
  } = req.body;

  if (!title || !content || !external_url) {
    return res.status(400).json({ error: 'Title, content, and external_url are required' });
  }

  try {
    const query = `
      INSERT INTO news_updates (
        title, content, author, publish_date,
        category, keywords, external_url, source
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      title, content, author, publish_date,
      category, keywords, external_url, source
    ];
    const [result] = await pool.query(query, values);

    // ✅ Insert audit log
    await pool.query(
      `INSERT INTO audit_logs (user_id, action, target_id, target_type)
       VALUES (?, ?, ?, ?)`,
      [req.user.id, 'Created news article', result.insertId, 'news']
    );

    // ✅ Notify subscribers
    const [subscribers] = await pool.query(
      `SELECT u.email FROM notifications n
       JOIN users u ON n.user_id = u.id
       WHERE n.notify_news = TRUE`
    );

    for (const user of subscribers) {
      await transporter.sendMail({
        from: 'YOUR_EMAIL@gmail.com',
        to: user.email,
        subject: `📰 New News Article: ${title}`,
        text: `A new news article "${title}" has been published.\nRead more: ${external_url}`
      });
    }

    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    console.error('Create news error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Update with audit
router.put('/:id', auth, checkRole, async (req, res) => {
  const { id } = req.params;
  const {
    title, content, author, publish_date,
    category, keywords, external_url, source
  } = req.body;

  try {
    const query = `
      UPDATE news_updates
      SET title=?, content=?, author=?, publish_date=?,
          category=?, keywords=?, external_url=?, source=?
      WHERE id=?
    `;
    const values = [
      title, content, author, publish_date,
      category, keywords, external_url, source, id
    ];
    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'News article not found' });
    }

    // ✅ Insert audit log
    await pool.query(
      `INSERT INTO audit_logs (user_id, action, target_id, target_type)
       VALUES (?, ?, ?, ?)`,
      [req.user.id, 'Updated news article', id, 'news']
    );

    res.json({ id, ...req.body });
  } catch (error) {
    console.error('Update news article error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Delete with audit
router.delete('/:id', auth, checkRole, async (req, res) => {
  const { id } = req.params;

  try {
    const query = 'DELETE FROM news_updates WHERE id = ?';
    const [result] = await pool.query(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'News article not found' });
    }

    // ✅ Insert audit log
    await pool.query(
      `INSERT INTO audit_logs (user_id, action, target_id, target_type)
       VALUES (?, ?, ?, ?)`,
      [req.user.id, 'Deleted news article', id, 'news']
    );

    res.json({ message: 'News article deleted successfully' });
  } catch (error) {
    console.error('Delete news article error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
