import { useState, useEffect } from 'react';
import { Button, FormInput, Alert, Card } from '../components';
import * as CustomerService from '../services/customerService';
import type { Customer, CustomerData } from '../types';
import styles from './Customers.module.css';

type FormMode = 'list' | 'create';

export const Customers: React.FC = () => {
  const [mode, setMode] = useState<FormMode>('list');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('BJ');
  const [phonePrefix, setPhonePrefix] = useState('+229');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    const result = await CustomerService.listCustomers();
    if (result.success && result.data) {
      setCustomers(result.data);
    } else {
      setMessage({ type: 'error', text: `Erreur: ${result.error}` });
    }
    setLoading(false);
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data: CustomerData = {
        firstname,
        lastname,
        email,
        country_code: countryCode,
        phone_prefix: phonePrefix,
        phone_number: phoneNumber,
      };

      const result = await CustomerService.createCustomer(data);
      if (result.success) {
        setMessage({ type: 'success', text: '✅ Client créé avec succès!' });
        setFirstname('');
        setLastname('');
        setEmail('');
        setPhoneNumber('');
        loadCustomers();
      } else {
        setMessage({ type: 'error', text: `Erreur: ${result.error}` });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: `Erreur: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce client?')) return;

    setLoading(true);
    const result = await CustomerService.deleteCustomer(id);
    if (result.success) {
      setMessage({ type: 'success', text: '✅ Client supprimé!' });
      loadCustomers();
    } else {
      setMessage({ type: 'error', text: `Erreur: ${result.error}` });
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <h1>👥 Gestion des Clients</h1>

      {message && (
        <Alert
          type={message.type}
          message={message.text}
          onClose={() => setMessage(null)}
        />
      )}

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${mode === 'list' ? styles.active : ''}`}
          onClick={() => setMode('list')}
        >
          Lister
        </button>
        <button
          className={`${styles.tab} ${mode === 'create' ? styles.active : ''}`}
          onClick={() => setMode('create')}
        >
          Créer
        </button>
      </div>

      {mode === 'list' && (
        <Card title="📋 Tous les clients">
          <Button
            onClick={loadCustomers}
            loading={loading}
            variant="secondary"
            fullWidth
          >
            Rafraîchir
          </Button>

          {customers.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666' }}>
              Aucun client trouvé
            </p>
          ) : (
            <div className={styles.grid}>
              {customers.map((customer) => (
                <Card
                  key={customer.id}
                  title={`${customer.firstname} ${customer.lastname}`}
                  actions={
                    <Button
                      size="small"
                      variant="danger"
                      onClick={() => handleDeleteCustomer(customer.id)}
                      loading={loading}
                    >
                      Supprimer
                    </Button>
                  }
                >
                  <div className={styles.customerDetails}>
                    <p>
                      <strong>ID:</strong> {customer.id}
                    </p>
                    <p>
                      <strong>Email:</strong> {customer.email}
                    </p>
                    <p>
                      <strong>Pays:</strong> {customer.country_code}
                    </p>
                    <p>
                      <strong>Créé:</strong>{' '}
                      {new Date(customer.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      )}

      {mode === 'create' && (
        <Card title="➕ Créer un nouveau client">
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
                label="Préfixe Téléphone"
                type="text"
                value={phonePrefix}
                onChange={(e) => setPhonePrefix(e.target.value)}
                placeholder="+229"
              />
              <FormInput
                label="Numéro Téléphone"
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="67462549"
                required
              />
            </div>

            <Button
              type="submit"
              fullWidth
              loading={loading}
              variant="success"
            >
              Créer le Client
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
};
