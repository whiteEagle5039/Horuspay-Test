import { useState, useEffect } from 'react';
import { Button, FormInput, Alert } from '../components';
import { ResponseViewer } from '../components/ResponseViewer';
import * as WebhookService from '../services/webhookService';
import * as ApiKeyService from '../services/apiKeyService';
import type { Webhook, ApiKey } from '../types';

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
    setResponse(res.raw ?? res.data);
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
    <div className="space-y-6">
      <div className="mb-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">Configuration</div>
        <h1 className="text-2xl font-bold text-white">Webhooks & API Keys</h1>
        <p className="text-sm text-slate-400 mt-1">Gestion des webhooks et des clés d'API</p>
      </div>

      {msg && <Alert type={msg.type} message={msg.text} onClose={() => setMsg(null)} />}

      <div className="flex gap-1 bg-slate-800/50 p-1 rounded-lg border border-slate-700 mb-6 overflow-x-auto">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${tab === id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
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
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">Webhooks enregistrés</h3>
            <Button onClick={loadWebhooks} loading={loading} variant="secondary" size="sm">Rafraîchir</Button>
          </div>
          <div className="p-6">
            {webhooks.length === 0 ? (
              <p className="text-slate-500 text-sm py-8 text-center">Aucun webhook configuré</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-700">
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">URL</th>
                      <th className="px-4 py-3">Créé le</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {webhooks.map((w) => (
                      <tr key={w.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                        <td className="px-4 py-3 text-slate-500 text-xs">#{w.id}</td>
                        <td className="px-4 py-3 text-slate-300 font-mono text-xs">{w.url}</td>
                        <td className="px-4 py-3 text-slate-500 text-xs">
                          {w.created_at ? new Date(w.created_at).toLocaleDateString('fr-FR') : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            className="text-xs px-2.5 py-1 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20"
                            onClick={() => { setWebhookId(String(w.id)); handleDeleteWebhook(); }}
                          >
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
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">Créer un webhook — Webhook.create()</h3>
          </div>
          <div className="p-6">
            <form onSubmit={handleCreateWebhook} className="space-y-4">
              <FormInput label="URL du webhook" type="url" value={webhookUrl} onChange={(e: any) => setWebhookUrl(e.target.value)} placeholder="https://yoursite.com/webhook" required />
              <div className="text-xs text-slate-500 bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
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
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">Supprimer un webhook</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <FormInput label="ID du webhook" type="number" value={webhookId} onChange={(e: any) => setWebhookId(e.target.value)} placeholder="123" required />
              <div className="text-xs text-amber-400 bg-amber-500/10 rounded-lg p-3 border border-amber-500/20">
                Le webhook sera supprimé et ne recevra plus d'événements.
              </div>
              <Button fullWidth onClick={handleDeleteWebhook} loading={loading} variant="danger">Supprimer</Button>
            </div>
            <ResponseViewer data={response} title="Réponse webhook.delete()" />
          </div>
        </div>
      )}

      {/* ======================== API KEYS ======================== */}
      {tab === 'apikeys' && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">Clés API — ApiKey.all()</h3>
            <Button onClick={loadApiKeys} loading={loading} variant="secondary" size="sm">Rafraîchir</Button>
          </div>
          <div className="p-6">
            {apiKeys.length === 0 ? (
              <p className="text-slate-500 text-sm py-8 text-center">Aucune clé API trouvée</p>
            ) : (
              <div className="flex flex-col gap-3 mb-4">
                {apiKeys.map((k) => (
                  <div key={k.id} className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2 items-center">
                        <span className="text-[10px] uppercase tracking-wider text-slate-500">Clé publique</span>
                        <code className="font-mono text-xs text-indigo-400">{k.public_key}</code>
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className="text-[10px] uppercase tracking-wider text-slate-500">Clé privée</span>
                        <code className="font-mono text-xs text-red-300">{'•'.repeat(20)}</code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-3">
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
