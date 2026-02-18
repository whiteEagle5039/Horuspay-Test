import { useState, useEffect } from 'react';
import { Button, FormInput, Alert } from '../components';
import { ResponseViewer } from '../components/ResponseViewer';
import { IconSend, IconRefresh } from '../components/Icons';
import * as PayoutService from '../services/payoutService';
import type { Payout, PayoutData } from '../types';
import styles from './Payouts.module.css';

type Tab = 'list' | 'create' | 'retrieve' | 'update' | 'pay' | 'delete' | 'batch';

const TABS: { id: Tab; label: string }[] = [
  { id: 'list',     label: 'Liste'      },
  { id: 'create',   label: 'Créer'      },
  { id: 'retrieve', label: 'Récupérer'  },
  { id: 'pay',      label: 'Exécuter'   },
  { id: 'update',   label: 'Modifier'   },
  { id: 'delete',   label: 'Supprimer'  },
  { id: 'batch',    label: 'Batch'      },
];

const PAYMENT_MODES = [
  { value: 'mtn_open',      label: 'MTN Mobile Money' },
  { value: 'orange_money',  label: 'Orange Money'     },
  { value: 'moov_money',    label: 'Moov Money'       },
  { value: 'bank_transfer', label: 'Virement Bancaire' },
];

const COUNTRIES = [
  { code: 'BJ', label: 'Bénin',         prefix: '+229' },
  { code: 'SN', label: 'Sénégal',       prefix: '+221' },
  { code: 'CI', label: "Côte d'Ivoire", prefix: '+225' },
  { code: 'ML', label: 'Mali',          prefix: '+223' },
];

const BATCH_PLACEHOLDER = JSON.stringify([
  {
    amount: 1000,
    currency: 'XOF',
    mode: 'mtn_open',
    callback_url: 'https://example.com/callback',
    customer_id: 1,
  },
  {
    amount: 2500,
    currency: 'XOF',
    mode: 'orange_money',
    callback_url: 'https://example.com/callback',
    customer_id: 2,
  },
], null, 2);

type Msg = { type: 'success' | 'error'; text: string };

export const Payouts: React.FC = () => {
  const [tab, setTab]       = useState<Tab>('list');
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg]         = useState<Msg | null>(null);
  const [response, setResponse] = useState<unknown>(null);

  const [payoutId, setPayoutId] = useState('');

  // Création
  const [amount, setAmount]           = useState('');
  const [currency, setCurrency]       = useState('XOF');
  const [mode, setMode]               = useState('mtn_open');
  const [callbackUrl, setCallbackUrl] = useState('https://example.com/callback');
  const [customerId, setCustomerId]   = useState('');
  const [firstname, setFirstname]     = useState('');
  const [lastname, setLastname]       = useState('');
  const [email, setEmail]             = useState('');
  const [countryCode, setCountryCode] = useState('BJ');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Mise à jour
  const [updAmount, setUpdAmount]     = useState('');
  const [updCurrency, setUpdCurrency] = useState('XOF');

  // Batch
  const [batchJson, setBatchJson] = useState(BATCH_PLACEHOLDER);

  const notify = (type: Msg['type'], text: string) => setMsg({ type, text });
  const clearResp = () => setResponse(null);

  useEffect(() => { loadPayouts(); }, []);

  const loadPayouts = async () => {
    setLoading(true); clearResp();
    const res = await PayoutService.listPayouts();
    if (res.success && res.data) {
      setPayouts(res.data);
    } else {
      notify('error', res.error || 'Erreur chargement');
    }
    setResponse(res.raw ?? res.data);
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); clearResp();
    const data: PayoutData = {
      amount: parseFloat(amount),
      currency,
      mode,
      callback_url: callbackUrl,
    };
    if (customerId) {
      data.customer_id = parseInt(customerId);
    } else {
      data.customer = {
        firstname, lastname, email,
        country_code: countryCode,
        phone: { number: phoneNumber, country: countryCode.toLowerCase(), network: mode },
      };
    }
    const res = await PayoutService.createPayout(data);
    if (res.success) {
      notify('success', `Payout créé — ID: ${(res.data as Payout)?.id}`);
      setAmount(''); setCustomerId(''); setFirstname(''); setLastname(''); setEmail(''); setPhoneNumber('');
      loadPayouts();
    } else {
      notify('error', res.error || 'Erreur création');
    }
    setResponse(res.raw ?? res.data);
    setLoading(false);
  };

  const handleRetrieve = async (id?: string) => {
    const target = id || payoutId;
    if (!target) return notify('error', 'Entrez un ID de payout');
    setLoading(true); clearResp();
    const res = await PayoutService.retrievePayout(target);
    if (res.success) {
      notify('success', `Payout #${target} récupéré`);
    } else {
      notify('error', res.error || 'Erreur récupération');
    }
    setResponse(res.raw ?? res.data);
    setLoading(false);
  };

  const handlePay = async (id?: string) => {
    const target = id || payoutId;
    if (!target) return notify('error', 'Entrez un ID de payout');
    setLoading(true); clearResp();
    const res = await PayoutService.payPayout(target);
    if (res.success) {
      notify('success', 'Transfert exécuté !');
      loadPayouts();
    } else {
      notify('error', res.error || 'Erreur exécution');
    }
    setResponse(res.raw ?? res.data);
    setLoading(false);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!payoutId) return notify('error', 'Entrez un ID de payout');
    setLoading(true); clearResp();
    const data: Partial<PayoutData> = {};
    if (updAmount)   data.amount   = parseFloat(updAmount);
    if (updCurrency) data.currency = updCurrency;
    const res = await PayoutService.updatePayout(payoutId, data);
    if (res.success) {
      notify('success', `Payout #${payoutId} mis à jour`);
      loadPayouts();
    } else {
      notify('error', res.error || 'Erreur mise à jour');
    }
    setResponse(res.raw ?? res.data);
    setLoading(false);
  };

  const handleDelete = async (id?: string) => {
    const target = id || payoutId;
    if (!target) return notify('error', 'Entrez un ID de payout');
    if (!confirm(`Supprimer le payout #${target} ?`)) return;
    setLoading(true); clearResp();
    const res = await PayoutService.deletePayout(target);
    if (res.success) {
      notify('success', `Payout #${target} supprimé`);
      setPayoutId('');
      loadPayouts();
    } else {
      notify('error', res.error || 'Erreur suppression');
    }
    setResponse(res.data);
    setLoading(false);
  };

  const handleBatch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); clearResp();
    try {
      const payoutsData = JSON.parse(batchJson);
      const res = await PayoutService.createPayoutBatch(payoutsData);
      if (res.success) {
        notify('success', 'Batch créé !');
        setBatchJson(BATCH_PLACEHOLDER);
        loadPayouts();
      } else {
        notify('error', res.error || 'Erreur batch');
      }
      setResponse(res.raw ?? res.data);
    } catch {
      notify('error', 'JSON invalide');
    }
    setLoading(false);
  };

  const getStatusClass = (status: string) => {
    if (status === 'completed' || status === 'approved') return styles.statusApproved;
    if (status === 'failed' || status === 'refused') return styles.statusRefused;
    return styles.statusPending;
  };

  const IdField = () => (
    <FormInput
      label="ID du payout"
      type="number"
      value={payoutId}
      onChange={(e) => setPayoutId(e.target.value)}
      placeholder="123"
      required
    />
  );

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Transferts</h1>
        <p className={styles.pageMeta}>Payouts &amp; virements mobiles</p>
      </div>

      {msg && <Alert type={msg.type} message={msg.text} onClose={() => setMsg(null)} />}

      <div className={styles.tabs}>
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            className={`${styles.tab} ${tab === id ? styles.active : ''}`}
            onClick={() => { setTab(id); setMsg(null); setResponse(null); }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ======================== LIST ======================== */}
      {tab === 'list' && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>Tous les transferts</h3>
            <Button onClick={loadPayouts} loading={loading} variant="secondary" size="small">
              <IconRefresh size={14} /> Rafraîchir
            </Button>
          </div>
          <div className={styles.panelBody}>
            {payouts.length === 0 ? (
              <div className={styles.empty}>
                <div className={styles.emptyIcon}><IconSend size={40} /></div>
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
                      <th>Actions rapides</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payouts.map((p) => (
                      <tr key={p.id}>
                        <td style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px' }}>#{p.id}</td>
                        <td className={styles.refCell}>{p.reference || '—'}</td>
                        <td className={styles.amountCell}>
                          {p.amount.toLocaleString('fr-FR')} <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>{p.currency}</span>
                        </td>
                        <td style={{ fontSize: '12px' }}>{p.mode}</td>
                        <td>
                          <span className={`${styles.status} ${getStatusClass(p.status)}`}>{p.status}</span>
                        </td>
                        <td>
                          <div className={styles.actions}>
                            <button className={styles.actionBtn} onClick={() => { setPayoutId(String(p.id)); handleRetrieve(String(p.id)); setTab('retrieve'); }}>Voir</button>
                            <button className={styles.actionBtnGreen} onClick={() => { setPayoutId(String(p.id)); handlePay(String(p.id)); }}>Exécuter</button>
                            <button className={styles.actionBtnRed} onClick={() => handleDelete(String(p.id))}>Supprimer</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <ResponseViewer data={response} title="Réponse Payout.all()" />
          </div>
        </div>
      )}

      {/* ======================== CREATE ======================== */}
      {tab === 'create' && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}><h3 className={styles.panelTitle}>Créer un transfert</h3></div>
          <div className={styles.panelBody}>
            <form onSubmit={handleCreate} className={styles.form}>
              <div className={styles.row}>
                <FormInput label="Montant" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="5000" required />
                <div className={styles.formGroup}>
                  <label className={styles.label}>Devise</label>
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={styles.select}>
                    <option value="XOF">XOF — Franc CFA</option>
                    <option value="USD">USD — Dollar</option>
                    <option value="EUR">EUR — Euro</option>
                  </select>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Mode de paiement</label>
                <select value={mode} onChange={(e) => setMode(e.target.value)} className={styles.select}>
                  {PAYMENT_MODES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
              <FormInput label="URL de callback" type="url" value={callbackUrl} onChange={(e) => setCallbackUrl(e.target.value)} placeholder="https://example.com/callback" required />

              <div className={styles.divider}><span>Client</span></div>

              <FormInput label="ID client existant (optionnel)" type="number" value={customerId} onChange={(e) => setCustomerId(e.target.value)} placeholder="Laisser vide pour nouveau client" />

              {!customerId && (
                <div className={styles.newClientSection}>
                  <div className={styles.row}>
                    <FormInput label="Prénom" type="text" value={firstname} onChange={(e) => setFirstname(e.target.value)} placeholder="Jean" required />
                    <FormInput label="Nom" type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} placeholder="Dupont" required />
                  </div>
                  <FormInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jean@example.com" required />
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Code Pays</label>
                    <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)} className={styles.select}>
                      {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.label} ({c.code})</option>)}
                    </select>
                  </div>
                  <FormInput label="Numéro de téléphone" type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+22967462549" required />
                </div>
              )}

              <Button type="submit" fullWidth loading={loading} variant="success">Créer le transfert</Button>
            </form>
            <ResponseViewer data={response} title="Réponse Payout.create()" />
          </div>
        </div>
      )}

      {/* ======================== RETRIEVE ======================== */}
      {tab === 'retrieve' && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}><h3 className={styles.panelTitle}>Récupérer un payout</h3></div>
          <div className={styles.panelBody}>
            <div className={styles.form}>
              <IdField />
              <Button fullWidth onClick={() => handleRetrieve()} loading={loading} variant="secondary">Récupérer</Button>
            </div>
            <ResponseViewer data={response} title="Réponse Payout.retrieve()" />
          </div>
        </div>
      )}

      {/* ======================== PAY ======================== */}
      {tab === 'pay' && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}><h3 className={styles.panelTitle}>Exécuter un transfert</h3></div>
          <div className={styles.panelBody}>
            <div className={styles.form}>
              <IdField />
              <div className={styles.infoBox}>
                Appelle <code>payout.pay()</code> — déclenche le transfert mobile.
              </div>
              <Button fullWidth onClick={() => handlePay()} loading={loading} variant="success">Exécuter le transfert</Button>
            </div>
            <ResponseViewer data={response} title="Réponse payout.pay()" />
          </div>
        </div>
      )}

      {/* ======================== UPDATE ======================== */}
      {tab === 'update' && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}><h3 className={styles.panelTitle}>Modifier un payout</h3></div>
          <div className={styles.panelBody}>
            <form onSubmit={handleUpdate} className={styles.form}>
              <IdField />
              <div className={styles.dividerLine} />
              <div className={styles.row}>
                <FormInput label="Nouveau montant" type="number" value={updAmount} onChange={(e) => setUpdAmount(e.target.value)} placeholder="5000" />
                <div className={styles.formGroup}>
                  <label className={styles.label}>Devise</label>
                  <select value={updCurrency} onChange={(e) => setUpdCurrency(e.target.value)} className={styles.select}>
                    <option value="XOF">XOF</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>
              <Button type="submit" fullWidth loading={loading}>Mettre à jour</Button>
            </form>
            <ResponseViewer data={response} title="Réponse Payout.update()" />
          </div>
        </div>
      )}

      {/* ======================== DELETE ======================== */}
      {tab === 'delete' && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}><h3 className={styles.panelTitle}>Supprimer un payout</h3></div>
          <div className={styles.panelBody}>
            <div className={styles.form}>
              <IdField />
              <div className={styles.warningBox}>
                ⚠️ Suppression permanente. Appelle <code>payout.delete()</code>.
              </div>
              <Button fullWidth onClick={() => handleDelete()} loading={loading} variant="danger">Supprimer définitivement</Button>
            </div>
            <ResponseViewer data={response} title="Réponse payout.delete()" />
          </div>
        </div>
      )}

      {/* ======================== BATCH ======================== */}
      {tab === 'batch' && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}><h3 className={styles.panelTitle}>Batch de transferts</h3></div>
          <div className={styles.panelBody}>
            <form onSubmit={handleBatch} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Tableau JSON des transferts</label>
                <textarea
                  value={batchJson}
                  onChange={(e) => setBatchJson(e.target.value)}
                  className={styles.textarea}
                  rows={14}
                  spellCheck={false}
                />
              </div>
              <div className={styles.infoBox}>
                Chaque entrée doit contenir : <code>amount, currency, mode, callback_url</code> et soit <code>customer_id</code> soit un objet <code>customer</code>.
              </div>
              <Button type="submit" fullWidth loading={loading} variant="success">Envoyer le batch</Button>
            </form>
            <ResponseViewer data={response} title="Réponse Payout.createBatch()" />
          </div>
        </div>
      )}

    </div>
  );
};
