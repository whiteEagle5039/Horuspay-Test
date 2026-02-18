import { Account } from 'horuspay';
import type { ApiResponse, Account as AccountType, AccountData } from '../types';
import { extractError, extractList, extractObject } from './_helpers';

export const listAccounts = async (
  filters?: Record<string, unknown>
): Promise<ApiResponse<AccountType[]>> => {
  try {
    const raw = await Account.all(filters);
    return { success: true, data: extractList<AccountType>(raw), raw };
  } catch (e) {
    return { success: false, ...extractError(e) };
  }
};

export const retrieveAccount = async (
  id: number | string
): Promise<ApiResponse<AccountType>> => {
  try {
    const raw = await Account.retrieve(id);
    return { success: true, data: extractObject<AccountType>(raw), raw };
  } catch (e) {
    return { success: false, ...extractError(e) };
  }
};

export const createAccount = async (
  data: AccountData
): Promise<ApiResponse<AccountType>> => {
  try {
    const raw = await Account.create(data);
    return { success: true, data: extractObject<AccountType>(raw), raw };
  } catch (e) {
    return { success: false, ...extractError(e) };
  }
};

export const updateAccount = async (
  id: number | string,
  data: Partial<AccountData>
): Promise<ApiResponse<AccountType>> => {
  try {
    const raw = await Account.update(id, data);
    return { success: true, data: extractObject<AccountType>(raw), raw };
  } catch (e) {
    return { success: false, ...extractError(e) };
  }
};

export const inviteToAccount = async (
  id: number | string,
  email: string
): Promise<ApiResponse<unknown>> => {
  try {
    const account = await Account.retrieve(id);
    const raw = await account.invite({ email });
    return { success: true, data: extractObject(raw), raw };
  } catch (e) {
    return { success: false, ...extractError(e) };
  }
};
