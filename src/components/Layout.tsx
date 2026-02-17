import { Link, useLocation } from 'react-router-dom';
import styles from './Layout.module.css';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <div className={styles.layout}>
      <nav className={styles.sidebar}>
        <div className={styles.logo}>
          <h2>🎯 HorusPay</h2>
          <p>Test SDK</p>
        </div>

        <div className={styles.menu}>
          <Link
            to="/"
            className={`${styles.menuItem} ${location.pathname === '/' ? styles.active : ''}`}
          >
            📊 Dashboard
          </Link>
          <Link
            to="/transactions"
            className={`${styles.menuItem} ${
              location.pathname === '/transactions' ? styles.active : ''
            }`}
          >
            💳 Transactions
          </Link>
          <Link
            to="/customers"
            className={`${styles.menuItem} ${
              location.pathname === '/customers' ? styles.active : ''
            }`}
          >
            👥 Clients
          </Link>
          <Link
            to="/payouts"
            className={`${styles.menuItem} ${
              location.pathname === '/payouts' ? styles.active : ''
            }`}
          >
            💸 Transferts
          </Link>
          <Link
            to="/setup"
            className={`${styles.menuItem} ${location.pathname === '/setup' ? styles.active : ''}`}
          >
            ⚙️ Configuration
          </Link>
        </div>

        <div className={styles.footer}>
          <p>HorusPay SDK v1.0.0</p>
          <a href="https://docs.horuspay.com" target="_blank" rel="noopener noreferrer">
            Documentation
          </a>
        </div>
      </nav>

      <main className={styles.content}>{children}</main>
    </div>
  );
};
