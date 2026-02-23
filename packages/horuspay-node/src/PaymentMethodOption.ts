import { HorusPayObject } from './HorusPayObject';
import { Resource } from './Resource';

/**
 * Class PaymentMethodOption
 *
 * @property int $id
 * @property string $name
 * @property int $country_id
 * @property int $currency_id
 * @property string $created_at
 * @property string $updated_at
 */
export class PaymentMethodOption extends Resource {
    protected static ressourceName = 'payment_method_option';
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
     * @returns {Promise<PaymentMethodOption>}
     */
    static retrieve(id, params = {}, headers = {}): Promise<PaymentMethodOption> {
        return <Promise<PaymentMethodOption>> this._retrieve(id, params, headers);
    }

    /**
     * @param {string|number} id
     * @param {Object|null} params
     * @param {Object|null} headers
     * @returns {Promise<PaymentMethodOption>}
     */
    static update(id, params = {}, headers = {}): Promise<PaymentMethodOption> {
        return <Promise<PaymentMethodOption>> this._update(id, params, headers);
    }
}
