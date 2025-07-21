const express = require('express');
const db = require('../config/db'); // Adjust path
const auth = require('../middleware/auth');
const router = express.Router();

// Get notification preferences
router.get('/', auth, async (req, res) => {
  try {
    const [prefs] = await db.query('SELECT * FROM notifications WHERE user_id = ?', [req.user.id]);
    if (prefs.length === 0) {
      return res.json({ notify_documents: false, notify_events: false, notify_news: false });
    }
    res.json(prefs[0]);
  } catch (error) {
    console.error('Get preferences error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Subscribe to notifications
router.post('/subscribe', auth, async (req, res) => {
  const { notify_documents, notify_news, notify_events } = req.body;

  try {
    await db.query(
      'INSERT INTO notifications (user_id, notify_documents, notify_news, notify_events) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE notify_documents = ?, notify_news = ?, notify_events = ?',
      [req.user.id, notify_documents || false, notify_news || false, notify_events || false, notify_documents || false, notify_news || false, notify_events || false]
    );
    res.json({ message: 'Notification preferences updated' });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Unsubscribe from notifications
router.post('/unsubscribe', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM notifications WHERE user_id = ?', [req.user.id]);
    res.json({ message: 'Unsubscribed from notifications' });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;