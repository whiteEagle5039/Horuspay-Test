import { HorusPayObject } from './HorusPayObject';
import { Resource } from './Resource';

/**
 * Class Blog
 *
 * @property int $id
 * @property string $title
 * @property string $slug
 * @property string $content
 * @property int $category_id
 * @property string $created_at
 * @property string $updated_at
 */
export class Blog extends Resource {
    protected static ressourceName = 'blog';
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
     * @param {string} slug
     * @param {Object|null} params
     * @param {Object|null} headers
     * @returns {Promise<Blog>}
     */
    static retrieve(slug, params = {}, headers = {}): Promise<Blog> {
        return <Promise<Blog>> this._retrieve(slug, params, headers);
    }

    /**
     * @param {Object|null} params
     * @param {Object|null} headers
     * @returns {Promise<Blog>}
     */
    static create(params = {}, headers = {}): Promise<Blog> {
        return <Promise<Blog>> this._create(params, headers);
    }

    /**
     * @param {string} slug
     * @param {Object|null} params
     * @param {Object|null} headers
     * @returns {Promise<Blog>}
     */
    static update(slug, params = {}, headers = {}): Promise<Blog> {
        return <Promise<Blog>> this._update(slug, params, headers);
    }
}
