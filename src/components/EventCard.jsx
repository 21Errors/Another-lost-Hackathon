import React from 'react';
import { Link } from 'react-router-dom';
import styles from './EventCard.module.css'; // Import the CSS module

// Import Lucide icons
import { ExternalLink, Pencil, Trash2 } from 'lucide-react';

function EventCard({ event, onDelete }) {
  const truncatedDescription = event.description?.length > 100
    ? event.description.slice(0, 100) + '…'
    : event.description;

  // Format event_date to YYYY-MM-DD
  const formattedDate = event.event_date
    ? new Date(event.event_date).toISOString().split('T')[0]
    : 'N/A';

  // Ensure link_or_rsvp has a protocol
  const formattedLink = event.link_or_rsvp
    ? event.link_or_rsvp.startsWith('http://') || event.link_or_rsvp.startsWith('https://')
      ? event.link_or_rsvp
      : `https://${event.link_or_rsvp}`
    : '#';

  return (
    <div className={styles.card}> {/* Apply card style */}
      <h3 className={styles.title}>{event.title}</h3> {/* Apply title style */}
      <p className={styles.info}>
        <strong>Category:</strong> <span className={styles.infoValue}>{event.category || 'N/A'}</span>
      </p>
      <p className={styles.info}>
        <strong>Description:</strong> <span className={styles.infoValue}>{truncatedDescription || 'N/A'}</span>
      </p>
      <p className={styles.info}>
        <strong>Event Date:</strong> <span className={styles.infoValue}>{formattedDate}</span>
      </p>
      <p className={styles.info}>
        <strong>Location:</strong> <span className={styles.infoValue}>{event.location || 'N/A'}</span>
      </p>
      <p className={styles.info}>
        <strong>Host:</strong> <span className={styles.infoValue}>{event.host || 'N/A'}</span>
      </p>
      <p className={styles.info}>
        <strong>Source:</strong> <span className={styles.infoValue}>{event.source || 'N/A'}</span>
      </p>

      <div className={styles.actions}> {/* Apply actions container style */}
        <a
          href={formattedLink}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.viewLink} 
        >
          View Event <ExternalLink size={16} /> {/* Add icon */}
        </a>

        {/* Show Edit and Delete only if onDelete is passed (admin) */}
        {onDelete && (
          <>
            <Link
              to={`/edit-event/${event.id}`}
              className={styles.editLink} 
            >
              Edit <Pencil size={16} /> {/* Add icon */}
            </Link>
            <button
              onClick={() => onDelete(event.id)}
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

export default EventCard;