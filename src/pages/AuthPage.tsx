import { useState } from 'react';
import { Button, FormInput, Alert } from '../components';
import { ResponseViewer } from '../components/ResponseViewer';
import * as AuthService from '../services/authService';

type Tab = 'login' | 'register' | 'profile' | 'password' | 'reset';

const TABS: { id: Tab; label: string }[] = [
  { id: 'login',    label: 'Connexion'      },
  { id: 'register', label: 'Inscription'    },
  { id: 'profile',  label: 'Profil'         },
  { id: 'password', label: 'Mot de passe'   },
  { id: 'reset',    label: 'Réinitialiser'  },
];

type Msg = { type: 'success' | 'error'; text: string };

export const AuthPage: React.FC = () => {
  const [tab, setTab]           = useState<Tab>('login');
  const [loading, setLoading]   = useState(false);
  const [msg, setMsg]           = useState<Msg | null>(null);
  const [response, setResponse] = useState<unknown>(null);

  // Login
  const [loginEmail, setLoginEmail]       = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register
  const [regEmail, setRegEmail]                   = useState('');
  const [regPassword, setRegPassword]             = useState('');
  const [regConfirm, setRegConfirm]               = useState('');
  const [regFullname, setRegFullname]             = useState('');

  // Profile update
  const [profEmail, setProfEmail]   = useState('');
  const [profName, setProfName]     = useState('');
  const [profLocale, setProfLocale] = useState('fr');

  // Password change
  const [pwCurrent, setPwCurrent]   = useState('');
  const [pwNew, setPwNew]           = useState('');
  const [pwConfirm, setPwConfirm]   = useState('');

  // Reset password
  const [resetEmail, setResetEmail]       = useState('');
  const [resetToken, setResetToken]       = useState('');
  const [resetPw, setResetPw]             = useState('');
  const [resetPwConf, setResetPwConf]     = useState('');

  const notify = (type: Msg['type'], text: string) => setMsg({ type, text });

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); setResponse(null);
    const res = await AuthService.login({ email: loginEmail, password: loginPassword });
    if (res.success) {
      notify('success', 'Connexion réussie ! Token sauvegardé.');
    } else {
      notify('error', res.error || 'Erreur de connexion');
    }
    setResponse(res.raw ?? res.data);
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); setResponse(null);
    const res = await AuthService.register({ email: regEmail, password: regPassword, password_confirmation: regConfirm, fullname: regFullname });
    if (res.success) {
      notify('success', 'Inscription réussie !');
    } else {
      notify('error', res.error || 'Erreur inscription');
    }
    setResponse(res.raw ?? res.data);
    setLoading(false);
  };

  const handleGetProfile = async () => {
    setLoading(true); setResponse(null);
    const res = await AuthService.getProfile();
    if (res.success) {
      notify('success', 'Profil récupéré');
    } else {
      notify('error', res.error || 'Erreur profil');
    }
    setResponse(res.raw ?? res.data);
    setLoading(false);
  };

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); setResponse(null);
    const data: { email?: string; name?: string; locale?: string } = {};
    if (profEmail)  data.email  = profEmail;
    if (profName)   data.name   = profName;
    if (profLocale) data.locale = profLocale;
    const res = await AuthService.updateProfile(data);
    if (res.success) {
      notify('success', 'Profil mis à jour');
    } else {
      notify('error', res.error || 'Erreur mise à jour');
    }
    setResponse(res.raw ?? res.data);
    setLoading(false);
  };

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pwNew !== pwConfirm) return notify('error', 'Les mots de passe ne correspondent pas');
    setLoading(true); setResponse(null);
    const res = await AuthService.changePassword({ password: pwNew, password_confirmation: pwConfirm });
    if (res.success) {
      notify('success', 'Mot de passe modifié');
    } else {
      notify('error', res.error || 'Erreur changement mdp');
    }
    setResponse(res.raw ?? res.data);
    setLoading(false);
  };

  const handleRequestReset = async () => {
    if (!resetEmail) return notify('error', 'Entrez votre email');
    setLoading(true); setResponse(null);
    const res = await AuthService.requestPasswordReset(resetEmail);
    if (res.success) {
      notify('success', 'Email de réinitialisation envoyé');
    } else {
      notify('error', res.error || 'Erreur demande reset');
    }
    setResponse(res.raw ?? res.data);
    setLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!resetToken) return notify('error', 'Entrez le token de réinitialisation');
    setLoading(true); setResponse(null);
    const res = await AuthService.resetPassword(resetToken, { password: resetPw, password_confirmation: resetPwConf });
    if (res.success) {
      notify('success', 'Mot de passe réinitialisé');
    } else {
      notify('error', res.error || 'Erreur reset mdp');
    }
    setResponse(res.raw ?? res.data);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">Authentication</div>
        <h1 className="text-2xl font-bold text-white">Auth SDK</h1>
        <p className="text-sm text-slate-400 mt-1">Testez les méthodes d'authentification HorusPay</p>
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

      {/* ======================== LOGIN ======================== */}
      {tab === 'login' && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-base font-semibold text-white mb-4">Connexion — Auth.login()</h3>
          <form onSubmit={handleLogin} className="space-y-4">
            <FormInput label="Email" type="email" value={loginEmail} onChange={(e: any) => setLoginEmail(e.target.value)} placeholder="user@example.com" required />
            <FormInput label="Mot de passe" type="password" value={loginPassword} onChange={(e: any) => setLoginPassword(e.target.value)} placeholder="••••••••" required />
            <Button type="submit" fullWidth loading={loading}>Se connecter</Button>
          </form>
          <ResponseViewer data={response} title="Réponse Auth.login()" />
        </div>
      )}

      {/* ======================== REGISTER ======================== */}
      {tab === 'register' && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-base font-semibold text-white mb-4">Inscription — Auth.register()</h3>
          <form onSubmit={handleRegister} className="space-y-4">
            <FormInput label="Nom complet" type="text" value={regFullname} onChange={(e: any) => setRegFullname(e.target.value)} placeholder="Jean Dupont" required />
            <FormInput label="Email" type="email" value={regEmail} onChange={(e: any) => setRegEmail(e.target.value)} placeholder="user@example.com" required />
            <FormInput label="Mot de passe" type="password" value={regPassword} onChange={(e: any) => setRegPassword(e.target.value)} placeholder="••••••••" required />
            <FormInput label="Confirmer le mot de passe" type="password" value={regConfirm} onChange={(e: any) => setRegConfirm(e.target.value)} placeholder="••••••••" required />
            <Button type="submit" fullWidth loading={loading} variant="success">S'inscrire</Button>
          </form>
          <ResponseViewer data={response} title="Réponse Auth.register()" />
        </div>
      )}

      {/* ======================== PROFILE ======================== */}
      {tab === 'profile' && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-base font-semibold text-white mb-4">Profil — Auth.getProfile() / updateProfile()</h3>
          <div className="space-y-4">
            <Button fullWidth onClick={handleGetProfile} loading={loading} variant="secondary">Récupérer le profil</Button>
          </div>
          <div className="border-t border-slate-700 my-4" />
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <FormInput label="Nouvel email" type="email" value={profEmail} onChange={(e: any) => setProfEmail(e.target.value)} placeholder="newemail@example.com" />
            <FormInput label="Nouveau nom" type="text" value={profName} onChange={(e: any) => setProfName(e.target.value)} placeholder="Jean Dupont" />
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-400">Locale</label>
              <select value={profLocale} onChange={(e: any) => setProfLocale(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
            </div>
            <Button type="submit" fullWidth loading={loading}>Mettre à jour le profil</Button>
          </form>
          <ResponseViewer data={response} title="Réponse Auth.getProfile() / updateProfile()" />
        </div>
      )}

      {/* ======================== PASSWORD ======================== */}
      {tab === 'password' && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-base font-semibold text-white mb-4">Changer le mot de passe — Auth.changePassword()</h3>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <FormInput label="Mot de passe actuel" type="password" value={pwCurrent} onChange={(e: any) => setPwCurrent(e.target.value)} placeholder="••••••••" required />
            <FormInput label="Nouveau mot de passe" type="password" value={pwNew} onChange={(e: any) => setPwNew(e.target.value)} placeholder="••••••••" required />
            <FormInput label="Confirmer" type="password" value={pwConfirm} onChange={(e: any) => setPwConfirm(e.target.value)} placeholder="••••••••" required />
            <Button type="submit" fullWidth loading={loading}>Changer le mot de passe</Button>
          </form>
          <ResponseViewer data={response} title="Réponse Auth.changePassword()" />
        </div>
      )}

      {/* ======================== RESET ======================== */}
      {tab === 'reset' && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-base font-semibold text-white mb-4">Réinitialisation — Auth.requestPasswordReset()</h3>
          <div className="space-y-4">
            <FormInput label="Email" type="email" value={resetEmail} onChange={(e: any) => setResetEmail(e.target.value)} placeholder="user@example.com" />
            <Button fullWidth onClick={handleRequestReset} loading={loading} variant="secondary">Envoyer l'email de reset</Button>
          </div>
          <div className="border-t border-slate-700 my-4" />
          <h3 className="text-base font-semibold text-white mb-4">Confirmer — Auth.resetPassword()</h3>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <FormInput label="Token de reset" type="text" value={resetToken} onChange={(e: any) => setResetToken(e.target.value)} placeholder="abc123..." required />
            <FormInput label="Nouveau mot de passe" type="password" value={resetPw} onChange={(e: any) => setResetPw(e.target.value)} placeholder="••••••••" required />
            <FormInput label="Confirmer" type="password" value={resetPwConf} onChange={(e: any) => setResetPwConf(e.target.value)} placeholder="••••••••" required />
            <Button type="submit" fullWidth loading={loading}>Réinitialiser</Button>
          </form>
          <ResponseViewer data={response} title="Réponse Auth.resetPassword()" />
        </div>
      )}
    </div>
  );
};
