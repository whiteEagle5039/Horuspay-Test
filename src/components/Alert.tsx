import styles from './Alert.module.css';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  return (
    <div className={`${styles.alert} ${styles[type]}`}>
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className={styles.closeBtn}>
          ✕
        </button>
      )}
    </div>
  );
};
