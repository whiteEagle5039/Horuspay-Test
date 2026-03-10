import { HorusPayError } from 'horuspay-node';

export interface ServiceResult {
  success: boolean;
  data?: any;
  error?: string;
  details?: any;
  raw?: any;
}

/**
 * Extract error information from a caught exception.
 * If it's a HorusPayError, pull errorMessage, errors, and model.
 * Otherwise fall back to e.message.
 */
export function extractError(e: any): { message: string; details: any } {
  if (e instanceof HorusPayError) {
    return {
      message: e.errorMessage || e.message || 'An unexpected error occurred',
      details: e.errors ?? null,
    };
  }
  return {
    message: e?.message || 'An unexpected error occurred',
    details: null,
  };
}

/**
 * Convert a HorusPayObject (or any SDK object) to a plain JS object
 * by spreading its attributes. Handles nested objects and arrays recursively.
 */
export function toPlainObject(obj: any): any {
  if (obj === null || obj === undefined) return obj;

  // Primitives
  if (typeof obj !== 'object') return obj;

  // Arrays — recurse into each element
  if (Array.isArray(obj)) {
    return obj.map((item) => toPlainObject(item));
  }

  // HorusPayObject or plain object — collect non-function own properties
  const result: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (typeof val === 'function') continue;
    result[key] = toPlainObject(val);
  }
  return result;
}
