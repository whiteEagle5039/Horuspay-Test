import { HorusPayObject } from './HorusPayObject';
import { Resource } from './Resource';
import { arrayToHorusPayObject } from './Util';

/**
 * Class ApiKey
 *
 * @property int $id
 * @property string $public_key
 * @property string $private_key
 * @property string $created_at
 * @property string $updated_at
 */
export class ApiKey extends Resource {
    protected static ressourceName = 'api_key';
    protected static pathPrefix = '/accounts';

    /**
     * @param {Object|null} params
     * @param {Object|null} headers
     * @returns {Promise<HorusPayObject>}
     */
    static all(params = {}, headers = {}): Promise<HorusPayObject> {
        return <Promise<HorusPayObject>> this._all(params, headers);
    }

    /**
     * Regenerate API keys
     * @param {Object} params
     * @param {Object} headers
     * @returns {Promise<HorusPayObject>}
     */
    static regenerate(params = {}, headers = {}) : Promise<HorusPayObject> {
        const url = this.classPath() + '/regenerate';

        return <Promise<HorusPayObject>> this._staticRequest('post', url, params, headers)
            .then(({ data, options }) => {
                return arrayToHorusPayObject(data, options);
            });
    }
}
