// src/components/DocumentCard/DocumentCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './DocumentCard.module.css';

// Import Lucide icons
import { ExternalLink, Pencil, Trash2 } from 'lucide-react';

function DocumentCard({ document, onDelete }) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{document.title}</h3>
      <p className={styles.info}>
        <strong>Category:</strong> <span className={styles.infoValue}>{document.category}</span>
      </p>
      <p className={styles.info}>
        <strong>Type:</strong> <span className={styles.infoValue}>{document.type}</span>
      </p>
      <p className={styles.info}>
        <strong>Description:</strong> <span className={styles.infoValue}>{document.description}</span>
      </p>
      <p className={styles.info}>
        <strong>Issuer:</strong> <span className={styles.infoValue}>{document.issuing_authority}</span>
      </p>

      <div className={styles.actions}>
        <a
          href={document.external_url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.viewLink}
        >
          View Document <ExternalLink size={16} />
        </a>

        {onDelete && (
          <>
            <Link to={`/edit-document/${document.id}`} className={styles.editLink}>
              Edit <Pencil size={16} />
            </Link>

            <button onClick={() => onDelete(document.id)} className={styles.deleteButton}>
              Delete <Trash2 size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default DocumentCard;