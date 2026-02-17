import { useState, useEffect } from 'react';
import { Button, FormInput, Alert } from '../components';
import * as PayoutService from '../services/payoutService';
import type { Payout, PayoutData } from '../types';
import styles from './Payouts.module.css';

type FormMode = 'list' | 'create' | 'batch';

const BATCH_PLACEHOLDER = JSON.stringify(
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
);

export const Payouts: React.FC = () => {
  const [mode, setMode]     = useState<FormMode>('list');
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Single payout form
  const [amount, setAmount]           = useState('');
  const [currency, setCurrency]       = useState('XOF');
  const [modePayment, setModePayment] = useState('mtn_open');
  const [callbackUrl, setCallbackUrl] = useState('https://example.com/callback');
  const [customerId, setCustomerId]   = useState('');
  const [firstname, setFirstname]     = useState('');
  const [lastname, setLastname]       = useState('');
  const [email, setEmail]             = useState('');
  const [countryCode, setCountryCode] = useState('BJ');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Batch
  const [batchJson, setBatchJson] = useState(BATCH_PLACEHOLDER);

  useEffect(() => { loadPayouts(); }, []);

  const loadPayouts = async () => {
    setLoading(true);
    const result = await PayoutService.listPayouts();
    if (result.success && result.data) {
      setPayouts(result.data);
    } else {
      setMessage({ type: 'error', text: `Erreur : ${result.error}` });
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
        mode: modePayment,
        callback_url: callbackUrl,
      };

      if (customerId) {
        data.customer_id = parseInt(customerId);
      } else {
        data.customer = {
          firstname, lastname, email,
          country_code: countryCode,
          phone: {
            number: phoneNumber,
            country: countryCode.toLowerCase(),
            network: modePayment,
          },
        };
      }

      const result = await PayoutService.createPayout(data);
      if (result.success) {
        setMessage({ type: 'success', text: 'Payout créé avec succès !' });
        setAmount(''); setCurrency('XOF'); setCustomerId('');
        setFirstname(''); setLastname(''); setEmail(''); setPhoneNumber('');
        loadPayouts();
      } else {
        setMessage({ type: 'error', text: `Erreur : ${result.error}` });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: `Erreur : ${error.message}` });
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
        setMessage({ type: 'success', text: 'Batch créé avec succès !' });
        setBatchJson(BATCH_PLACEHOLDER);
        loadPayouts();
      } else {
        setMessage({ type: 'error', text: `Erreur : ${result.error}` });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: `Erreur : ${error.message || 'JSON invalide'}` });
    } finally {
      setLoading(false);
    }
  };

  const handlePayPayout = async (id: number) => {
    setLoading(true);
    const result = await PayoutService.payPayout(id);
    if (result.success) {
      setMessage({ type: 'success', text: 'Transfert effectué !' });
      loadPayouts();
    } else {
      setMessage({ type: 'error', text: `Erreur : ${result.error}` });
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>

      {/* Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Transferts</h1>
        <p className={styles.pageMeta}>Payouts & virements mobiles</p>
      </div>

      {/* Alert */}
      {message && (
        <Alert type={message.type} message={message.text} onClose={() => setMessage(null)} />
      )}

      {/* Tab nav */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${mode === 'list' ? styles.active : ''}`}
          onClick={() => setMode('list')}
        >
          Liste
        </button>
        <button
          className={`${styles.tab} ${mode === 'create' ? styles.active : ''}`}
          onClick={() => setMode('create')}
        >
          Nouveau
        </button>
        <button
          className={`${styles.tab} ${mode === 'batch' ? styles.active : ''}`}
          onClick={() => setMode('batch')}
        >
          Batch
        </button>
      </div>

      {/* ---- LIST ---- */}
      {mode === 'list' && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>Tous les transferts</h3>
            <Button onClick={loadPayouts} loading={loading} variant="secondary" size="small">
              ↻ Rafraîchir
            </Button>
          </div>
          <div className={styles.panelBody}>
            {payouts.length === 0 ? (
              <div className={styles.empty}>
                <div className={styles.emptyIcon}>💸</div>
                <p className={styles.emptyText}>Aucun transfert trouvé</p>
              </div>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
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
                        <td style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px' }}>
                          #{payout.id}
                        </td>
                        <td className={styles.refCell}>{payout.reference}</td>
                        <td className={styles.amountCell}>
                          {payout.amount.toLocaleString('fr-FR')} {payout.currency}
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
          </div>
        </div>
      )}

      {/* ---- CREATE ---- */}
      {mode === 'create' && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>Créer un transfert</h3>
          </div>
          <div className={styles.panelBody}>
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
                  <option value="XOF">XOF — Franc CFA</option>
                  <option value="USD">USD — Dollar américain</option>
                  <option value="EUR">EUR — Euro</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Mode de paiement</label>
                <select
                  value={modePayment}
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

              {/* Client selector */}
              <div className={styles.divider}><span>Client</span></div>

              <FormInput
                label="ID client existant"
                type="number"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                placeholder="Laisser vide pour créer un nouveau client"
              />

              {!customerId && (
                <div className={styles.newClientSection}>
                  <p className={styles.newClientLabel}>Nouveau client</p>

                  <FormInput
                    label="Prénom"
                    type="text"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    placeholder="Jean"
                    required
                  />
                  <FormInput
                    label="Nom"
                    type="text"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    placeholder="Dupont"
                    required
                  />
                  <FormInput
                    label="Email"
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
                    label="Numéro de téléphone"
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+22967462549"
                    required
                  />
                </div>
              )}

              <Button type="submit" fullWidth loading={loading} variant="success">
                Créer le transfert
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* ---- BATCH ---- */}
      {mode === 'batch' && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>Batch de transferts</h3>
          </div>
          <div className={styles.panelBody}>
            <form onSubmit={handleCreateBatch} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Tableau JSON des transferts</label>
                <textarea
                  value={batchJson}
                  onChange={(e) => setBatchJson(e.target.value)}
                  className={styles.textarea}
                  rows={14}
                  spellCheck={false}
                />
              </div>

              <div className={styles.batchNote}>
                Entrez un tableau JSON valide. Chaque entrée doit contenir :
                <code style={{ display: 'inline', color: 'rgba(96,165,250,0.75)', marginLeft: 4 }}>
                  amount, currency, mode, callback_url
                </code>{' '}
                et soit{' '}
                <code style={{ display: 'inline', color: 'rgba(96,165,250,0.75)' }}>customer_id</code>
                {' '}soit un objet{' '}
                <code style={{ display: 'inline', color: 'rgba(96,165,250,0.75)' }}>customer</code>.
              </div>

              <Button type="submit" fullWidth loading={loading} variant="success">
                Envoyer le batch
              </Button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};