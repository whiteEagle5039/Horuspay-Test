import { useState, useEffect } from 'react';
import { Button, FormInput, Alert } from '../components';
import { IconUsers, IconRefresh } from '../components/Icons';
import * as CustomerService from '../services/customerService';
import type { Customer, CustomerData } from '../types';
import styles from './Customers.module.css';

type FormMode = 'list' | 'create';

/** Generate initials from first + last name */
const getInitials = (first: string, last: string) =>
  `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();

export const Customers: React.FC = () => {
  const [mode, setMode]         = useState<FormMode>('list');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading]   = useState(false);
  const [message, setMessage]   = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [firstname, setFirstname]   = useState('');
  const [lastname, setLastname]     = useState('');
  const [email, setEmail]           = useState('');
  const [countryCode, setCountryCode] = useState('BJ');
  const [phonePrefix, setPhonePrefix] = useState('+229');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => { loadCustomers(); }, []);

  const loadCustomers = async () => {
    setLoading(true);
    const result = await CustomerService.listCustomers();
    if (result.success && result.data) {
      setCustomers(result.data);
    } else {
      setMessage({ type: 'error', text: `Erreur : ${result.error}` });
    }
    setLoading(false);
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data: CustomerData = {
        firstname, lastname, email,
        country_code: countryCode,
        phone_prefix: phonePrefix,
        phone_number: phoneNumber,
      };
      const result = await CustomerService.createCustomer(data);
      if (result.success) {
        setMessage({ type: 'success', text: 'Client créé avec succès !' });
        setFirstname(''); setLastname(''); setEmail(''); setPhoneNumber('');
        loadCustomers();
      } else {
        setMessage({ type: 'error', text: `Erreur : ${result.error}` });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: `Erreur : ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) return;
    setLoading(true);
    const result = await CustomerService.deleteCustomer(id);
    if (result.success) {
      setMessage({ type: 'success', text: 'Client supprimé !' });
      loadCustomers();
    } else {
      setMessage({ type: 'error', text: `Erreur : ${result.error}` });
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>

      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Clients</h1>
          <p className={styles.pageMeta}>
            {customers.length > 0 ? `${customers.length} client${customers.length > 1 ? 's' : ''}` : 'Gérez vos clients'}
          </p>
        </div>
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
          Nouveau client
        </button>
      </div>

      {/* LIST MODE */}
      {mode === 'list' && (
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
                {customers.map((customer) => (
                  <div key={customer.id} className={styles.customerCard}>
                    <div className={styles.customerCardHead}>
                      <div className={styles.customerAvatar}>
                        {getInitials(customer.firstname, customer.lastname)}
                      </div>
                      <p className={styles.customerName}>
                        {customer.firstname} {customer.lastname}
                      </p>
                    </div>
                    <div className={styles.customerCardBody}>
                      <div className={styles.customerDetail}>
                        <span className={styles.detailKey}>ID</span>
                        <span className={styles.detailVal}>#{customer.id}</span>
                      </div>
                      <div className={styles.customerDetail}>
                        <span className={styles.detailKey}>Email</span>
                        <span className={styles.detailVal}>{customer.email}</span>
                      </div>
                      <div className={styles.customerDetail}>
                        <span className={styles.detailKey}>Pays</span>
                        <span className={styles.detailVal}>{customer.country_code}</span>
                      </div>
                      <div className={styles.customerDetail}>
                        <span className={styles.detailKey}>Créé</span>
                        <span className={styles.detailVal}>
                          {new Date(customer.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                    <div className={styles.customerCardFoot}>
                      <Button
                        size="small"
                        variant="danger"
                        onClick={() => handleDeleteCustomer(customer.id)}
                        loading={loading}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE MODE */}
      {mode === 'create' && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>Créer un client</h3>
          </div>
          <div className={styles.panelBody}>
            <form onSubmit={handleCreateCustomer} className={styles.form}>
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
                  <option value="BF">Burkina Faso (BF)</option>
                </select>
              </div>

              <div className={styles.formula}>
                <FormInput
                  label="Préfixe"
                  type="text"
                  value={phonePrefix}
                  onChange={(e) => setPhonePrefix(e.target.value)}
                  placeholder="+229"
                />
                <FormInput
                  label="Numéro de téléphone"
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="67462549"
                  required
                />
              </div>

              <Button type="submit" fullWidth loading={loading} variant="success">
                Créer le client
              </Button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};