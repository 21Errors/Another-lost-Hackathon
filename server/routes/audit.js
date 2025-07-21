const express = require('express');
const db = require('../config/db'); // Adjust path
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');
const router = express.Router();

// Get audit logs (admin-only)
router.get('/audit-logs', auth, requireAdmin, async (req, res) => {
  try {
    const [logs] = await db.query(
      'SELECT audit_logs.*, users.username FROM audit_logs LEFT JOIN users ON audit_logs.user_id = users.id ORDER BY timestamp DESC'
    );
    res.json(logs);
  } catch (error) {
    console.error('Audit logs error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;