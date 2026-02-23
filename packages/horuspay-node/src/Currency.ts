import { HorusPayObject } from './HorusPayObject';
import { Resource } from './Resource';

/**
 * Class Currency
 *
 * @property int $id
 * @property string $code
 * @property string $name
 * @property string $symbol
 * @property number $decimals
 * @property boolean $active
 * @property string $created_at
 * @property string $updated_at
 */
export class Currency extends Resource {
    protected static ressourceName = 'currency';
    protected static pathPrefix = '/admin';

    /**
     * @param {string|number} id
     * @param {Object|null} params
     * @param {Object|null} headers
     * @returns {Promise<Currency>}
     */
    static retrieve(id, params = {}, headers = {}): Promise<Currency> {
        return <Promise<Currency>> this._retrieve(id, params, headers);
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
     * @returns {Promise<Currency>}
     */
    static create(params = {}, headers = {}): Promise<Currency> {
        return <Promise<Currency>> this._create(params, headers);
    }

    /**
     * @param {string|number} id
     * @param {Object|null} params
     * @param {Object|null} headers
     * @returns {Promise<Currency>}
     */
    static update(id, params = {}, headers = {}): Promise<Currency> {
        return <Promise<Currency>> this._update(id, params, headers);
    }
}
