import { useState, useEffect } from 'react';
import { Button, FormInput, Alert } from '../components';
import { ResponseViewer } from '../components/ResponseViewer';
import { Users, RefreshCw } from 'lucide-react';
import * as CustomerService from '../services/customerService';
import type { Customer, CustomerData } from '../types';

type Tab = 'list' | 'create' | 'retrieve' | 'update' | 'delete';

const TABS: { id: Tab; label: string }[] = [
  { id: 'list',     label: 'Liste'      },
  { id: 'create',   label: 'Créer'      },
  { id: 'retrieve', label: 'Récupérer'  },
  { id: 'update',   label: 'Modifier'   },
  { id: 'delete',   label: 'Supprimer'  },
];

const COUNTRIES = [
  { code: 'BJ', label: 'Bénin',         prefix: '+229' },
  { code: 'SN', label: 'Sénégal',       prefix: '+221' },
  { code: 'CI', label: "Côte d'Ivoire", prefix: '+225' },
  { code: 'ML', label: 'Mali',          prefix: '+223' },
  { code: 'BF', label: 'Burkina Faso',  prefix: '+226' },
  { code: 'GN', label: 'Guinée',        prefix: '+224' },
  { code: 'TG', label: 'Togo',          prefix: '+228' },
];

const getInitials = (first: string, last: string) =>
  `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();

type Msg = { type: 'success' | 'error'; text: string };

export const Customers: React.FC = () => {
  const [tab, setTab]             = useState<Tab>('list');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading]     = useState(false);
  const [msg, setMsg]             = useState<Msg | null>(null);
  const [response, setResponse]   = useState<unknown>(null);

  const [customerId, setCustomerId] = useState('');

  const [firstname, setFirstname]     = useState('');
  const [lastname, setLastname]       = useState('');
  const [email, setEmail]             = useState('');
  const [countryCode, setCountryCode] = useState('BJ');
  const [phonePrefix, setPhonePrefix] = useState('+229');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [updFirstname, setUpdFirstname] = useState('');
  const [updLastname, setUpdLastname]   = useState('');
  const [updEmail, setUpdEmail]         = useState('');

  const notify = (type: Msg['type'], text: string) => setMsg({ type, text });
  const clearResp = () => setResponse(null);

  useEffect(() => { loadCustomers(); }, []);

  const loadCustomers = async () => {
    setLoading(true); clearResp();
    const res = await CustomerService.listCustomers();
    if (res.success && res.data) {
      setCustomers(Array.isArray(res.data) ? res.data : []);
    } else {
      notify('error', res.error || 'Erreur chargement');
    }
    setResponse(res.raw ?? res.data);
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); clearResp();
    const data: CustomerData = {
      firstname, lastname, email,
      country_code: countryCode,
      phone_prefix: phonePrefix,
      phone_number: phoneNumber,
    };
    const res = await CustomerService.createCustomer(data);
    if (res.success) {
      notify('success', `Client créé — ID: ${(res.data as Customer)?.id}`);
      setFirstname(''); setLastname(''); setEmail(''); setPhoneNumber('');
      loadCustomers();
    } else {
      notify('error', res.error || 'Erreur création');
    }
    setResponse(res.raw ?? res.data);
    setLoading(false);
  };

  const handleRetrieve = async (id?: string) => {
    const target = id || customerId;
    if (!target) return notify('error', 'Entrez un ID client');
    setLoading(true); clearResp();
    const res = await CustomerService.retrieveCustomer(target);
    if (res.success) {
      notify('success', `Client #${target} récupéré`);
    } else {
      notify('error', res.error || 'Erreur récupération');
    }
    setResponse(res.raw ?? res.data);
    setLoading(false);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!customerId) return notify('error', 'Entrez un ID client');
    setLoading(true); clearResp();
    const data: Partial<CustomerData> = {};
    if (updFirstname) data.firstname = updFirstname;
    if (updLastname)  data.lastname  = updLastname;
    if (updEmail)     data.email     = updEmail;
    const res = await CustomerService.updateCustomer(customerId, data);
    if (res.success) {
      notify('success', `Client #${customerId} mis à jour`);
      loadCustomers();
    } else {
      notify('error', res.error || 'Erreur mise à jour');
    }
    setResponse(res.raw ?? res.data);
    setLoading(false);
  };

  const handleDelete = async (id?: string) => {
    const target = id || customerId;
    if (!target) return notify('error', 'Entrez un ID client');
    if (!confirm(`Supprimer le client #${target} ?`)) return;
    setLoading(true); clearResp();
    const res = await CustomerService.deleteCustomer(target);
    if (res.success) {
      notify('success', `Client #${target} supprimé`);
      setCustomerId('');
      loadCustomers();
    } else {
      notify('error', res.error || 'Erreur suppression');
    }
    setResponse(res.raw ?? res.data);
    setLoading(false);
  };

  const handleCountryChange = (code: string) => {
    setCountryCode(code);
    const country = COUNTRIES.find(c => c.code === code);
    if (country) setPhonePrefix(country.prefix);
  };

  const IdField = () => (
    <FormInput
      label="ID du client"
      type="number"
      value={customerId}
      onChange={(e: any) => setCustomerId(e.target.value)}
      placeholder="123"
      required
    />
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Clients</h1>
          <p className="text-sm text-slate-400 mt-1">
            {customers.length > 0
              ? `${customers.length} client${customers.length > 1 ? 's' : ''}`
              : 'Gérez vos clients'}
          </p>
        </div>
      </div>

      {msg && <Alert type={msg.type} message={msg.text} onClose={() => setMsg(null)} />}

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

      {tab === 'list' && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">Tous les clients</h3>
            <Button onClick={loadCustomers} loading={loading} variant="secondary" size="sm">
              <RefreshCw size={14} /> Rafraîchir
            </Button>
          </div>
          <div className="p-6">
            {customers.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-slate-500 mb-2 flex justify-center"><Users size={40} /></div>
                <p className="text-slate-500 text-sm">Aucun client trouvé</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customers.map((c) => (
                  <div key={c.id} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                    <div className="px-4 py-3 flex items-center gap-3 border-b border-slate-700/50">
                      <div className="w-8 h-8 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-xs font-bold">
                        {getInitials(c.firstname, c.lastname)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{c.firstname} {c.lastname}</p>
                        <p className="text-xs text-slate-500">#{c.id}</p>
                      </div>
                    </div>
                    <div className="px-4 py-3 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Email</span>
                        <span className="text-slate-300 truncate ml-2">{c.email}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Pays</span>
                        <span className="text-slate-300">{c.country_code}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Créé</span>
                        <span className="text-slate-300">
                          {c.created_at ? new Date(c.created_at).toLocaleDateString('fr-FR') : '—'}
                        </span>
                      </div>
                    </div>
                    <div className="px-4 py-3 border-t border-slate-700/50 flex items-center gap-2">
                      <button className="text-xs px-2.5 py-1 rounded-md bg-slate-700 text-slate-300 hover:bg-slate-600" onClick={() => { setCustomerId(String(c.id)); handleRetrieve(String(c.id)); setTab('retrieve'); }}>Voir</button>
                      <button className="text-xs px-2.5 py-1 rounded-md bg-slate-700 text-slate-300 hover:bg-slate-600" onClick={() => { setCustomerId(String(c.id)); setTab('update'); }}>Modifier</button>
                      <button className="text-xs px-2.5 py-1 rounded-md bg-red-900/30 text-red-400 hover:bg-red-900/50" onClick={() => handleDelete(String(c.id))}>Supprimer</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <ResponseViewer data={response} title="Réponse Customer.all()" />
          </div>
        </div>
      )}

      {tab === 'create' && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between"><h3 className="text-base font-semibold text-white">Créer un client</h3></div>
          <div className="p-6">
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput label="Prénom" type="text" value={firstname} onChange={(e: any) => setFirstname(e.target.value)} placeholder="Jean" required />
                <FormInput label="Nom" type="text" value={lastname} onChange={(e: any) => setLastname(e.target.value)} placeholder="Dupont" required />
              </div>
              <FormInput label="Email" type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} placeholder="jean@example.com" required />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-300">Code Pays</label>
                <select value={countryCode} onChange={(e: any) => handleCountryChange(e.target.value)} className="w-full rounded-lg border border-slate-600 bg-slate-700 text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  {COUNTRIES.map(c => (
                    <option key={c.code} value={c.code}>{c.label} ({c.code})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput label="Préfixe" type="text" value={phonePrefix} onChange={(e: any) => setPhonePrefix(e.target.value)} placeholder="+229" />
                <FormInput label="Numéro" type="text" value={phoneNumber} onChange={(e: any) => setPhoneNumber(e.target.value)} placeholder="67462549" required />
              </div>
              <Button type="submit" fullWidth loading={loading} variant="success">Créer le client</Button>
            </form>
            <ResponseViewer data={response} title="Réponse Customer.create()" />
          </div>
        </div>
      )}

      {tab === 'retrieve' && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between"><h3 className="text-base font-semibold text-white">Récupérer un client</h3></div>
          <div className="p-6">
            <div className="space-y-4">
              <IdField />
              <Button fullWidth onClick={() => handleRetrieve()} loading={loading} variant="secondary">Récupérer</Button>
            </div>
            <ResponseViewer data={response} title="Réponse Customer.retrieve()" />
          </div>
        </div>
      )}

      {tab === 'update' && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between"><h3 className="text-base font-semibold text-white">Modifier un client</h3></div>
          <div className="p-6">
            <form onSubmit={handleUpdate} className="space-y-4">
              <IdField />
              <div className="border-t border-slate-700" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput label="Nouveau prénom" type="text" value={updFirstname} onChange={(e: any) => setUpdFirstname(e.target.value)} placeholder="Jean" />
                <FormInput label="Nouveau nom" type="text" value={updLastname} onChange={(e: any) => setUpdLastname(e.target.value)} placeholder="Dupont" />
              </div>
              <FormInput label="Nouvel email" type="email" value={updEmail} onChange={(e: any) => setUpdEmail(e.target.value)} placeholder="newemail@example.com" />
              <Button type="submit" fullWidth loading={loading}>Mettre à jour</Button>
            </form>
            <ResponseViewer data={response} title="Réponse Customer.update()" />
          </div>
        </div>
      )}

      {tab === 'delete' && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between"><h3 className="text-base font-semibold text-white">Supprimer un client</h3></div>
          <div className="p-6">
            <div className="space-y-4">
              <IdField />
              <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg px-4 py-3 text-sm text-yellow-400">
                ⚠️ Suppression permanente. Appelle <code className="bg-slate-700 px-1 py-0.5 rounded text-xs">customer.delete()</code>.
              </div>
              <Button fullWidth onClick={() => handleDelete()} loading={loading} variant="danger">Supprimer définitivement</Button>
            </div>
            <ResponseViewer data={response} title="Réponse customer.delete()" />
          </div>
        </div>
      )}

    </div>
  );
};
