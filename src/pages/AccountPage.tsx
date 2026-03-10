import { useState, useEffect } from 'react';
import { Button, FormInput, Alert } from '../components';
import { ResponseViewer } from '../components/ResponseViewer';
import { RefreshCw } from 'lucide-react';
import * as AccountService from '../services/accountService';
import type { Account, AccountData } from '../types';

type Tab = 'list' | 'retrieve' | 'create' | 'update' | 'invite';

const TABS: { id: Tab; label: string }[] = [
  { id: 'list',     label: 'Mes comptes'  },
  { id: 'retrieve', label: 'Récupérer'   },
  { id: 'create',   label: 'Créer'       },
  { id: 'update',   label: 'Modifier'    },
  { id: 'invite',   label: 'Inviter'     },
];

const ACCOUNT_TYPES = ['business', 'personal'];
const BUSINESS_TYPES = ['individual', 'company'];

type Msg = { type: 'success' | 'error'; text: string };

export const AccountPage: React.FC = () => {
  const [tab, setTab]           = useState<Tab>('list');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading]   = useState(false);
  const [msg, setMsg]           = useState<Msg | null>(null);
  const [response, setResponse] = useState<unknown>(null);

  const [accountId, setAccountId] = useState('');

  // Create / update fields
  const [name, setName]               = useState('');
  const [email, setEmail]             = useState('');
  const [accountType, setAccountType] = useState('business');
  const [businessType, setBusinessType] = useState('company');
  const [businessName, setBusinessName] = useState('');
  const [website, setWebsite]         = useState('');
  const [description, setDescription] = useState('');
  const [phonePrefix, setPhonePrefix] = useState('+229');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('BJ');
  const [timezone, setTimezone]       = useState('Africa/Porto-Novo');

  // Invite
  const [inviteEmail, setInviteEmail] = useState('');

  const notify = (type: Msg['type'], text: string) => setMsg({ type, text });

  useEffect(() => { loadAccounts(); }, []);

  const loadAccounts = async () => {
    setLoading(true); setResponse(null);
    const res = await AccountService.listAccounts();
    if (res.success && res.data) setAccounts(res.data);
    else notify('error', res.error || 'Erreur chargement');
    setResponse(res.raw ?? res.data);
    setLoading(false);
  };

  const handleRetrieve = async (id?: string) => {
    const target = id || accountId;
    if (!target) return notify('error', 'Entrez un ID de compte');
    setLoading(true); setResponse(null);
    const res = await AccountService.retrieveAccount(target);
    if (res.success) notify('success', `Compte #${target} récupéré`);
    else notify('error', res.error || 'Erreur récupération');
    setResponse(res.raw ?? res.data);
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); setResponse(null);
    const data: AccountData = {
      name, email,
      account_type: accountType,
      business_type: businessType,
      business_name: businessName || undefined,
      website: website || undefined,
      description: description || undefined,
      phone_prefix: phonePrefix || undefined,
      phone_number: phoneNumber || undefined,
      country_code: countryCode,
      timezone,
    };
    const res = await AccountService.createAccount(data);
    if (res.success) {
      notify('success', `Compte créé — ID: ${(res.data as Account)?.id}`);
      setName(''); setEmail(''); setBusinessName(''); setWebsite('');
      setDescription(''); setPhoneNumber('');
      loadAccounts();
    } else {
      notify('error', res.error || 'Erreur création');
    }
    setResponse(res.raw ?? res.data);
    setLoading(false);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!accountId) return notify('error', 'Entrez un ID de compte');
    setLoading(true); setResponse(null);
    const data: Partial<AccountData> = {};
    if (name)         data.name         = name;
    if (email)        data.email        = email;
    if (businessName) data.business_name = businessName;
    if (website)      data.website      = website;
    if (description)  data.description  = description;
    if (phoneNumber)  data.phone_number = phoneNumber;
    if (timezone)     data.timezone     = timezone;
    const res = await AccountService.updateAccount(accountId, data);
    if (res.success) {
      notify('success', `Compte #${accountId} mis à jour`);
      loadAccounts();
    } else {
      notify('error', res.error || 'Erreur mise à jour');
    }
    setResponse(res.raw ?? res.data);
    setLoading(false);
  };

  const handleInvite = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!accountId) return notify('error', 'Entrez un ID de compte');
    if (!inviteEmail) return notify('error', 'Entrez un email à inviter');
    setLoading(true); setResponse(null);
    const res = await AccountService.inviteToAccount(accountId, inviteEmail);
    if (res.success) {
      notify('success', `Invitation envoyée à ${inviteEmail}`);
      setInviteEmail('');
    } else {
      notify('error', res.error || 'Erreur invitation');
    }
    setResponse(res.raw ?? res.data);
    setLoading(false);
  };

  const IdField = () => (
    <FormInput
      label="ID du compte"
      type="number"
      value={accountId}
      onChange={(e: any) => setAccountId(e.target.value)}
      placeholder="123"
      required
    />
  );

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">Gestion</div>
        <h1 className="text-2xl font-bold text-white">Comptes</h1>
        <p className="text-sm text-slate-400 mt-1">
          {accounts.length > 0
            ? `${accounts.length} compte${accounts.length > 1 ? 's' : ''}`
            : 'Gestion des comptes HorusPay'}
        </p>
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

      {/* ======================== LIST ======================== */}
      {tab === 'list' && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">Mes comptes — Account.all()</h3>
            <Button onClick={loadAccounts} loading={loading} variant="secondary" size="sm">
              <RefreshCw size={14} /> Rafraîchir
            </Button>
          </div>
          <div className="p-6">
            {accounts.length === 0 ? (
              <p className="text-slate-500 text-sm py-8 text-center">
                Aucun compte trouvé
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-700">
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Nom</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Statut</th>
                      <th className="px-4 py-3">Pays</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map((acc) => (
                      <tr key={acc.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                        <td className="px-4 py-3 text-slate-500 text-xs">#{acc.id}</td>
                        <td className="px-4 py-3 text-slate-200 font-medium">{acc.name}</td>
                        <td className="px-4 py-3 text-slate-300 font-mono text-xs">{acc.email}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${acc.account_type === 'business' ? 'bg-blue-500/10 text-blue-400' : 'bg-amber-500/10 text-amber-400'}`}>
                            {acc.account_type}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${acc.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                            {acc.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-xs">{acc.country_code || '—'}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1.5">
                            <button
                              className="text-xs px-2.5 py-1 rounded-md bg-slate-700 text-slate-300 hover:bg-slate-600"
                              onClick={() => { setAccountId(String(acc.id)); handleRetrieve(String(acc.id)); setTab('retrieve'); }}
                            >Voir</button>
                            <button
                              className="text-xs px-2.5 py-1 rounded-md bg-slate-700 text-slate-300 hover:bg-slate-600"
                              onClick={() => { setAccountId(String(acc.id)); setTab('update'); }}
                            >Modifier</button>
                            <button
                              className="text-xs px-2.5 py-1 rounded-md bg-slate-700 text-slate-300 hover:bg-slate-600"
                              onClick={() => { setAccountId(String(acc.id)); setTab('invite'); }}
                            >Inviter</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <ResponseViewer data={response} title="Réponse Account.all()" />
          </div>
        </div>
      )}

      {/* ======================== RETRIEVE ======================== */}
      {tab === 'retrieve' && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">Récupérer un compte — Account.retrieve()</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <IdField />
              <Button fullWidth onClick={() => handleRetrieve()} loading={loading} variant="secondary">Récupérer</Button>
            </div>
            <ResponseViewer data={response} title="Réponse Account.retrieve()" />
          </div>
        </div>
      )}

      {/* ======================== CREATE ======================== */}
      {tab === 'create' && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">Créer un compte — Account.create()</h3>
          </div>
          <div className="p-6">
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput label="Nom" type="text" value={name} onChange={(e: any) => setName(e.target.value)} placeholder="Mon Entreprise" required />
                <FormInput label="Email" type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} placeholder="contact@entreprise.com" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-400">Type de compte</label>
                  <select value={accountType} onChange={(e: any) => setAccountType(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
                    {ACCOUNT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-400">Type d'activité</label>
                  <select value={businessType} onChange={(e: any) => setBusinessType(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
                    {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput label="Nom commercial" type="text" value={businessName} onChange={(e: any) => setBusinessName(e.target.value)} placeholder="Mon Entreprise SA" />
                <FormInput label="Site web" type="url" value={website} onChange={(e: any) => setWebsite(e.target.value)} placeholder="https://monsite.com" />
              </div>
              <FormInput label="Description" type="text" value={description} onChange={(e: any) => setDescription(e.target.value)} placeholder="Brève description de l'activité" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput label="Préfixe tél." type="text" value={phonePrefix} onChange={(e: any) => setPhonePrefix(e.target.value)} placeholder="+229" />
                <FormInput label="Numéro tél." type="text" value={phoneNumber} onChange={(e: any) => setPhoneNumber(e.target.value)} placeholder="67462549" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput label="Code pays" type="text" value={countryCode} onChange={(e: any) => setCountryCode(e.target.value)} placeholder="BJ" />
                <FormInput label="Fuseau horaire" type="text" value={timezone} onChange={(e: any) => setTimezone(e.target.value)} placeholder="Africa/Porto-Novo" />
              </div>
              <Button type="submit" fullWidth loading={loading} variant="success">Créer le compte</Button>
            </form>
            <ResponseViewer data={response} title="Réponse Account.create()" />
          </div>
        </div>
      )}

      {/* ======================== UPDATE ======================== */}
      {tab === 'update' && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">Modifier un compte — Account.update()</h3>
          </div>
          <div className="p-6">
            <form onSubmit={handleUpdate} className="space-y-4">
              <IdField />
              <div className="border-t border-slate-700 my-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput label="Nouveau nom" type="text" value={name} onChange={(e: any) => setName(e.target.value)} placeholder="Nouveau nom" />
                <FormInput label="Nouvel email" type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} placeholder="newemail@example.com" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput label="Nom commercial" type="text" value={businessName} onChange={(e: any) => setBusinessName(e.target.value)} placeholder="Nouveau nom commercial" />
                <FormInput label="Site web" type="url" value={website} onChange={(e: any) => setWebsite(e.target.value)} placeholder="https://newsite.com" />
              </div>
              <FormInput label="Description" type="text" value={description} onChange={(e: any) => setDescription(e.target.value)} placeholder="Nouvelle description" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput label="Numéro tél." type="text" value={phoneNumber} onChange={(e: any) => setPhoneNumber(e.target.value)} placeholder="67462549" />
                <FormInput label="Fuseau horaire" type="text" value={timezone} onChange={(e: any) => setTimezone(e.target.value)} placeholder="Africa/Porto-Novo" />
              </div>
              <div className="text-xs text-slate-500 bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                Seuls les champs remplis seront mis à jour.
              </div>
              <Button type="submit" fullWidth loading={loading}>Mettre à jour</Button>
            </form>
            <ResponseViewer data={response} title="Réponse Account.update()" />
          </div>
        </div>
      )}

      {/* ======================== INVITE ======================== */}
      {tab === 'invite' && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">Inviter un utilisateur — account.invite()</h3>
          </div>
          <div className="p-6">
            <form onSubmit={handleInvite} className="space-y-4">
              <IdField />
              <div className="border-t border-slate-700 my-4" />
              <FormInput
                label="Email à inviter"
                type="email"
                value={inviteEmail}
                onChange={(e: any) => setInviteEmail(e.target.value)}
                placeholder="collaborateur@example.com"
                required
              />
              <div className="text-xs text-slate-500 bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                L'utilisateur recevra un email d'invitation pour rejoindre ce compte.
              </div>
              <Button type="submit" fullWidth loading={loading} variant="success">Envoyer l'invitation</Button>
            </form>
            <ResponseViewer data={response} title="Réponse account.invite()" />
          </div>
        </div>
      )}
    </div>
  );
};
