import { useState, useEffect } from 'react';
import { Button, FormInput, Alert, Card } from '../components';
import * as TransactionService from '../services/transactionService';
import type { Transaction, TransactionData } from '../types';
import styles from './Transactions.module.css';

type FormMode = 'list' | 'create' | 'retrieve' | 'pay' | 'status' | 'refund';

export const Transactions: React.FC = () => {
  const [mode, setMode] = useState<FormMode>('list');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('XOF');
  const [callbackUrl, setCallbackUrl] = useState('https://example.com/callback');
  const [customerId, setCustomerId] = useState('');
  const [retrieveId, setRetrieveId] = useState('');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    const result = await TransactionService.listTransactions();
    if (result.success && result.data) {
      setTransactions(result.data);
    } else {
      setMessage({ type: 'error', text: `Erreur: ${result.error}` });
    }
    setLoading(false);
  };

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data: TransactionData = {
        amount: parseInt(amount),
        currency,
        callback_url: callbackUrl,
      };

      if (customerId) {
        data.customer_id = parseInt(customerId);
      }

      const result = await TransactionService.createTransaction(data);
      if (result.success) {
        setMessage({ type: 'success', text: '✅ Transaction créée avec succès!' });
        setAmount('');
        setCurrency('XOF');
        setCustomerId('');
        loadTransactions();
      } else {
        setMessage({ type: 'error', text: `Erreur: ${result.error}` });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: `Erreur: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleRetrieveTransaction = async (id: number) => {
    setLoading(true);
    const result = await TransactionService.retrieveTransaction(id);
    if (result.success) {
      setMessage({ type: 'success', text: '✅ Transaction récupérée' });
      setRetrieveId(id.toString());
    } else {
      setMessage({ type: 'error', text: `Erreur: ${result.error}` });
    }
    setLoading(false);
  };

  const handlePayTransaction = async (id: number) => {
    setLoading(true);
    const result = await TransactionService.payTransaction(id);
    if (result.success) {
      setMessage({ type: 'success', text: '✅ Paiement déclenché!' });
      loadTransactions();
    } else {
      setMessage({ type: 'error', text: `Erreur: ${result.error}` });
    }
    setLoading(false);
  };

  const handleGetStatus = async (id: number) => {
    setLoading(true);
    const result = await TransactionService.getTransactionStatus(id);
    if (result.success) {
      const { status, wasPaid, wasRefunded } = result.data;
      setMessage({
        type: 'success',
        text: `Statut: ${status} | Payée: ${wasPaid} | Remboursée: ${wasRefunded}`,
      });
    } else {
      setMessage({ type: 'error', text: `Erreur: ${result.error}` });
    }
    setLoading(false);
  };

  const handleRefund = async (id: number) => {
    setLoading(true);
    const result = await TransactionService.refundTransaction(id);
    if (result.success) {
      setMessage({ type: 'success', text: '✅ Remboursement effectué!' });
      loadTransactions();
    } else {
      setMessage({ type: 'error', text: `Erreur: ${result.error}` });
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <h1>💳 Gestion des Transactions</h1>

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
        <Card title="📋 Toutes les transactions">
          <Button
            onClick={loadTransactions}
            loading={loading}
            variant="secondary"
            fullWidth
          >
            Rafraîchir
          </Button>

          {transactions.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666' }}>
              Aucune transaction trouvée
            </p>
          ) : (
            <div className={styles.table}>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Référence</th>
                    <th>Montant</th>
                    <th>Devise</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td>{tx.id}</td>
                      <td>{tx.reference}</td>
                      <td>{tx.amount}</td>
                      <td>{tx.currency}</td>
                      <td>
                        <span className={`${styles.status} ${styles[tx.status]}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <Button
                            size="small"
                            variant="secondary"
                            onClick={() => handleRetrieveTransaction(tx.id)}
                            loading={loading}
                          >
                            Voir
                          </Button>
                          <Button
                            size="small"
                            variant="success"
                            onClick={() => handlePayTransaction(tx.id)}
                            loading={loading}
                          >
                            Payer
                          </Button>
                          <Button
                            size="small"
                            onClick={() => handleGetStatus(tx.id)}
                            loading={loading}
                          >
                            Statut
                          </Button>
                          <Button
                            size="small"
                            variant="danger"
                            onClick={() => handleRefund(tx.id)}
                            loading={loading}
                          >
                            Rembourser
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {mode === 'create' && (
        <Card title="➕ Créer une nouvelle transaction">
          <form onSubmit={handleCreateTransaction} className={styles.form}>
            <FormInput
              label="Montant"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="5000"
              required
            />

            <div className={styles.formGroup}>
              <label>Devise</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className={styles.select}
              >
                <option value="XOF">XOF (Franc CFA)</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>

            <FormInput
              label="URL de callback"
              type="url"
              value={callbackUrl}
              onChange={(e) => setCallbackUrl(e.target.value)}
              placeholder="https://example.com/callback"
              required
            />

            <FormInput
              label="ID Client (optionnel)"
              type="number"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              placeholder="Laisser vide pour créer un nouveau client"
            />

            <Button
              type="submit"
              fullWidth
              loading={loading}
              variant="success"
            >
              Créer la Transaction
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
};
