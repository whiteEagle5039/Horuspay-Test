import { useState, useEffect } from 'react';
import { Button, FormInput, Alert } from '../components';
import { ResponseViewer } from '../components/ResponseViewer';
import { IconRefresh } from '../components/Icons';
import * as AccountService from '../services/accountService';
import type { Account, AccountData } from '../types';
import styles from './Transactions.module.css';

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
      onChange={(e) => setAccountId(e.target.value)}
      placeholder="123"
      required
    />
  );

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Comptes</h1>
          <p className={styles.pageMeta}>
            {accounts.length > 0
              ? `${accounts.length} compte${accounts.length > 1 ? 's' : ''}`
              : 'Gestion des comptes HorusPay'}
          </p>
        </div>
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
            <h3 className={styles.panelTitle}>Mes comptes — Account.all()</h3>
            <Button onClick={loadAccounts} loading={loading} variant="secondary" size="small">
              <IconRefresh size={14} /> Rafraîchir
            </Button>
          </div>
          <div className={styles.panelBody}>
            {accounts.length === 0 ? (
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px', padding: '32px 0' }}>
                Aucun compte trouvé
              </p>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nom</th>
                      <th>Email</th>
                      <th>Type</th>
                      <th>Statut</th>
                      <th>Pays</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map((acc) => (
                      <tr key={acc.id}>
                        <td style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px' }}>#{acc.id}</td>
                        <td style={{ color: 'rgba(255,255,255,0.78)', fontWeight: 500 }}>{acc.name}</td>
                        <td className={styles.refCell}>{acc.email}</td>
                        <td>
                          <span className={`${styles.status} ${acc.account_type === 'business' ? styles.processing : styles.pending}`}>
                            {acc.account_type}
                          </span>
                        </td>
                        <td>
                          <span className={`${styles.status} ${acc.status === 'active' ? styles.approved : styles.rejected}`}>
                            {acc.status}
                          </span>
                        </td>
                        <td style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{acc.country_code || '—'}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              className={styles.actionBtn}
                              onClick={() => { setAccountId(String(acc.id)); handleRetrieve(String(acc.id)); setTab('retrieve'); }}
                            >Voir</button>
                            <button
                              className={styles.actionBtnBlue}
                              onClick={() => { setAccountId(String(acc.id)); setTab('update'); }}
                            >Modifier</button>
                            <button
                              className={styles.actionBtnGreen}
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
        <div className={styles.panel}>
          <div className={styles.panelHeader}><h3 className={styles.panelTitle}>Récupérer un compte — Account.retrieve()</h3></div>
          <div className={styles.panelBody}>
            <div className={styles.form}>
              <IdField />
              <Button fullWidth onClick={() => handleRetrieve()} loading={loading} variant="secondary">Récupérer</Button>
            </div>
            <ResponseViewer data={response} title="Réponse Account.retrieve()" />
          </div>
        </div>
      )}

      {/* ======================== CREATE ======================== */}
      {tab === 'create' && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}><h3 className={styles.panelTitle}>Créer un compte — Account.create()</h3></div>
          <div className={styles.panelBody}>
            <form onSubmit={handleCreate} className={styles.form}>
              <div className={styles.row}>
                <FormInput label="Nom" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Mon Entreprise" required />
                <FormInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contact@entreprise.com" required />
              </div>
              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Type de compte</label>
                  <select value={accountType} onChange={(e) => setAccountType(e.target.value)} className={styles.select}>
                    {ACCOUNT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Type d'activité</label>
                  <select value={businessType} onChange={(e) => setBusinessType(e.target.value)} className={styles.select}>
                    {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className={styles.row}>
                <FormInput label="Nom commercial" type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Mon Entreprise SA" />
                <FormInput label="Site web" type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://monsite.com" />
              </div>
              <FormInput label="Description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brève description de l'activité" />
              <div className={styles.row}>
                <FormInput label="Préfixe tél." type="text" value={phonePrefix} onChange={(e) => setPhonePrefix(e.target.value)} placeholder="+229" />
                <FormInput label="Numéro tél." type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="67462549" />
              </div>
              <div className={styles.row}>
                <FormInput label="Code pays" type="text" value={countryCode} onChange={(e) => setCountryCode(e.target.value)} placeholder="BJ" />
                <FormInput label="Fuseau horaire" type="text" value={timezone} onChange={(e) => setTimezone(e.target.value)} placeholder="Africa/Porto-Novo" />
              </div>
              <Button type="submit" fullWidth loading={loading} variant="success">Créer le compte</Button>
            </form>
            <ResponseViewer data={response} title="Réponse Account.create()" />
          </div>
        </div>
      )}

      {/* ======================== UPDATE ======================== */}
      {tab === 'update' && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}><h3 className={styles.panelTitle}>Modifier un compte — Account.update()</h3></div>
          <div className={styles.panelBody}>
            <form onSubmit={handleUpdate} className={styles.form}>
              <IdField />
              <div className={styles.dividerLine} />
              <div className={styles.row}>
                <FormInput label="Nouveau nom" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nouveau nom" />
                <FormInput label="Nouvel email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="newemail@example.com" />
              </div>
              <div className={styles.row}>
                <FormInput label="Nom commercial" type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Nouveau nom commercial" />
                <FormInput label="Site web" type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://newsite.com" />
              </div>
              <FormInput label="Description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Nouvelle description" />
              <div className={styles.row}>
                <FormInput label="Numéro tél." type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="67462549" />
                <FormInput label="Fuseau horaire" type="text" value={timezone} onChange={(e) => setTimezone(e.target.value)} placeholder="Africa/Porto-Novo" />
              </div>
              <div className={styles.infoBox}>
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
        <div className={styles.panel}>
          <div className={styles.panelHeader}><h3 className={styles.panelTitle}>Inviter un utilisateur — account.invite()</h3></div>
          <div className={styles.panelBody}>
            <form onSubmit={handleInvite} className={styles.form}>
              <IdField />
              <div className={styles.dividerLine} />
              <FormInput
                label="Email à inviter"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="collaborateur@example.com"
                required
              />
              <div className={styles.infoBox}>
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
