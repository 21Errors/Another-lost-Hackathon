// src/pages/EditDocumentPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import styles from '../EditFormPage.module.css'; // Import shared styles

function EditDocumentPage() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    type: '',
    description: '',
    issuing_authority: '',
    keywords: '',
    applicable_to: '',
    external_url: '',
    source: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        // IMPORTANT: Ensure your API endpoint is correct.
        // The original code had `https://hackathon-w8qk.onrender.com/${id}` which seems incorrect for a document.
        // It should likely be `http://localhost:5000/api/documents/${id}` or similar.
        // I'm using `http://localhost:5000/api/documents/${id}` as a placeholder assuming a local API.
        const res = await fetch(`https://hackathon-w8qk.onrender.com/api/documents/${id}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        // Assuming applicable_to might come as an array and needs to be a comma-separated string for input
        if (Array.isArray(data.applicable_to)) {
          data.applicable_to = data.applicable_to.join(', ');
        }
        setFormData(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || 'Failed to load document.');
      } finally {
        setLoading(false);
      }
    };
    fetchDocument();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setLoading(true); // Indicate saving is in progress

    try {
      const dataToSend = { ...formData };
      // Convert applicable_to back to array if it's a string
      if (typeof dataToSend.applicable_to === 'string') {
        dataToSend.applicable_to = dataToSend.applicable_to.split(',').map(item => item.trim()).filter(item => item !== '');
      }

      // IMPORTANT: Ensure your API endpoint is correct.
      const res = await fetch(`https://hackathon-w8qk.onrender.com/api/documents/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: user?.username,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }
      alert('Document updated successfully!'); // Use alert for now, consider custom modal later
      navigate('/documents');
    } catch (err) {
      console.error('Update failed:', err);
      setError(`Update failed: ${err.message}`);
      // alert(`Update failed: ${err.message}`); // Removed redundant alert
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className={styles.loadingMessage}>Loading document...</p>;
  if (error) return <p className={styles.errorMessage}>{error}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Edit Document</h1>
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
          Category:
          <input
            name="category"
            value={formData.category || ''}
            onChange={handleChange}
            className={styles.input}
          />
        </label>

        <label className={styles.formGroup}>
          Type:
          <input
            name="type"
            value={formData.type || ''}
            onChange={handleChange}
            className={styles.input}
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
          />
        </label>

        <label className={styles.formGroup}>
          Issuing Authority:
          <input
            name="issuing_authority"
            value={formData.issuing_authority || ''}
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
          Applicable To:
          <input
            name="applicable_to"
            placeholder="Comma separated"
            value={formData.applicable_to || ''}
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
      <Link to="/documents" className={styles.backLink}>
        &larr; Back to Documents
      </Link>
    </div>
  );
}

export default EditDocumentPage;