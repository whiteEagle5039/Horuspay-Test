import { Transaction } from 'horuspay-node';
import { extractError, toPlainObject, extractCollection, type ServiceResult } from './_helpers';

export async function createTransaction(data: Record<string, any>): Promise<ServiceResult> {
  try {
    const result = await Transaction.create(data);
    return { success: true, data: toPlainObject(result) };
  } catch (e: any) {
    const { message, details } = extractError(e);
    return { success: false, error: message, details };
  }
}

export async function listTransactions(params?: Record<string, any>): Promise<ServiceResult> {
  try {
    const result = await Transaction.all(params);
    const { items, raw } = extractCollection(result);
    return { success: true, data: items, raw };
  } catch (e: any) {
    const { message, details } = extractError(e);
    return { success: false, error: message, details };
  }
}

export async function retrieveTransaction(id: string | number): Promise<ServiceResult> {
  try {
    const result = await Transaction.retrieve(id);
    return { success: true, data: toPlainObject(result) };
  } catch (e: any) {
    const { message, details } = extractError(e);
    return { success: false, error: message, details };
  }
}

export async function updateTransaction(id: string | number, data: Record<string, any>): Promise<ServiceResult> {
  try {
    const result = await Transaction.update(id, data);
    return { success: true, data: toPlainObject(result) };
  } catch (e: any) {
    const { message, details } = extractError(e);
    return { success: false, error: message, details };
  }
}

export async function deleteTransaction(id: string | number): Promise<ServiceResult> {
  try {
    const tx = await Transaction.retrieve(id);
    await tx.delete();
    return { success: true };
  } catch (e: any) {
    const { message, details } = extractError(e);
    return { success: false, error: message, details };
  }
}

export async function payTransaction(id: string | number): Promise<ServiceResult> {
  try {
    const tx = await Transaction.retrieve(id);
    const result = await tx.pay();
    return { success: true, data: toPlainObject(result) };
  } catch (e: any) {
    const { message, details } = extractError(e);
    return { success: false, error: message, details };
  }
}

export async function getTransactionStatus(id: string | number): Promise<ServiceResult> {
  try {
    const tx = await Transaction.retrieve(id);
    const statusResult = await tx.getStatus();
    return {
      success: true,
      data: {
        ...toPlainObject(statusResult),
        wasPaid: tx.wasPaid(),
        wasRefunded: tx.wasRefunded(),
        wasPartiallyRefunded: tx.wasPartiallyRefunded(),
      },
    };
  } catch (e: any) {
    const { message, details } = extractError(e);
    return { success: false, error: message, details };
  }
}

export async function generateToken(id: string | number): Promise<ServiceResult> {
  try {
    const tx = await Transaction.retrieve(id);
    const result = await tx.generateToken();
    return { success: true, data: toPlainObject(result) };
  } catch (e: any) {
    const { message, details } = extractError(e);
    return { success: false, error: message, details };
  }
}

export async function refundTransaction(id: string | number): Promise<ServiceResult> {
  try {
    const tx = await Transaction.retrieve(id);
    const result = await tx.refund();
    return { success: true, data: toPlainObject(result) };
  } catch (e: any) {
    const { message, details } = extractError(e);
    return { success: false, error: message, details };
  }
}
