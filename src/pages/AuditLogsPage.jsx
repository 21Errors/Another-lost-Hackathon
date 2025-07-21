import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import pageStyles from './PageLayout.module.css'; // Import common page layout styles
import styles from './AuditLogsPage.module.css'; // Import component-specific styles

export default function AuditLogsPage() {
  const { user } = useContext(AuthContext);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication and authorization
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'admin') {
      setError('Admin access required');
      navigate('/'); // Redirect non-admins
      return;
    }

    const fetchLogs = async () => {
      try {
        const response = await fetch('http://https://hackathon-w8qk.onrender.com/api/audit/audit-logs', {
          headers: { Authorization: user.username },
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to fetch audit logs');
        }
        const data = await response.json();
        setLogs(data);
      } catch (err) {
        setError(err.message || 'Server error');
      }
    };
    fetchLogs();
  }, [user, navigate]);

  return (
    <>
      {/* Page Banner */}
      <div className={pageStyles.header}>
        <h1 className={pageStyles.title}>Audit Logs</h1>
      </div>

      {/* Main Content Container */}
      <div className={pageStyles.contentContainer}>
        {error && <p className={styles.errorMessage}>{error}</p>}
        {logs.length === 0 && !error ? ( /* Display empty message only if no error and no logs */
          <p className={styles.emptyMessage}>No audit logs available.</p>
        ) : (
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr className={styles.tableRowHead}>
                <th className={styles.tableHeaderCell}>User</th>
                <th className={styles.tableHeaderCell}>Action</th>
                <th className={styles.tableHeaderCell}>Target ID</th>
                <th className={styles.tableHeaderCell}>Target Type</th>
                <th className={styles.tableHeaderCell}>Timestamp</th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {logs.map((log) => (
                <tr key={log.id} className={styles.tableRowBody}>
                  {/* Add data-label attributes for responsive table on small screens */}
                  <td className={styles.tableCell} data-label="User">{log.username || 'Unknown'}</td>
                  <td className={styles.tableCell} data-label="Action">{log.action}</td>
                  <td className={styles.tableCell} data-label="Target ID">{log.target_id || 'N/A'}</td>
                  <td className={styles.tableCell} data-label="Target Type">{log.target_type || 'N/A'}</td>
                  <td className={styles.tableCell} data-label="Timestamp">{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}