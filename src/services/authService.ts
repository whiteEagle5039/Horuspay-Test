import { Auth } from 'horuspay-node';
import { extractError, toPlainObject, type ServiceResult } from './_helpers';
import { saveToken } from '../config/horuspay';

export async function register(data: Record<string, any>): Promise<ServiceResult> {
  try {
    const result = await Auth.register(data);
    return { success: true, data: toPlainObject(result) };
  } catch (e: any) {
    const { message, details } = extractError(e);
    return { success: false, error: message, details };
  }
}

export async function login(data: Record<string, any>): Promise<ServiceResult> {
  try {
    const result = await Auth.login(data);
    const plain = toPlainObject(result);
    if (plain?.token) saveToken(plain.token);
    return { success: true, data: plain };
  } catch (e: any) {
    const { message, details } = extractError(e);
    return { success: false, error: message, details };
  }
}

export async function otpLogin(email: string, otp: string): Promise<ServiceResult> {
  try {
    const result = await Auth.otpLogin({ email, otp });
    const plain = toPlainObject(result);
    if (plain?.token) saveToken(plain.token);
    return { success: true, data: plain };
  } catch (e: any) {
    const { message, details } = extractError(e);
    return { success: false, error: message, details };
  }
}

export async function findRole(email: string): Promise<ServiceResult> {
  try {
    const result = await Auth.findRole({ email });
    return { success: true, data: toPlainObject(result) };
  } catch (e: any) {
    const { message, details } = extractError(e);
    return { success: false, error: message, details };
  }
}

export async function getProfile(): Promise<ServiceResult> {
  try {
    const result = await Auth.getProfile();
    return { success: true, data: toPlainObject(result) };
  } catch (e: any) {
    const { message, details } = extractError(e);
    return { success: false, error: message, details };
  }
}

export async function getProfileAccounts(): Promise<ServiceResult> {
  try {
    const result = await Auth.getProfileAccounts();
    return { success: true, data: toPlainObject(result) };
  } catch (e: any) {
    const { message, details } = extractError(e);
    return { success: false, error: message, details };
  }
}

export async function updateProfile(data: Record<string, any>): Promise<ServiceResult> {
  try {
    const result = await Auth.updateProfile(data);
    return { success: true, data: toPlainObject(result) };
  } catch (e: any) {
    const { message, details } = extractError(e);
    return { success: false, error: message, details };
  }
}

export async function changePassword(data: { password: string; password_confirmation: string }): Promise<ServiceResult> {
  try {
    const result = await Auth.changePassword(data);
    return { success: true, data: toPlainObject(result) };
  } catch (e: any) {
    const { message, details } = extractError(e);
    return { success: false, error: message, details };
  }
}

export async function requestPasswordReset(email: string): Promise<ServiceResult> {
  try {
    const result = await Auth.requestPasswordReset({ email });
    return { success: true, data: toPlainObject(result) };
  } catch (e: any) {
    const { message, details } = extractError(e);
    return { success: false, error: message, details };
  }
}

export async function resetPassword(resetToken: string, data: Record<string, any>): Promise<ServiceResult> {
  try {
    const result = await Auth.resetPassword(resetToken, data);
    return { success: true, data: toPlainObject(result) };
  } catch (e: any) {
    const { message, details } = extractError(e);
    return { success: false, error: message, details };
  }
}

export async function confirmEmail(email: string): Promise<ServiceResult> {
  try {
    const result = await Auth.confirmEmail({ email });
    return { success: true, data: toPlainObject(result) };
  } catch (e: any) {
    const { message, details } = extractError(e);
    return { success: false, error: message, details };
  }
}

export async function switchAccount(accountId: string | number): Promise<ServiceResult> {
  try {
    const result = await Auth.switchAccount({ account_id: accountId });
    return { success: true, data: toPlainObject(result) };
  } catch (e: any) {
    const { message, details } = extractError(e);
    return { success: false, error: message, details };
  }
}
