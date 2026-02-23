import 'mocha';
import { expect } from 'chai';
import * as nock from 'nock';
import { ApiConnectionError, HorusPay, Requestor } from '../src';
import { setUp, tearDown } from './utils';

describe('RequestorTest', () => {

    beforeEach(setUp);
    afterEach(tearDown);

    it('should have request default params', async () => {
        nock(/horuspay\.africa/)
            .get('/v1/path')
            .query({ 'foo': '2' })
            .reply(500, {});

        let requestor = new Requestor();

        try {
            await requestor.request('get', '/path', { 'foo': '2' }, { 'X-Custom': 'foo' });
        } catch (e) {
            expect(e).to.be.an.instanceof(ApiConnectionError)
            expect(e.httpStatus).to.equal(500);
            expect(e.httpResponse).to.not.be.null;
            expect(e.httpRequest).to.not.be.null;
            expect(e.httpResponse.config.url).to.equal('https://sandbox.horuspay.africa/v1/path');
            expect(e.httpResponse.config.params).to.deep.equal({ foo: '2' });
            expect(e.httpResponse.config.method).to.equal('get');
            expect(e.httpRequest.getHeader('Authorization')).to.equal('Bearer sk_test_123');
            expect(e.httpRequest.getHeader('X-Version')).to.equal(HorusPay.VERSION);
            expect(e.httpRequest.getHeader('X-Source')).to.equal('HorusPay NodeLib');
            expect(e.httpRequest.getHeader('X-Custom')).to.equal('foo');
        }
    });

    it('should not send HorusPay-Account header when using API key', async () => {
        HorusPay.setAccountId(898);

        nock(/horuspay\.africa/)
            .get('/v1/path')
            .reply(500, {});

        let requestor = new Requestor();

        try {
            await requestor.request('get', '/path');
        } catch (e) {
            expect(e).to.be.an.instanceof(ApiConnectionError);
            expect(e.httpRequest.getHeader('Authorization')).to.equal('Bearer sk_test_123');
            expect(e.httpRequest.getHeader('HorusPay-Account')).to.be.undefined;
        }
    });

    it('should send HorusPay-Account header when using JWT token', async () => {
        HorusPay.setApiKey(null);
        HorusPay.setToken('mytoken');
        HorusPay.setAccountId(898);
        HorusPay.setApiVersion('v3');
        HorusPay.setEnvironment('production');

        nock(/horuspay\.africa/)
            .get('/v3/path')
            .query({ 'foo': '2' })
            .reply(500, {});

        let requestor = new Requestor();

        try {
            await requestor.request('get', '/path', { 'foo': '2' }, { 'X-Custom': 'foo' });
        } catch (e) {
            expect(e).to.be.an.instanceof(ApiConnectionError)
            expect(e.httpStatus).to.equal(500);
            expect(e.httpResponse).to.not.be.null;
            expect(e.httpRequest).to.not.be.null;
            expect(e.httpResponse.config.url).to.equal('https://api.horuspay.africa/v3/path');
            expect(e.httpResponse.config.params).to.deep.equal({ foo: '2' });
            expect(e.httpResponse.config.method).to.equal('get');
            expect(e.httpRequest.getHeader('Authorization')).to.equal('Bearer mytoken');
            expect(e.httpRequest.getHeader('X-Version')).to.equal(HorusPay.VERSION);
            expect(e.httpRequest.getHeader('X-Source')).to.equal('HorusPay NodeLib');
            expect(e.httpRequest.getHeader('X-Custom')).to.equal('foo');
            expect(e.httpRequest.getHeader('HorusPay-Account')).to.equal('898');
        }
    });

    it('should set request api base', async () => {
        HorusPay.setApiVersion('v1');
        HorusPay.setApiBase('https://test.horuspay.africa');

        nock(/horuspay\.africa/)
            .get('/v1/path')
            .query({ 'foo': '2' })
            .reply(500, {});

        let requestor = new Requestor();

        try {
            await requestor.request('get', '/path', { 'foo': '2' }, { 'X-Custom': 'foo' });
        } catch (e) {
            expect(e).to.be.an.instanceof(ApiConnectionError)
            expect(e.httpResponse.config.url).to.equal('https://test.horuspay.africa/v1/path');
        }
    });

    it('should use HORUSPAY_API_BASE env variable as base url', async () => {
        process.env.HORUSPAY_API_BASE = 'https://custom-api.horuspay.africa';

        nock(/horuspay\.africa/)
            .get('/v1/path')
            .reply(500, {});

        let requestor = new Requestor();

        try {
            await requestor.request('get', '/path');
        } catch (e) {
            expect(e).to.be.an.instanceof(ApiConnectionError);
            expect(e.httpResponse.config.url).to.equal('https://custom-api.horuspay.africa/v1/path');
        } finally {
            delete process.env.HORUSPAY_API_BASE;
        }
    });

    it('should prioritize setApiBase over HORUSPAY_API_BASE env variable', async () => {
        process.env.HORUSPAY_API_BASE = 'https://env-api.horuspay.africa';
        HorusPay.setApiBase('https://explicit-api.horuspay.africa');

        nock(/horuspay\.africa/)
            .get('/v1/path')
            .reply(500, {});

        let requestor = new Requestor();

        try {
            await requestor.request('get', '/path');
        } catch (e) {
            expect(e).to.be.an.instanceof(ApiConnectionError);
            expect(e.httpResponse.config.url).to.equal('https://explicit-api.horuspay.africa/v1/path');
        } finally {
            delete process.env.HORUSPAY_API_BASE;
        }
    });
});
