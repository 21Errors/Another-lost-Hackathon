// src/components/NewsList/NewsList.jsx
import React from 'react';
import NewsCard from './NewsCard'; // Ensure correct relative path
import styles from './NewsList.module.css'; // Import the CSS module

function NewsList({ results, onDelete }) {
  // The "No results found" message is handled by the parent NewsPage component
  // for consistent messaging and centralized state management.
  return (
    <div className={styles.list}> {/* Apply list style */}
      {results.map((news) => (
        <NewsCard key={news.id} news={news} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default NewsList;