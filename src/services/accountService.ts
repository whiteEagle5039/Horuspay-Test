import { Account } from 'horuspay-node';
import { extractError, toPlainObject, extractCollection, type ServiceResult } from './_helpers';

export async function listAccounts(params?: Record<string, any>): Promise<ServiceResult> {
  try {
    const result = await Account.all(params);
    const { items, raw } = extractCollection(result);
    return { success: true, data: items, raw };
  } catch (e: any) {
    const { message, details } = extractError(e);
    return { success: false, error: message, details };
  }
}

export async function retrieveAccount(id: string | number): Promise<ServiceResult> {
  try {
    const result = await Account.retrieve(id);
    return { success: true, data: toPlainObject(result) };
  } catch (e: any) {
    const { message, details } = extractError(e);
    return { success: false, error: message, details };
  }
}

export async function createAccount(data: Record<string, any>): Promise<ServiceResult> {
  try {
    const result = await Account.create(data);
    return { success: true, data: toPlainObject(result) };
  } catch (e: any) {
    const { message, details } = extractError(e);
    return { success: false, error: message, details };
  }
}

export async function updateAccount(id: string | number, data: Record<string, any>): Promise<ServiceResult> {
  try {
    const result = await Account.update(id, data);
    return { success: true, data: toPlainObject(result) };
  } catch (e: any) {
    const { message, details } = extractError(e);
    return { success: false, error: message, details };
  }
}

export async function inviteToAccount(id: string | number, email: string): Promise<ServiceResult> {
  try {
    const account = await Account.retrieve(id);
    const result = await account.invite({ email });
    return { success: true, data: toPlainObject(result) };
  } catch (e: any) {
    const { message, details } = extractError(e);
    return { success: false, error: message, details };
  }
}
