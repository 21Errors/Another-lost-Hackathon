// DocumentsPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import DocumentSearch from '../components/DocumentSearch'; // Assuming these handle their own internal styles/icons
import DocumentList from '../components/DocumentList'; // Assuming these handle their own internal styles/icons
import { Link } from 'react-router-dom';
import styles from './DocumentsPage.module.css';

// Import Lucide icons
import {
  FileText,        // For the main title and general documents
  FilePlus,        // For the "Add New Document" button
  LoaderCircle,    // For loading state
  AlertTriangle,   // For error state
  Info             // For empty state
} from 'lucide-react';

function DocumentsPage() {
  const { user } = useContext(AuthContext);
  const [documents, setDocuments] = useState([]);
  const [lastSearchParams, setLastSearchParams] = useState({
    keyword: '',
    category: '',
    type: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDocuments = async (params) => {
    setLoading(true);
    setError(null);
    try {
      let url;
      if (params && params.keyword && params.keyword.trim() !== '') {
        const query = new URLSearchParams(params).toString();
        url = `http://localhost:5000/api/documents/search?${query}`;
      } else {
        url = 'http://localhost:5000/api/documents/all';
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setDocuments(data);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      setError(`Failed to load documents: ${error.message}`);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments(lastSearchParams);
  }, [lastSearchParams]);

  const handleSearch = (results) => {
    setDocuments(results);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/documents/${id}`, {
        method: 'DELETE',
        headers: { Authorization: user?.username },
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      alert('Document deleted!');
      fetchDocuments(lastSearchParams);
    } catch (error) {
      console.error('Failed to delete document:', error);
      alert(`Delete failed: ${error.message}`);
    }
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://static.elfsight.com/platform/platform.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <FileText size={32} className={styles.titleIcon} /> Regulatory Documents
      </h1>

      {user?.role === 'admin' && (
        <div className={styles.addButtonWrapper}> {/* Added wrapper for centering */}
          <Link to="/add-document" className={styles.addButton}>
            <FilePlus size={20} /> Add New Document
          </Link>
        </div>
      )}

      <DocumentSearch onSearch={handleSearch} />

      {loading && (
        <p className={styles.loadingState}>
          <LoaderCircle size={24} className={styles.loadingIcon} /> Loading documents...
        </p>
      )}
      {error && (
        <p className={styles.errorState}>
          <AlertTriangle size={24} className={styles.errorIcon} /> {error}
        </p>
      )}
      {!loading && !error && documents.length === 0 && (
        <p className={styles.emptyState}>
          <Info size={20} className={styles.emptyIcon} /> No documents found.
        </p>
      )}

      <DocumentList results={documents} onDelete={user?.role === 'admin' ? handleDelete : null} />

      <div className="elfsight-app-89cbd518-8c1b-4c9e-b505-4ccf01775cd5" data-elfsight-app-lazy></div>
    </div>
  );
}

export default DocumentsPage;