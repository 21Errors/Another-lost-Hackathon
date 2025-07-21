// src/pages/AddNewsPage.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AddNewsForm from '../components/AddNewsForm';
import pageStyles from './PageLayout.module.css'; // Import shared page styles

export default function AddNewsPage() {
  const navigate = useNavigate();

  const handleAdded = () => {
    alert('News article added successfully!');
    navigate('/news');
  };

  return (
    <div className={pageStyles.container}> {/* Apply container style */}
      <h1 className={pageStyles.pageTitle}>Add New News Article</h1> {/* Apply page title style */}
      <AddNewsForm onAdded={handleAdded} username="Admin" />
      <Link
        to="/news"
        className={pageStyles.backLink} 
      >
        &larr; Back to News
      </Link>
    </div>
  );
}