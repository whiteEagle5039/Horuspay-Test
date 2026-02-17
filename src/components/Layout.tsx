import { Link, useLocation } from 'react-router-dom';
import styles from './Layout.module.css';

const navItems = [
  { to: '/',             icon: '◈',  label: 'Dashboard'    },
  { to: '/transactions', icon: '↔',  label: 'Transactions'  },
  { to: '/customers',    icon: '⊙',  label: 'Clients'       },
  { to: '/payouts',      icon: '↑',  label: 'Transferts'    },
  { to: '/setup',        icon: '◎',  label: 'Configuration' },
];

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <div className={styles.layout}>
      <nav className={styles.sidebar}>

        {/* Brand */}
        <div className={styles.logo}>
          <div className={styles.logoMark}>
            <div className={styles.logoBadge}>⬡</div>
            <h2>HorusPay</h2>
          </div>
          <p>Test SDK</p>
        </div>

        {/* Navigation */}
        <div className={styles.menu}>
          <span className={styles.sectionLabel}>Navigation</span>
          {navItems.map(({ to, icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`${styles.menuItem} ${location.pathname === to ? styles.active : ''}`}
            >
              <span className={styles.menuIcon}>{icon}</span>
              {label}
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <span className={styles.footerVersion}>HorusPay SDK v1.0.0</span>
          <a
            href="https://docs.horuspay.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            Documentation ↗
          </a>
        </div>

      </nav>

      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
};