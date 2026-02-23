import { HorusPayObject } from './HorusPayObject';
import { Resource } from './Resource';
import { arrayToHorusPayObject } from './Util';

/**
 * Class AdminAccount
 *
 * Admin-scoped account management
 *
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string $account_type
 * @property string $business_type
 * @property string $status
 * @property boolean $blocked
 * @property string $created_at
 * @property string $updated_at
 */
export class AdminAccount extends Resource {
    protected static ressourceName = 'account';
    protected static pathPrefix = '/admin';

    /**
     * @param {Object|null} params
     * @param {Object|null} headers
     * @returns {Promise<HorusPayObject>}
     */
    static all(params = {}, headers = {}): Promise<HorusPayObject> {
        return <Promise<HorusPayObject>> this._all(params, headers);
    }

    /**
     * @param {string|number} id
     * @param {Object|null} params
     * @param {Object|null} headers
     * @returns {Promise<AdminAccount>}
     */
    static retrieve(id, params = {}, headers = {}): Promise<AdminAccount> {
        return <Promise<AdminAccount>> this._retrieve(id, params, headers);
    }

    /**
     * @param {string|number} id
     * @param {Object|null} params
     * @param {Object|null} headers
     * @returns {Promise<AdminAccount>}
     */
    static update(id, params = {}, headers = {}): Promise<AdminAccount> {
        return <Promise<AdminAccount>> this._update(id, params, headers);
    }

    /**
     * Block an account
     * @param {string|number} id
     * @param {Object} params - { blocked_reason: { rccm: "...", message: "..." } }
     * @param {Object} headers
     * @returns {Promise<HorusPayObject>}
     */
    static block(id, params = {}, headers = {}) : Promise<HorusPayObject> {
        const url = this.resourcePath(id) + '/block';

        return this._staticRequest('post', url, params, headers)
            .then(({ data, options }) => {
                return <HorusPayObject>arrayToHorusPayObject(data, options);
            });
    }

    /**
     * Unblock an account
     * @param {string|number} id
     * @param {Object} params
     * @param {Object} headers
     * @returns {Promise<HorusPayObject>}
     */
    static unblock(id, params = {}, headers = {}) : Promise<HorusPayObject> {
        const url = this.resourcePath(id) + '/unblock';

        return this._staticRequest('post', url, params, headers)
            .then(({ data, options }) => {
                return <HorusPayObject>arrayToHorusPayObject(data, options);
            });
    }

    /**
     * Validate an account
     * @param {string|number} id
     * @param {Object} params - { statut: "active"|"reject", blocked_reason?: {...} }
     * @param {Object} headers
     * @returns {Promise<HorusPayObject>}
     */
    static validate(id, params = {}, headers = {}) : Promise<HorusPayObject> {
        const url = this.resourcePath(id) + '/validate';

        return this._staticRequest('post', url, params, headers)
            .then(({ data, options }) => {
                return <HorusPayObject>arrayToHorusPayObject(data, options);
            });
    }
}
