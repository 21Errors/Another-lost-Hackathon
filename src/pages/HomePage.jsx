// HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';

// Import Lucide icons
import {
  FileText,      // For documents
  CalendarDays,  // For events
  Newspaper,     // For news
  ArrowRight,    // For "View" and "View More" links
  LoaderCircle,  // For loading state
  AlertTriangle, // For error state
  Info           // For empty state
} from 'lucide-react';

export default function HomePage() {
  const [documents, setDocuments] = useState([]);
  const [events, setEvents] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch documents
        const docRes = await fetch('https://hackathon-w8qk.onrender.com/api/documents/all');

        if (!docRes.ok) throw new Error(`Documents fetch failed: ${docRes.status}`);
        const docData = await docRes.json();
        setDocuments(docData.slice(0, 3));

        // Fetch events
        const eventRes = await fetch('https://hackathon-w8qk.onrender.com/api/events/all');
        if (!eventRes.ok) throw new Error(`Events fetch failed: ${eventRes.status}`);
        const eventData = await eventRes.json();
        setEvents(eventData.slice(0, 3));

        // Fetch news
        const newsRes = await fetch('https://hackathon-w8qk.onrender.com/api/news/all');
        if (!newsRes.ok) throw new Error(`News fetch failed: ${newsRes.status}`);
        const newsData = await newsRes.json();
        setNews(newsData.slice(0, 3));
      } catch (err) {
        console.error('Fetch error:', err);
        setError(`Failed to load data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helpers
  const formatLink = (url) =>
    url ? (url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`) : '#';

  const formatDate = (date) => (date ? new Date(date).toISOString().split('T')[0] : 'N/A');

  const truncateText = (text, maxLength = 100) =>
    text?.length > maxLength ? text.slice(0, maxLength) + '…' : text || 'N/A';

  // Elfsight widget once on mount
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://static.elfsight.com/platform/platform.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Welcome to the Financial Services Regulatory Portal</h1>
      </header>

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

      {/* Documents */}
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>
          <FileText size={28} className={styles.cardTitleIcon} /> Recent Documents
        </h2>
        {documents.length === 0 && !loading && !error && (
          <p className={styles.emptyState}>
            <Info size={20} className={styles.emptyIcon} /> No documents available.
          </p>
        )}
        <div className={styles.cardsGrid}>
          {documents.map((doc) => (
            <article key={doc.id} className={styles.item}>
              <h3 className={styles.itemTitle}>{doc.title}</h3>
              <p className={styles.itemDescription}>Description: {truncateText(doc.description)}</p>
              <a
                href={formatLink(doc.external_url)}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.itemLink}
              >
                View Document <ArrowRight size={16} className={styles.itemLinkIcon} />
              </a>
            </article>
          ))}
        </div>
        <Link to="/documents" className={styles.viewMoreLink}>
          View More Documents <ArrowRight size={18} className={styles.viewMoreIcon} />
        </Link>
      </section>

      {/* Events */}
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>
          <CalendarDays size={28} className={styles.cardTitleIcon} /> Upcoming Events
        </h2>
        {events.length === 0 && !loading && !error && (
          <p className={styles.emptyState}>
            <Info size={20} className={styles.emptyIcon} /> No events available.
          </p>
        )}
        <div className={styles.cardsGrid}>
          {events.map((event) => (
            <article key={event.id} className={styles.item}>
              <h3 className={styles.itemTitle}>{event.title}</h3>
              <p className={styles.itemDescription}>Description: {truncateText(event.description)}</p>
              <p className={styles.itemDate}>Event Date: {formatDate(event.event_date)}</p>
              <a
                href={formatLink(event.link_or_rsvp)}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.itemLink}
              >
                View Event <ArrowRight size={16} className={styles.itemLinkIcon} />
              </a>
            </article>
          ))}
        </div>
        <Link to="/events" className={styles.viewMoreLink}>
          View More Events <ArrowRight size={18} className={styles.viewMoreIcon} />
        </Link>
      </section>

      {/* News */}
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>
          <Newspaper size={28} className={styles.cardTitleIcon} /> Latest News
        </h2>
        {news.length === 0 && !loading && !error && (
          <p className={styles.emptyState}>
            <Info size={20} className={styles.emptyIcon} /> No news articles available.
          </p>
        )}
        <div className={styles.cardsGrid}>
          {news.map((newsItem) => (
            <article key={newsItem.id} className={styles.item}>
              <h3 className={styles.itemTitle}>{newsItem.title}</h3>
              <p className={styles.itemDescription}>Content: {truncateText(newsItem.content)}</p>
              <p className={styles.itemDate}>Publish Date: {formatDate(newsItem.publish_date)}</p>
              <a
                href={formatLink(newsItem.external_url)}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.itemLink}
              >
                View Article <ArrowRight size={16} className={styles.itemLinkIcon} />
              </a>
            </article>
          ))}
        </div>
        <Link to="/news" className={styles.viewMoreLink}>
          View More News <ArrowRight size={18} className={styles.viewMoreIcon} />
        </Link>
      </section>

      <div
        className="elfsight-app-a15cd675-9dcc-4e5d-8e17-30b2d11f71d4"
        data-elfsight-app-lazy
      ></div>
    </div>
  );
}