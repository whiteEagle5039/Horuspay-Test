import { useState, useEffect } from 'react';
import { Button, FormInput, Alert } from '../components';
import { ResponseViewer } from '../components/ResponseViewer';
import { Send, RefreshCw } from 'lucide-react';
import * as PayoutService from '../services/payoutService';
import type { Payout, PayoutData } from '../types';

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
      setPayouts(Array.isArray(res.data) ? res.data : []);
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
    setResponse(res.raw ?? res.data);
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

  const getStatusClasses = (status: string) => {
    if (status === 'completed' || status === 'approved') return 'bg-emerald-500/10 text-emerald-400';
    if (status === 'failed' || status === 'refused') return 'bg-red-500/10 text-red-400';
    return 'bg-yellow-500/10 text-yellow-400';
  };

  const IdField = () => (
    <FormInput
      label="ID du payout"
      type="number"
      value={payoutId}
      onChange={(e: any) => setPayoutId(e.target.value)}
      placeholder="123"
      required
    />
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Transferts</h1>
          <p className="text-sm text-slate-400 mt-1">Payouts &amp; virements mobiles</p>
        </div>
      </div>

      {msg && <Alert type={msg.type} message={msg.text} onClose={() => setMsg(null)} />}

      <div className="flex gap-1 bg-slate-800/50 p-1 rounded-lg border border-slate-700 mb-6 overflow-x-auto">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              tab === id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
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
            <h3 className="text-base font-semibold text-white">Tous les transferts</h3>
            <Button onClick={loadPayouts} loading={loading} variant="secondary" size="sm">
              <RefreshCw size={14} /> Rafraîchir
            </Button>
          </div>
          <div className="p-6">
            {payouts.length === 0 ? (
              <div className="text-slate-500 text-sm py-8 text-center">
                <div className="mb-3 flex justify-center text-slate-600"><Send size={40} /></div>
                <p>Aucun transfert trouvé</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-700">
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Référence</th>
                      <th className="px-4 py-3">Montant</th>
                      <th className="px-4 py-3">Mode</th>
                      <th className="px-4 py-3">Statut</th>
                      <th className="px-4 py-3">Actions rapides</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payouts.map((p) => (
                      <tr key={p.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                        <td className="px-4 py-3" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px' }}>#{p.id}</td>
                        <td className="px-4 py-3 text-slate-300 font-mono text-xs">{p.reference || '—'}</td>
                        <td className="px-4 py-3 text-slate-300 font-semibold">
                          {p.amount.toLocaleString('fr-FR')} <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>{p.currency}</span>
                        </td>
                        <td className="px-4 py-3 text-slate-300" style={{ fontSize: '12px' }}>{p.mode}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClasses(p.status)}`}>{p.status}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors" onClick={() => { setPayoutId(String(p.id)); handleRetrieve(String(p.id)); setTab('retrieve'); }}>Voir</button>
                            <button className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors" onClick={() => { setPayoutId(String(p.id)); handlePay(String(p.id)); }}>Exécuter</button>
                            <button className="text-xs text-red-400 hover:text-red-300 transition-colors" onClick={() => handleDelete(String(p.id))}>Supprimer</button>
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
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between"><h3 className="text-base font-semibold text-white">Créer un transfert</h3></div>
          <div className="p-6">
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput label="Montant" type="number" value={amount} onChange={(e: any) => setAmount(e.target.value)} placeholder="5000" required />
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-300">Devise</label>
                  <select value={currency} onChange={(e: any) => setCurrency(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
                    <option value="XOF">XOF — Franc CFA</option>
                    <option value="USD">USD — Dollar</option>
                    <option value="EUR">EUR — Euro</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-300">Mode de paiement</label>
                <select value={mode} onChange={(e: any) => setMode(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
                  {PAYMENT_MODES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
              <FormInput label="URL de callback" type="url" value={callbackUrl} onChange={(e: any) => setCallbackUrl(e.target.value)} placeholder="https://example.com/callback" required />

              <div className="relative flex items-center gap-3 py-2">
                <div className="flex-1 border-t border-slate-700" />
                <span className="text-xs text-slate-500 uppercase tracking-wider">Client</span>
                <div className="flex-1 border-t border-slate-700" />
              </div>

              <FormInput label="ID client existant (optionnel)" type="number" value={customerId} onChange={(e: any) => setCustomerId(e.target.value)} placeholder="Laisser vide pour nouveau client" />

              {!customerId && (
                <div className="space-y-4 rounded-lg border border-slate-700/50 p-4 bg-slate-800/50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput label="Prénom" type="text" value={firstname} onChange={(e: any) => setFirstname(e.target.value)} placeholder="Jean" required />
                    <FormInput label="Nom" type="text" value={lastname} onChange={(e: any) => setLastname(e.target.value)} placeholder="Dupont" required />
                  </div>
                  <FormInput label="Email" type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} placeholder="jean@example.com" required />
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-300">Code Pays</label>
                    <select value={countryCode} onChange={(e: any) => setCountryCode(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
                      {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.label} ({c.code})</option>)}
                    </select>
                  </div>
                  <FormInput label="Numéro de téléphone" type="text" value={phoneNumber} onChange={(e: any) => setPhoneNumber(e.target.value)} placeholder="+22967462549" required />
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
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between"><h3 className="text-base font-semibold text-white">Récupérer un payout</h3></div>
          <div className="p-6">
            <div className="space-y-4">
              <IdField />
              <Button fullWidth onClick={() => handleRetrieve()} loading={loading} variant="secondary">Récupérer</Button>
            </div>
            <ResponseViewer data={response} title="Réponse Payout.retrieve()" />
          </div>
        </div>
      )}

      {/* ======================== PAY ======================== */}
      {tab === 'pay' && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between"><h3 className="text-base font-semibold text-white">Exécuter un transfert</h3></div>
          <div className="p-6">
            <div className="space-y-4">
              <IdField />
              <div className="text-xs rounded-lg p-3 border border-indigo-500/30 bg-indigo-500/10 text-indigo-300">
                Appelle <code className="bg-slate-900 px-1.5 py-0.5 rounded text-indigo-400">payout.pay()</code> — déclenche le transfert mobile.
              </div>
              <Button fullWidth onClick={() => handlePay()} loading={loading} variant="success">Exécuter le transfert</Button>
            </div>
            <ResponseViewer data={response} title="Réponse payout.pay()" />
          </div>
        </div>
      )}

      {/* ======================== UPDATE ======================== */}
      {tab === 'update' && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between"><h3 className="text-base font-semibold text-white">Modifier un payout</h3></div>
          <div className="p-6">
            <form onSubmit={handleUpdate} className="space-y-4">
              <IdField />
              <div className="border-t border-slate-700" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput label="Nouveau montant" type="number" value={updAmount} onChange={(e: any) => setUpdAmount(e.target.value)} placeholder="5000" />
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-300">Devise</label>
                  <select value={updCurrency} onChange={(e: any) => setUpdCurrency(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
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
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between"><h3 className="text-base font-semibold text-white">Supprimer un payout</h3></div>
          <div className="p-6">
            <div className="space-y-4">
              <IdField />
              <div className="text-xs rounded-lg p-3 border border-yellow-500/30 bg-yellow-500/10 text-yellow-300">
                Warning: Suppression permanente. Appelle <code className="bg-slate-900 px-1.5 py-0.5 rounded text-yellow-400">payout.delete()</code>.
              </div>
              <Button fullWidth onClick={() => handleDelete()} loading={loading} variant="danger">Supprimer définitivement</Button>
            </div>
            <ResponseViewer data={response} title="Réponse payout.delete()" />
          </div>
        </div>
      )}

      {/* ======================== BATCH ======================== */}
      {tab === 'batch' && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between"><h3 className="text-base font-semibold text-white">Batch de transferts</h3></div>
          <div className="p-6">
            <form onSubmit={handleBatch} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-300">Tableau JSON des transferts</label>
                <textarea
                  value={batchJson}
                  onChange={(e: any) => setBatchJson(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-y"
                  rows={14}
                  spellCheck={false}
                />
              </div>
              <div className="text-xs rounded-lg p-3 border border-indigo-500/30 bg-indigo-500/10 text-indigo-300">
                Chaque entrée doit contenir : <code className="bg-slate-900 px-1.5 py-0.5 rounded text-indigo-400">amount, currency, mode, callback_url</code> et soit <code className="bg-slate-900 px-1.5 py-0.5 rounded text-indigo-400">customer_id</code> soit un objet <code className="bg-slate-900 px-1.5 py-0.5 rounded text-indigo-400">customer</code>.
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
