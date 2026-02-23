import { HorusPayObject } from './HorusPayObject';
import { Resource } from './Resource';
import { arrayToHorusPayObject } from './Util';

/**
 * Class Auth
 *
 * Handles all authentication-related API operations
 */
export class Auth extends Resource {
    protected static ressourceName = 'auth';
    protected static pathPrefix = '';

    /**
     * Override classPath to use /auth instead of pluralized
     */
    static classPath(): string {
        return '/auth';
    }

    /**
     * Register a new user
     * @param {Object} params - { email, password, password_confirmation, fullname }
     * @param {Object} headers
     * @returns {Promise<HorusPayObject>}
     */
    static register(params = {}, headers = {}) : Promise<HorusPayObject> {
        const url = '/auth/registrations';

        return this._staticRequest('post', url, params, headers)
            .then(({ data, options }) => {
                return <HorusPayObject>arrayToHorusPayObject(data, options);
            });
    }

    /**
     * Login with email and password
     * @param {Object} params - { email, password }
     * @param {Object} headers
     * @returns {Promise<HorusPayObject>}
     */
    static login(params = {}, headers = {}) : Promise<HorusPayObject> {
        const url = '/auth/sessions';

        return this._staticRequest('post', url, params, headers)
            .then(({ data, options }) => {
                return <HorusPayObject>arrayToHorusPayObject(data, options);
            });
    }

    /**
     * Find the connection type / role for a user
     * @param {Object} params - { email }
     * @param {Object} headers
     * @returns {Promise<HorusPayObject>}
     */
    static findRole(params = {}, headers = {}) : Promise<HorusPayObject> {
        const url = '/auth/find_role';

        return this._staticRequest('post', url, params, headers)
            .then(({ data, options }) => {
                return <HorusPayObject>arrayToHorusPayObject(data, options);
            });
    }

    /**
     * Login with OTP
     * @param {Object} params - { email, otp }
     * @param {Object} headers
     * @returns {Promise<HorusPayObject>}
     */
    static otpLogin(params = {}, headers = {}) : Promise<HorusPayObject> {
        const url = '/auth/sessions';

        return this._staticRequest('post', url, params, headers)
            .then(({ data, options }) => {
                return <HorusPayObject>arrayToHorusPayObject(data, options);
            });
    }

    /**
     * Confirm email
     * @param {Object} params - { email }
     * @param {Object} headers
     * @returns {Promise<HorusPayObject>}
     */
    static confirmEmail(params = {}, headers = {}) : Promise<HorusPayObject> {
        const url = '/auth/confirmations';

        return this._staticRequest('post', url, params, headers)
            .then(({ data, options }) => {
                return <HorusPayObject>arrayToHorusPayObject(data, options);
            });
    }

    /**
     * Update email confirmation
     * @param {string|number} id
     * @param {Object} params - { email, confirmation_token }
     * @param {Object} headers
     * @returns {Promise<HorusPayObject>}
     */
    static updateConfirmation(id, params = {}, headers = {}) : Promise<HorusPayObject> {
        const url = `/auth/confirmations/${id}`;

        return this._staticRequest('put', url, params, headers)
            .then(({ data, options }) => {
                return <HorusPayObject>arrayToHorusPayObject(data, options);
            });
    }

    /**
     * Request password reset
     * @param {Object} params - { email }
     * @param {Object} headers
     * @returns {Promise<HorusPayObject>}
     */
    static requestPasswordReset(params = {}, headers = {}) : Promise<HorusPayObject> {
        const url = '/auth/passwords';

        return this._staticRequest('post', url, params, headers)
            .then(({ data, options }) => {
                return <HorusPayObject>arrayToHorusPayObject(data, options);
            });
    }

    /**
     * Reset password with token
     * @param {string} resetToken
     * @param {Object} params - { email, password, password_confirmation }
     * @param {Object} headers
     * @returns {Promise<HorusPayObject>}
     */
    static resetPassword(resetToken: string, params = {}, headers = {}) : Promise<HorusPayObject> {
        const url = `/auth/passwords/${resetToken}`;

        return this._staticRequest('put', url, params, headers)
            .then(({ data, options }) => {
                return <HorusPayObject>arrayToHorusPayObject(data, options);
            });
    }

    /**
     * Get authenticated user profile
     * @param {Object} params
     * @param {Object} headers
     * @returns {Promise<HorusPayObject>}
     */
    static getProfile(params = {}, headers = {}) : Promise<HorusPayObject> {
        const url = '/auth/profile';

        return this._staticRequest('get', url, params, headers)
            .then(({ data, options }) => {
                return <HorusPayObject>arrayToHorusPayObject(data, options);
            });
    }

    /**
     * Get profile accounts
     * @param {Object} params
     * @param {Object} headers
     * @returns {Promise<HorusPayObject>}
     */
    static getProfileAccounts(params = {}, headers = {}) : Promise<HorusPayObject> {
        const url = '/auth/profile/accounts';

        return this._staticRequest('get', url, params, headers)
            .then(({ data, options }) => {
                return <HorusPayObject>arrayToHorusPayObject(data, options);
            });
    }

    /**
     * Update user profile
     * @param {Object} params - { email, locale, name }
     * @param {Object} headers
     * @returns {Promise<HorusPayObject>}
     */
    static updateProfile(params = {}, headers = {}) : Promise<HorusPayObject> {
        const url = '/auth/profile';

        return this._staticRequest('put', url, params, headers)
            .then(({ data, options }) => {
                return <HorusPayObject>arrayToHorusPayObject(data, options);
            });
    }

    /**
     * Change password
     * @param {Object} params - { password, password_confirmation }
     * @param {Object} headers
     * @returns {Promise<HorusPayObject>}
     */
    static changePassword(params = {}, headers = {}) : Promise<HorusPayObject> {
        const url = '/auth/profile/password';

        return this._staticRequest('put', url, params, headers)
            .then(({ data, options }) => {
                return <HorusPayObject>arrayToHorusPayObject(data, options);
            });
    }

    /**
     * Switch active account
     * @param {Object} params - { account_id }
     * @param {Object} headers
     * @returns {Promise<HorusPayObject>}
     */
    static switchAccount(params = {}, headers = {}) : Promise<HorusPayObject> {
        const url = '/auth/profile/switch_account';

        return this._staticRequest('put', url, params, headers)
            .then(({ data, options }) => {
                return <HorusPayObject>arrayToHorusPayObject(data, options);
            });
    }
}
