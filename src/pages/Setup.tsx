import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, FormInput, Alert, Card } from '../components';
import { configureHorusPay, getHorusPayConfig, saveHorusPayConfig, isHorusPayConfigured } from '../config/horuspay';
import styles from './Setup.module.css';

export const Setup: React.FC = () => {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState('');
  const [environment, setEnvironment] = useState<'sandbox' | 'production' | 'development'>('sandbox');
  const [accountId, setAccountId] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

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
      saveHorusPayConfig({
        apiKey: apiKey.trim(),
        environment,
        accountId: accountId.trim(),
      });

      setMessage({ type: 'success', text: '✅ Configuration sauvegardée avec succès!' });
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error: any) {
      setMessage({ type: 'error', text: `❌ Erreur: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card title="Configuration HorusPay">
        <form onSubmit={handleSave} className={styles.form}>
          {message && (
            <Alert
              type={message.type}
              message={message.text}
              onClose={() => setMessage(null)}
            />
          )}

          <FormInput
            label="Clé API (API Key)"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk_live_xxxxxxxx"
            required
          />

          <div className={styles.formGroup}>
            <label className={styles.label}>Environnement</label>
            <select
              value={environment}
              onChange={(e) => setEnvironment(e.target.value as any)}
              className={styles.select}
            >
              <option value="sandbox">Sandbox (Test)</option>
              <option value="production">Production</option>
              <option value="development">Development</option>
            </select>
          </div>

          <FormInput
            label="ID du Compte"
            type="text"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            placeholder="votre-account-id"
            required
          />

          <Button type="submit" fullWidth loading={loading}>
            Sauvegarder la Configuration
          </Button>

          {isHorusPayConfigured() && (
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => navigate('/')}
              style={{ marginTop: '8px' }}
            >
              Retour au Dashboard
            </Button>
          )}
        </form>
      </Card>

      <div className={styles.info}>
        <h4>📝 Notes d'utilisation</h4>
        <ul>
          <li>La clé API est stockée localement dans votre navigateur</li>
          <li>Assurez-vous d'utiliser une clé de test en environnement sandbox</li>
          <li>Ne partagez jamais votre clé API</li>
          <li>
            Consultez la{' '}
            <a
              href="https://docs.horuspay.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              documentation API
            </a>{' '}
            pour plus de détails
          </li>
        </ul>
      </div>
    </div>
  );
};
