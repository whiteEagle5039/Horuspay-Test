import { useState, useEffect } from 'react';
import { Button, FormInput, Alert } from '../components';
import { ResponseViewer } from '../components/ResponseViewer';
import { RefreshCw, CreditCard } from 'lucide-react';
import * as TransactionService from '../services/transactionService';
import type { Transaction, TransactionData } from '../types';

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
    setResponse(res.raw ?? res.data);
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
    setResponse(res.raw ?? res.data);
    setLoading(false);
  };

  /* ---- Helpers UI ---- */

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':   case 'transferred': return 'bg-emerald-500/10 text-emerald-400';
      case 'refunded':   case 'partially_refunded': return 'bg-emerald-500/10 text-emerald-400';
      case 'refused':    return 'bg-red-500/10 text-red-400';
      default:           return 'bg-yellow-500/10 text-yellow-400';
    }
  };

  /* ---- ID Field (shared) ---- */
  const IdField = () => (
    <FormInput
      label="ID de la transaction"
      type="number"
      value={txId}
      onChange={(e: any) => setTxId(e.target.value)}
      placeholder="123"
      required
    />
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Transactions</h1>
          <p className="text-sm text-slate-400">
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
      <div className="flex gap-1 bg-slate-800/50 p-1 rounded-lg border border-slate-700 mb-6 overflow-x-auto">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${tab === id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            onClick={() => { setTab(id); setMsg(null); setResponse(null); }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ======================== LIST ======================== */}
      {tab === 'list' && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">Toutes les transactions</h3>
            <Button onClick={loadTransactions} loading={loading} variant="secondary" size="sm">
              <RefreshCw size={14} /> Rafraîchir
            </Button>
          </div>
          <div className="p-6">
            {transactions.length === 0 ? (
              <div className="text-slate-500 text-sm py-8 text-center">
                <div className="mb-3 flex justify-center text-slate-600"><CreditCard size={40} /></div>
                <p>Aucune transaction trouvée</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-700">
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Référence</th>
                      <th className="px-4 py-3">Montant</th>
                      <th className="px-4 py-3">Statut</th>
                      <th className="px-4 py-3">Créée le</th>
                      <th className="px-4 py-3">Actions rapides</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                        <td className="px-4 py-3 text-xs text-white/35">#{tx.id}</td>
                        <td className="px-4 py-3 font-mono text-xs text-indigo-400">{tx.reference || '—'}</td>
                        <td className="px-4 py-3 text-slate-300">
                          {tx.amount.toLocaleString('fr-FR')} <span className="text-white/40 text-[11px]">{tx.currency}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-white/45">
                          {tx.created_at ? new Date(tx.created_at).toLocaleDateString('fr-FR') : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button className="text-xs px-2.5 py-1 rounded-md bg-slate-700 text-slate-300 hover:bg-slate-600" onClick={() => { setTxId(String(tx.id)); setTab('retrieve'); handleRetrieve(String(tx.id)); }}>Voir</button>
                            <button className="text-xs px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20" onClick={() => { setTxId(String(tx.id)); setTab('pay'); }}>Payer</button>
                            <button className="text-xs px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20" onClick={() => { setTxId(String(tx.id)); setTab('status'); }}>Statut</button>
                            <button className="text-xs px-2.5 py-1 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20" onClick={() => { setTxId(String(tx.id)); handleRefund(); }}>Rembourser</button>
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
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">Créer une transaction</h3>
          </div>
          <div className="p-6">
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormInput label="Montant" type="number" value={amount} onChange={(e: any) => setAmount(e.target.value)} placeholder="5000" required />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-300">Devise</label>
                  <select value={currency} onChange={(e: any) => setCurrency(e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="XOF">XOF — Franc CFA</option>
                    <option value="USD">USD — Dollar</option>
                    <option value="EUR">EUR — Euro</option>
                  </select>
                </div>
              </div>
              <FormInput label="URL de callback" type="url" value={callbackUrl} onChange={(e: any) => setCallbackUrl(e.target.value)} placeholder="https://example.com/callback" required />
              <FormInput label="Description (optionnel)" type="text" value={description} onChange={(e: any) => setDescription(e.target.value)} placeholder="Paiement commande #42" />
              <FormInput label="ID Client (optionnel)" type="number" value={customerId} onChange={(e: any) => setCustomerId(e.target.value)} placeholder="Laisser vide pour nouveau client" />
              <Button type="submit" fullWidth loading={loading} variant="success">Créer la transaction</Button>
            </form>
            <ResponseViewer data={response} title="Réponse Transaction.create()" />
          </div>
        </div>
      )}

      {/* ======================== RETRIEVE ======================== */}
      {tab === 'retrieve' && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between"><h3 className="text-base font-semibold text-white">Récupérer une transaction</h3></div>
          <div className="p-6">
            <div className="space-y-4">
              <IdField />
              <Button fullWidth onClick={() => handleRetrieve()} loading={loading} variant="secondary">Récupérer</Button>
            </div>
            <ResponseViewer data={response} title="Réponse Transaction.retrieve()" />
          </div>
        </div>
      )}

      {/* ======================== PAY ======================== */}
      {tab === 'pay' && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between"><h3 className="text-base font-semibold text-white">Déclencher un paiement</h3></div>
          <div className="p-6">
            <div className="space-y-4">
              <IdField />
              <div className="text-xs text-slate-500 bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
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
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between"><h3 className="text-base font-semibold text-white">Générer un token de paiement</h3></div>
          <div className="p-6">
            <div className="space-y-4">
              <IdField />
              <div className="text-xs text-slate-500 bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
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
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between"><h3 className="text-base font-semibold text-white">Vérifier le statut</h3></div>
          <div className="p-6">
            <div className="space-y-4">
              <IdField />
              <div className="text-xs text-slate-500 bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
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
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between"><h3 className="text-base font-semibold text-white">Rembourser une transaction</h3></div>
          <div className="p-6">
            <div className="space-y-4">
              <IdField />
              <div className="text-xs text-amber-400 bg-amber-500/10 rounded-lg p-3 border border-amber-500/20">
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
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between"><h3 className="text-base font-semibold text-white">Modifier une transaction</h3></div>
          <div className="p-6">
            <form onSubmit={handleUpdate} className="space-y-4">
              <IdField />
              <div className="border-t border-slate-700 my-4" />
              <div className="grid grid-cols-2 gap-4">
                <FormInput label="Nouveau montant" type="number" value={updAmount} onChange={(e: any) => setUpdAmount(e.target.value)} placeholder="5000" />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-300">Devise</label>
                  <select value={updCurrency} onChange={(e: any) => setUpdCurrency(e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
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
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between"><h3 className="text-base font-semibold text-white">Supprimer une transaction</h3></div>
          <div className="p-6">
            <div className="space-y-4">
              <IdField />
              <div className="text-xs text-amber-400 bg-amber-500/10 rounded-lg p-3 border border-amber-500/20">
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
