// src/pages/EventsPage/EventsPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Path might need adjustment
import { Link } from 'react-router-dom';
import EventSearch from '../components/EventSearch'; // Path might need adjustment
import EventList from '../components/EventList'; // Path might need adjustment
import styles from './EventsPage.module.css'; // Import the CSS module

// Import Lucide icons
import {
  CalendarDays,    // For the main title
  FilePlus,        // For the "Add New Event" button (reusing FilePlus for consistency)
  LoaderCircle,    // For loading state
  AlertTriangle,   // For error state
  Info             // For empty state
} from 'lucide-react';

export default function EventsPage() {
  const { user } = useContext(AuthContext);

  const [events, setEvents] = useState([]);
  const [lastSearchParams, setLastSearchParams] = useState({
    keyword: '',
    category: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvents = async (params) => {
    setLoading(true);
    setError(null);

    try {
      let url;
      if (params && params.keyword && params.keyword.trim() !== '') {
        const query = new URLSearchParams(params).toString();
        url = `http://localhost:5000/api/events/search?${query}`;
      } else {
        url = 'http://localhost:5000/api/events/all';
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setError(`Failed to load events: ${error.message}`);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(lastSearchParams);
  }, [lastSearchParams]);

  const handleSearch = (results) => {
    setEvents(results);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: 'DELETE',
        headers: { Authorization: user?.username },
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      alert('Event deleted!');
      fetchEvents(lastSearchParams);
    } catch (error) {
      console.error('Failed to delete event:', error);
      alert(`Delete failed: ${error.message}`);
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
    <div className={styles.container}> {/* Apply container style */}
      <h1 className={styles.title}> {/* Apply title style */}
        <CalendarDays size={32} className={styles.titleIcon} /> Events
      </h1>

      {user?.role === 'admin' && (
        <div className={styles.addButtonWrapper}>
          <Link
            to="/add-event"
            className={styles.addButton} // Apply button style
          >
            <FilePlus size={20} /> Add New Event
          </Link>
        </div>
      )}

      <EventSearch onSearch={handleSearch} />

      {loading && (
        <p className={styles.loadingState}> {/* Apply loading style */}
          <LoaderCircle size={24} className={styles.loadingIcon} /> Loading events...
        </p>
      )}
      {error && (
        <p className={styles.errorState}> {/* Apply error style */}
          <AlertTriangle size={24} className={styles.errorIcon} /> {error}
        </p>
      )}
      {!loading && !error && events.length === 0 && (
        <p className={styles.emptyState}> {/* Apply empty style */}
          <Info size={20} className={styles.emptyIcon} /> No events found.
        </p>
      )}

      <EventList results={events} onDelete={user?.role === 'admin' ? handleDelete : null} />

      <div
        className="elfsight-app-89cbd518-8c1b-4c9e-b505-4ccf01775cd5"
        data-elfsight-app-lazy
      ></div>
    </div>
  );
}