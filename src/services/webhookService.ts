import { Webhook } from 'horuspay-node';
import { extractError, toPlainObject, extractCollection, type ServiceResult } from './_helpers';

export async function createWebhook(data: Record<string, any>): Promise<ServiceResult> {
  try {
    const result = await Webhook.create(data);
    return { success: true, data: toPlainObject(result) };
  } catch (e: any) {
    const { message, details } = extractError(e);
    return { success: false, error: message, details };
  }
}

export async function listWebhooks(params?: Record<string, any>): Promise<ServiceResult> {
  try {
    const result = await Webhook.all(params);
    const { items, raw } = extractCollection(result);
    return { success: true, data: items, raw };
  } catch (e: any) {
    const { message, details } = extractError(e);
    return { success: false, error: message, details };
  }
}

export async function retrieveWebhook(id: string | number): Promise<ServiceResult> {
  try {
    const result = await Webhook.retrieve(id);
    return { success: true, data: toPlainObject(result) };
  } catch (e: any) {
    const { message, details } = extractError(e);
    return { success: false, error: message, details };
  }
}

export async function updateWebhook(id: string | number, data: Record<string, any>): Promise<ServiceResult> {
  try {
    const result = await Webhook.update(id, data);
    return { success: true, data: toPlainObject(result) };
  } catch (e: any) {
    const { message, details } = extractError(e);
    return { success: false, error: message, details };
  }
}

export async function deleteWebhook(id: string | number): Promise<ServiceResult> {
  try {
    const webhook = await Webhook.retrieve(id);
    await webhook.delete();
    return { success: true };
  } catch (e: any) {
    const { message, details } = extractError(e);
    return { success: false, error: message, details };
  }
}

export function verifyWebhookSignature(
  payload: string,
  header: string,
  secret: string,
  tolerance?: number,
): ServiceResult {
  try {
    Webhook.constructEvent(payload, header, secret, tolerance);
    return { success: true, data: { valid: true } };
  } catch (e: any) {
    const { message, details } = extractError(e);
    return { success: false, error: message, details };
  }
}
