import { HorusPayObject } from './HorusPayObject';
import { Resource } from './Resource';
import { arrayToHorusPayObject } from './Util';

/**
 * Class Account
 *
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string $account_type
 * @property string $business_type
 * @property string $business_name
 * @property string $business_identity_type
 * @property string $website
 * @property string $description
 * @property string $phone_prefix
 * @property string $phone_number
 * @property string $country_code
 * @property string $timezone
 * @property string $status
 * @property string $created_at
 * @property string $updated_at
 */
export class Account extends Resource {
    protected static ressourceName = 'account';

    /**
     * @param {string|number} id
     * @param {Object|null} params
     * @param {Object|null} headers
     * @returns {Promise<Account>}
     */
    static retrieve(id, params = {}, headers = {}): Promise<Account> {
        return <Promise<Account>> this._retrieve(id, params, headers);
    }

    /**
     * @param {Object|null} params
     * @param {Object|null} headers
     * @returns {Promise<HorusPayObject>}
     */
    static all(params = {}, headers = {}): Promise<HorusPayObject> {
        return <Promise<HorusPayObject>> this._all(params, headers);
    }

    /**
     * @param {Object|null} params
     * @param {Object|null} headers
     * @returns {Promise<Account>}
     */
    static create(params = {}, headers = {}): Promise<Account> {
        return <Promise<Account>> this._create(params, headers);
    }

    /**
     * @param {string} id The ID of the account to update.
     * @param {Object|null} params
     * @param {Object|null} headers
     * @returns {Promise<Account>}
     */
    static update(id, params = {}, headers = {}): Promise<Account> {
        return <Promise<Account>> this._update(id, params, headers);
    }

    /**
     * @param {Object|null} headers
     * @returns {Promise<Account>} The saved account.
     */
    save(headers = {}): Promise<Account> {
        return <Promise<Account>> this._save(headers);
    }

    /**
     * @param {Object|null} headers
     * @returns {Promise<Account>} The deleted account.
     */
    delete(headers = {}): Promise<Account> {
        return <Promise<Account>> this._delete(headers);
    }

    /**
     * Invite a user to the account
     * @param {Object} params
     * @param {Object} headers
     * @returns {Promise<HorusPayObject>}
     */
    invite(params = {}, headers = {}) : Promise<HorusPayObject> {
        const url = this.instanceUrl() + '/invite';

        return Account._staticRequest('post', url, params, headers)
            .then(({ data, options }) => {
                let object = <HorusPayObject>arrayToHorusPayObject(data, options);
                return <HorusPayObject>object;
            });
    }
}
