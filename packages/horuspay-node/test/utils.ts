import { InternalAxiosRequestConfig } from 'axios';
import { expect } from 'chai';
import { HorusPay, Requestor } from '../src';

const API_KEY = 'sk_test_123';
let lastRequestConfig: InternalAxiosRequestConfig;

Requestor.addRequestInterceptor({
    callback: (config: InternalAxiosRequestConfig) =>  {
        lastRequestConfig = config
        return config;
    }
});

export function setUp() {
    HorusPay.setApiKey(API_KEY);
}

export function tearDown() {
    HorusPay.setApiKey(null);
    HorusPay.setApiBase(null);
    HorusPay.setApiVersion('v1');
    HorusPay.setEnvironment('sandbox');
    HorusPay.setToken(null);
    HorusPay.setAccountId(null);
    HorusPay.setVerifySslCerts(true);
    Requestor.setHttpClient(null);
}

export function exceptRequest(config: Partial<InternalAxiosRequestConfig>) {
    expect(lastRequestConfig).to.include(config);
}
