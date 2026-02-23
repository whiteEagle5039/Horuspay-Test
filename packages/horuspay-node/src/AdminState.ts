import { HorusPayObject } from './HorusPayObject';
import { Resource } from './Resource';
import { arrayToHorusPayObject } from './Util';

/**
 * Class AdminState
 *
 * Admin statistics/states endpoint
 */
export class AdminState extends Resource {
    protected static ressourceName = 'state';
    protected static pathPrefix = '/admin';

    /**
     * Get stats
     * @param {Object} params - { start_date, end_date, account_id? }
     * @param {Object} headers
     * @returns {Promise<HorusPayObject>}
     */
    static all(params = {}, headers = {}): Promise<HorusPayObject> {
        return <Promise<HorusPayObject>> this._all(params, headers);
    }
}
