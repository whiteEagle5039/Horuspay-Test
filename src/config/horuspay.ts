import { HorusPay } from 'horuspay';
import type { HorusPayConfig } from '../types';

let isConfigured = false;

export const configureHorusPay = (config: HorusPayConfig) => {
  try {
    HorusPay.setApiKey(config.apiKey);
    HorusPay.setEnvironment(config.environment);
    HorusPay.setAccountId(config.accountId);
    isConfigured = true;
    console.log('✅ HorusPay configured successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to configure HorusPay:', error);
    return false;
  }
};

export const getHorusPayConfig = (): HorusPayConfig => {
  return {
    apiKey: localStorage.getItem('horuspay_api_key') || '',
    environment: (localStorage.getItem('horuspay_env') || 'sandbox') as 'sandbox' | 'production' | 'development',
    accountId: localStorage.getItem('horuspay_account_id') || '',
  };
};

export const saveHorusPayConfig = (config: HorusPayConfig) => {
  localStorage.setItem('horuspay_api_key', config.apiKey);
  localStorage.setItem('horuspay_env', config.environment);
  localStorage.setItem('horuspay_account_id', config.accountId);
  configureHorusPay(config);
};

export const isHorusPayConfigured = () => isConfigured;

export { HorusPay };
