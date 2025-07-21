// src/components/AddNewsForm/AddNewsForm.jsx
import React, { useState } from 'react';
import styles from './AddNewsForm.module.css'; // Import the CSS module

export default function AddNewsForm({ onAdded, username }) {
  const [form, setForm] = useState({
    title: '',
    content: '',
    author: '',
    publish_date: '',
    category: '',
    keywords: '',
    external_url: '',
    source: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage('');
    setLoading(true);

    try {
      const dataToSend = { ...form };

      const res = await fetch('http://https://hackathon-w8qk.onrender.com/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: username || '', // ✅ Use username in header
        },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Failed to add news article. Status: ${res.status}`);
      }

      const newNews = await res.json();
      setForm({
        title: '',
        content: '',
        author: '',
        publish_date: '',
        category: '',
        keywords: '',
        external_url: '',
        source: '',
      });
      setLoading(false);
      setMessage('News article added successfully!');
      onAdded(newNews);
    } catch (err) {
      setError(`Error: ${err.message || 'Network error'}`);
      setLoading(false);
      console.error('Error submitting form:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}> {/* Apply form style */}
      
      {error && <p className={styles.errorMessage}>{error}</p>} {/* Apply error message style */}
      {message && <p className={styles.successMessage}>{message}</p>} {/* Apply success message style */}

      <input
        name="title"
        placeholder="Title *"
        value={form.title}
        onChange={handleChange}
        required
        className={styles.input}
      />
      <textarea
        name="content"
        placeholder="Content *"
        value={form.content}
        onChange={handleChange}
        required
        className={`${styles.input} ${styles.textarea}`} 
      />
      <input
        name="author"
        placeholder="Author"
        value={form.author}
        onChange={handleChange}
        className={styles.input} 
      />
      <input
        name="publish_date"
        type="date"
        placeholder="Publish Date"
        value={form.publish_date}
        onChange={handleChange}
        className={styles.input} 
      />
      <input
        name="category"
        placeholder="Category"
        value={form.category}
        onChange={handleChange}
        className={styles.input} 
      />
      <input
        name="keywords"
        placeholder="Keywords (comma separated)"
        value={form.keywords}
        onChange={handleChange}
        className={styles.input} 
      />
      <input
        name="external_url"
        placeholder="External URL *"
        value={form.external_url}
        onChange={handleChange}
        required
        className={styles.input} 
      />
      <input
        name="source"
        placeholder="Source"
        value={form.source}
        onChange={handleChange}
        className={styles.input} 
      />

      <button
        type="submit"
        disabled={loading}
        className={styles.button} 
      >
        {loading ? 'Adding...' : 'Add News Article'}
      </button>
    </form>
  );
}