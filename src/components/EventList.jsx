// src/components/EventList/EventList.jsx
import React from 'react';
import EventCard from './EventCard'; // Ensure correct relative path
import styles from './EventList.module.css'; // Import the CSS module

function EventList({ results, onDelete }) {
  // The "No results found" message is handled by the parent EventsPage component
  // for consistent messaging and centralized state management.
  return (
    <div className={styles.list}> {/* Apply list style */}
      {results.map((event) => (
        <EventCard key={event.id} event={event} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default EventList;