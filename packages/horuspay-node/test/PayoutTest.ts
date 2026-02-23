import 'mocha';
import { expect } from 'chai';
import * as nock from 'nock';
import { Payout, HorusPayObject } from '../src';
import { exceptRequest, setUp, tearDown } from './utils';

describe('PayoutTest', () => {

    beforeEach(setUp);
    afterEach(tearDown);

    it('should return payouts', async () => {
        let body = {
            'v1/payouts': [{
                'id': 1,
                'klass': 'v1/payout',
                'amount': 100,
                'currency': 'XOF',
                'mode': 'mtn_open',
                'status': 'pending',
                'customer_id': 1,
                'created_at': '2026-01-12T09:09:03.969Z',
                'updated_at': '2026-01-12T09:09:03.969Z'
            }],
            'meta': { 'page': 1 }
        };

        nock(/horuspay\.africa/)
            .get('/v1/accounts/payouts')
            .reply(200, body);

        let object = await Payout.all();

        exceptRequest({
            url: 'https://sandbox.horuspay.africa/v1/accounts/payouts',
            method: 'get'
        });

        expect(object).to.be.instanceof(HorusPayObject);
        expect(object.payouts[0]).to.be.instanceof(Payout);
        expect(object.payouts[0].id).to.equal(1);
        expect(object.payouts[0].amount).to.equal(100);
        expect(object.payouts[0].mode).to.equal('mtn_open');
    });

    it('should create a payout', async () => {
        let data = {
            'amount': 100,
            'currency': 'XOF',
            'mode': 'mtn_open',
            'callback_url': 'https://merchant.test/callbacks/tx',
            'customer': {
                'firstname': 'dakin',
                'lastname': 'test',
                'email': 'awaqq@example.com',
                'country_code': 'BJ',
                'phone': {
                    'number': '+2290167462549',
                    'country': 'bj',
                    'network': 'mtn_open'
                }
            }
        };

        let body = {
            'v1/payout': {
                'id': 1,
                'klass': 'v1/payout',
                'amount': data.amount,
                'currency': data.currency,
                'mode': data.mode,
                'status': 'pending',
                'created_at': '2026-01-12T09:09:03.969Z',
                'updated_at': '2026-01-12T09:09:03.969Z'
            }
        };

        nock(/horuspay\.africa/)
            .post('/v1/accounts/payouts')
            .reply(200, body);

        let payout = await Payout.create(data);

        exceptRequest({
            url: 'https://sandbox.horuspay.africa/v1/accounts/payouts',
            data: JSON.stringify(data),
            method: 'post'
        });

        expect(payout).to.be.instanceof(Payout);
        expect(payout.id).to.equal(1);
        expect(payout.amount).to.equal(100);
        expect(payout.mode).to.equal('mtn_open');
    });

    it('should trigger payout transfer', async () => {
        let body: any = {
            'v1/payout': {
                'id': 1,
                'klass': 'v1/payout',
                'amount': 100,
                'status': 'pending',
                'created_at': '2026-01-12T09:09:03.969Z',
                'updated_at': '2026-01-12T09:09:03.969Z'
            }
        };

        nock(/horuspay\.africa/)
            .post('/v1/accounts/payouts')
            .reply(200, body);

        let payout = await Payout.create({ amount: 100 });

        body = { 'message': 'transfer initiated' };
        nock(/horuspay\.africa/)
            .post('/v1/accounts/payouts/1/pay')
            .reply(200, body);

        const result = await payout.pay();

        exceptRequest({
            url: 'https://sandbox.horuspay.africa/v1/accounts/payouts/1/pay',
            method: 'post'
        });

        expect(result).to.be.instanceof(HorusPayObject);
        expect(result.message).to.equal('transfer initiated');
    });
});
