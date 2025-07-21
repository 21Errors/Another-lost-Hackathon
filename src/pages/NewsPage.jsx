// src/pages/NewsPage/NewsPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Path might need adjustment depending on your folder structure
import { Link } from 'react-router-dom';
import NewsSearch from '../components/NewsSearch'; // Path might need adjustment
import NewsList from '../components/NewsList'; // Path might need adjustment
import styles from './NewsPage.module.css'; // Import the CSS module

// Import Lucide icons
import {
  Newspaper,       // For the main title
  FilePlus,        // For the "Add New News Article" button
  LoaderCircle,    // For loading state
  AlertTriangle,   // For error state
  Info             // For empty state
} from 'lucide-react';

export default function NewsPage() {
  const { user } = useContext(AuthContext);

  const [news, setNews] = useState([]);
  const [lastSearchParams] = useState({
    keyword: '',
    category: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNews = async (params) => {
    setLoading(true);
    setError(null);

    try {
      let url;
      if (params && params.keyword && params.keyword.trim() !== '') {
        const query = new URLSearchParams(params).toString();
        url = `https://hackathon-w8qk.onrender.com/api/news/search?${query}`;
      } else {
        url = 'https://hackathon-w8qk.onrender.com/api/news/all';
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setNews(data);
    } catch (error) {
      console.error('Failed to fetch news:', error);
      setError(`Failed to load news: ${error.message}`);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(lastSearchParams);
  }, [lastSearchParams]);

  const handleSearch = (results) => {
    setNews(results);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this news article?')) return;

    try {
      const res = await fetch(`https://hackathon-w8qk.onrender.com/api/news/${id}`, {
        method: 'DELETE',
        headers: { Authorization: user?.username },
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      alert('News article deleted!');
      fetchNews(lastSearchParams);
    } catch (error) {
      console.error('Failed to delete news:', error);
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
        <Newspaper size={32} className={styles.titleIcon} /> News Articles
      </h1>

      {user?.role === 'admin' && (
        <div className={styles.addButtonWrapper}>
          <Link
            to="/add-news"
            className={styles.addButton} // Apply button style
          >
            <FilePlus size={20} /> Add New News Article
          </Link>
        </div>
      )}

      <NewsSearch onSearch={handleSearch} />

      {loading && (
        <p className={styles.loadingState}> {/* Apply loading style */}
          <LoaderCircle size={24} className={styles.loadingIcon} /> Loading news...
        </p>
      )}
      {error && (
        <p className={styles.errorState}> {/* Apply error style */}
          <AlertTriangle size={24} className={styles.errorIcon} /> {error}
        </p>
      )}
      {!loading && !error && news.length === 0 && (
        <p className={styles.emptyState}> {/* Apply empty style */}
          <Info size={20} className={styles.emptyIcon} /> No news articles found.
        </p>
      )}

      <NewsList results={news} onDelete={user?.role === 'admin' ? handleDelete : null} />

      <div className="elfsight-app-a15cd675-9dcc-4e5d-8e17-30b2d11f71d4" data-elfsight-app-lazy></div>
    </div>
  );
}