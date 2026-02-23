import * as crypto from 'crypto';
import { HorusPayObject } from './HorusPayObject';

/**
 * Convert response to HorusPayObject
 * @param {any} resp
 * @param {any} opts
 */
export function convertToHorusPayObject(
    resp: any,
    opts: any
): HorusPayObject {
    let types: any = {
        'v1/transaction': require('./Transaction').Transaction,
        'v1/customer': require('./Customer').Customer,
        'v1/payout': require('./Payout').Payout,
        'v1/account': require('./Account').Account,
        'v1/api_key': require('./ApiKey').ApiKey,
        'v1/role': require('./Role').Role,
        'v1/permission': require('./Permission').Permission,
        'v1/webhook': require('./Webhook').Webhook,
        'v1/payout_request': require('./PayoutRequest').PayoutRequest,
        'v1/currency': require('./Currency').Currency,
        'v1/country': require('./Country').Country,
        'v1/continent': require('./Continent').Continent,
        'v1/blog': require('./Blog').Blog,
        'v1/category': require('./Category').Category,
        'v1/payment_method_option': require('./PaymentMethodOption').PaymentMethodOption,
        'v1/user': require('./User').User,
        'v1/fee_setting': require('./FeeSetting').FeeSetting,
        'v1/event_definition': require('./EventDefinition').EventDefinition,
    };
    let object = new HorusPayObject;
    if (resp['klass']) {
        let klass = resp['klass'];

        if (types[klass]) {
            object = new types[klass]();
        }
    }

    object.refreshFrom(resp, opts);

    return object;
}

/**
 * Convert array response to HorusPayObject
 * @param {any} array
 * @param {any} opts
 */
export function arrayToHorusPayObject(
    array: any,
    opts: any
): HorusPayObject | HorusPayObject[] {
    if (Array.isArray(array)) {
        let mapped: HorusPayObject[] = [];

        array.forEach(i => {
            mapped.push(convertToHorusPayObject(i, opts));
        });

        return mapped;
    } else {
        return convertToHorusPayObject(array, opts);
    }
}

/**
 * Strip api version from key
 * @param {any} key
 * @param {any} opts
 */
export function stripApiVersion(key: any, opts: any): string {
    let apiPart = '';

    if (opts && opts.apiVersion) {
        apiPart = `${opts.apiVersion}/`;
    }

    return key.replace(apiPart, '');
}

/**
 * Check a date value
 * @param {any} date
 * @return {any}
 */
export function toDateString(date: any)
{
    if (date instanceof Date) {
        return date.toISOString();
    } else if (typeof date == 'string' || typeof date == 'number') {
        return date;
    } else {
        throw new Error(
            'Invalid datetime argument. Should be a date in string format, ' +
            ' a timestamp  or an instance of Date.'
        );
    }
}

/**
 * Secure compare, from https://github.com/freewil/scmp
 */
export function secureCompare(a, b) {
    a = Buffer.from(a);
    b = Buffer.from(b);

    if (a.length !== b.length) {
        return false;
    }

    if (crypto.timingSafeEqual) {
        return crypto.timingSafeEqual(a, b);
    }

    const len = a.length;
    let result = 0;

    for (let i = 0; i < len; ++i) {
        result |= a[i] ^ b[i];
    }
    return result === 0;
}
