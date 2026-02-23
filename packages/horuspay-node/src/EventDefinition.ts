import { HorusPayObject } from './HorusPayObject';
import { Resource } from './Resource';

/**
 * Class EventDefinition
 *
 * @property int $id
 * @property string $name
 * @property string $created_at
 * @property string $updated_at
 */
export class EventDefinition extends Resource {
    protected static ressourceName = 'event_definition';
    protected static pathPrefix = '/admin';

    /**
     * @param {Object|null} params
     * @param {Object|null} headers
     * @returns {Promise<HorusPayObject>}
     */
    static all(params = {}, headers = {}): Promise<HorusPayObject> {
        return <Promise<HorusPayObject>> this._all(params, headers);
    }
}
