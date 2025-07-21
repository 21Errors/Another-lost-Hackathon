// src/pages/AddEventPage.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AddEventForm from '../components/AddEventForm';
import pageStyles from './PageLayout.module.css'; // Import shared page styles

export default function AddEventPage() {
  const navigate = useNavigate();

  const handleAdded = () => {
    alert('Event added successfully!');
    navigate('/events');
  };

  return (
    <div className={pageStyles.container}> {/* Apply container style */}
      <h1 className={pageStyles.pageTitle}>Add New Event</h1> {/* Apply page title style */}
      <AddEventForm onAdded={handleAdded} username="Admin" />
      <Link
        to="/events"
        className={pageStyles.backLink} 
      >
        &larr; Back to Events
      </Link>
    </div>
  );
}