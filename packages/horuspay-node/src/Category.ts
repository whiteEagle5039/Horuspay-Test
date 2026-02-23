import { HorusPayObject } from './HorusPayObject';
import { Resource } from './Resource';

/**
 * Class Category
 *
 * @property int $id
 * @property string $name
 * @property string $created_at
 * @property string $updated_at
 */
export class Category extends Resource {
    protected static ressourceName = 'category';
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
     * @returns {Promise<Category>}
     */
    static retrieve(id, params = {}, headers = {}): Promise<Category> {
        return <Promise<Category>> this._retrieve(id, params, headers);
    }

    /**
     * @param {Object|null} params
     * @param {Object|null} headers
     * @returns {Promise<Category>}
     */
    static create(params = {}, headers = {}): Promise<Category> {
        return <Promise<Category>> this._create(params, headers);
    }

    /**
     * @param {string|number} id
     * @param {Object|null} params
     * @param {Object|null} headers
     * @returns {Promise<Category>}
     */
    static update(id, params = {}, headers = {}): Promise<Category> {
        return <Promise<Category>> this._update(id, params, headers);
    }
}
