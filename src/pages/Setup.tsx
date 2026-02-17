import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, FormInput, Alert } from '../components';
import { getHorusPayConfig, saveHorusPayConfig, isHorusPayConfigured } from '../config/horuspay';
import styles from './Setup.module.css';

type Env = 'sandbox' | 'production' | 'development';

const ENV_OPTIONS: { value: Env; label: string; hint: string }[] = [
  { value: 'sandbox',     label: 'Sandbox',     hint: 'Test' },
  { value: 'production',  label: 'Production',  hint: 'Live' },
  { value: 'development', label: 'Dev',          hint: 'Local' },
];

export const Setup: React.FC = () => {
  const navigate = useNavigate();
  const [apiKey, setApiKey]           = useState('');
  const [environment, setEnvironment] = useState<Env>('sandbox');
  const [accountId, setAccountId]     = useState('');
  const [message, setMessage]         = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading]         = useState(false);
  const [configured]                  = useState(() => isHorusPayConfigured());

  useEffect(() => {
    const config = getHorusPayConfig();
    if (config.apiKey) {
      setApiKey(config.apiKey);
      setEnvironment(config.environment);
      setAccountId(config.accountId);
    }
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!apiKey.trim() || !accountId.trim()) {
      setMessage({ type: 'error', text: 'Tous les champs sont requis' });
      setLoading(false);
      return;
    }

    try {
      saveHorusPayConfig({ apiKey: apiKey.trim(), environment, accountId: accountId.trim() });
      setMessage({ type: 'success', text: 'Configuration sauvegardée avec succès !' });
      setTimeout(() => navigate('/'), 1500);
    } catch (error: any) {
      setMessage({ type: 'error', text: `Erreur : ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>

      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageEyebrow}>Configuration</div>
        <h1 className={styles.pageTitle}>Paramètres HorusPay</h1>
        <p className={styles.pageSubtitle}>Renseignez vos clés pour commencer à tester le SDK</p>
      </div>

      {/* Configured badge */}
      {configured && (
        <div className={styles.statusBadge}>
          <span className={styles.statusDot} />
          SDK configuré et actif
        </div>
      )}

      {/* Main card */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Clés & Environnement</h3>

        <form onSubmit={handleSave} className={styles.form}>
          {message && (
            <Alert type={message.type} message={message.text} onClose={() => setMessage(null)} />
          )}

          <FormInput
            label="Clé API (API Key)"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk_live_xxxxxxxx"
            required
          />

          {/* Environment pill selector */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Environnement</label>
            <div className={styles.envSelector}>
              {ENV_OPTIONS.map(({ value, label, hint }) => {
                const isActive = environment === value;
                const variantClass =
                  value === 'sandbox'     ? styles.envOptionSandbox :
                  value === 'production'  ? styles.envOptionProduction :
                  styles.envOptionDevelopment;

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setEnvironment(value)}
                    className={`${styles.envOption} ${variantClass} ${isActive ? styles.envActive : ''}`}
                  >
                    <span className={styles.envDot} />
                    {label}
                    <span style={{ fontSize: '10px', opacity: 0.6 }}>{hint}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.formDivider} />

          <FormInput
            label="ID du Compte"
            type="text"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            placeholder="votre-account-id"
            required
          />

          <div className={styles.actions}>
            <Button type="submit" fullWidth loading={loading}>
              Sauvegarder la Configuration
            </Button>
            {configured && (
              <Button type="button" variant="secondary" fullWidth onClick={() => navigate('/')}>
                Retour au Dashboard
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Info box */}
      <div className={styles.info}>
        <h4>Notes d'utilisation</h4>
        <ul>
          <li>La clé API est stockée localement dans votre navigateur</li>
          <li>Utilisez toujours une clé de test en environnement Sandbox</li>
          <li>Ne partagez jamais votre clé API de Production</li>
          <li>
            Consultez la{' '}
            <a href="https://docs.horuspay.com" target="_blank" rel="noopener noreferrer">
              documentation API
            </a>{' '}
            pour plus de détails
          </li>
        </ul>
      </div>

    </div>
  );
};