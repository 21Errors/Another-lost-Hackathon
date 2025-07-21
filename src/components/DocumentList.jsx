// src/components/DocumentList/DocumentList.jsx
import React from 'react';
import DocumentCard from './DocumentCard'; // Ensure this path is correct relative to DocumentList
import styles from './DocumentList.module.css';

function DocumentList({ results, onDelete }) {
  // The empty state message is now handled by DocumentsPage.jsx for consistency.
  // This component focuses solely on rendering the list of cards.
  return (
    <div className={styles.list}>
      {results.map((doc) => (
        <DocumentCard key={doc.id} document={doc} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default DocumentList;