import { HorusPayObject } from './HorusPayObject';
import { Resource } from './Resource';

/**
 * Class Country
 *
 * @property int $id
 * @property string $name_fr
 * @property string $name_en
 * @property string $code
 * @property string $flag_emoji
 * @property int $continent_id
 * @property string $created_at
 * @property string $updated_at
 */
export class Country extends Resource {
    protected static ressourceName = 'country';
    protected static pathPrefix = '/admin';

    /**
     * @param {string|number} id
     * @param {Object|null} params
     * @param {Object|null} headers
     * @returns {Promise<Country>}
     */
    static retrieve(id, params = {}, headers = {}): Promise<Country> {
        return <Promise<Country>> this._retrieve(id, params, headers);
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
     * @returns {Promise<Country>}
     */
    static create(params = {}, headers = {}): Promise<Country> {
        return <Promise<Country>> this._create(params, headers);
    }

    /**
     * @param {string|number} id
     * @param {Object|null} params
     * @param {Object|null} headers
     * @returns {Promise<Country>}
     */
    static update(id, params = {}, headers = {}): Promise<Country> {
        return <Promise<Country>> this._update(id, params, headers);
    }

    /**
     * @param {Object|null} headers
     * @returns {Promise<Country>} The deleted country.
     */
    delete(headers = {}): Promise<Country> {
        return <Promise<Country>> this._delete(headers);
    }
}
