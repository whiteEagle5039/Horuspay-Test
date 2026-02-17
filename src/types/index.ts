// Types for HorusPay SDK testing

export interface HorusPayConfig {
  apiKey: string;
  environment: 'sandbox' | 'production' | 'development';
  accountId: string;
}

export interface CustomerData {
  firstname: string;
  lastname: string;
  email: string;
  country_code: string;
  phone_prefix?: string;
  phone_number?: string;
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
  customer?: CustomerData;
  customer_id?: number;
  reference?: string;
}

export interface PayoutData {
  amount: number;
  currency: string;
  mode: string;
  callback_url: string;
  customer?: CustomerData;
  customer_id?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: Record<string, string[]>;
}

export interface Transaction {
  id: number;
  reference: string;
  amount: number;
  currency: string;
  status: string;
  customer?: CustomerData;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  country_code: string;
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
  customer?: CustomerData;
  created_at: string;
  updated_at: string;
}

export interface WebhookEvent {
  type: string;
  data: Record<string, any>;
  created_at: string;
}
