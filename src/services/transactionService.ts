import { Transaction as HorusPayTransaction } from 'horuspay';
import type { TransactionData, ApiResponse, Transaction } from '../types';

export const createTransaction = async (
  data: TransactionData
): Promise<ApiResponse<Transaction>> => {
  try {
    const tx = await HorusPayTransaction.create(data);
    return {
      success: true,
      data: tx as unknown as Transaction,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to create transaction',
      details: error.errors,
    };
  }
};

export const listTransactions = async (
  filters?: any
): Promise<ApiResponse<Transaction[]>> => {
  try {
    const transactions = await HorusPayTransaction.all(filters);
    return {
      success: true,
      data: transactions as unknown as Transaction[],
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to list transactions',
    };
  }
};

export const retrieveTransaction = async (
  id: number
): Promise<ApiResponse<Transaction>> => {
  try {
    const tx = await HorusPayTransaction.retrieve(id);
    return {
      success: true,
      data: tx as unknown as Transaction,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to retrieve transaction',
    };
  }
};

export const payTransaction = async (
  id: number
): Promise<ApiResponse<any>> => {
  try {
    const tx = await HorusPayTransaction.retrieve(id);
    const result = await tx.pay();
    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to pay transaction',
    };
  }
};

export const getTransactionStatus = async (
  id: number
): Promise<ApiResponse<any>> => {
  try {
    const tx = await HorusPayTransaction.retrieve(id);
    const status = await tx.getStatus();
    const wasPaid = tx.wasPaid();
    const wasRefunded = tx.wasRefunded();

    return {
      success: true,
      data: {
        status,
        wasPaid,
        wasRefunded,
        transaction: tx,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to get transaction status',
    };
  }
};

export const refundTransaction = async (
  id: number
): Promise<ApiResponse<any>> => {
  try {
    const tx = await HorusPayTransaction.retrieve(id);
    const result = await tx.refund();
    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to refund transaction',
    };
  }
};

export const updateTransaction = async (
  id: number,
  data: Partial<TransactionData>
): Promise<ApiResponse<Transaction>> => {
  try {
    const tx = await HorusPayTransaction.update(id, data);
    return {
      success: true,
      data: tx as unknown as Transaction,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to update transaction',
    };
  }
};

export const deleteTransaction = async (
  id: number
): Promise<ApiResponse<void>> => {
  try {
    const tx = await HorusPayTransaction.retrieve(id);
    await tx.delete();
    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to delete transaction',
    };
  }
};
