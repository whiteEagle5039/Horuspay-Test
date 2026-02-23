/**
 * Class HorusPay
 */
export class HorusPay {
    static readonly VERSION = '1.0.1';
    protected static apiKey: string;
    protected static apiBase: string;
    protected static token = '';
    protected static accountId: string|number = '';
    protected static environment = 'sandbox';
    protected static apiVersion = 'v1';
    protected static verifySslCerts = true;

    /**
     * Return the api key
     * @return {string}
     */
    static getApiKey()
    {
        return HorusPay.apiKey;
    }

    /**
     * Set api key
     * @param {string} apiKey
     */
    static setApiKey(apiKey: string) {
        HorusPay.apiKey = apiKey;
        HorusPay.token = '';
    }

    /**
     * Return the api base
     * @return {string}
     */
    static getApiBase()
    {
        return HorusPay.apiBase;
    }

    /**
     * Set api base
     * @param {string} apiBase
     */
    static setApiBase(apiBase: string) {
        HorusPay.apiBase = apiBase;
    }

    /**
     * Return the token
     * @returns {string}
     */
    static getToken()
    {
        return HorusPay.token;
    }

    /**
     * Set token
     * @param {string} token
     */
    static setToken(token: string) {
        HorusPay.token = token;
    }

    /**
     * Return the account id
     * @returns {string|number}
     */
    static getAccountId()
    {
        return HorusPay.accountId;
    }

    /**
     * Set the account id
     * @param {string|number} accountId
     */
    static setAccountId(accountId: string | number) {
        HorusPay.accountId = accountId;
    }

    /**
     * Set the environment
     * @param {string} value
     */
    static setEnvironment(value: string) {
        HorusPay.environment = value;
    }

    /**
     * Get the environment
     * @return {string}
     */
    static getEnvironment() {
        return HorusPay.environment;
    }

    /**
     * Return the api version
     * @return {string}
     */
    static getApiVersion() : string {
        return HorusPay.apiVersion;
    }

    /**
     * Set api version
     * @param {string} version
     */
    static setApiVersion(version: string) {
        HorusPay.apiVersion = version;
    }

    /**
     * @param {boolean} value The verify ssl certificates value.
     * @return {void}
     */
    static setVerifySslCerts(value: boolean) {
        HorusPay.verifySslCerts = value;
    }

    /**
     * @return {boolean} Determine if the request should verify SSL certificate.
     */
    static getVerifySslCerts() : boolean {
        return HorusPay.verifySslCerts;
    }
}
