import 'mocha';
import { expect } from 'chai';
import * as nock from 'nock';
import { PayoutRequest, HorusPayObject } from '../src';
import { exceptRequest, setUp, tearDown } from './utils';

describe('PayoutRequestTest', () => {

    beforeEach(setUp);
    afterEach(tearDown);

    it('should list payout requests', async () => {
        let body = {
            'v1/payout_requests': [{
                'id': 1,
                'klass': 'v1/payout_request',
                'status': 'pending',
                'created_at': '2026-01-12T09:09:03.969Z',
                'updated_at': '2026-01-12T09:09:03.969Z'
            }],
            'meta': { 'page': 1 }
        };

        nock(/horuspay\.africa/)
            .get('/v1/admin/payout_requests')
            .reply(200, body);

        let object = await PayoutRequest.all();

        exceptRequest({
            url: 'https://sandbox.horuspay.africa/v1/admin/payout_requests',
            method: 'get'
        });

        expect(object).to.be.instanceof(HorusPayObject);
    });

    it('should approve a payout request', async () => {
        let body = { 'message': 'Payout request approved' };

        nock(/horuspay\.africa/)
            .post('/v1/admin/payout_requests/1/approve')
            .reply(200, body);

        let result = await PayoutRequest.approve(1);

        exceptRequest({
            url: 'https://sandbox.horuspay.africa/v1/admin/payout_requests/1/approve',
            method: 'post'
        });

        expect(result).to.be.instanceof(HorusPayObject);
        expect(result.message).to.equal('Payout request approved');
    });

    it('should cancel a payout request', async () => {
        let body = { 'message': 'Payout request cancelled' };

        nock(/horuspay\.africa/)
            .post('/v1/admin/payout_requests/1/cancel')
            .reply(200, body);

        let result = await PayoutRequest.cancel(1);

        exceptRequest({
            url: 'https://sandbox.horuspay.africa/v1/admin/payout_requests/1/cancel',
            method: 'post'
        });

        expect(result).to.be.instanceof(HorusPayObject);
        expect(result.message).to.equal('Payout request cancelled');
    });
});
