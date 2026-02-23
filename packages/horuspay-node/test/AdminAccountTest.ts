import 'mocha';
import { expect } from 'chai';
import * as nock from 'nock';
import { AdminAccount, HorusPayObject } from '../src';
import { exceptRequest, setUp, tearDown } from './utils';

describe('AdminAccountTest', () => {

    beforeEach(setUp);
    afterEach(tearDown);

    it('should list admin accounts', async () => {
        let body = {
            'v1/accounts': [{
                'id': 1,
                'klass': 'v1/account',
                'name': 'Shop Test',
                'email': 'shop@test.com',
                'status': 'active',
                'blocked': false,
                'created_at': '2026-01-12T09:09:03.969Z',
                'updated_at': '2026-01-12T09:09:03.969Z'
            }],
            'meta': { 'page': 1 }
        };

        nock(/horuspay\.africa/)
            .get('/v1/admin/accounts')
            .reply(200, body);

        let object = await AdminAccount.all();

        exceptRequest({
            url: 'https://sandbox.horuspay.africa/v1/admin/accounts',
            method: 'get'
        });

        expect(object).to.be.instanceof(HorusPayObject);
    });

    it('should block an account', async () => {
        let data = {
            'blocked_reason': {
                'rccm': 'Document invalide',
                'message': 'mettre a jour le nom'
            }
        };
        let body = { 'message': 'Account blocked' };

        nock(/horuspay\.africa/)
            .post('/v1/admin/accounts/1/block')
            .reply(200, body);

        let result = await AdminAccount.block(1, data);

        exceptRequest({
            url: 'https://sandbox.horuspay.africa/v1/admin/accounts/1/block',
            data: JSON.stringify(data),
            method: 'post'
        });

        expect(result).to.be.instanceof(HorusPayObject);
        expect(result.message).to.equal('Account blocked');
    });

    it('should unblock an account', async () => {
        let body = { 'message': 'Account unblocked' };

        nock(/horuspay\.africa/)
            .post('/v1/admin/accounts/1/unblock')
            .reply(200, body);

        let result = await AdminAccount.unblock(1);

        exceptRequest({
            url: 'https://sandbox.horuspay.africa/v1/admin/accounts/1/unblock',
            method: 'post'
        });

        expect(result).to.be.instanceof(HorusPayObject);
        expect(result.message).to.equal('Account unblocked');
    });

    it('should validate an account', async () => {
        let data = { 'statut': 'active' };
        let body = { 'message': 'Account validated' };

        nock(/horuspay\.africa/)
            .post('/v1/admin/accounts/1/validate')
            .reply(200, body);

        let result = await AdminAccount.validate(1, data);

        exceptRequest({
            url: 'https://sandbox.horuspay.africa/v1/admin/accounts/1/validate',
            data: JSON.stringify(data),
            method: 'post'
        });

        expect(result).to.be.instanceof(HorusPayObject);
        expect(result.message).to.equal('Account validated');
    });
});
