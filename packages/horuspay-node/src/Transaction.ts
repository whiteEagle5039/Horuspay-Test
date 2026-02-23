import { Resource, HorusPayObject } from '.';
import { arrayToHorusPayObject } from './Util';

/**
 * Class Transaction
 *
 * @property int $id
 * @property string $reference
 * @property string $description
 * @property string $callback_url
 * @property number $amount
 * @property string $currency
 * @property string $status
 * @property string $mode
 * @property int $customer_id
 * @property string $created_at
 * @property string $updated_at
 */
export class Transaction extends Resource {
    protected static ressourceName = 'transaction';
    protected static pathPrefix = '/accounts';

    private static PAID_STATUS = [
        'approved', 'transferred', 'refunded',
        'approved_partially_refunded', 'transferred_partially_refunded'
    ];

    /**
     * Check if the transaction was paid
     * @return {boolean}
     */
    public wasPaid(): boolean {
        return Transaction.PAID_STATUS.includes(this.status);
    }

    /**
     * Check if the transaction was refunded
     * @return {boolean}
     */
    public wasRefunded() {
        return this.status && this.status.includes('refunded');
    }

    /**
     * Check if the transaction was partially refunded
     * @return {boolean}
     */
    public wasPartiallyRefunded(): boolean {
        return this.status && this.status.includes('partially_refunded');
    }

    /**
     * @param {Object|null} params
     * @param {Object|null} headers
     * @returns {Promise<Transaction>}
     */
    static create(params = {}, headers = {}): Promise<Transaction> {
        return <Promise<Transaction>>this._create(params, headers);
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
     * @param {string|number} id
     * @param {Object|null} params
     * @param {Object|null} headers
     * @returns {Promise<Transaction>}
     */
    static retrieve(id, params = {}, headers = {}): Promise<Transaction> {
        return <Promise<Transaction>> this._retrieve(id, params, headers);
    }

    /**
     * @param {string|number} id The ID of the transaction to update.
     * @param {object|null} params
     * @param {object|null} headers
     * @returns {Promise<Transaction>}
     */
    static update(id, params = {}, headers = {}): Promise<Transaction> {
        return <Promise<Transaction>>this._update(id, params, headers);
    }

    /**
     * @param {Object|null} headers
     * @returns {Promise<Transaction>} The saved transaction.
     */
    save(headers = {}): Promise<Transaction> {
        return <Promise<Transaction>>this._save(headers);
    }

    /**
     * @param {Object|null} headers
     * @returns {Promise<Transaction>} The deleted transaction.
     */
    delete(headers = {}): Promise<Transaction> {
        return <Promise<Transaction>>this._delete(headers);
    }

    /**
     * Get transaction status
     * @param {Object} params
     * @param {Object} headers
     * @returns {Promise<HorusPayObject>}
     */
    getStatus(params = {}, headers = {}) : Promise<HorusPayObject> {
        const url = this.instanceUrl() + '/status';

        return Transaction._staticRequest('get', url, params, headers)
            .then(({ data, options }) => {
                let object = <HorusPayObject>arrayToHorusPayObject(data, options);
                return <HorusPayObject>object;
            });
    }

    /**
     * Pay the transaction (without redirection)
     * @param {Object} params
     * @param {Object} headers
     * @returns {Promise<HorusPayObject>}
     */
    pay(params = {}, headers = {}) : Promise<HorusPayObject> {
        const url = this.instanceUrl() + '/pay';

        return Transaction._staticRequest('post', url, params, headers)
            .then(({ data, options }) => {
                let object = <HorusPayObject>arrayToHorusPayObject(data, options);
                return <HorusPayObject>object;
            });
    }

    /**
     * Generate token for the transaction
     * @param {Object} params
     * @param {Object} headers
     * @returns {Promise<HorusPayObject>}
     */
    generateToken(params = {}, headers = {}) : Promise<HorusPayObject> {
        const url = this.instanceUrl() + '/generate_token';

        return Transaction._staticRequest('post', url, params, headers)
            .then(({ data, options }) => {
                let object = <HorusPayObject>arrayToHorusPayObject(data, options);
                return <HorusPayObject>object;
            });
    }

    /**
     * Refund the transaction
     * @param {Object} params
     * @param {Object} headers
     * @returns {Promise<HorusPayObject>}
     */
    refund(params = {}, headers = {}) : Promise<HorusPayObject> {
        const url = this.instanceUrl() + '/refund';

        return Transaction._staticRequest('post', url, params, headers)
            .then(({ data, options }) => {
                let object = <HorusPayObject>arrayToHorusPayObject(data, options);
                return <HorusPayObject>object;
            });
    }
}
