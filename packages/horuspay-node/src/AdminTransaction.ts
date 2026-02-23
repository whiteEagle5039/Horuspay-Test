import { HorusPayObject } from './HorusPayObject';
import { Resource } from './Resource';

/**
 * Class AdminTransaction
 *
 * Admin-scoped transaction access (read-only)
 *
 * @property int $id
 * @property string $reference
 * @property number $amount
 * @property string $status
 * @property string $created_at
 * @property string $updated_at
 */
export class AdminTransaction extends Resource {
    protected static ressourceName = 'transaction';
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
     * @returns {Promise<AdminTransaction>}
     */
    static retrieve(id, params = {}, headers = {}): Promise<AdminTransaction> {
        return <Promise<AdminTransaction>> this._retrieve(id, params, headers);
    }
}
