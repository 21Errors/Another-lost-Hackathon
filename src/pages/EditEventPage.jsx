// src/pages/EditEventPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import styles from './EditFormPage.module.css'; // Import shared styles

export default function EditEventPage() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    host: '',
    link_or_rsvp: '',
    category: '',
    keywords: '',
    source: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // IMPORTANT: Ensure your API endpoint is correct.
        // The original code had `https://hackathon-w8qk.onrender.com/api/events/${id}`.
        // I'm using `http://localhost:5000/api/events/${id}` as a placeholder assuming a local API.
        const res = await fetch(`https://hackathon-w8qk.onrender.com/api/events/${id}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        // Format date for input type="date"
        if (data.event_date) {
          data.event_date = new Date(data.event_date).toISOString().split('T')[0];
        }
        setFormData(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || 'Failed to load event.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setLoading(true); // Indicate saving is in progress

    try {
      const res = await fetch(`https://hackathon-w8qk.onrender.com/api/events/${id}`, {
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
      alert('Event updated successfully!'); // Use alert for now, consider custom modal later
      navigate('/events');
    } catch (err) {
      console.error('Update failed:', err);
      setError(`Update failed: ${err.message}`);
      // alert(`Update failed: ${err.message}`); // Removed redundant alert
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className={styles.loadingMessage}>Loading event...</p>;
  if (error) return <p className={styles.errorMessage}>{error}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Edit Event</h1>
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
          Description:
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            className={`${styles.input} ${styles.textarea}`}
            rows={3}
            required
          />
        </label>
        <label className={styles.formGroup}>
          Event Date:
          <input
            name="event_date"
            type="date"
            value={formData.event_date || ''}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </label>
        <label className={styles.formGroup}>
          Location:
          <input
            name="location"
            value={formData.location || ''}
            onChange={handleChange}
            className={styles.input}
          />
        </label>
        <label className={styles.formGroup}>
          Host:
          <input
            name="host"
            value={formData.host || ''}
            onChange={handleChange}
            className={styles.input}
          />
        </label>
        <label className={styles.formGroup}>
          Link or RSVP:
          <input
            name="link_or_rsvp"
            value={formData.link_or_rsvp || ''}
            onChange={handleChange}
            className={styles.input}
            required
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
      <Link to="/events" className={styles.backLink}>
        &larr; Back to Events
      </Link>
    </div>
  );
}