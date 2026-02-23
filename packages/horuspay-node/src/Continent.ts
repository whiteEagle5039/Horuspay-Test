import { HorusPayObject } from './HorusPayObject';
import { Resource } from './Resource';

/**
 * Class Continent
 *
 * @property int $id
 * @property string $name_fr
 * @property string $name_en
 * @property string $code
 * @property string $created_at
 * @property string $updated_at
 */
export class Continent extends Resource {
    protected static ressourceName = 'continent';
    protected static pathPrefix = '/admin';

    /**
     * @param {string|number} id
     * @param {Object|null} params
     * @param {Object|null} headers
     * @returns {Promise<Continent>}
     */
    static retrieve(id, params = {}, headers = {}): Promise<Continent> {
        return <Promise<Continent>> this._retrieve(id, params, headers);
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
     * @returns {Promise<Continent>}
     */
    static create(params = {}, headers = {}): Promise<Continent> {
        return <Promise<Continent>> this._create(params, headers);
    }

    /**
     * @param {string|number} id
     * @param {Object|null} params
     * @param {Object|null} headers
     * @returns {Promise<Continent>}
     */
    static update(id, params = {}, headers = {}): Promise<Continent> {
        return <Promise<Continent>> this._update(id, params, headers);
    }

    /**
     * @param {Object|null} headers
     * @returns {Promise<Continent>} The deleted continent.
     */
    delete(headers = {}): Promise<Continent> {
        return <Promise<Continent>> this._delete(headers);
    }
}
