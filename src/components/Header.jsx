// header.jsx
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import styles from './Header.module.css';

// Import desired Lucide icons
import {
  Gem,
  Home,
  Bell, // For the notification/settings button
  Search,
  User,
  LogOut,
  LogIn,
  FileText, // For Audit Logs
  Settings // If you prefer a settings icon for the button
} from 'lucide-react';

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search-results?query=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSettingsClick = () => {
    if (user) {
      navigate('/settings');
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.navLinks}>
          {/* Home/Dashboard Link with Icon */}
          <Link to="/" className={styles.link}>
            <Gem size={50} /> {/* Using Home icon */}
            
          </Link>

          {/* Settings/Notification Button with Icon */}
          <button
            onClick={handleSettingsClick}
            className={styles.linkHover}
          >
            <Bell size={30} /> {/* Using Bell icon, adjust size as needed */}
            Notifications
          </button>

          {user?.role === 'admin' && (
            <Link to="/audit-logs" className={styles.linkHover}>
              <FileText size={30} /> {/* Using FileText icon for Audit Logs */}
              Audit Logs
            </Link>
          )}
        </div>

        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            placeholder="Search everything..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            <Search size={20} /> {/* Search icon */}
            Search
          </button>
        </form>

        <div className={styles.userSection}>
          {user ? (
            <>
              {/* User Greeting with Icon */}
              <span className={styles.userGreeting}>
                <User size={20} /> {/* User icon */}
                Hi, {user.username}!
              </span>
              {/* Logout Button with Icon */}
              <button onClick={logout} className={styles.logoutButton}>
                <LogOut size={20} /> {/* Logout icon */}
                Logout
              </button>
            </>
          ) : (
            // Login Link with Icon
            <Link to="/login" className={styles.loginLink}>
              <LogIn size={20} /> {/* Login icon */}
              Login
            </Link>
          )}
        </div>
      </header>
    </>
  );
}