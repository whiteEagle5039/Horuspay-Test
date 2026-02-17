import { Customer as HorusPayCustomer } from 'horuspay';
import type { CustomerData, ApiResponse, Customer } from '../types';

export const createCustomer = async (
  data: CustomerData
): Promise<ApiResponse<Customer>> => {
  try {
    const customer = await HorusPayCustomer.create(data);
    return {
      success: true,
      data: customer as unknown as Customer,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to create customer',
      details: error.errors,
    };
  }
};

export const listCustomers = async (
  filters?: any
): Promise<ApiResponse<Customer[]>> => {
  try {
    const customers = await HorusPayCustomer.all(filters);
    return {
      success: true,
      data: customers as unknown as Customer[],
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to list customers',
    };
  }
};

export const retrieveCustomer = async (
  id: number
): Promise<ApiResponse<Customer>> => {
  try {
    const customer = await HorusPayCustomer.retrieve(id);
    return {
      success: true,
      data: customer as unknown as Customer,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to retrieve customer',
    };
  }
};

export const updateCustomer = async (
  id: number,
  data: Partial<CustomerData>
): Promise<ApiResponse<Customer>> => {
  try {
    const customer = await HorusPayCustomer.update(id, data);
    return {
      success: true,
      data: customer as unknown as Customer,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to update customer',
    };
  }
};

export const deleteCustomer = async (
  id: number
): Promise<ApiResponse<void>> => {
  try {
    const customer = await HorusPayCustomer.retrieve(id);
    await customer.delete();
    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to delete customer',
    };
  }
};
