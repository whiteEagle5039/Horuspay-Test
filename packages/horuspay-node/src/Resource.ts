import * as pluralize from 'pluralize';
import { InvalidRequest } from './Error';
import { HorusPay } from './HorusPay';
import { HorusPayObject } from './HorusPayObject';
import { Requestor } from './Requestor';
import { arrayToHorusPayObject } from './Util';

/**
 * Class Resource
 */
export class Resource extends HorusPayObject {
    protected static requestor: Requestor;
    protected static ressourceName = 'Resource';
    protected static pathPrefix = '';

    /**
     * Set requestor
     * @param {Requestor} req
     */
    static setRequestor(req: Requestor) {
        Resource.requestor = req;
    }

    /**
     * Return the requestor
     * @returns {Requestor}
     */
    static getRequestor() {
        return Resource.requestor || new Requestor();
    }

    /**
     * Return class name
     * @returns {string}
     */
    static className(): string {
        return this.ressourceName.toLowerCase();
    }

    /**
     * Return the class path
     * @return {string}
     */
    static classPath(): string {
        let base = this.className();
        let plural = pluralize(base);
        let prefix = this.pathPrefix || '';

        return `${prefix}/${plural}`;
    }

    /**
     * Return the resource path
     * @param {number|string} id
     * @returns {string}
     */
    static resourcePath(id: number | string) {
        if (id === null) {
            let klass = this.className();
            let message = `Could not determine which URL to request: ${klass} instance has invalid ID: ${id}`;

            throw new InvalidRequest(message);
        }

        let base = this.classPath();
        let extn = encodeURI(`${id}`);

        return `${base}/${extn}`;
    }

    /**
     * Return the instance url
     * @returns {string}
     */
    instanceUrl() {
        return (<any>this).constructor.resourcePath(this.id);
    }

    /**
     * Validate params
     * @param {Object|null} params
     */
    protected static _validateParams(params = null) {
        if (params && typeof params != 'object') {
            let message = `You must pass an object as the first argument to HorusPay API
            method calls.  (HINT: an example call to create a customer
            would be: Customer.create({'firstname': 'toto',
            'lastname': 'zoro', 'email': 'admin@gmail.com', 'phone': '66666666'})`;
            throw new InvalidRequest(message);
        }
    }

    /**
     * Send static request
     * @param {string} method
     * @param {string} url
     * @param {Object|null} params
     * @param {Object|null} headers
     * @returns {Promise<any>}
     */
    protected static _staticRequest(
        method: string,
        url: string,
        params: any = {},
        headers: any = {}
    ) {
        return Resource.getRequestor().request(method, url, params, headers)
            .then(response => {
                let options = {
                    'apiVersion': HorusPay.getApiVersion(),
                    'environment': HorusPay.getEnvironment()
                };

                return { data: response.data, options };
            });
    }

    /**
     * Retrieve resource
     * @param {string|number} id
     * @param {Object|null} params
     * @param {Object|null} headers
     */
    protected static _retrieve(
        id: any,
        params: any = {},
        headers: any = {}
    ): Promise<HorusPayObject> {
        let url = this.resourcePath(id);
        let className = this.className();

        return this._staticRequest('get', url, params, headers)
            .then(({ data, options }) => {
                let object = <HorusPayObject>arrayToHorusPayObject(data, options);

                return <HorusPayObject>object[className];
            });
    }

    /**
     * Send list resource request
     * @param {Object|null} params
     * @param {Object|null} headers
     * @returns {Promise<HorusPayObject|HorusPayObject[]>}
     */
    protected static _all(
        params = {},
        headers = {}
    ): Promise<HorusPayObject|HorusPayObject[]> {
        this._validateParams(params);

        let path = this.classPath();

        return this._staticRequest('get', path, params, headers)
            .then(({ data, options }) => {
                return arrayToHorusPayObject(data, options);
            })
    }

    /**
     * Send create resource request
     * @param {Object|null} params
     * @param {Object|null} headers
     * @returns {Promise<HorusPayObject>}
     */
    protected static _create(
        params: any,
        headers: any
    ): Promise<HorusPayObject> {
        this._validateParams(params);
        let url = this.classPath();
        let className = this.className();

        return this._staticRequest('post', url, params, headers)
            .then(({ data, options }) => {
                let object = <HorusPayObject>arrayToHorusPayObject(data, options);

                return <HorusPayObject>object[className];
            });
    }

    /**
     * Send update resource request
     * @param {string|number} id
     * @param {Object|null} params
     * @param {Object|null} headers
     * @returns {Promise<HorusPayObject>}
     */
    protected static _update(
        id,
        params: any,
        headers: any
    ): Promise<HorusPayObject> {
        this._validateParams(params);
        let url = this.resourcePath(id);
        let className = this.className();

        return this._staticRequest('put', url, params, headers)
            .then(({ data, options }) => {
                let object = <HorusPayObject>arrayToHorusPayObject(data, options);

                return <HorusPayObject>object[className];
            });
    }

    /**
     * Send delete resource request
     * @param {Object|null} headers
     * @returns {Promise<HorusPayObject>}
     */
    protected _delete(headers: any): Promise<HorusPayObject> {
        let url = this.instanceUrl();
        return Resource._staticRequest('delete', url, [], headers)
            .then(({ data, options }) => {
                return this;
            });
    }

    /**
     * Send create or update resource request
     * @param {Object|null} headers
     * @returns {Promise<HorusPayObject>}
     */
    protected _save(headers: any): Promise<HorusPayObject> {
        let params = this.serializeParameters();
        let className = Resource.className();
        let url = this.instanceUrl();

        return Resource._staticRequest('PUT', url, params, headers)
            .then(({ data, options }) => {
                let klass = `${options.apiVersion} / ${className}`;
                let json = data[klass];

                this.refreshFrom(json, options);

                return this;
            });
    }
}
