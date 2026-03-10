import { HorusPay } from 'horuspay-node';
import type { HorusPayConfig } from '../types';

// ---- localStorage keys ----
const KEY_SECRET_KEY  = 'horuspay_secret_key';
const KEY_PUBLIC_KEY  = 'horuspay_public_key';
const KEY_API_BASE    = 'horuspay_api_base';
const KEY_ENV         = 'horuspay_env';
const KEY_ACCOUNT_ID  = 'horuspay_account_id';
const KEY_API_VERSION = 'horuspay_api_version';
const KEY_TOKEN       = 'horuspay_token';

// ---- Internal state ----
let _configured = false;

// ---- Auto-initialize from localStorage on load ----
const _stored = getHorusPayConfig();
if (_stored.secretKey || _stored.publicKey) {
  _applyConfig(_stored);
}

function _applyConfig(config: HorusPayConfig): void {
  HorusPay.initialize({
    secretKey: config.secretKey || undefined,
    publicKey: config.publicKey || undefined,
    apiBase: config.apiBase || undefined,
    environment: config.environment,
    accountId: typeof config.accountId === 'string'
      ? (isNaN(Number(config.accountId)) ? config.accountId : Number(config.accountId))
      : config.accountId,
    apiVersion: config.apiVersion || undefined,
  });
  _configured = true;
}

/** Configure the HorusPay SDK */
export function configureHorusPay(config: HorusPayConfig): boolean {
  try {
    _applyConfig(config);
    console.log('[HorusPay] Configured -', config.environment);
    return true;
  } catch (e) {
    console.error('[HorusPay] Configuration failed', e);
    return false;
  }
}

/** Save config to localStorage and initialize the SDK */
export function saveHorusPayConfig(config: HorusPayConfig): void {
  localStorage.setItem(KEY_SECRET_KEY, config.secretKey);
  localStorage.setItem(KEY_PUBLIC_KEY, config.publicKey);
  localStorage.setItem(KEY_ENV, config.environment);
  localStorage.setItem(KEY_ACCOUNT_ID, String(config.accountId));
  if (config.apiBase) {
    localStorage.setItem(KEY_API_BASE, config.apiBase);
  } else {
    localStorage.removeItem(KEY_API_BASE);
  }
  if (config.apiVersion) {
    localStorage.setItem(KEY_API_VERSION, config.apiVersion);
  } else {
    localStorage.removeItem(KEY_API_VERSION);
  }
  configureHorusPay(config);
}

/** Read config from localStorage */
export function getHorusPayConfig(): HorusPayConfig {
  return {
    secretKey:  localStorage.getItem(KEY_SECRET_KEY) || '',
    publicKey:  localStorage.getItem(KEY_PUBLIC_KEY) || '',
    apiBase:    localStorage.getItem(KEY_API_BASE) || undefined,
    environment: (localStorage.getItem(KEY_ENV) || 'sandbox') as HorusPayConfig['environment'],
    accountId:  localStorage.getItem(KEY_ACCOUNT_ID) || '',
    apiVersion: localStorage.getItem(KEY_API_VERSION) || undefined,
  };
}

/** Check if the SDK is configured (at least secretKey or publicKey present) */
export function isHorusPayConfigured(): boolean {
  if (_configured) return true;
  const cfg = getHorusPayConfig();
  if (cfg.secretKey || cfg.publicKey) {
    _applyConfig(cfg);
    return true;
  }
  return false;
}

/** Clear all stored config */
export function clearHorusPayConfig(): void {
  localStorage.removeItem(KEY_SECRET_KEY);
  localStorage.removeItem(KEY_PUBLIC_KEY);
  localStorage.removeItem(KEY_API_BASE);
  localStorage.removeItem(KEY_ENV);
  localStorage.removeItem(KEY_ACCOUNT_ID);
  localStorage.removeItem(KEY_API_VERSION);
  localStorage.removeItem(KEY_TOKEN);
  _configured = false;
}

/** Save a JWT token (for Auth flows) */
export function saveToken(token: string): void {
  localStorage.setItem(KEY_TOKEN, token);
  HorusPay.setToken(token);
}

/** Retrieve the stored JWT token */
export function getToken(): string {
  return localStorage.getItem(KEY_TOKEN) || '';
}

export { HorusPay };
