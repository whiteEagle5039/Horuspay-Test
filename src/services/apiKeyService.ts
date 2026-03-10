import { ApiKey } from 'horuspay-node';
import { extractError, toPlainObject, type ServiceResult } from './_helpers';

export async function listApiKeys(params?: Record<string, any>): Promise<ServiceResult> {
  try {
    const result = await ApiKey.all(params);
    return { success: true, data: toPlainObject(result) };
  } catch (e: any) {
    const { message, details } = extractError(e);
    return { success: false, error: message, details };
  }
}

export async function regenerateApiKeys(): Promise<ServiceResult> {
  try {
    const result = await ApiKey.regenerate();
    return { success: true, data: toPlainObject(result) };
  } catch (e: any) {
    const { message, details } = extractError(e);
    return { success: false, error: message, details };
  }
}
