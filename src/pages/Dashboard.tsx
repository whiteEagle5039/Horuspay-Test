import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';

interface MenuItemProps {
  title: string;
  description: string;
  icon: string;
  path: string;
  accent: string;
  onClick: (path: string) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ title, description, icon, path, accent, onClick }) => {
  return (
    <div className={styles.menuCard} onClick={() => onClick(path)}>
      <div
        className={styles.menuIcon}
        style={{ boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 12px rgba(0,0,0,0.2), 0 0 20px ${accent}22` }}
      >
        {icon}
      </div>
      <div className={styles.menuContent}>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <span className={styles.menuArrow}>→</span>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'Transactions',
      description: 'Créer, lister et gérer les transactions de paiement',
      icon: '💳',
      path: '/transactions',
      accent: '#3B82F6',
    },
    {
      title: 'Clients',
      description: 'Gérer les informations et profils des clients',
      icon: '👥',
      path: '/customers',
      accent: '#8B5CF6',
    },
    {
      title: 'Transferts',
      description: 'Effectuer des transferts et payouts mobiles',
      icon: '💸',
      path: '/payouts',
      accent: '#10B981',
    },
    {
      title: 'Configuration',
      description: 'Configurer les clés API et les paramètres',
      icon: '⚙️',
      path: '/setup',
      accent: '#F59E0B',
    },
  ];

  const resources = [
    {
      label: 'Documentation API HorusPay',
      url: 'https://docs.horuspay.com',
      color: '#3B82F6',
    },
    {
      label: 'Dashboard HorusPay',
      url: 'https://dashboard.horuspay.com',
      color: '#8B5CF6',
    },
    {
      label: 'GitHub HorusPay',
      url: 'https://github.com/horuspay',
      color: '#10B981',
    },
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerEyebrow}>HorusPay SDK — Test Interface</div>
        <h1>HorusPay Testeur</h1>
        <p>Interface de test complète pour le SDK HorusPay</p>
      </div>

      {/* Menu Grid */}
      <div className={styles.grid}>
        {menuItems.map((item) => (
          <MenuItem key={item.path} {...item} onClick={navigate} />
        ))}
      </div>

      {/* Resources */}
      <section className={styles.section}>
        <p className={styles.sectionTitle}>Ressources</p>
        <div className={styles.resourcesCard}>
          {resources.map((r) => (
            <a
              key={r.url}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.resourceItem}
            >
              <span
                className={styles.resourceDot}
                style={{ background: r.color, boxShadow: `0 0 8px ${r.color}88` }}
              />
              {r.label}
              <span className={styles.resourceArrow}>↗</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};