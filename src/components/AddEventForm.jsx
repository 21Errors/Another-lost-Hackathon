// src/components/AddEventForm/AddEventForm.jsx
import React, { useState } from 'react';
import styles from './AddEventForm.module.css'; // Import the CSS module

export default function AddEventForm({ onAdded, username }) {
  const [form, setForm] = useState({
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage('');
    setLoading(true);

    try {
      const dataToSend = { ...form };

      const res = await fetch('https://hackathon-w8qk.onrender.com/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: username || '',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.error || `Failed to add event. Status: ${res.status}`
        );
      }

      const newEvent = await res.json();
      setForm({
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
      setLoading(false);
      setMessage('Event added successfully!');
      onAdded(newEvent);
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
        name="description"
        placeholder="Description *"
        value={form.description}
        onChange={handleChange}
        required
        className={`${styles.input} ${styles.textarea}`}
      />
      <input
        name="event_date"
        type="date"
        placeholder="Event Date *"
        value={form.event_date}
        onChange={handleChange}
        required
        className={styles.input}
      />
      <input
        name="location"
        placeholder="Location"
        value={form.location}
        onChange={handleChange}
        className={styles.input}
      />
      <input
        name="host"
        placeholder="Host"
        value={form.host}
        onChange={handleChange}
        className={styles.input} 
      />
      <input
        name="link_or_rsvp"
        placeholder="Link or RSVP *"
        value={form.link_or_rsvp}
        onChange={handleChange}
        required
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
        {loading ? 'Adding...' : 'Add Event'}
      </button>
    </form>
  );
}