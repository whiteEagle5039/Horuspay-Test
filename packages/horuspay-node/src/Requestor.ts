import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ApiConnectionError } from './Error';
import { HorusPay } from './HorusPay';

export interface RequestInterceptor {
    callback: (value: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;
    onRejected?: (error: any) => any
};

/**
* Class Requestor
*/
export class Requestor {
    static SANDBOX_BASE = 'https://sandbox.horuspay.africa';
    static PRODUCTION_BASE = 'https://api.horuspay.africa';
    static DEVELOPMENT_BASE = 'https://dev-api.horuspay.africa';

    protected static httpClient: AxiosInstance;
    protected static requestInterceptors: RequestInterceptor[] = [];

    /**
     * Set the http client instance
     * @param {AxiosInstance} client
     */
    static setHttpClient(client: AxiosInstance) {
        Requestor.httpClient = client;
    }

    /**
     * Return the httpClient
     * @returns {AxiosInstance}
     */
    private httpClient(): AxiosInstance {
        if (!Requestor.httpClient) {
            let options = {};

            if (HorusPay.getVerifySslCerts()) {
                // TODO Set ca bundle file to the request
            }

            Requestor.httpClient = axios.create(options);
            this.applyRequestInterceptors(Requestor.httpClient);
        }

        return Requestor.httpClient;
    }

    /**
     * Add a request interceptor
     * @param {RequestInterceptor} interceptor
     */
    static addRequestInterceptor(interceptor: RequestInterceptor) {
        this.requestInterceptors.push(interceptor);
    }

    /**
     * Apply request interceptors
     * @param {AxiosInstance} httpClient
     */
    private applyRequestInterceptors(httpClient: AxiosInstance) {
        Requestor.requestInterceptors.forEach(interceptor => {
            httpClient.interceptors.request.use(
                interceptor.callback, interceptor.onRejected
            );
        })
    }

    /**
     * Send request
     * @param {string} method
     * @param {string} path
     * @param {Object} params
     * @param {Object} headers
     *
     * @returns {Promise<AxiosResponse<any>>}
     */
    request(
        method: string,
        path: string,
        params = {},
        headers = {}
    ): Promise<AxiosResponse<any>> {
        let url = this.url(path);
        method = method.toUpperCase();
        headers = Object.assign(this.defaultHeaders(), headers);

        let requestConfig: AxiosRequestConfig = {
            method,
            url,
            headers,
            responseType: 'json'
        }

        if (['GET', 'HEAD', 'DELETE'].indexOf(method) > -1) {
            requestConfig['params'] = params;
        } else {
            requestConfig['data'] = params;
        }

        return this.httpClient().request(requestConfig)
            .catch(this.handleRequestException);
    }

    /**
     * Return base url
     * @returns {string}
     */
    protected baseUrl(): string {
        // 1. Explicit setApiBase() takes highest priority
        const apiBase = HorusPay.getApiBase();
        if (apiBase) {
            return apiBase;
        }

        // 2. Environment variable override
        const envBase = typeof process !== 'undefined' && process.env?.HORUSPAY_API_BASE;
        if (envBase) {
            return envBase;
        }

        // 3. Default based on environment setting
        const environment = HorusPay.getEnvironment();
        switch (environment) {
            case 'development':
            case 'dev':
                return Requestor.DEVELOPMENT_BASE;
            case 'sandbox':
            case 'test':
            case null:
                return Requestor.SANDBOX_BASE;
            case 'production':
            case 'live':
                return Requestor.PRODUCTION_BASE;
        }
    }

    /**
     * Handle request exception
     * @param {any} e
     * @returns {Promise<ApiConnectionError>}
     */
    protected handleRequestException(e: any) {
        let message = `Request error: ${e.message}`;
        let httpStatusCode = e.response ? e.response.status : null;
        let httpRequest = e.request;
        let httpResponse = e.response;

        return Promise.reject(new ApiConnectionError(
            message,
            httpStatusCode,
            httpRequest,
            httpResponse
        ));
    }

    /**
     * Return the url
     * @param {string} path
     */
    protected url(path = '') {
        return `${this.baseUrl()}/${HorusPay.getApiVersion()}${path}`;
    }

    /**
     * Return default headers
     * @returns {Object}
     */
    protected defaultHeaders() {
        const apiKey = HorusPay.getApiKey();
        const token = apiKey || HorusPay.getToken();
        const accountId = HorusPay.getAccountId();

        let _default: any = {
            'X-Version': HorusPay.VERSION,
            'X-Source': 'HorusPay NodeLib',
            'Authorization': 'Bearer ' + token
        };

        // Only send HorusPay-Account header when using a JWT token (not API Key).
        // API Keys are already bound to an account server-side.
        if (!apiKey && accountId) {
            _default['HorusPay-Account'] = accountId;
        }

        return _default;
    }
}
