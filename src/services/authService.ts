import { Auth } from 'horuspay';
import type {
  ApiResponse,
  AuthLoginData,
  AuthRegisterData,
  AuthResetPasswordData,
  UserProfile,
} from '../types';
import { extractError, extractObject } from './_helpers';
import { saveToken } from '../config/horuspay';

export const register = async (
  data: AuthRegisterData
): Promise<ApiResponse<unknown>> => {
  try {
    const raw = await Auth.register(data);
    return { success: true, data: extractObject(raw), raw };
  } catch (e) {
    return { success: false, ...extractError(e) };
  }
};

export const login = async (
  data: AuthLoginData
): Promise<ApiResponse<{ token?: string; user?: unknown }>> => {
  try {
    const raw = await Auth.login(data);
    const result = extractObject<{ token?: string }>(raw);
    // Sauvegarde le token si présent
    if (result?.token) {
      saveToken(result.token);
    }
    return { success: true, data: result as { token?: string; user?: unknown }, raw };
  } catch (e) {
    return { success: false, ...extractError(e) };
  }
};

export const otpLogin = async (
  email: string,
  otp: string
): Promise<ApiResponse<unknown>> => {
  try {
    const raw = await Auth.otpLogin({ email, otp });
    const result = extractObject<{ token?: string }>(raw);
    if (result?.token) saveToken(result.token);
    return { success: true, data: result, raw };
  } catch (e) {
    return { success: false, ...extractError(e) };
  }
};

export const findRole = async (
  email: string
): Promise<ApiResponse<unknown>> => {
  try {
    const raw = await Auth.findRole({ email });
    return { success: true, data: extractObject(raw), raw };
  } catch (e) {
    return { success: false, ...extractError(e) };
  }
};

export const getProfile = async (): Promise<ApiResponse<UserProfile>> => {
  try {
    const raw = await Auth.getProfile();
    return { success: true, data: extractObject<UserProfile>(raw), raw };
  } catch (e) {
    return { success: false, ...extractError(e) };
  }
};

export const getProfileAccounts = async (): Promise<ApiResponse<unknown>> => {
  try {
    const raw = await Auth.getProfileAccounts();
    return { success: true, data: extractObject(raw), raw };
  } catch (e) {
    return { success: false, ...extractError(e) };
  }
};

export const updateProfile = async (data: {
  email?: string;
  locale?: string;
  name?: string;
}): Promise<ApiResponse<UserProfile>> => {
  try {
    const raw = await Auth.updateProfile(data);
    return { success: true, data: extractObject<UserProfile>(raw), raw };
  } catch (e) {
    return { success: false, ...extractError(e) };
  }
};

export const changePassword = async (data: {
  password: string;
  password_confirmation: string;
}): Promise<ApiResponse<unknown>> => {
  try {
    const raw = await Auth.changePassword(data);
    return { success: true, data: extractObject(raw), raw };
  } catch (e) {
    return { success: false, ...extractError(e) };
  }
};

export const requestPasswordReset = async (
  email: string
): Promise<ApiResponse<unknown>> => {
  try {
    const raw = await Auth.requestPasswordReset({ email });
    return { success: true, data: extractObject(raw), raw };
  } catch (e) {
    return { success: false, ...extractError(e) };
  }
};

export const resetPassword = async (
  resetToken: string,
  data: AuthResetPasswordData
): Promise<ApiResponse<unknown>> => {
  try {
    const raw = await Auth.resetPassword(resetToken, data);
    return { success: true, data: extractObject(raw), raw };
  } catch (e) {
    return { success: false, ...extractError(e) };
  }
};

export const confirmEmail = async (
  email: string
): Promise<ApiResponse<unknown>> => {
  try {
    const raw = await Auth.confirmEmail({ email });
    return { success: true, data: extractObject(raw), raw };
  } catch (e) {
    return { success: false, ...extractError(e) };
  }
};

export const switchAccount = async (
  accountId: number | string
): Promise<ApiResponse<unknown>> => {
  try {
    const raw = await Auth.switchAccount({ account_id: accountId });
    return { success: true, data: extractObject(raw), raw };
  } catch (e) {
    return { success: false, ...extractError(e) };
  }
};
