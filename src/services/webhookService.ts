import { Webhook } from 'horuspay';
import type { ApiResponse, Webhook as WebhookType, WebhookData } from '../types';
import { extractError, extractList, extractObject } from './_helpers';

export const createWebhook = async (
  data: WebhookData
): Promise<ApiResponse<WebhookType>> => {
  try {
    const raw = await Webhook.create(data);
    return { success: true, data: extractObject<WebhookType>(raw), raw };
  } catch (e) {
    return { success: false, ...extractError(e) };
  }
};

export const listWebhooks = async (
  filters?: Record<string, unknown>
): Promise<ApiResponse<WebhookType[]>> => {
  try {
    const raw = await Webhook.all(filters);
    return { success: true, data: extractList<WebhookType>(raw), raw };
  } catch (e) {
    return { success: false, ...extractError(e) };
  }
};

export const retrieveWebhook = async (
  id: number | string
): Promise<ApiResponse<WebhookType>> => {
  try {
    const raw = await Webhook.retrieve(id);
    return { success: true, data: extractObject<WebhookType>(raw), raw };
  } catch (e) {
    return { success: false, ...extractError(e) };
  }
};

export const updateWebhook = async (
  id: number | string,
  data: Partial<WebhookData>
): Promise<ApiResponse<WebhookType>> => {
  try {
    const raw = await Webhook.update(id, data);
    return { success: true, data: extractObject<WebhookType>(raw), raw };
  } catch (e) {
    return { success: false, ...extractError(e) };
  }
};

export const deleteWebhook = async (
  id: number | string
): Promise<ApiResponse<void>> => {
  try {
    const webhook = await Webhook.retrieve(id);
    await webhook.delete();
    return { success: true };
  } catch (e) {
    return { success: false, ...extractError(e) };
  }
};

export const verifyWebhookSignature = (
  payload: string,
  header: string,
  secret: string,
  tolerance?: number
): ApiResponse<{ valid: boolean }> => {
  try {
    Webhook.constructEvent(payload, header, secret, tolerance);
    return { success: true, data: { valid: true } };
  } catch (e) {
    return { success: false, ...extractError(e), data: { valid: false } };
  }
};
