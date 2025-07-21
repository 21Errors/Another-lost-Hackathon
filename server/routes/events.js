const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const transporter = require('../config/email');
const auth = require('../middleware/auth'); // Added auth middleware
const checkRole = require('../middleware/requireAdmin'); // ✅ Import the admin checker


// Test route
router.get('/', (req, res) => {
  res.send('✅ Events API is running! Use /all or /search.');
});

// List ALL events
router.get('/all', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM events ORDER BY title ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Advanced Search
router.get('/search', async (req, res) => {
  const { keyword, category } = req.query;
  let query = `SELECT * FROM events WHERE 1=1`;
  const values = [];

  if (keyword && keyword.trim() !== '') {
    query += ` AND (
      LOWER(COALESCE(title, '')) LIKE ?
      OR LOWER(COALESCE(description, '')) LIKE ?
      OR LOWER(COALESCE(keywords, '')) LIKE ?
      OR LOWER(COALESCE(location, '')) LIKE ?
      OR LOWER(COALESCE(host, '')) LIKE ?
    )`;
    const like = `%${keyword.toLowerCase()}%`;
    values.push(like, like, like, like, like);
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

// Get categories
router.get('/categories', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT DISTINCT category FROM events WHERE category IS NOT NULL AND category != ""'
    );
    res.json(rows);
  } catch (error) {
    console.error('Fetch categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Fetch by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create event & log audit
router.post('/', auth, checkRole, async (req, res) => {
  const {
    title, description, event_date, location, host,
    link_or_rsvp, category, keywords, source
  } = req.body;

  if (!title || !description || !event_date || !link_or_rsvp) {
    return res.status(400).json({ error: 'Title, description, event_date, and link_or_rsvp are required' });
  }

  try {
    const query = `
      INSERT INTO events (
        title, description, event_date, location, host,
        link_or_rsvp, category, keywords, source
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      title, description, event_date, location, host,
      link_or_rsvp, category, keywords, source
    ];
    const [result] = await pool.query(query, values);

    // Log audit using user_id
    await pool.query(
      `INSERT INTO audit_logs (user_id, action, target_id, target_type) VALUES (?, ?, ?, ?)`,
      [req.user.id, 'Created event', result.insertId, 'event']
    );

    // Notify subscribers
    const [subscribers] = await pool.query(
      `SELECT u.email FROM notifications n
       JOIN users u ON n.user_id = u.id
       WHERE n.notify_events = TRUE`
    );

    for (const user of subscribers) {
      await transporter.sendMail({
        from: 'YOUR_EMAIL@gmail.com',
        to: user.email,
        subject: `📅 New Event: ${title}`,
        text: `A new event "${title}" has been added.\nCheck it here: ${link_or_rsvp}`
      });
    }

    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update & log audit
router.put('/:id', auth, checkRole, async (req, res) => {
  const { id } = req.params;
  const {
    title, description, event_date, location, host,
    link_or_rsvp, category, keywords, source
  } = req.body;

  try {
    const query = `
      UPDATE events
      SET title=?, description=?, event_date=?, location=?, host=?,
          link_or_rsvp=?, category=?, keywords=?, source=?
      WHERE id=?
    `;
    const values = [
      title, description, event_date, location, host,
      link_or_rsvp, category, keywords, source, id
    ];
    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Log audit
    await pool.query(
      `INSERT INTO audit_logs (user_id, action, target_id, target_type) VALUES (?, ?, ?, ?)`,
      [req.user.id, 'Updated event', id, 'event']
    );

    res.json({ id, ...req.body });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete & log audit
router.delete('/:id', auth, checkRole, async (req, res) => {
  const { id } = req.params;

  try {
    const query = 'DELETE FROM events WHERE id = ?';
    const [result] = await pool.query(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Log audit
    await pool.query(
      `INSERT INTO audit_logs (user_id, action, target_id, target_type) VALUES (?, ?, ?, ?)`,
      [req.user.id, 'Deleted event', id, 'event']
    );

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
