const pool = require('../config/db');

const searchDocuments = async (keyword, category, type) => {
  let query = `
    SELECT id, title, category, type, issuing_authority, external_url
    FROM documents
    WHERE (LOWER(title) LIKE ? OR LOWER(description) LIKE ? OR LOWER(keywords) LIKE ?)
  `;
  const values = [`%${keyword.toLowerCase()}%`, `%${keyword.toLowerCase()}%`, `%${keyword.toLowerCase()}%`];

  if (category) {
    query += ' AND category = ?';
    values.push(category);
  }
  if (type) {
    query += ' AND type = ?';
    values.push(type);
  }

  query += ' ORDER BY title ASC LIMIT 50;';

  const [rows] = await pool.query(query, values);
  return rows;
};

module.exports = { searchDocuments };
