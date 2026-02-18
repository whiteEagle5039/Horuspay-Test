import { useState, useEffect } from 'react';
import { Button, FormInput, Alert } from '../components';
import { ResponseViewer } from '../components/ResponseViewer';
import { IconRefresh, IconCreditCard } from '../components/Icons';
import * as TransactionService from '../services/transactionService';
import type { Transaction, TransactionData } from '../types';
import styles from './Transactions.module.css';

type Tab = 'list' | 'create' | 'retrieve' | 'pay' | 'generate-token' | 'status' | 'refund' | 'update' | 'delete';

const TABS: { id: Tab; label: string }[] = [
  { id: 'list',           label: 'Liste'           },
  { id: 'create',         label: 'Créer'           },
  { id: 'retrieve',       label: 'Récupérer'       },
  { id: 'pay',            label: 'Payer'           },
  { id: 'generate-token', label: 'Token'           },
  { id: 'status',         label: 'Statut'          },
  { id: 'refund',         label: 'Rembourser'      },
  { id: 'update',         label: 'Modifier'        },
  { id: 'delete',         label: 'Supprimer'       },
];

type Msg = { type: 'success' | 'error'; text: string };

export const Transactions: React.FC = () => {
  const [tab, setTab]                 = useState<Tab>('list');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading]         = useState(false);
  const [msg, setMsg]                 = useState<Msg | null>(null);
  const [response, setResponse]       = useState<unknown>(null);

  // Champs communs
  const [txId, setTxId]               = useState('');

  // Création
  const [amount, setAmount]           = useState('');
  const [currency, setCurrency]       = useState('XOF');
  const [callbackUrl, setCallbackUrl] = useState('https://example.com/callback');
  const [description, setDescription] = useState('');
  const [customerId, setCustomerId]   = useState('');

  // Mise à jour
  const [updAmount, setUpdAmount]     = useState('');
  const [updCurrency, setUpdCurrency] = useState('XOF');

  const notify = (type: Msg['type'], text: string) => setMsg({ type, text });
  const clearResp = () => setResponse(null);

  useEffect(() => { loadTransactions(); }, []);

  const loadTransactions = async () => {
    setLoading(true);
    clearResp();
    const res = await TransactionService.listTransactions();
    if (res.success && res.data) {
      setTransactions(res.data);
    } else {
      notify('error', res.error || 'Erreur chargement');
    }
    setResponse(res.raw ?? res.data);
    setLoading(false);
  };

  /* ---- Actions ---- */

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    clearResp();
    const data: TransactionData = {
      amount:       parseFloat(amount),
      currency,
      callback_url: callbackUrl,
      description:  description || undefined,
      customer_id:  customerId ? parseInt(customerId) : undefined,
    };
    const res = await TransactionService.createTransaction(data);
    if (res.success) {
      notify('success', `Transaction créée — ID: ${(res.data as Transaction)?.id}`);
      setAmount(''); setDescription(''); setCustomerId('');
      loadTransactions();
    } else {
      notify('error', res.error || 'Erreur création');
    }
    setResponse(res.raw ?? res.data);
    setLoading(false);
  };

  const handleRetrieve = async (id?: string) => {
    const target = id || txId;
    if (!target) return notify('error', 'Entrez un ID de transaction');
    setLoading(true); clearResp();
    const res = await TransactionService.retrieveTransaction(target);
    if (res.success) {
      notify('success', `Transaction #${target} récupérée`);
    } else {
      notify('error', res.error || 'Erreur récupération');
    }
    setResponse(res.raw ?? res.data);
    setLoading(false);
  };

  const handlePay = async () => {
    if (!txId) return notify('error', 'Entrez un ID de transaction');
    setLoading(true); clearResp();
    const res = await TransactionService.payTransaction(txId);
    if (res.success) {
      notify('success', 'Paiement déclenché avec succès !');
      loadTransactions();
    } else {
      notify('error', res.error || 'Erreur paiement');
    }
    setResponse(res.raw ?? res.data);
    setLoading(false);
  };

  const handleGenerateToken = async () => {
    if (!txId) return notify('error', 'Entrez un ID de transaction');
    setLoading(true); clearResp();
    const res = await TransactionService.generateToken(txId);
    if (res.success) {
      notify('success', 'Token généré !');
    } else {
      notify('error', res.error || 'Erreur génération token');
    }
    setResponse(res.raw ?? res.data);
    setLoading(false);
  };

  const handleStatus = async () => {
    if (!txId) return notify('error', 'Entrez un ID de transaction');
    setLoading(true); clearResp();
    const res = await TransactionService.getTransactionStatus(txId);
    if (res.success && res.data) {
      const d = res.data;
      notify('success', `Statut: ${d.status} | Payée: ${d.wasPaid} | Remboursée: ${d.wasRefunded} | Part. remb.: ${d.wasPartiallyRefunded}`);
    } else {
      notify('error', res.error || 'Erreur statut');
    }
    setResponse(res.data);
    setLoading(false);
  };

  const handleRefund = async () => {
    if (!txId) return notify('error', 'Entrez un ID de transaction');
    if (!confirm(`Rembourser la transaction #${txId} ?`)) return;
    setLoading(true); clearResp();
    const res = await TransactionService.refundTransaction(txId);
    if (res.success) {
      notify('success', 'Remboursement effectué !');
      loadTransactions();
    } else {
      notify('error', res.error || 'Erreur remboursement');
    }
    setResponse(res.raw ?? res.data);
    setLoading(false);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!txId) return notify('error', 'Entrez un ID de transaction');
    setLoading(true); clearResp();
    const updateData: Partial<TransactionData> = {};
    if (updAmount)   updateData.amount   = parseFloat(updAmount);
    if (updCurrency) updateData.currency = updCurrency;
    const res = await TransactionService.updateTransaction(txId, updateData);
    if (res.success) {
      notify('success', `Transaction #${txId} mise à jour`);
      loadTransactions();
    } else {
      notify('error', res.error || 'Erreur mise à jour');
    }
    setResponse(res.raw ?? res.data);
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!txId) return notify('error', 'Entrez un ID de transaction');
    if (!confirm(`Supprimer définitivement la transaction #${txId} ?`)) return;
    setLoading(true); clearResp();
    const res = await TransactionService.deleteTransaction(txId);
    if (res.success) {
      notify('success', `Transaction #${txId} supprimée`);
      setTxId('');
      loadTransactions();
    } else {
      notify('error', res.error || 'Erreur suppression');
    }
    setResponse(res.data);
    setLoading(false);
  };

  /* ---- Helpers UI ---- */

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':   case 'transferred': return styles.statusApproved;
      case 'refunded':   case 'partially_refunded': return styles.statusRefunded;
      case 'refused':    return styles.statusRefused;
      default:           return styles.statusPending;
    }
  };

  /* ---- ID Field (shared) ---- */
  const IdField = () => (
    <FormInput
      label="ID de la transaction"
      type="number"
      value={txId}
      onChange={(e) => setTxId(e.target.value)}
      placeholder="123"
      required
    />
  );

  return (
    <div className={styles.container}>

      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Transactions</h1>
          <p className={styles.pageMeta}>
            {transactions.length > 0
              ? `${transactions.length} transaction${transactions.length > 1 ? 's' : ''}`
              : 'Gérez vos transactions de paiement'}
          </p>
        </div>
      </div>

      {msg && (
        <Alert type={msg.type} message={msg.text} onClose={() => setMsg(null)} />
      )}

      {/* Tabs */}
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
            <h3 className={styles.panelTitle}>Toutes les transactions</h3>
            <Button onClick={loadTransactions} loading={loading} variant="secondary" size="small">
              <IconRefresh size={14} /> Rafraîchir
            </Button>
          </div>
          <div className={styles.panelBody}>
            {transactions.length === 0 ? (
              <div className={styles.empty}>
                <div className={styles.emptyIcon}><IconCreditCard size={40} /></div>
                <p className={styles.emptyText}>Aucune transaction trouvée</p>
              </div>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Référence</th>
                      <th>Montant</th>
                      <th>Statut</th>
                      <th>Créée le</th>
                      <th>Actions rapides</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id}>
                        <td style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px' }}>#{tx.id}</td>
                        <td className={styles.refCell}>{tx.reference || '—'}</td>
                        <td className={styles.amountCell}>
                          {tx.amount.toLocaleString('fr-FR')} <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>{tx.currency}</span>
                        </td>
                        <td>
                          <span className={`${styles.status} ${getStatusColor(tx.status)}`}>
                            {tx.status}
                          </span>
                        </td>
                        <td style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>
                          {tx.created_at ? new Date(tx.created_at).toLocaleDateString('fr-FR') : '—'}
                        </td>
                        <td>
                          <div className={styles.actions}>
                            <button className={styles.actionBtn} onClick={() => { setTxId(String(tx.id)); setTab('retrieve'); handleRetrieve(String(tx.id)); }}>Voir</button>
                            <button className={styles.actionBtnGreen} onClick={() => { setTxId(String(tx.id)); setTab('pay'); }}>Payer</button>
                            <button className={styles.actionBtnBlue} onClick={() => { setTxId(String(tx.id)); setTab('status'); }}>Statut</button>
                            <button className={styles.actionBtnRed} onClick={() => { setTxId(String(tx.id)); handleRefund(); }}>Rembourser</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <ResponseViewer data={response} title="Réponse listTransactions()" />
          </div>
        </div>
      )}

      {/* ======================== CREATE ======================== */}
      {tab === 'create' && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>Créer une transaction</h3>
          </div>
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
              <FormInput label="URL de callback" type="url" value={callbackUrl} onChange={(e) => setCallbackUrl(e.target.value)} placeholder="https://example.com/callback" required />
              <FormInput label="Description (optionnel)" type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Paiement commande #42" />
              <FormInput label="ID Client (optionnel)" type="number" value={customerId} onChange={(e) => setCustomerId(e.target.value)} placeholder="Laisser vide pour nouveau client" />
              <Button type="submit" fullWidth loading={loading} variant="success">Créer la transaction</Button>
            </form>
            <ResponseViewer data={response} title="Réponse Transaction.create()" />
          </div>
        </div>
      )}

      {/* ======================== RETRIEVE ======================== */}
      {tab === 'retrieve' && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}><h3 className={styles.panelTitle}>Récupérer une transaction</h3></div>
          <div className={styles.panelBody}>
            <div className={styles.form}>
              <IdField />
              <Button fullWidth onClick={() => handleRetrieve()} loading={loading} variant="secondary">Récupérer</Button>
            </div>
            <ResponseViewer data={response} title="Réponse Transaction.retrieve()" />
          </div>
        </div>
      )}

      {/* ======================== PAY ======================== */}
      {tab === 'pay' && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}><h3 className={styles.panelTitle}>Déclencher un paiement</h3></div>
          <div className={styles.panelBody}>
            <div className={styles.form}>
              <IdField />
              <div className={styles.infoBox}>
                Appelle <code>transaction.pay()</code> — déclenche le flux de paiement sans redirection.
              </div>
              <Button fullWidth onClick={handlePay} loading={loading} variant="success">Déclencher le paiement</Button>
            </div>
            <ResponseViewer data={response} title="Réponse transaction.pay()" />
          </div>
        </div>
      )}

      {/* ======================== GENERATE TOKEN ======================== */}
      {tab === 'generate-token' && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}><h3 className={styles.panelTitle}>Générer un token de paiement</h3></div>
          <div className={styles.panelBody}>
            <div className={styles.form}>
              <IdField />
              <div className={styles.infoBox}>
                Appelle <code>transaction.generateToken()</code> — génère un token JWT pour le checkout.
              </div>
              <Button fullWidth onClick={handleGenerateToken} loading={loading}>Générer le token</Button>
            </div>
            <ResponseViewer data={response} title="Réponse transaction.generateToken()" />
          </div>
        </div>
      )}

      {/* ======================== STATUS ======================== */}
      {tab === 'status' && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}><h3 className={styles.panelTitle}>Vérifier le statut</h3></div>
          <div className={styles.panelBody}>
            <div className={styles.form}>
              <IdField />
              <div className={styles.infoBox}>
                Combine <code>transaction.getStatus()</code>, <code>wasPaid()</code>, <code>wasRefunded()</code> et <code>wasPartiallyRefunded()</code>.
              </div>
              <Button fullWidth onClick={handleStatus} loading={loading} variant="secondary">Vérifier le statut</Button>
            </div>
            <ResponseViewer data={response} title="Réponse statut détaillé" />
          </div>
        </div>
      )}

      {/* ======================== REFUND ======================== */}
      {tab === 'refund' && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}><h3 className={styles.panelTitle}>Rembourser une transaction</h3></div>
          <div className={styles.panelBody}>
            <div className={styles.form}>
              <IdField />
              <div className={styles.warningBox}>
                ⚠️ Cette action est irréversible. Appelle <code>transaction.refund()</code>.
              </div>
              <Button fullWidth onClick={handleRefund} loading={loading} variant="danger">Rembourser</Button>
            </div>
            <ResponseViewer data={response} title="Réponse transaction.refund()" />
          </div>
        </div>
      )}

      {/* ======================== UPDATE ======================== */}
      {tab === 'update' && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}><h3 className={styles.panelTitle}>Modifier une transaction</h3></div>
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
            <ResponseViewer data={response} title="Réponse Transaction.update()" />
          </div>
        </div>
      )}

      {/* ======================== DELETE ======================== */}
      {tab === 'delete' && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}><h3 className={styles.panelTitle}>Supprimer une transaction</h3></div>
          <div className={styles.panelBody}>
            <div className={styles.form}>
              <IdField />
              <div className={styles.warningBox}>
                ⚠️ Suppression permanente. Appelle <code>transaction.delete()</code>.
              </div>
              <Button fullWidth onClick={handleDelete} loading={loading} variant="danger">Supprimer définitivement</Button>
            </div>
            <ResponseViewer data={response} title="Réponse transaction.delete()" />
          </div>
        </div>
      )}

    </div>
  );
};
