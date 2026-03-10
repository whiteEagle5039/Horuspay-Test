import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, FormInput, Alert } from '../components';
import { getHorusPayConfig } from '../config/horuspay';
import { useConfig } from '../config/ConfigContext';
import type { HorusPayConfig } from '../types';

type Env = 'sandbox' | 'production' | 'development';

const ENV_OPTIONS: { value: Env; label: string; hint: string }[] = [
  { value: 'sandbox',     label: 'Sandbox',     hint: 'Test' },
  { value: 'production',  label: 'Production',  hint: 'Live' },
  { value: 'development', label: 'Dev',          hint: 'Local' },
];

export const Setup: React.FC = () => {
  const navigate = useNavigate();
  const { isConfigured: configured, setConfiguration } = useConfig();
  const [secretKey, setSecretKey]       = useState('');
  const [publicKey, setPublicKey]       = useState('');
  const [apiBase, setApiBase]           = useState('');
  const [environment, setEnvironment]   = useState<Env>('sandbox');
  const [accountId, setAccountId]       = useState('');
  const [apiVersion, setApiVersion]     = useState('v1');
  const [message, setMessage]           = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading]           = useState(false);

  useEffect(() => {
    const config = getHorusPayConfig();
    if (config.secretKey) {
      setSecretKey(config.secretKey);
      setPublicKey(config.publicKey);
      setApiBase(config.apiBase ?? '');
      setEnvironment(config.environment);
      setAccountId(String(config.accountId));
      setApiVersion(config.apiVersion ?? '');
    }
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!secretKey.trim() && !publicKey.trim()) {
      setMessage({ type: 'error', text: 'Au moins une clé API (secrète ou publique) est requise' });
      setLoading(false);
      return;
    }

    try {
      const config: HorusPayConfig = {
        secretKey: secretKey.trim(),
        publicKey: publicKey.trim(),
        environment,
        ...(accountId.trim() && { accountId: accountId.trim() }),
        ...(apiBase.trim() && { apiBase: apiBase.trim() }),
        ...(apiVersion.trim() && { apiVersion: apiVersion.trim() }),
      };
      setConfiguration(config);
      setMessage({ type: 'success', text: 'Configuration sauvegardée avec succès !' });
      setTimeout(() => navigate('/'), 1500);
    } catch (error: any) {
      setMessage({ type: 'error', text: `Erreur : ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Configuration</div>
        <h1 className="text-3xl font-bold text-white">Paramètres HorusPay</h1>
        <p className="text-slate-400 mt-2">Renseignez vos clés pour commencer à tester le SDK</p>
      </div>

      {/* Configured badge */}
      {configured && (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 text-xs font-semibold text-emerald-400 bg-emerald-500/10">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          SDK configuré et actif
        </div>
      )}

      {/* Main card */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">Clés & Environnement</h3>

        <form onSubmit={handleSave} className="space-y-4">
          {message && (
            <Alert type={message.type} message={message.text} onClose={() => setMessage(null)} />
          )}

          <FormInput
            label="Clé Secrète (Secret Key)"
            type="password"
            value={secretKey}
            onChange={(e: any) => setSecretKey(e.target.value)}
            placeholder="horus_pay_sec_..."
            required
          />

          <FormInput
            label="Clé Publique (Public Key) — optionnel"
            type="password"
            value={publicKey}
            onChange={(e: any) => setPublicKey(e.target.value)}
            placeholder="horus_pay_pub_..."
          />

          <FormInput
            label="URL de Base API (optionnel)"
            type="text"
            value={apiBase}
            onChange={(e: any) => setApiBase(e.target.value)}
            placeholder="https://api.horuspay.africa"
          />

          {/* Environment pill selector */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Environnement</label>
            <div className="flex gap-2">
              {ENV_OPTIONS.map(({ value, label, hint }) => {
                const isActive = environment === value;
                const activeColors =
                  value === 'sandbox'    ? 'border-blue-500/50 bg-blue-500/10 text-blue-400' :
                  value === 'production' ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' :
                                           'border-amber-500/50 bg-amber-500/10 text-amber-400';
                const dotColor =
                  value === 'sandbox'    ? 'bg-blue-400' :
                  value === 'production' ? 'bg-emerald-400' :
                                           'bg-amber-400';

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setEnvironment(value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                      isActive
                        ? activeColors
                        : 'border-slate-600 bg-slate-700/50 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isActive ? dotColor : 'bg-slate-500'}`} />
                    {label}
                    <span className="text-[10px] opacity-60">{hint}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-700 my-4" />

          <FormInput
            label="ID du Compte (optionnel — utile seulement avec auth JWT multi-comptes)"
            type="text"
            value={accountId}
            onChange={(e: any) => setAccountId(e.target.value)}
            placeholder="votre-account-id"
          />

          <FormInput
            label="Version API (optionnel)"
            type="text"
            value={apiVersion}
            onChange={(e: any) => setApiVersion(e.target.value)}
            placeholder="v1"
          />

          <div className="flex flex-col gap-3 pt-2">
            <Button type="submit" fullWidth loading={loading}>
              Sauvegarder la Configuration
            </Button>
            {configured && (
              <Button type="button" variant="secondary" fullWidth onClick={() => navigate('/')}>
                Retour au Dashboard
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Info box */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
        <h4 className="text-white font-semibold mb-3">Notes d'utilisation</h4>
        <ul className="space-y-2 text-sm text-slate-400 list-disc list-inside">
          <li>Les clés sont stockées localement dans votre navigateur</li>
          <li>Utilisez toujours des clés de test en environnement Sandbox</li>
          <li>Ne partagez jamais vos clés de Production</li>
          <li>
            Consultez la{' '}
            <a href="https://docs.horuspay.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
              documentation API
            </a>{' '}
            pour plus de détails
          </li>
        </ul>
      </div>

    </div>
  );
};
