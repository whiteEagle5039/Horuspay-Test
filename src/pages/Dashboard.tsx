import { type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconCreditCard, IconUsers, IconSend, IconSettings, IconChevronRight, IconBook, IconLayout, IconGithub, IconExternalLink } from '../components/Icons';
import styles from './Dashboard.module.css';

interface MenuItemProps {
  title: string;
  description: string;
  icon: ReactNode;
  path: string;
  accent: string;
  onClick: (path: string) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ title, description, icon, path, accent, onClick }) => {
  return (
    <div className={styles.menuCard} onClick={() => onClick(path)}>
      <div
        className={styles.menuIcon}
        style={{ boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 12px rgba(0,0,0,0.2), 0 0 20px ${accent}22`, color: accent }}
      >
        {icon}
      </div>
      <div className={styles.menuContent}>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <span className={styles.menuArrow}><IconChevronRight size={18} /></span>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'Transactions',
      description: 'Créer, lister et gérer les transactions de paiement',
      icon: <IconCreditCard size={24} />,
      path: '/transactions',
      accent: '#3B82F6',
    },
    {
      title: 'Clients',
      description: 'Gérer les informations et profils des clients',
      icon: <IconUsers size={24} />,
      path: '/customers',
      accent: '#8B5CF6',
    },
    {
      title: 'Transferts',
      description: 'Effectuer des transferts et payouts mobiles',
      icon: <IconSend size={24} />,
      path: '/payouts',
      accent: '#10B981',
    },
    {
      title: 'Configuration',
      description: 'Configurer les clés API et les paramètres',
      icon: <IconSettings size={24} />,
      path: '/setup',
      accent: '#F59E0B',
    },
  ];

  const resources = [
    {
      label: 'Documentation API HorusPay',
      url: 'https://docs.horuspay.com',
      color: '#3B82F6',
      icon: <IconBook size={16} />,
    },
    {
      label: 'Dashboard HorusPay',
      url: 'https://dashboard.horuspay.com',
      color: '#8B5CF6',
      icon: <IconLayout size={16} />,
    },
    {
      label: 'GitHub HorusPay',
      url: 'https://github.com/horuspay',
      color: '#10B981',
      icon: <IconGithub size={16} />,
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
                className={styles.resourceIcon}
                style={{ color: r.color }}
              >
                {r.icon}
              </span>
              {r.label}
              <span className={styles.resourceArrow}><IconExternalLink size={13} /></span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};
