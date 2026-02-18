import { useState } from 'react';
import { Button, FormInput, Alert } from '../components';
import { ResponseViewer } from '../components/ResponseViewer';
import * as AuthService from '../services/authService';
import styles from './Setup.module.css';

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
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div className={styles.pageEyebrow}>Authentication</div>
        <h1 className={styles.pageTitle}>Auth SDK</h1>
        <p className={styles.pageSubtitle}>Testez les méthodes d'authentification HorusPay</p>
      </div>

      {msg && <Alert type={msg.type} message={msg.text} onClose={() => setMsg(null)} />}

      <div className={styles.tabsWrap}>
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            className={`${styles.tabBtn} ${tab === id ? styles.tabActive : ''}`}
            onClick={() => { setTab(id); setMsg(null); setResponse(null); }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ======================== LOGIN ======================== */}
      {tab === 'login' && (
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Connexion — Auth.login()</h3>
          <form onSubmit={handleLogin} className={styles.form}>
            <FormInput label="Email" type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="user@example.com" required />
            <FormInput label="Mot de passe" type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="••••••••" required />
            <Button type="submit" fullWidth loading={loading}>Se connecter</Button>
          </form>
          <ResponseViewer data={response} title="Réponse Auth.login()" />
        </div>
      )}

      {/* ======================== REGISTER ======================== */}
      {tab === 'register' && (
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Inscription — Auth.register()</h3>
          <form onSubmit={handleRegister} className={styles.form}>
            <FormInput label="Nom complet" type="text" value={regFullname} onChange={(e) => setRegFullname(e.target.value)} placeholder="Jean Dupont" required />
            <FormInput label="Email" type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="user@example.com" required />
            <FormInput label="Mot de passe" type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} placeholder="••••••••" required />
            <FormInput label="Confirmer le mot de passe" type="password" value={regConfirm} onChange={(e) => setRegConfirm(e.target.value)} placeholder="••••••••" required />
            <Button type="submit" fullWidth loading={loading} variant="success">S'inscrire</Button>
          </form>
          <ResponseViewer data={response} title="Réponse Auth.register()" />
        </div>
      )}

      {/* ======================== PROFILE ======================== */}
      {tab === 'profile' && (
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Profil — Auth.getProfile() / updateProfile()</h3>
          <div className={styles.form}>
            <Button fullWidth onClick={handleGetProfile} loading={loading} variant="secondary">Récupérer le profil</Button>
          </div>
          <div className={styles.formDivider} />
          <form onSubmit={handleUpdateProfile} className={styles.form}>
            <FormInput label="Nouvel email" type="email" value={profEmail} onChange={(e) => setProfEmail(e.target.value)} placeholder="newemail@example.com" />
            <FormInput label="Nouveau nom" type="text" value={profName} onChange={(e) => setProfName(e.target.value)} placeholder="Jean Dupont" />
            <div className={styles.formGroup}>
              <label className={styles.label}>Locale</label>
              <select value={profLocale} onChange={(e) => setProfLocale(e.target.value)} className={styles.select}>
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
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Changer le mot de passe — Auth.changePassword()</h3>
          <form onSubmit={handleChangePassword} className={styles.form}>
            <FormInput label="Mot de passe actuel" type="password" value={pwCurrent} onChange={(e) => setPwCurrent(e.target.value)} placeholder="••••••••" required />
            <FormInput label="Nouveau mot de passe" type="password" value={pwNew} onChange={(e) => setPwNew(e.target.value)} placeholder="••••••••" required />
            <FormInput label="Confirmer" type="password" value={pwConfirm} onChange={(e) => setPwConfirm(e.target.value)} placeholder="••••••••" required />
            <Button type="submit" fullWidth loading={loading}>Changer le mot de passe</Button>
          </form>
          <ResponseViewer data={response} title="Réponse Auth.changePassword()" />
        </div>
      )}

      {/* ======================== RESET ======================== */}
      {tab === 'reset' && (
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Réinitialisation — Auth.requestPasswordReset()</h3>
          <div className={styles.form}>
            <FormInput label="Email" type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} placeholder="user@example.com" />
            <Button fullWidth onClick={handleRequestReset} loading={loading} variant="secondary">Envoyer l'email de reset</Button>
          </div>
          <div className={styles.formDivider} />
          <h3 className={styles.cardTitle}>Confirmer — Auth.resetPassword()</h3>
          <form onSubmit={handleResetPassword} className={styles.form}>
            <FormInput label="Token de reset" type="text" value={resetToken} onChange={(e) => setResetToken(e.target.value)} placeholder="abc123..." required />
            <FormInput label="Nouveau mot de passe" type="password" value={resetPw} onChange={(e) => setResetPw(e.target.value)} placeholder="••••••••" required />
            <FormInput label="Confirmer" type="password" value={resetPwConf} onChange={(e) => setResetPwConf(e.target.value)} placeholder="••••••••" required />
            <Button type="submit" fullWidth loading={loading}>Réinitialiser</Button>
          </form>
          <ResponseViewer data={response} title="Réponse Auth.resetPassword()" />
        </div>
      )}
    </div>
  );
};
