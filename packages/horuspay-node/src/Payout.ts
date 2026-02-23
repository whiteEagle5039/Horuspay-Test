import { Resource, HorusPayObject } from '.';
import { arrayToHorusPayObject } from './Util';

/**
 * Class Payout
 *
 * @property int $id
 * @property string $reference
 * @property number $amount
 * @property string $currency
 * @property string $mode
 * @property string $status
 * @property string $callback_url
 * @property int $customer_id
 * @property string $created_at
 * @property string $updated_at
 */
export class Payout extends Resource {
    protected static ressourceName = 'payout';
    protected static pathPrefix = '/accounts';

    /**
     * @param {Object|null} params
     * @param {Object|null} headers
     * @returns {Promise<Payout>}
     */
    static create(params = {}, headers: object | null = {}): Promise<Payout> {
        return <Promise<Payout>>this._create(params, headers);
    }

    /**
     * @param {Object|null} params
     * @param {Object|null} headers
     * @returns {Promise<HorusPayObject>}
     */
    static all(params: object | null = {}, headers: object | null = {}): Promise<HorusPayObject> {
        return <Promise<HorusPayObject>>this._all(params, headers);
    }

    /**
     * @param {string|number} id
     * @param {Object|null} params
     * @param {Object|null} headers
     * @returns {Promise<Payout>}
     */
    static retrieve(id: string | number, params: object | null = {}, headers: object | null = {}): Promise<Payout> {
        return <Promise<Payout>>this._retrieve(id, params, headers);
    }

    /**
     * @param {string|number} id The ID of the Payout to update.
     * @param {object|null} params
     * @param {object|null} headers
     * @returns {Promise<Payout>}
     */
    static update(id: string | number, params: object | null = {}, headers: object | null = {}): Promise<Payout> {
        return <Promise<Payout>>this._update(id, params, headers);
    }

    /**
     * @param {Object|null} headers
     * @returns {Promise<Payout>} The saved Payout.
     */
    save(headers = {}): Promise<Payout> {
        return <Promise<Payout>>this._save(headers);
    }

    /**
     * @param {Object|null} headers
     * @returns {Promise<Payout>} The deleted Payout.
     */
    delete(headers = {}): Promise<Payout> {
        return <Promise<Payout>>this._delete(headers);
    }

    /**
     * Trigger the payout transfer
     * @param {Object} params
     * @param {Object} headers
     * @returns {Promise<HorusPayObject>}
     */
    pay(params = {}, headers = {}) : Promise<HorusPayObject> {
        const url = this.instanceUrl() + '/pay';

        return Payout._staticRequest('post', url, params, headers)
            .then(({ data, options }) => {
                let object = <HorusPayObject>arrayToHorusPayObject(data, options);
                return <HorusPayObject>object;
            });
    }

    /**
     * Create mass payouts
     * @param {Array} payouts
     * @param {Object} params
     * @param {Object} headers
     * @returns {Promise<HorusPayObject>}
     */
    static createBatch(payouts: any[] = [], params = {}, headers = {}): Promise<HorusPayObject> {
        const url = this.classPath();

        return <Promise<HorusPayObject>> this._staticRequest('post', url, payouts, headers)
            .then(({ data, options }) => {
                return arrayToHorusPayObject(data, options);
            });
    }
}
