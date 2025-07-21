// src/components/NewsCard/NewsCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NewsCard.module.css'; // Import the CSS module

// Import Lucide icons
import { ExternalLink, Pencil, Trash2 } from 'lucide-react';

function NewsCard({ news, onDelete }) {
  const truncatedContent = news.content?.length > 100
    ? news.content.slice(0, 100) + '…'
    : news.content;

  // Format publish_date to YYYY-MM-DD
  const formattedDate = news.publish_date
    ? new Date(news.publish_date).toISOString().split('T')[0]
    : 'N/A';

  // Ensure external_url has a protocol
  const formattedLink = news.external_url
    ? news.external_url.startsWith('http://') || news.external_url.startsWith('https://')
      ? news.external_url
      : `https://${news.external_url}`
    : '#';

  return (
    <div className={styles.card}> {/* Apply card style */}
      <h3 className={styles.title}>{news.title}</h3> {/* Apply title style */}
      <p className={styles.info}>
        <strong>Category:</strong> <span className={styles.infoValue}>{news.category || 'N/A'}</span>
      </p>
      <p className={styles.info}>
        <strong>Content:</strong> <span className={styles.infoValue}>{truncatedContent || 'N/A'}</span>
      </p>
      <p className={styles.info}>
        <strong>Author:</strong> <span className={styles.infoValue}>{news.author || 'N/A'}</span>
      </p>
      <p className={styles.info}>
        <strong>Publish Date:</strong> <span className={styles.infoValue}>{formattedDate}</span>
      </p>
      <p className={styles.info}>
        <strong>Source:</strong> <span className={styles.infoValue}>{news.source || 'N/A'}</span>
      </p>

      <div className={styles.actions}> {/* Apply actions container style */}
        <a
          href={formattedLink}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.viewLink} 
        >
          View Article <ExternalLink size={16} /> {/* Add icon */}
        </a>

        {/* Show Edit and Delete only if onDelete is passed (admin) */}
        {onDelete && (
          <>
            <Link
              to={`/edit-news/${news.id}`}
              className={styles.editLink} 
            >
              Edit <Pencil size={16} /> {/* Add icon */}
            </Link>
            <button
              onClick={() => onDelete(news.id)}
              className={styles.deleteButton} 
            >
              Delete <Trash2 size={16} /> {/* Add icon */}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default NewsCard;