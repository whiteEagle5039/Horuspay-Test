import { HorusPay } from 'horuspay';
import type { HorusPayConfig } from '../types';

// ---- Clés localStorage ----
const KEY_API    = 'horuspay_api_key';
const KEY_ENV    = 'horuspay_env';
const KEY_ACC    = 'horuspay_account_id';
const KEY_TOKEN  = 'horuspay_token';

// ---- Proxy Vercel pour contourner CORS ----
const PROXY_MAP: Record<string, string> = {
  sandbox:     '/api/sandbox',
  production:  '/api/prod',
  development: '/api/dev',
};

// ---- Etat interne ----
let _configured = false;

// ---- Initialisation depuis localStorage au chargement ----
const _stored = getHorusPayConfig();
if (_stored.apiKey && _stored.accountId) {
  _applyConfig(_stored);
}

function _applyConfig(config: HorusPayConfig): void {
  HorusPay.setApiKey(config.apiKey);
  HorusPay.setEnvironment(config.environment);
  // Proxy Vercel : redirige les appels via le même domaine pour éviter CORS
  const proxyBase = PROXY_MAP[config.environment];
  if (proxyBase) {
    HorusPay.setApiBase(proxyBase);
  }
  // accountId peut être string ou number
  const accId = typeof config.accountId === 'string'
    ? (isNaN(Number(config.accountId)) ? config.accountId : Number(config.accountId))
    : config.accountId;
  HorusPay.setAccountId(accId);
  _configured = true;
}

/** Configure le SDK HorusPay */
export function configureHorusPay(config: HorusPayConfig): boolean {
  try {
    _applyConfig(config);
    console.log('✅ HorusPay configured', config.environment);
    return true;
  } catch (e) {
    console.error('❌ HorusPay config failed', e);
    return false;
  }
}

/** Lit la config depuis localStorage */
export function getHorusPayConfig(): HorusPayConfig {
  return {
    apiKey:      localStorage.getItem(KEY_API)  || '',
    environment: (localStorage.getItem(KEY_ENV) || 'sandbox') as HorusPayConfig['environment'],
    accountId:   localStorage.getItem(KEY_ACC)  || '',
  };
}

/** Sauvegarde la config et initialise le SDK */
export function saveHorusPayConfig(config: HorusPayConfig): void {
  localStorage.setItem(KEY_API, config.apiKey);
  localStorage.setItem(KEY_ENV, config.environment);
  localStorage.setItem(KEY_ACC, String(config.accountId));
  configureHorusPay(config);
}

/** Sauvegarde un token JWT (pour les flows Auth) */
export function saveToken(token: string): void {
  localStorage.setItem(KEY_TOKEN, token);
  HorusPay.setToken(token);
}

/** Récupère le token JWT */
export function getToken(): string {
  return localStorage.getItem(KEY_TOKEN) || '';
}

/** Efface la config complète */
export function clearHorusPayConfig(): void {
  localStorage.removeItem(KEY_API);
  localStorage.removeItem(KEY_ENV);
  localStorage.removeItem(KEY_ACC);
  localStorage.removeItem(KEY_TOKEN);
  _configured = false;
}

/** Vérifie si le SDK est configuré */
export function isHorusPayConfigured(): boolean {
  // Vérifie le flag interne OU les données localStorage
  if (_configured) return true;
  const cfg = getHorusPayConfig();
  if (cfg.apiKey && cfg.accountId) {
    _applyConfig(cfg);
    return true;
  }
  return false;
}

export { HorusPay };
