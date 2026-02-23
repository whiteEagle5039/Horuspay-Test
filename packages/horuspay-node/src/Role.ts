import { HorusPayObject } from './HorusPayObject';
import { Resource } from './Resource';
import { arrayToHorusPayObject } from './Util';

/**
 * Class Role
 *
 * @property int $id
 * @property string $name
 * @property string $created_at
 * @property string $updated_at
 */
export class Role extends Resource {
    protected static ressourceName = 'role';
    protected static pathPrefix = '/accounts';

    /**
     * @param {Object|null} params
     * @param {Object|null} headers
     * @returns {Promise<Role>}
     */
    static create(params = {}, headers = {}): Promise<Role> {
        return <Promise<Role>> this._create(params, headers);
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
     * @returns {Promise<Role>}
     */
    static retrieve(id, params = {}, headers = {}): Promise<Role> {
        return <Promise<Role>> this._retrieve(id, params, headers);
    }

    /**
     * @param {string|number} id The ID of the role to update.
     * @param {Object|null} params
     * @param {Object|null} headers
     * @returns {Promise<Role>}
     */
    static update(id, params = {}, headers = {}): Promise<Role> {
        return <Promise<Role>> this._update(id, params, headers);
    }

    /**
     * @param {Object|null} headers
     * @returns {Promise<Role>} The saved role.
     */
    save(headers = {}): Promise<Role> {
        return <Promise<Role>> this._save(headers);
    }

    /**
     * @param {Object|null} headers
     * @returns {Promise<Role>} The deleted role.
     */
    delete(headers = {}): Promise<Role> {
        return <Promise<Role>> this._delete(headers);
    }

    /**
     * Assign a permission to this role
     * @param {Object} params
     * @param {Object} headers
     * @returns {Promise<HorusPayObject>}
     */
    assignPermission(params = {}, headers = {}) : Promise<HorusPayObject> {
        const url = this.instanceUrl() + '/permissions';

        return Role._staticRequest('post', url, params, headers)
            .then(({ data, options }) => {
                let object = <HorusPayObject>arrayToHorusPayObject(data, options);
                return <HorusPayObject>object;
            });
    }

    /**
     * List permissions of this role
     * @param {Object} params
     * @param {Object} headers
     * @returns {Promise<HorusPayObject>}
     */
    listPermissions(params = {}, headers = {}) : Promise<HorusPayObject> {
        const url = this.instanceUrl() + '/permissions';

        return Role._staticRequest('get', url, params, headers)
            .then(({ data, options }) => {
                let object = <HorusPayObject>arrayToHorusPayObject(data, options);
                return <HorusPayObject>object;
            });
    }
}
