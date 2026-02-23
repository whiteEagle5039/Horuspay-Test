import { HorusPayObject } from './HorusPayObject';
import { Resource } from './Resource';
import { arrayToHorusPayObject } from './Util';

/**
 * Class AdminExport
 *
 * Admin export endpoint
 */
export class AdminExport extends Resource {
    protected static ressourceName = 'export';
    protected static pathPrefix = '/admin';

    /**
     * Create an export
     * @param {Object} params - { export_type, email, export_format, filters? }
     * @param {Object} headers
     * @returns {Promise<HorusPayObject>}
     */
    static create(params = {}, headers = {}): Promise<HorusPayObject> {
        return <Promise<HorusPayObject>> this._create(params, headers);
    }
}
