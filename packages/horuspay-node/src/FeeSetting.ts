import { HorusPayObject } from './HorusPayObject';
import { Resource } from './Resource';
import { arrayToHorusPayObject } from './Util';

/**
 * Class FeeSetting
 *
 * Admin-scoped fee settings per account
 *
 * @property int $id
 * @property string $percentage
 * @property number $fixed
 * @property int $account_id
 * @property int $payment_method_option_id
 * @property string $created_at
 * @property string $updated_at
 */
export class FeeSetting extends Resource {
    protected static ressourceName = 'fee_setting';
    protected static pathPrefix = '/admin';

    /**
     * List fee settings for an account
     * @param {string|number} accountId
     * @param {Object} params
     * @param {Object} headers
     * @returns {Promise<HorusPayObject>}
     */
    static allForAccount(accountId, params = {}, headers = {}) : Promise<HorusPayObject> {
        const url = `/admin/accounts/${accountId}/fee_settings`;

        return <Promise<HorusPayObject>> this._staticRequest('get', url, params, headers)
            .then(({ data, options }) => {
                return arrayToHorusPayObject(data, options);
            });
    }

    /**
     * Update a fee setting for an account
     * @param {string|number} accountId
     * @param {string|number} feeId
     * @param {Object} params - { percentage, fixed }
     * @param {Object} headers
     * @returns {Promise<HorusPayObject>}
     */
    static updateForAccount(accountId, feeId, params = {}, headers = {}) : Promise<HorusPayObject> {
        const url = `/admin/accounts/${accountId}/fee_settings/${feeId}`;

        return <Promise<HorusPayObject>> this._staticRequest('put', url, params, headers)
            .then(({ data, options }) => {
                return arrayToHorusPayObject(data, options);
            });
    }
}
