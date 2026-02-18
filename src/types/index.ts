// ============================================================
// HorusPay SDK — Types complets alignés avec le SDK v1.0.0
// ============================================================

export interface HorusPayConfig {
  apiKey: string;
  environment: 'sandbox' | 'production' | 'development';
  accountId: string | number;
}

// ---- Données de base ----

export interface CustomerData {
  firstname: string;
  lastname: string;
  email: string;
  country_code: string;
  phone_prefix?: string;
  phone_number?: string;
  // Format alternatif utilisé dans les payouts
  phone?: {
    number: string;
    country: string;
    network?: string;
  };
}

export interface TransactionData {
  amount: number;
  currency: string;
  callback_url: string;
  description?: string;
  reference?: string;
  customer?: CustomerData;
  customer_id?: number;
}

export interface PayoutData {
  amount: number;
  currency: string;
  mode: string;
  callback_url: string;
  customer?: CustomerData;
  customer_id?: number;
}

export interface AccountData {
  name?: string;
  email?: string;
  account_type?: string;
  business_type?: string;
  business_name?: string;
  website?: string;
  description?: string;
  phone_prefix?: string;
  phone_number?: string;
  country_code?: string;
  timezone?: string;
}

export interface WebhookData {
  url: string;
}

export interface AuthRegisterData {
  email: string;
  password: string;
  password_confirmation: string;
  fullname: string;
}

export interface AuthLoginData {
  email: string;
  password: string;
}

export interface AuthResetPasswordData {
  password: string;
  password_confirmation: string;
}

// ---- Modèles de réponse ----

export interface Transaction {
  id: number;
  reference: string;
  description?: string;
  callback_url?: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  mode?: string;
  customer_id?: number;
  customer?: Customer;
  created_at: string;
  updated_at: string;
}

export type TransactionStatus =
  | 'approved'
  | 'pending'
  | 'refused'
  | 'transferred'
  | 'refunded'
  | 'partially_refunded';

export interface Customer {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  country_code: string;
  phone_prefix?: string;
  phone_number?: string;
  created_at: string;
  updated_at: string;
}

export interface Payout {
  id: number;
  reference: string;
  amount: number;
  currency: string;
  mode: string;
  status: string;
  callback_url?: string;
  customer_id?: number;
  customer?: Customer;
  created_at: string;
  updated_at: string;
}

export interface Account {
  id: number;
  name: string;
  email: string;
  account_type: string;
  business_type?: string;
  business_name?: string;
  business_identity_type?: string;
  website?: string;
  description?: string;
  phone_prefix?: string;
  phone_number?: string;
  country_code?: string;
  timezone?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ApiKey {
  id: number;
  public_key: string;
  private_key: string;
  created_at: string;
  updated_at: string;
}

export interface Webhook {
  id: number;
  url: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id?: number;
  email: string;
  fullname?: string;
  name?: string;
  locale?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PaymentMethodOption {
  id: number;
  name: string;
  country_id?: number;
  currency_id?: number;
  created_at: string;
  updated_at: string;
}

export interface TransactionStatus_Detail {
  wasPaid: boolean;
  wasRefunded: boolean;
  wasPartiallyRefunded: boolean;
  status: string;
  raw: unknown;
}

// ---- Réponse API générique ----

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  details?: Record<string, string[]> | unknown;
  raw?: unknown; // Réponse brute SDK pour le debug
}

// ---- Webhook Event ----

export interface WebhookEvent {
  type: string;
  data: Record<string, unknown>;
  created_at: string;
}

// ---- Navigation ----

export type PageSection =
  | 'dashboard'
  | 'transactions'
  | 'customers'
  | 'payouts'
  | 'auth'
  | 'webhooks'
  | 'apikeys'
  | 'account'
  | 'setup';
