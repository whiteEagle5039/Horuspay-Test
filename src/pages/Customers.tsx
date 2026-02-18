import { useState, useEffect } from 'react';
import { Button, FormInput, Alert } from '../components';
import { ResponseViewer } from '../components/ResponseViewer';
import { IconUsers, IconRefresh } from '../components/Icons';
import * as CustomerService from '../services/customerService';
import type { Customer, CustomerData } from '../types';
import styles from './Customers.module.css';

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
      setCustomers(res.data);
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
    setResponse(res.data);
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
      onChange={(e) => setCustomerId(e.target.value)}
      placeholder="123"
      required
    />
  );

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Clients</h1>
          <p className={styles.pageMeta}>
            {customers.length > 0
              ? `${customers.length} client${customers.length > 1 ? 's' : ''}`
              : 'Gérez vos clients'}
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

      {tab === 'list' && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>Tous les clients</h3>
            <Button onClick={loadCustomers} loading={loading} variant="secondary" size="small">
              <IconRefresh size={14} /> Rafraîchir
            </Button>
          </div>
          <div className={styles.panelBody}>
            {customers.length === 0 ? (
              <div className={styles.empty}>
                <div className={styles.emptyIcon}><IconUsers size={40} /></div>
                <p className={styles.emptyText}>Aucun client trouvé</p>
              </div>
            ) : (
              <div className={styles.grid}>
                {customers.map((c) => (
                  <div key={c.id} className={styles.customerCard}>
                    <div className={styles.customerCardHead}>
                      <div className={styles.customerAvatar}>
                        {getInitials(c.firstname, c.lastname)}
                      </div>
                      <div>
                        <p className={styles.customerName}>{c.firstname} {c.lastname}</p>
                        <p className={styles.customerId}>#{c.id}</p>
                      </div>
                    </div>
                    <div className={styles.customerCardBody}>
                      <div className={styles.customerDetail}>
                        <span className={styles.detailKey}>Email</span>
                        <span className={styles.detailVal}>{c.email}</span>
                      </div>
                      <div className={styles.customerDetail}>
                        <span className={styles.detailKey}>Pays</span>
                        <span className={styles.detailVal}>{c.country_code}</span>
                      </div>
                      <div className={styles.customerDetail}>
                        <span className={styles.detailKey}>Créé</span>
                        <span className={styles.detailVal}>
                          {c.created_at ? new Date(c.created_at).toLocaleDateString('fr-FR') : '—'}
                        </span>
                      </div>
                    </div>
                    <div className={styles.customerCardFoot}>
                      <button className={styles.actionBtn} onClick={() => { setCustomerId(String(c.id)); handleRetrieve(String(c.id)); setTab('retrieve'); }}>Voir</button>
                      <button className={styles.actionBtn} onClick={() => { setCustomerId(String(c.id)); setTab('update'); }}>Modifier</button>
                      <button className={styles.actionBtnRed} onClick={() => handleDelete(String(c.id))}>Supprimer</button>
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
        <div className={styles.panel}>
          <div className={styles.panelHeader}><h3 className={styles.panelTitle}>Créer un client</h3></div>
          <div className={styles.panelBody}>
            <form onSubmit={handleCreate} className={styles.form}>
              <div className={styles.row}>
                <FormInput label="Prénom" type="text" value={firstname} onChange={(e) => setFirstname(e.target.value)} placeholder="Jean" required />
                <FormInput label="Nom" type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} placeholder="Dupont" required />
              </div>
              <FormInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jean@example.com" required />
              <div className={styles.formGroup}>
                <label className={styles.label}>Code Pays</label>
                <select value={countryCode} onChange={(e) => handleCountryChange(e.target.value)} className={styles.select}>
                  {COUNTRIES.map(c => (
                    <option key={c.code} value={c.code}>{c.label} ({c.code})</option>
                  ))}
                </select>
              </div>
              <div className={styles.row}>
                <FormInput label="Préfixe" type="text" value={phonePrefix} onChange={(e) => setPhonePrefix(e.target.value)} placeholder="+229" />
                <FormInput label="Numéro" type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="67462549" required />
              </div>
              <Button type="submit" fullWidth loading={loading} variant="success">Créer le client</Button>
            </form>
            <ResponseViewer data={response} title="Réponse Customer.create()" />
          </div>
        </div>
      )}

      {tab === 'retrieve' && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}><h3 className={styles.panelTitle}>Récupérer un client</h3></div>
          <div className={styles.panelBody}>
            <div className={styles.form}>
              <IdField />
              <Button fullWidth onClick={() => handleRetrieve()} loading={loading} variant="secondary">Récupérer</Button>
            </div>
            <ResponseViewer data={response} title="Réponse Customer.retrieve()" />
          </div>
        </div>
      )}

      {tab === 'update' && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}><h3 className={styles.panelTitle}>Modifier un client</h3></div>
          <div className={styles.panelBody}>
            <form onSubmit={handleUpdate} className={styles.form}>
              <IdField />
              <div className={styles.dividerLine} />
              <div className={styles.row}>
                <FormInput label="Nouveau prénom" type="text" value={updFirstname} onChange={(e) => setUpdFirstname(e.target.value)} placeholder="Jean" />
                <FormInput label="Nouveau nom" type="text" value={updLastname} onChange={(e) => setUpdLastname(e.target.value)} placeholder="Dupont" />
              </div>
              <FormInput label="Nouvel email" type="email" value={updEmail} onChange={(e) => setUpdEmail(e.target.value)} placeholder="newemail@example.com" />
              <Button type="submit" fullWidth loading={loading}>Mettre à jour</Button>
            </form>
            <ResponseViewer data={response} title="Réponse Customer.update()" />
          </div>
        </div>
      )}

      {tab === 'delete' && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}><h3 className={styles.panelTitle}>Supprimer un client</h3></div>
          <div className={styles.panelBody}>
            <div className={styles.form}>
              <IdField />
              <div className={styles.warningBox}>
                ⚠️ Suppression permanente. Appelle <code>customer.delete()</code>.
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
