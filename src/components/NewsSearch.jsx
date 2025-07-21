// src/components/NewsSearch/NewsSearch.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './NewsSearch.module.css';

function NewsSearch({ onSearch }) {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('https://hackathon-w8qk.onrender.com/api/news/categories');
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
      const response = await axios.get('https://hackathon-w8qk.onrender.com/api/news/search', {
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
    onSearch([]);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search news..."
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
      {/* Added className to this div */}
      <div className={styles.buttonContainer}>
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

export default NewsSearch;