// src/components/EventSearch/EventSearch.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './EventSearch.module.css'; // Import the CSS module

// Removed Lucide Search icon import as it's no longer styled within input or on button in this simpler design.
// If you still want an icon on the button, you'd re-add it here and adjust .button style in CSS.

function EventSearch({ onSearch }) {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/events/categories');
        setCategories(res.data);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('http://localhost:5000/api/events/search', {
        params: { keyword, category },
      });
      onSearch(response.data);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleReset = () => {
    setKeyword('');
    setCategory('');
    onSearch([]); // Clears search results
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}> {/* Apply form style */}
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search events..."
        className={styles.input} 
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className={styles.select}
      >
        <option value="">All Categories</option>
        {categories.map((cat, idx) => (
          <option key={idx} value={cat.category}>{cat.category}</option>
        ))}
      </select>
      <div>
        <button
          type="submit"
          className={styles.button} 
        >
          Search
        </button>
      </div>
    </form>
  );
}

export default EventSearch;