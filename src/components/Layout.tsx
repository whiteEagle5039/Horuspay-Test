import { Link, useLocation } from 'react-router-dom';
import { IconHome, IconCreditCard, IconUsers, IconSend, IconSettings, IconHexagon, IconExternalLink } from './Icons';
import { isHorusPayConfigured, getHorusPayConfig } from '../config/horuspay';
import styles from './Layout.module.css';

// Icônes supplémentaires
const IconKey = ({ size = 17 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7.5" cy="15.5" r="5.5"/><path d="M21 2l-9.6 9.6"/><path d="M15.5 7.5l3 3L22 7l-3-3"/>
  </svg>
);
const IconLock = ({ size = 17 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const ENV_COLORS: Record<string, string> = {
  sandbox:     '#60A5FA',
  production:  '#6EE7B7',
  development: '#FCD34D',
};

const NAV_SECTIONS = [
  {
    label: 'Principal',
    items: [
      { to: '/',             icon: <IconHome size={17} />,       label: 'Dashboard'      },
      { to: '/transactions', icon: <IconCreditCard size={17} />, label: 'Transactions'   },
      { to: '/customers',    icon: <IconUsers size={17} />,      label: 'Clients'        },
      { to: '/payouts',      icon: <IconSend size={17} />,       label: 'Transferts'     },
    ],
  },
  {
    label: 'Avancé',
    items: [
      { to: '/auth',     icon: <IconLock size={17} />, label: 'Authentification' },
      { to: '/webhooks', icon: <IconKey size={17} />,  label: 'Webhooks & Keys'  },
    ],
  },
  {
    label: 'Paramètres',
    items: [
      { to: '/setup', icon: <IconSettings size={17} />, label: 'Configuration' },
    ],
  },
];

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const configured = isHorusPayConfigured();
  const config = getHorusPayConfig();
  const envColor = ENV_COLORS[config.environment] || '#60A5FA';

  return (
    <div className={styles.layout}>
      <nav className={styles.sidebar}>

        {/* Brand */}
        <div className={styles.logo}>
          <div className={styles.logoMark}>
            <div className={styles.logoBadge}><IconHexagon size={18} /></div>
            <h2>HorusPay</h2>
          </div>
          <p>SDK Testeur</p>
        </div>

        {/* Env indicator */}
        {configured && (
          <div className={styles.envBadge} style={{ borderColor: `${envColor}33`, color: envColor }}>
            <span className={styles.envDot} style={{ background: envColor }} />
            {config.environment}
          </div>
        )}

        {/* Navigation */}
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className={styles.menu}>
            <span className={styles.sectionLabel}>{section.label}</span>
            {section.items.map(({ to, icon, label }) => (
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
        ))}

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
