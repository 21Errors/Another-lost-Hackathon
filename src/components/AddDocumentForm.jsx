// src/components/AddDocumentForm/AddDocumentForm.jsx
import React, { useState } from 'react';
import styles from './AddDocumentForm.module.css'; // Import the CSS module

export default function AddDocumentForm({ onAdded, username }) {
  const [form, setForm] = useState({
    title: '',
    type: '',
    category: '',
    issuing_authority: '',
    description: '',
    keywords: '',
    applicable_to: '',
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
      if (dataToSend.applicable_to) {
        dataToSend.applicable_to = dataToSend.applicable_to.split(',').map(item => item.trim());
      } else {
        dataToSend.applicable_to = [];
      }

      const res = await fetch('http://localhost:5000/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': username || '',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Failed to add document. Status: ${res.status}`);
      }

      const newDocument = await res.json();
      setForm({
        title: '', type: '', category: '', issuing_authority: '',
        description: '', keywords: '', applicable_to: '',
        external_url: '', source: '',
      });
      setLoading(false);
      setMessage('Document added successfully!');
      onAdded(newDocument);
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

      {/* --- Form Fields --- */}
      <input
        name="title"
        placeholder="Title *"
        value={form.title}
        onChange={handleChange}
        required
        className={styles.input}
      />
      <input
        name="type"
        placeholder="Type (e.g., Form, Policy)"
        value={form.type}
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
        name="issuing_authority"
        placeholder="Issuing Authority"
        value={form.issuing_authority}
        onChange={handleChange}
        className={styles.input} 
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className={`${styles.input} ${styles.textarea}`} 
      />
      <input
        name="keywords"
        placeholder="Keywords (comma separated, e.g., 'AML, Compliance')"
        value={form.keywords}
        onChange={handleChange}
        className={styles.input} 
      />
      <input
        name="applicable_to"
        placeholder="Applicable To (comma separated, e.g., 'Individual, Business')"
        value={form.applicable_to}
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
        {loading ? 'Adding...' : 'Add Document'}
      </button>
    </form>
  );
}