import { ApiKey } from 'horuspay';
import type { ApiResponse, ApiKey as ApiKeyType } from '../types';
import { extractError, extractList, extractObject } from './_helpers';

export const listApiKeys = async (
  filters?: Record<string, unknown>
): Promise<ApiResponse<ApiKeyType[]>> => {
  try {
    const raw = await ApiKey.all(filters);
    return { success: true, data: extractList<ApiKeyType>(raw), raw };
  } catch (e) {
    return { success: false, ...extractError(e) };
  }
};

export const regenerateApiKeys = async (): Promise<ApiResponse<ApiKeyType>> => {
  try {
    const raw = await ApiKey.regenerate();
    return { success: true, data: extractObject<ApiKeyType>(raw), raw };
  } catch (e) {
    return { success: false, ...extractError(e) };
  }
};
