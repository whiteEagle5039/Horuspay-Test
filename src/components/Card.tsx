import styles from './Card.module.css';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children, actions }) => {
  return (
    <div className={styles.card}>
      {title && (
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
      )}
      <div className={styles.body}>{children}</div>
    </div>
  );
};
