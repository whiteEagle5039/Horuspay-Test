import { Transaction as HPTransaction } from 'horuspay';
import type {
  TransactionData,
  ApiResponse,
  Transaction,
  TransactionStatus_Detail,
} from '../types';
import { extractError, extractList, extractObject } from './_helpers';

export const createTransaction = async (
  data: TransactionData
): Promise<ApiResponse<Transaction>> => {
  try {
    const raw = await HPTransaction.create(data);
    return { success: true, data: extractObject<Transaction>(raw), raw };
  } catch (e) {
    return { success: false, ...extractError(e) };
  }
};

export const listTransactions = async (
  filters?: Record<string, unknown>
): Promise<ApiResponse<Transaction[]>> => {
  try {
    const raw = await HPTransaction.all(filters);
    return { success: true, data: extractList<Transaction>(raw), raw };
  } catch (e) {
    return { success: false, ...extractError(e) };
  }
};

export const retrieveTransaction = async (
  id: number | string
): Promise<ApiResponse<Transaction>> => {
  try {
    const raw = await HPTransaction.retrieve(id);
    return { success: true, data: extractObject<Transaction>(raw), raw };
  } catch (e) {
    return { success: false, ...extractError(e) };
  }
};

export const updateTransaction = async (
  id: number | string,
  data: Partial<TransactionData>
): Promise<ApiResponse<Transaction>> => {
  try {
    const raw = await HPTransaction.update(id, data);
    return { success: true, data: extractObject<Transaction>(raw), raw };
  } catch (e) {
    return { success: false, ...extractError(e) };
  }
};

export const payTransaction = async (
  id: number | string
): Promise<ApiResponse<unknown>> => {
  try {
    const tx = await HPTransaction.retrieve(id);
    const raw = await tx.pay();
    return { success: true, data: extractObject(raw), raw };
  } catch (e) {
    return { success: false, ...extractError(e) };
  }
};

export const generateToken = async (
  id: number | string
): Promise<ApiResponse<unknown>> => {
  try {
    const tx = await HPTransaction.retrieve(id);
    const raw = await tx.generateToken();
    return { success: true, data: extractObject(raw), raw };
  } catch (e) {
    return { success: false, ...extractError(e) };
  }
};

export const getTransactionStatus = async (
  id: number | string
): Promise<ApiResponse<TransactionStatus_Detail>> => {
  try {
    const tx = await HPTransaction.retrieve(id);
    const statusRaw = await tx.getStatus();
    const detail: TransactionStatus_Detail = {
      wasPaid:              tx.wasPaid(),
      wasRefunded:          tx.wasRefunded(),
      wasPartiallyRefunded: tx.wasPartiallyRefunded(),
      status:               (tx as unknown as Record<string,string>).status,
      raw:                  statusRaw,
    };
    return { success: true, data: detail, raw: statusRaw };
  } catch (e) {
    return { success: false, ...extractError(e) };
  }
};

export const refundTransaction = async (
  id: number | string
): Promise<ApiResponse<unknown>> => {
  try {
    const tx = await HPTransaction.retrieve(id);
    const raw = await tx.refund();
    return { success: true, data: extractObject(raw), raw };
  } catch (e) {
    return { success: false, ...extractError(e) };
  }
};

export const deleteTransaction = async (
  id: number | string
): Promise<ApiResponse<void>> => {
  try {
    const tx = await HPTransaction.retrieve(id);
    await tx.delete();
    return { success: true };
  } catch (e) {
    return { success: false, ...extractError(e) };
  }
};
