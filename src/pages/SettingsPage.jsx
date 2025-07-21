// src/pages/SettingsPage/SettingsPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import styles from './SettingsPage.module.css'; // Import page-specific styles

// Import Lucide icons
import {
  Settings,        // For the main title
  MailCheck,       // For save button
  MailX,           // For unsubscribe button
  LoaderCircle,    // For loading state (though not directly used in this code)
  AlertTriangle,   // For error state
  CheckCircle,     // For success message
} from 'lucide-react';

export default function SettingsPage() {
  const { user } = useContext(AuthContext);
  const [notifyDocuments, setNotifyDocuments] = useState(false);
  const [notifyEvents, setNotifyEvents] = useState(false);
  const [notifyNews, setNotifyNews] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchPreferences = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/notifications', {
          headers: { Authorization: user.username },
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to fetch preferences');
        }
        const data = await response.json();
        setNotifyDocuments(data.notify_documents || false);
        setNotifyEvents(data.notify_events || false);
        setNotifyNews(data.notify_news || false);
      } catch (err) {
        console.error('Fetch preferences error:', err);
        setError(`Failed to load preferences: ${err.message}`); // Display fetch error
      }
    };
    fetchPreferences();
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch('http://localhost:5000/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: user.username },
        body: JSON.stringify({
          notify_documents: notifyDocuments,
          notify_events: notifyEvents,
          notify_news: notifyNews,
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update preferences');
      }
      setSuccess('Preferences updated successfully');
    } catch (err) {
      setError(err.message || 'Server error');
    }
  };

  const handleUnsubscribe = async () => {
    setError(null);
    setSuccess(null);
    if (!window.confirm('Are you sure you want to unsubscribe from ALL notifications?')) {
        return; // User cancelled
    }
    try {
      const response = await fetch('http://localhost:5000/api/notifications/unsubscribe', {
        method: 'POST',
        headers: { Authorization: user.username },
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to unsubscribe');
      }
      setNotifyDocuments(false);
      setNotifyEvents(false);
      setNotifyNews(false);
      setSuccess('Unsubscribed from all notifications');
    } catch (err) {
      setError(err.message || 'Server error');
    }
  };

  // Elfsight widget once on mount
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://static.elfsight.com/platform/platform.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <>
      {/* Page Banner for Settings */}
      <div className={styles.header}>
        <h1 className={styles.title}>
          <Settings size={32} className={styles.titleIcon} /> Notification Settings
        </h1>
      </div>

      {/* Main Content Container */}
      <div className={styles.container}>
        {error && <p className={styles.errorMessage}><AlertTriangle size={20} className={styles.messageIcon} /> {error}</p>}
        {success && <p className={styles.successMessage}><CheckCircle size={20} className={styles.messageIcon} /> {success}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={notifyDocuments}
                onChange={(e) => setNotifyDocuments(e.target.checked)}
                className={styles.checkboxInput}
              />
              Notify me about new documents
            </label>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={notifyEvents}
                onChange={(e) => setNotifyEvents(e.target.checked)}
                className={styles.checkboxInput}
              />
              Notify me about new events
            </label>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={notifyNews}
                onChange={(e) => setNotifyNews(e.target.checked)}
                className={styles.checkboxInput}
              />
              Notify me about new news articles
            </label>
          </div>
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.saveButton}>
              <MailCheck size={20} /> Save Preferences
            </button>
            <button
              type="button"
              onClick={handleUnsubscribe}
              className={styles.unsubscribeButton}
            >
              <MailX size={20} /> Unsubscribe from All
            </button>
          </div>
        </form>
        <div className="elfsight-app-89cbd518-8c1b-4c9e-b505-4ccf01775cd5" data-elfsight-app-lazy></div>
      </div>
    </>
  );
}