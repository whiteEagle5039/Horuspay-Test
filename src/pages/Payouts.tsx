import { useState, useEffect } from 'react';
import { Button, FormInput, Alert, Card } from '../components';
import * as PayoutService from '../services/payoutService';
import type { Payout, PayoutData } from '../types';
import styles from './Payouts.module.css';

type FormMode = 'list' | 'create' | 'batch';

export const Payouts: React.FC = () => {
  const [mode, setMode] = useState<FormMode>('list');
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states for single payout
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('XOF');
  const [mode_payment, setModePayment] = useState('mtn_open');
  const [callbackUrl, setCallbackUrl] = useState('https://example.com/callback');
  const [customerId, setCustomerId] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('BJ');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Batch states
  const [batchJson, setBatchJson] = useState('[]');

  useEffect(() => {
    loadPayouts();
  }, []);

  const loadPayouts = async () => {
    setLoading(true);
    const result = await PayoutService.listPayouts();
    if (result.success && result.data) {
      setPayouts(result.data);
    } else {
      setMessage({ type: 'error', text: `Erreur: ${result.error}` });
    }
    setLoading(false);
  };

  const handleCreatePayout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data: PayoutData = {
        amount: parseInt(amount),
        currency,
        mode: mode_payment,
        callback_url: callbackUrl,
      };

      if (customerId) {
        data.customer_id = parseInt(customerId);
      } else {
        data.customer = {
          firstname,
          lastname,
          email,
          country_code: countryCode,
          phone: {
            number: `${phoneNumber}`,
            country: countryCode.toLowerCase(),
            network: mode_payment,
          },
        };
      }

      const result = await PayoutService.createPayout(data);
      if (result.success) {
        setMessage({ type: 'success', text: '✅ Payout créé avec succès!' });
        setAmount('');
        setCurrency('XOF');
        setCustomerId('');
        setFirstname('');
        setLastname('');
        setEmail('');
        setPhoneNumber('');
        loadPayouts();
      } else {
        setMessage({ type: 'error', text: `Erreur: ${result.error}` });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: `Erreur: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payoutsData = JSON.parse(batchJson);
      const result = await PayoutService.createPayoutBatch(payoutsData);
      if (result.success) {
        setMessage({ type: 'success', text: '✅ Batch créé avec succès!' });
        setBatchJson('[]');
        loadPayouts();
      } else {
        setMessage({ type: 'error', text: `Erreur: ${result.error}` });
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: `Erreur: ${error.message || 'JSON invalide'}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayPayout = async (id: number) => {
    setLoading(true);
    const result = await PayoutService.payPayout(id);
    if (result.success) {
      setMessage({ type: 'success', text: '✅ Transfert effectué!' });
      loadPayouts();
    } else {
      setMessage({ type: 'error', text: `Erreur: ${result.error}` });
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <h1>💸 Gestion des Transferts (Payouts)</h1>

      {message && (
        <Alert
          type={message.type}
          message={message.text}
          onClose={() => setMessage(null)}
        />
      )}

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${mode === 'list' ? styles.active : ''}`}
          onClick={() => setMode('list')}
        >
          Lister
        </button>
        <button
          className={`${styles.tab} ${mode === 'create' ? styles.active : ''}`}
          onClick={() => setMode('create')}
        >
          Créer
        </button>
        <button
          className={`${styles.tab} ${mode === 'batch' ? styles.active : ''}`}
          onClick={() => setMode('batch')}
        >
          Batch
        </button>
      </div>

      {mode === 'list' && (
        <Card title="📋 Tous les transferts">
          <Button
            onClick={loadPayouts}
            loading={loading}
            variant="secondary"
            fullWidth
          >
            Rafraîchir
          </Button>

          {payouts.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666' }}>
              Aucun transfert trouvé
            </p>
          ) : (
            <div className={styles.table}>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Référence</th>
                    <th>Montant</th>
                    <th>Mode</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((payout) => (
                    <tr key={payout.id}>
                      <td>{payout.id}</td>
                      <td>{payout.reference}</td>
                      <td>
                        {payout.amount} {payout.currency}
                      </td>
                      <td>{payout.mode}</td>
                      <td>
                        <span className={`${styles.status} ${styles[payout.status]}`}>
                          {payout.status}
                        </span>
                      </td>
                      <td>
                        <Button
                          size="small"
                          variant="success"
                          onClick={() => handlePayPayout(payout.id)}
                          loading={loading}
                        >
                          Exécuter
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {mode === 'create' && (
        <Card title="➕ Créer un nouveau transfert">
          <form onSubmit={handleCreatePayout} className={styles.form}>
            <FormInput
              label="Montant"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="5000"
              required
            />

            <div className={styles.formGroup}>
              <label>Devise</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className={styles.select}
              >
                <option value="XOF">XOF (Franc CFA)</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Mode de Paiement</label>
              <select
                value={mode_payment}
                onChange={(e) => setModePayment(e.target.value)}
                className={styles.select}
              >
                <option value="mtn_open">MTN Mobile Money Open</option>
                <option value="orange_money">Orange Money</option>
                <option value="moov_money">Moov Money</option>
                <option value="bank_transfer">Virement Bancaire</option>
              </select>
            </div>

            <FormInput
              label="URL de callback"
              type="url"
              value={callbackUrl}
              onChange={(e) => setCallbackUrl(e.target.value)}
              placeholder="https://example.com/callback"
              required
            />

            <div className={styles.divider}>
              <span>OU</span>
            </div>

            <FormInput
              label="ID Client existant"
              type="number"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              placeholder="Si vide, créer un nouveau client"
            />

            {!customerId && (
              <>
                <FormInput
                  label="Prénom (nouveau client)"
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  placeholder="Jean"
                  required
                />

                <FormInput
                  label="Nom (nouveau client)"
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  placeholder="Dupont"
                  required
                />

                <FormInput
                  label="Email (nouveau client)"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jean@example.com"
                  required
                />

                <div className={styles.formGroup}>
                  <label>Code Pays</label>
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className={styles.select}
                  >
                    <option value="BJ">Bénin (BJ)</option>
                    <option value="SN">Sénégal (SN)</option>
                    <option value="CI">Côte d'Ivoire (CI)</option>
                    <option value="ML">Mali (ML)</option>
                  </select>
                </div>

                <FormInput
                  label="Numéro Téléphone"
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+22967462549"
                  required
                />
              </>
            )}

            <Button
              type="submit"
              fullWidth
              loading={loading}
              variant="success"
            >
              Créer le Transfert
            </Button>
          </form>
        </Card>
      )}

      {mode === 'batch' && (
        <Card title="📦 Créer un batch de transferts">
          <form onSubmit={handleCreateBatch} className={styles.form}>
            <div className={styles.formGroup}>
              <label>JSON des Transferts</label>
              <textarea
                value={batchJson}
                onChange={(e) => setBatchJson(e.target.value)}
                placeholder={JSON.stringify(
                  [
                    {
                      amount: 1000,
                      currency: 'XOF',
                      mode: 'mtn_open',
                      callback_url: 'https://example.com/callback',
                      customer_id: 1,
                    },
                  ],
                  null,
                  2
                )}
                className={styles.textarea}
                rows={12}
              />
            </div>

            <Button
              type="submit"
              fullWidth
              loading={loading}
              variant="success"
            >
              Créer le Batch
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
};
