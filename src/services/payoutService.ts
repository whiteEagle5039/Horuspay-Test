import { Payout } from 'horuspay-node';
import { extractError, toPlainObject, type ServiceResult } from './_helpers';

export async function createPayout(data: Record<string, any>): Promise<ServiceResult> {
  try {
    const result = await Payout.create(data);
    return { success: true, data: toPlainObject(result) };
  } catch (e: any) {
    const { message, details } = extractError(e);
    return { success: false, error: message, details };
  }
}

export async function listPayouts(params?: Record<string, any>): Promise<ServiceResult> {
  try {
    const result = await Payout.all(params);
    return { success: true, data: toPlainObject(result) };
  } catch (e: any) {
    const { message, details } = extractError(e);
    return { success: false, error: message, details };
  }
}

export async function retrievePayout(id: string | number): Promise<ServiceResult> {
  try {
    const result = await Payout.retrieve(id);
    return { success: true, data: toPlainObject(result) };
  } catch (e: any) {
    const { message, details } = extractError(e);
    return { success: false, error: message, details };
  }
}

export async function updatePayout(id: string | number, data: Record<string, any>): Promise<ServiceResult> {
  try {
    const result = await Payout.update(id, data);
    return { success: true, data: toPlainObject(result) };
  } catch (e: any) {
    const { message, details } = extractError(e);
    return { success: false, error: message, details };
  }
}

export async function deletePayout(id: string | number): Promise<ServiceResult> {
  try {
    const payout = await Payout.retrieve(id);
    await payout.delete();
    return { success: true };
  } catch (e: any) {
    const { message, details } = extractError(e);
    return { success: false, error: message, details };
  }
}

export async function payPayout(id: string | number): Promise<ServiceResult> {
  try {
    const payout = await Payout.retrieve(id);
    const result = await payout.pay();
    return { success: true, data: toPlainObject(result) };
  } catch (e: any) {
    const { message, details } = extractError(e);
    return { success: false, error: message, details };
  }
}

export async function createPayoutBatch(payouts: Record<string, any>[], params?: Record<string, any>): Promise<ServiceResult> {
  try {
    const result = await Payout.createBatch(payouts, params);
    return { success: true, data: toPlainObject(result) };
  } catch (e: any) {
    const { message, details } = extractError(e);
    return { success: false, error: message, details };
  }
}
