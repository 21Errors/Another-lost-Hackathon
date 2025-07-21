// src/pages/AddDocumentPage.jsx
import React from 'react';
import AddDocumentForm from '../components/AddDocumentForm';
import { Link, useNavigate } from 'react-router-dom';
import pageStyles from './PageLayout.module.css'; // Import shared page styles

export default function AddDocumentPage() {
  const navigate = useNavigate();

  const handleAdded = () => {
    alert('Document added successfully!');
    navigate('/documents');
  };

  const username = 'Admin'; // your username here

  return (
    <div className={pageStyles.container}> {/* Apply container style */}
      <h1 className={pageStyles.pageTitle}>Add New Document</h1> {/* Apply page title style */}
      <AddDocumentForm onAdded={handleAdded} username={username} />
      <Link
        to="/documents"
        className={pageStyles.backLink}
      >
        &larr; Back to Documents
      </Link>
    </div>
  );
}