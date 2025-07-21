// src/pages/EditNewsPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import styles from '../components/common/EditFormPage.module.css'; // Import shared styles

export default function EditNewsPage() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    publish_date: '',
    category: '',
    keywords: '',
    external_url: '',
    source: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // IMPORTANT: Ensure your API endpoint is correct.
        // The original code had `https://hackathon-w8qk.onrender.com/api/news/${id}`.
        // I'm using `http://localhost:5000/api/news/${id}` as a placeholder assuming a local API.
        const res = await fetch(`https://hackathon-w8qk.onrender.com/api/news/${id}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        // Format date for input type="date"
        if (data.publish_date) {
          data.publish_date = new Date(data.publish_date).toISOString().split('T')[0];
        }
        setFormData(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || 'News article not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setLoading(true); // Indicate saving is in progress

    try {
      const res = await fetch(`https://hackathon-w8qk.onrender.com/api/news/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: user?.username,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }
      alert('News article updated successfully!'); // Use alert for now, consider custom modal later
      navigate('/news');
    } catch (err) {
      console.error('Update failed:', err);
      setError(`Update failed: ${err.message}`);
      // alert(`Update failed: ${err.message}`); // Removed redundant alert
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className={styles.loadingMessage}>Loading news article...</p>;
  if (error) return <p className={styles.errorMessage}>{error}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Edit News Article</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.formGroup}>
          Title:
          <input
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </label>
        <label className={styles.formGroup}>
          Content:
          <textarea
            name="content"
            value={formData.content || ''}
            onChange={handleChange}
            className={`${styles.input} ${styles.textarea}`}
            rows={3}
            required
          />
        </label>
        <label className={styles.formGroup}>
          Author:
          <input
            name="author"
            value={formData.author || ''}
            onChange={handleChange}
            className={styles.input}
          />
        </label>
        <label className={styles.formGroup}>
          Publish Date:
          <input
            name="publish_date"
            type="date"
            value={formData.publish_date || ''}
            onChange={handleChange}
            className={styles.input}
          />
        </label>
        <label className={styles.formGroup}>
          Category:
          <input
            name="category"
            value={formData.category || ''}
            onChange={handleChange}
            className={styles.input}
          />
        </label>
        <label className={styles.formGroup}>
          Keywords:
          <input
            name="keywords"
            placeholder="Comma separated"
            value={formData.keywords || ''}
            onChange={handleChange}
            className={styles.input}
          />
        </label>
        <label className={styles.formGroup}>
          External URL:
          <input
            name="external_url"
            value={formData.external_url || ''}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </label>
        <label className={styles.formGroup}>
          Source:
          <input
            name="source"
            value={formData.source || ''}
            onChange={handleChange}
            className={styles.input}
          />
        </label>
        <button type="submit" className={styles.button}>
          Save Changes
        </button>
      </form>
      <Link to="/news" className={styles.backLink}>
        &larr; Back to News
      </Link>
    </div>
  );
}