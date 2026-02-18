import { Customer as HPCustomer } from 'horuspay';
import type { CustomerData, ApiResponse, Customer } from '../types';
import { extractError, extractList, extractObject } from './_helpers';

export const createCustomer = async (
  data: CustomerData
): Promise<ApiResponse<Customer>> => {
  try {
    const raw = await HPCustomer.create(data);
    return { success: true, data: extractObject<Customer>(raw), raw };
  } catch (e) {
    return { success: false, ...extractError(e) };
  }
};

export const listCustomers = async (
  filters?: Record<string, unknown>
): Promise<ApiResponse<Customer[]>> => {
  try {
    const raw = await HPCustomer.all(filters);
    return { success: true, data: extractList<Customer>(raw), raw };
  } catch (e) {
    return { success: false, ...extractError(e) };
  }
};

export const retrieveCustomer = async (
  id: number | string
): Promise<ApiResponse<Customer>> => {
  try {
    const raw = await HPCustomer.retrieve(id);
    return { success: true, data: extractObject<Customer>(raw), raw };
  } catch (e) {
    return { success: false, ...extractError(e) };
  }
};

export const updateCustomer = async (
  id: number | string,
  data: Partial<CustomerData>
): Promise<ApiResponse<Customer>> => {
  try {
    const raw = await HPCustomer.update(id, data);
    return { success: true, data: extractObject<Customer>(raw), raw };
  } catch (e) {
    return { success: false, ...extractError(e) };
  }
};

export const deleteCustomer = async (
  id: number | string
): Promise<ApiResponse<void>> => {
  try {
    const customer = await HPCustomer.retrieve(id);
    await customer.delete();
    return { success: true };
  } catch (e) {
    return { success: false, ...extractError(e) };
  }
};
