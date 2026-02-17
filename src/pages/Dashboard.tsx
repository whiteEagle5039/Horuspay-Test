import { useNavigate } from 'react-router-dom';
import { Card, Button } from '../components';
import styles from './Dashboard.module.css';

interface MenuItemProps {
  title: string;
  description: string;
  icon: string;
  path: string;
  onClick: (path: string) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ title, description, icon, path, onClick }) => {
  return (
    <Card>
      <div className={styles.menuItem} onClick={() => onClick(path)}>
        <div className={styles.icon}>{icon}</div>
        <div className={styles.content}>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
    </Card>
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
    },
    {
      title: 'Clients',
      description: 'Gérer les informations des clients',
      icon: '👥',
      path: '/customers',
    },
    {
      title: 'Transferts',
      description: 'Effectuer des transferts et payouts',
      icon: '💸',
      path: '/payouts',
    },
    {
      title: 'Configuration',
      description: 'Configurer les clés API et les paramètres',
      icon: '⚙️',
      path: '/setup',
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>🎯 HorusPay SDK Testeur</h1>
        <p>Interface de test complète pour le SDK HorusPay</p>
      </div>

      <div className={styles.grid}>
        {menuItems.map((item) => (
          <MenuItem
            key={item.path}
            {...item}
            onClick={navigate}
          />
        ))}
      </div>

      <section className={styles.section}>
        <Card title="📚 Ressources">
          <div className={styles.resourcesList}>
            <a href="https://docs.horuspay.com" target="_blank" rel="noopener noreferrer">
              Documentation API HorusPay
            </a>
            <a href="https://dashboard.horuspay.com" target="_blank" rel="noopener noreferrer">
              Dashboard HorusPay
            </a>
            <a href="https://github.com/horuspay" target="_blank" rel="noopener noreferrer">
              GitHub HorusPay
            </a>
          </div>
        </Card>
      </section>
    </div>
  );
};
