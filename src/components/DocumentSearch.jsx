import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './DocumentSearch.module.css';

function DocumentSearch({ onSearch }) {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [catsRes, typesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/documents/categories'),
          axios.get('http://localhost:5000/api/documents/types'),
        ]);
        setCategories(catsRes.data);
        setTypes(typesRes.data);
      } catch (error) {
        console.error('Failed to load options:', error);
      }
    };
    fetchOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('http://localhost:5000/api/documents/search', {
        params: { keyword, category, type },
      });
      onSearch(response.data);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search..."
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

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className={styles.select}
      >
        <option value="">All Types</option>
        {types.map((t, idx) => (
          <option key={idx} value={t.type}>{t.type}</option>
        ))}
      </select>

      <button
        type="submit"
        className={styles.button}
      >
        Search
      </button>

     
    </form>
  );
}

export default DocumentSearch;