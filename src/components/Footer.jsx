import React from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.info}>
        <p>Regulatory Portal &mdash; Delivering trusted regulatory information.</p>
        <p>Contact us: support@regulatoryportal.com | +1 (555) 123-4567</p>
        <p>
          Quick links: Home | Events | News | Documents
        </p>
      </div>
      <div className={styles.copy}>
        &copy; {new Date().getFullYear()} Regulatory Portal. All rights reserved.
      </div>
    </footer>
  );
}
