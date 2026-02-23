import { HorusPayObject } from './HorusPayObject';
import { Resource } from './Resource';

/**
 * Class Permission
 *
 * @property int $id
 * @property string $name
 * @property string $created_at
 * @property string $updated_at
 */
export class Permission extends Resource {
    protected static ressourceName = 'permission';
    protected static pathPrefix = '/accounts';

    /**
     * @param {Object|null} params
     * @param {Object|null} headers
     * @returns {Promise<Permission>}
     */
    static create(params = {}, headers = {}): Promise<Permission> {
        return <Promise<Permission>> this._create(params, headers);
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
     * @returns {Promise<Permission>}
     */
    static retrieve(id, params = {}, headers = {}): Promise<Permission> {
        return <Promise<Permission>> this._retrieve(id, params, headers);
    }
}
