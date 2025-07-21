const db = require('../config/db');

module.exports = async (req, res, next) => {
  const username = req.headers['authorization'];
  if (!username) {
    return res.status(401).json({ error: 'Authorization header required' });
  }

  try {
    const [users] = await db.query(
      'SELECT id, username, role FROM users WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid username' });
    }

    req.user = users[0]; // { id, username, role }
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
