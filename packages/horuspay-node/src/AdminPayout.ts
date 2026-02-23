import { HorusPayObject } from './HorusPayObject';
import { Resource } from './Resource';

/**
 * Class AdminPayout
 *
 * Admin-scoped payout access (read-only)
 *
 * @property int $id
 * @property string $reference
 * @property number $amount
 * @property string $status
 * @property string $created_at
 * @property string $updated_at
 */
export class AdminPayout extends Resource {
    protected static ressourceName = 'payout';
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
     * @returns {Promise<AdminPayout>}
     */
    static retrieve(id, params = {}, headers = {}): Promise<AdminPayout> {
        return <Promise<AdminPayout>> this._retrieve(id, params, headers);
    }
}
