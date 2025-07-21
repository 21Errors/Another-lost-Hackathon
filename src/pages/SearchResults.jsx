// src/pages/SearchResults/SearchResults.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import styles from './SearchResults.module.css'; // Import page-specific styles

// Import Lucide icons
import {
  Search,        // For the main title
  FileText,      // For document section/items
  CalendarDays,  // For event section/items
  Newspaper,     // For news section/items
  ExternalLink,  // For view links
  LoaderCircle,  // For loading state
  AlertTriangle, // For error state
  Info           // For empty state
} from 'lucide-react';

export default function SearchResults() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get('query') || '';

  const [documents, setDocuments] = useState([]);
  const [events, setEvents] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        const [docsRes, eventsRes, newsRes] = await Promise.all([
          fetch(`https://hackathon-w8qk.onrender.com/search?query=${encodeURIComponent(query)}`),
          fetch(`http://https://hackathon-w8qk.onrender.com/api/events/search?query=${encodeURIComponent(query)}`),
          fetch(`http://https://hackathon-w8qk.onrender.com/api/news/search?query=${encodeURIComponent(query)}`)
        ]);

        if (!docsRes.ok) throw new Error('Documents search failed');
        if (!eventsRes.ok) throw new Error('Events search failed');
        if (!newsRes.ok) throw new Error('News search failed');

        const [docsData, eventsData, newsData] = await Promise.all([
          docsRes.json(),
          eventsRes.json(),
          newsRes.json()
        ]);

        setDocuments(docsData);
        setEvents(eventsData);
        setNews(newsData);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Search failed.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const formatLink = (url) =>
    url ? (url.startsWith('http') ? url : `https://${url}`) : '#';

  const formatDate = (date) =>
    date ? new Date(date).toISOString().split('T')[0] : 'N/A';

  const truncate = (text, max = 100) =>
    text?.length > max ? text.slice(0, max) + '…' : text;

  return (
    <>
      {/* Page Banner for Search Results */}
      <div className={styles.header}>
        <h1 className={styles.title}>
          <Search size={32} className={styles.titleIcon} /> Search Results for "{query}"
        </h1>
      </div>

      {/* Main Content Container */}
      <div className={styles.container}>
        {loading && (
          <p className={styles.loadingState}>
            <LoaderCircle size={24} className={styles.loadingIcon} /> Loading...
          </p>
        )}
        {error && (
          <p className={styles.errorState}>
            <AlertTriangle size={24} className={styles.errorIcon} /> {error}
          </p>
        )}

        {!loading && !error && (
          <>
            {/* Documents */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <FileText size={24} className={styles.sectionTitleIcon} /> Documents
              </h2>
              {documents.length === 0 ? (
                <p className={styles.emptyState}>
                  <Info size={20} className={styles.emptyIcon} /> No documents found.
                </p>
              ) : (
                <div className={styles.resultsGrid}> {/* Use a grid for results */}
                  {documents.map(doc => (
                    <div key={doc.id} className={styles.resultItem}>
                      <h3 className={styles.itemTitle}>{doc.title}</h3>
                      <p className={styles.itemDescription}>{truncate(doc.description)}</p>
                      <a
                        href={formatLink(doc.external_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.viewLink}
                      >
                        View Document <ExternalLink size={16} />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Events */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <CalendarDays size={24} className={styles.sectionTitleIcon} /> Events
              </h2>
              {events.length === 0 ? (
                <p className={styles.emptyState}>
                  <Info size={20} className={styles.emptyIcon} /> No events found.
                </p>
              ) : (
                <div className={styles.resultsGrid}>
                  {events.map(event => (
                    <div key={event.id} className={styles.resultItem}>
                      <h3 className={styles.itemTitle}>{event.title}</h3>
                      <p className={styles.itemDescription}>{truncate(event.description)}</p>
                      <p className={styles.itemDate}>Event Date: {formatDate(event.event_date)}</p>
                      <a
                        href={formatLink(event.link_or_rsvp)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.viewLink}
                      >
                        View Event <ExternalLink size={16} />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* News */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <Newspaper size={24} className={styles.sectionTitleIcon} /> News
              </h2>
              {news.length === 0 ? (
                <p className={styles.emptyState}>
                  <Info size={20} className={styles.emptyIcon} /> No news articles found.
                </p>
              ) : (
                <div className={styles.resultsGrid}>
                  {news.map(newsItem => (
                    <div key={newsItem.id} className={styles.resultItem}>
                      <h3 className={styles.itemTitle}>{newsItem.title}</h3>
                      <p className={styles.itemDescription}>{truncate(newsItem.content)}</p>
                      <p className={styles.itemDate}>Publish Date: {formatDate(newsItem.publish_date)}</p>
                      <a
                        href={formatLink(newsItem.external_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.viewLink}
                      >
                        View Article <ExternalLink size={16} />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}