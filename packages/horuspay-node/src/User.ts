import { HorusPayObject } from './HorusPayObject';
import { Resource } from './Resource';

/**
 * Class User
 *
 * @property int $id
 * @property string $email
 * @property string $fullname
 * @property string $created_at
 * @property string $updated_at
 */
export class User extends Resource {
    protected static ressourceName = 'user';
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
     * @returns {Promise<User>}
     */
    static retrieve(id, params = {}, headers = {}): Promise<User> {
        return <Promise<User>> this._retrieve(id, params, headers);
    }

    /**
     * @param {string|number} id
     * @param {Object|null} params
     * @param {Object|null} headers
     * @returns {Promise<User>}
     */
    static update(id, params = {}, headers = {}): Promise<User> {
        return <Promise<User>> this._update(id, params, headers);
    }
}
