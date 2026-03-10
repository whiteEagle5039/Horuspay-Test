import { Customer } from 'horuspay-node';
import { extractError, toPlainObject, type ServiceResult } from './_helpers';

export async function createCustomer(data: Record<string, any>): Promise<ServiceResult> {
  try {
    const result = await Customer.create(data);
    return { success: true, data: toPlainObject(result) };
  } catch (e: any) {
    const { message, details } = extractError(e);
    return { success: false, error: message, details };
  }
}

export async function listCustomers(params?: Record<string, any>): Promise<ServiceResult> {
  try {
    const result = await Customer.all(params);
    return { success: true, data: toPlainObject(result) };
  } catch (e: any) {
    const { message, details } = extractError(e);
    return { success: false, error: message, details };
  }
}

export async function retrieveCustomer(id: string | number): Promise<ServiceResult> {
  try {
    const result = await Customer.retrieve(id);
    return { success: true, data: toPlainObject(result) };
  } catch (e: any) {
    const { message, details } = extractError(e);
    return { success: false, error: message, details };
  }
}

export async function updateCustomer(id: string | number, data: Record<string, any>): Promise<ServiceResult> {
  try {
    const result = await Customer.update(id, data);
    return { success: true, data: toPlainObject(result) };
  } catch (e: any) {
    const { message, details } = extractError(e);
    return { success: false, error: message, details };
  }
}

export async function deleteCustomer(id: string | number): Promise<ServiceResult> {
  try {
    const customer = await Customer.retrieve(id);
    await customer.delete();
    return { success: true };
  } catch (e: any) {
    const { message, details } = extractError(e);
    return { success: false, error: message, details };
  }
}
