import { HorusPayObject } from './HorusPayObject';
import { Resource } from './Resource';

/**
 * Class AdminCustomer
 *
 * Admin-scoped customer access (read-only)
 *
 * @property int $id
 * @property string $firstname
 * @property string $lastname
 * @property string $email
 * @property string $created_at
 * @property string $updated_at
 */
export class AdminCustomer extends Resource {
    protected static ressourceName = 'customer';
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
     * @returns {Promise<AdminCustomer>}
     */
    static retrieve(id, params = {}, headers = {}): Promise<AdminCustomer> {
        return <Promise<AdminCustomer>> this._retrieve(id, params, headers);
    }
}
