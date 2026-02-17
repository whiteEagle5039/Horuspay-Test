import { Payout as HorusPayPayout } from 'horuspay';
import type { PayoutData, ApiResponse, Payout } from '../types';

export const createPayout = async (
  data: PayoutData
): Promise<ApiResponse<Payout>> => {
  try {
    const payout = await HorusPayPayout.create(data);
    return {
      success: true,
      data: payout as unknown as Payout,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to create payout',
      details: error.errors,
    };
  }
};

export const listPayouts = async (
  filters?: any
): Promise<ApiResponse<Payout[]>> => {
  try {
    const payouts = await HorusPayPayout.all(filters);
    return {
      success: true,
      data: payouts as unknown as Payout[],
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to list payouts',
    };
  }
};

export const retrievePayout = async (
  id: number
): Promise<ApiResponse<Payout>> => {
  try {
    const payout = await HorusPayPayout.retrieve(id);
    return {
      success: true,
      data: payout as unknown as Payout,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to retrieve payout',
    };
  }
};

export const payPayout = async (
  id: number
): Promise<ApiResponse<any>> => {
  try {
    const payout = await HorusPayPayout.retrieve(id);
    const result = await payout.pay();
    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to pay payout',
    };
  }
};

export const createPayoutBatch = async (
  payouts: PayoutData[]
): Promise<ApiResponse<any>> => {
  try {
    const result = await HorusPayPayout.createBatch(payouts);
    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to create payout batch',
      details: error.errors,
    };
  }
};

export const updatePayout = async (
  id: number,
  data: Partial<PayoutData>
): Promise<ApiResponse<Payout>> => {
  try {
    const payout = await HorusPayPayout.update(id, data);
    return {
      success: true,
      data: payout as unknown as Payout,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to update payout',
    };
  }
};
