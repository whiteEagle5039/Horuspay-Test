import { useState, useEffect } from 'react';
import { Button, FormInput, Alert } from '../components';
import { ResponseViewer } from '../components/ResponseViewer';
import * as WebhookService from '../services/webhookService';
import * as ApiKeyService from '../services/apiKeyService';
import type { Webhook, ApiKey } from '../types';
import styles from './Transactions.module.css';

type Tab = 'webhooks-list' | 'webhook-create' | 'webhook-delete' | 'apikeys';

const TABS: { id: Tab; label: string }[] = [
  { id: 'webhooks-list',   label: 'Webhooks'         },
  { id: 'webhook-create',  label: 'Ajouter Webhook'  },
  { id: 'webhook-delete',  label: 'Supprimer Webhook' },
  { id: 'apikeys',         label: 'Clés API'         },
];

type Msg = { type: 'success' | 'error'; text: string };

export const WebhooksPage: React.FC = () => {
  const [tab, setTab]           = useState<Tab>('webhooks-list');
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [apiKeys, setApiKeys]   = useState<ApiKey[]>([]);
  const [loading, setLoading]   = useState(false);
  const [msg, setMsg]           = useState<Msg | null>(null);
  const [response, setResponse] = useState<unknown>(null);

  const [webhookUrl, setWebhookUrl] = useState('https://example.com/webhook');
  const [webhookId, setWebhookId]   = useState('');

  const notify = (type: Msg['type'], text: string) => setMsg({ type, text });

  useEffect(() => { loadWebhooks(); }, []);

  const loadWebhooks = async () => {
    setLoading(true);
    const res = await WebhookService.listWebhooks();
    if (res.success && res.data) setWebhooks(res.data);
    setResponse(res.raw ?? res.data);
    setLoading(false);
  };

  const loadApiKeys = async () => {
    setLoading(true);
    const res = await ApiKeyService.listApiKeys();
    if (res.success && res.data) setApiKeys(res.data);
    setResponse(res.raw ?? res.data);
    setLoading(false);
  };

  const handleCreateWebhook = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); setResponse(null);
    const res = await WebhookService.createWebhook({ url: webhookUrl });
    if (res.success) {
      notify('success', 'Webhook créé !');
      setWebhookUrl('https://example.com/webhook');
      loadWebhooks();
    } else {
      notify('error', res.error || 'Erreur création webhook');
    }
    setResponse(res.raw ?? res.data);
    setLoading(false);
  };

  const handleDeleteWebhook = async () => {
    if (!webhookId) return notify('error', 'Entrez un ID de webhook');
    if (!confirm(`Supprimer le webhook #${webhookId} ?`)) return;
    setLoading(true); setResponse(null);
    const res = await WebhookService.deleteWebhook(webhookId);
    if (res.success) {
      notify('success', `Webhook #${webhookId} supprimé`);
      setWebhookId('');
      loadWebhooks();
    } else {
      notify('error', res.error || 'Erreur suppression');
    }
    setResponse(res.data);
    setLoading(false);
  };

  const handleRegenerateKeys = async () => {
    if (!confirm('Régénérer les clés API ? Les anciennes clés seront invalidées.')) return;
    setLoading(true); setResponse(null);
    const res = await ApiKeyService.regenerateApiKeys();
    if (res.success) {
      notify('success', 'Clés API régénérées !');
      loadApiKeys();
    } else {
      notify('error', res.error || 'Erreur régénération');
    }
    setResponse(res.raw ?? res.data);
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Webhooks & API Keys</h1>
          <p className={styles.pageMeta}>Gestion des webhooks et des clés d'API</p>
        </div>
      </div>

      {msg && <Alert type={msg.type} message={msg.text} onClose={() => setMsg(null)} />}

      <div className={styles.tabs}>
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            className={`${styles.tab} ${tab === id ? styles.active : ''}`}
            onClick={() => {
              setTab(id);
              setMsg(null); setResponse(null);
              if (id === 'apikeys') loadApiKeys();
              if (id === 'webhooks-list') loadWebhooks();
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ======================== WEBHOOKS LIST ======================== */}
      {tab === 'webhooks-list' && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>Webhooks enregistrés</h3>
            <Button onClick={loadWebhooks} loading={loading} variant="secondary" size="small">Rafraîchir</Button>
          </div>
          <div className={styles.panelBody}>
            {webhooks.length === 0 ? (
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px', padding: '32px 0' }}>Aucun webhook configuré</p>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>URL</th>
                      <th>Créé le</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {webhooks.map((w) => (
                      <tr key={w.id}>
                        <td style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px' }}>#{w.id}</td>
                        <td className={styles.refCell}>{w.url}</td>
                        <td style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                          {w.created_at ? new Date(w.created_at).toLocaleDateString('fr-FR') : '—'}
                        </td>
                        <td>
                          <button className={styles.actionBtnRed} onClick={() => { setWebhookId(String(w.id)); handleDeleteWebhook(); }}>
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <ResponseViewer data={response} title="Réponse Webhook.all()" />
          </div>
        </div>
      )}

      {/* ======================== WEBHOOK CREATE ======================== */}
      {tab === 'webhook-create' && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}><h3 className={styles.panelTitle}>Créer un webhook — Webhook.create()</h3></div>
          <div className={styles.panelBody}>
            <form onSubmit={handleCreateWebhook} className={styles.form}>
              <FormInput label="URL du webhook" type="url" value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} placeholder="https://yoursite.com/webhook" required />
              <div className={styles.infoBox}>
                L'URL recevra des événements POST signés avec le secret HorusPay.
              </div>
              <Button type="submit" fullWidth loading={loading} variant="success">Créer le webhook</Button>
            </form>
            <ResponseViewer data={response} title="Réponse Webhook.create()" />
          </div>
        </div>
      )}

      {/* ======================== WEBHOOK DELETE ======================== */}
      {tab === 'webhook-delete' && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}><h3 className={styles.panelTitle}>Supprimer un webhook</h3></div>
          <div className={styles.panelBody}>
            <div className={styles.form}>
              <FormInput label="ID du webhook" type="number" value={webhookId} onChange={(e) => setWebhookId(e.target.value)} placeholder="123" required />
              <div className={styles.warningBox}>
                ⚠️ Le webhook sera supprimé et ne recevra plus d'événements.
              </div>
              <Button fullWidth onClick={handleDeleteWebhook} loading={loading} variant="danger">Supprimer</Button>
            </div>
            <ResponseViewer data={response} title="Réponse webhook.delete()" />
          </div>
        </div>
      )}

      {/* ======================== API KEYS ======================== */}
      {tab === 'apikeys' && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>Clés API — ApiKey.all()</h3>
            <Button onClick={loadApiKeys} loading={loading} variant="secondary" size="small">Rafraîchir</Button>
          </div>
          <div className={styles.panelBody}>
            {apiKeys.length === 0 ? (
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px', padding: '24px 0' }}>Aucune clé API trouvée</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                {apiKeys.map((k) => (
                  <div key={k.id} style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    padding: '16px 20px',
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.28)' }}>Clé publique</span>
                        <code style={{ fontFamily: 'Fira Code, monospace', fontSize: '12px', color: '#93C5FD' }}>{k.public_key}</code>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.28)' }}>Clé privée</span>
                        <code style={{ fontFamily: 'Fira Code, monospace', fontSize: '12px', color: '#FDA4AF' }}>{'•'.repeat(20)}</code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button onClick={loadApiKeys} loading={loading} variant="secondary">Voir les clés</Button>
              <Button onClick={handleRegenerateKeys} loading={loading} variant="danger">Régénérer les clés</Button>
            </div>
            <ResponseViewer data={response} title="Réponse ApiKey.all() / regenerate()" />
          </div>
        </div>
      )}
    </div>
  );
};
