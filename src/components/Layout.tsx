import { Link, useLocation } from 'react-router-dom';
import { IconHome, IconCreditCard, IconUsers, IconSend, IconSettings, IconHexagon, IconExternalLink } from './Icons';
import styles from './Layout.module.css';

const navItems = [
  { to: '/',             icon: <IconHome size={17} />,       label: 'Dashboard'    },
  { to: '/transactions', icon: <IconCreditCard size={17} />, label: 'Transactions'  },
  { to: '/customers',    icon: <IconUsers size={17} />,      label: 'Clients'       },
  { to: '/payouts',      icon: <IconSend size={17} />,       label: 'Transferts'    },
  { to: '/setup',        icon: <IconSettings size={17} />,   label: 'Configuration' },
];

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <div className={styles.layout}>
      <nav className={styles.sidebar}>

        {/* Brand */}
        <div className={styles.logo}>
          <div className={styles.logoMark}>
            <div className={styles.logoBadge}><IconHexagon size={18} /></div>
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
            Documentation <IconExternalLink size={12} />
          </a>
        </div>

      </nav>

      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
};
