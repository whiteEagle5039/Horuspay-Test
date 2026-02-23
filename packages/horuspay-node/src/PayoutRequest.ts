import { HorusPayObject } from './HorusPayObject';
import { Resource } from './Resource';
import { arrayToHorusPayObject } from './Util';

/**
 * Class PayoutRequest
 *
 * @property int $id
 * @property string $status
 * @property string $created_at
 * @property string $updated_at
 */
export class PayoutRequest extends Resource {
    protected static ressourceName = 'payout_request';
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
     * @returns {Promise<PayoutRequest>}
     */
    static retrieve(id, params = {}, headers = {}): Promise<PayoutRequest> {
        return <Promise<PayoutRequest>> this._retrieve(id, params, headers);
    }

    /**
     * Approve a payout request
     * @param {string|number} id
     * @param {Object} params
     * @param {Object} headers
     * @returns {Promise<HorusPayObject>}
     */
    static approve(id, params = {}, headers = {}) : Promise<HorusPayObject> {
        const url = this.resourcePath(id) + '/approve';

        return this._staticRequest('post', url, params, headers)
            .then(({ data, options }) => {
                return <HorusPayObject>arrayToHorusPayObject(data, options);
            });
    }

    /**
     * Cancel a payout request
     * @param {string|number} id
     * @param {Object} params
     * @param {Object} headers
     * @returns {Promise<HorusPayObject>}
     */
    static cancel(id, params = {}, headers = {}) : Promise<HorusPayObject> {
        const url = this.resourcePath(id) + '/cancel';

        return this._staticRequest('post', url, params, headers)
            .then(({ data, options }) => {
                return <HorusPayObject>arrayToHorusPayObject(data, options);
            });
    }
}
