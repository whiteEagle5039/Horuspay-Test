import { Payout as HPPayout } from 'horuspay';
import type { PayoutData, ApiResponse, Payout } from '../types';
import { extractError, extractList, extractObject } from './_helpers';

export const createPayout = async (
  data: PayoutData
): Promise<ApiResponse<Payout>> => {
  try {
    const raw = await HPPayout.create(data);
    return { success: true, data: extractObject<Payout>(raw), raw };
  } catch (e) {
    return { success: false, ...extractError(e) };
  }
};

export const listPayouts = async (
  filters?: Record<string, unknown>
): Promise<ApiResponse<Payout[]>> => {
  try {
    const raw = await HPPayout.all(filters);
    return { success: true, data: extractList<Payout>(raw), raw };
  } catch (e) {
    return { success: false, ...extractError(e) };
  }
};

export const retrievePayout = async (
  id: number | string
): Promise<ApiResponse<Payout>> => {
  try {
    const raw = await HPPayout.retrieve(id);
    return { success: true, data: extractObject<Payout>(raw), raw };
  } catch (e) {
    return { success: false, ...extractError(e) };
  }
};

export const updatePayout = async (
  id: number | string,
  data: Partial<PayoutData>
): Promise<ApiResponse<Payout>> => {
  try {
    const raw = await HPPayout.update(id, data);
    return { success: true, data: extractObject<Payout>(raw), raw };
  } catch (e) {
    return { success: false, ...extractError(e) };
  }
};

export const payPayout = async (
  id: number | string
): Promise<ApiResponse<unknown>> => {
  try {
    const payout = await HPPayout.retrieve(id);
    const raw = await payout.pay();
    return { success: true, data: extractObject(raw), raw };
  } catch (e) {
    return { success: false, ...extractError(e) };
  }
};

export const deletePayout = async (
  id: number | string
): Promise<ApiResponse<void>> => {
  try {
    const payout = await HPPayout.retrieve(id);
    await payout.delete();
    return { success: true };
  } catch (e) {
    return { success: false, ...extractError(e) };
  }
};

export const createPayoutBatch = async (
  payouts: PayoutData[],
  params?: Record<string, unknown>
): Promise<ApiResponse<unknown>> => {
  try {
    const raw = await HPPayout.createBatch(payouts, params);
    return { success: true, data: extractObject(raw), raw };
  } catch (e) {
    return { success: false, ...extractError(e) };
  }
};
