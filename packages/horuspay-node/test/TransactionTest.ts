import 'mocha';
import { expect } from 'chai';
import * as nock from 'nock';
import { Transaction, HorusPayObject } from '../src';
import { exceptRequest, setUp, tearDown } from './utils';

describe('TransactionTest', () => {

    beforeEach(setUp);
    afterEach(tearDown);

    it('should return transactions', async () => {
        let body = {
            'v1/transactions': [{
                'id': 1,
                'klass': 'v1/transaction',
                'reference': '109329828',
                'amount': 100,
                'currency': 'XOF',
                'callback_url': 'https://merchant.test/callbacks/tx',
                'status': 'pending',
                'customer_id': 1,
                'mode': 'mtn_open',
                'created_at': '2026-01-12T09:09:03.969Z',
                'updated_at': '2026-01-12T09:09:03.969Z'
            }],
            'meta': { 'page': 1 }
        };

        nock(/horuspay\.africa/)
            .get('/v1/accounts/transactions')
            .reply(200, body);

        let object = await Transaction.all();

        exceptRequest({
            url: 'https://sandbox.horuspay.africa/v1/accounts/transactions',
            method: 'get'
        });

        expect(object).to.be.instanceof(HorusPayObject);
        expect(object.meta).to.be.instanceof(HorusPayObject);
        expect(object.transactions[0]).to.be.instanceof(Transaction);
        expect(object.transactions[0].id).to.equal(1);
        expect(object.transactions[0].klass).to.equal('v1/transaction');
        expect(object.transactions[0].reference).to.equal('109329828');
        expect(object.transactions[0].amount).to.equal(100);
        expect(object.transactions[0].currency).to.equal('XOF');
        expect(object.transactions[0].status).to.equal('pending');
        expect(object.transactions[0].customer_id).to.equal(1);
        expect(object.transactions[0].mode).to.equal('mtn_open');
    });

    it('should retrieve a transaction', async () => {
        let body = {
            'v1/transaction': {
                'id': 1,
                'klass': 'v1/transaction',
                'reference': '109329828',
                'amount': 100,
                'currency': 'XOF',
                'callback_url': 'https://merchant.test/callbacks/tx',
                'status': 'pending',
                'customer_id': 1,
                'mode': 'mtn_open',
                'created_at': '2026-01-12T09:09:03.969Z',
                'updated_at': '2026-01-12T09:09:03.969Z'
            }
        };

        nock(/horuspay\.africa/)
            .get('/v1/accounts/transactions/1')
            .reply(200, body);

        let transaction = await Transaction.retrieve(1);

        exceptRequest({
            url: 'https://sandbox.horuspay.africa/v1/accounts/transactions/1',
            method: 'get'
        });

        expect(transaction).to.be.instanceof(HorusPayObject);
        expect(transaction).to.be.instanceof(Transaction);
        expect(transaction.id).to.equal(1);
        expect(transaction.reference).to.equal('109329828');
        expect(transaction.amount).to.equal(100);
    });

    it('should create transaction', async () => {
        let data = {
            'amount': 100,
            'currency': 'XOF',
            'callback_url': 'https://google.com',
            'customer_id': 10
        };

        let body = {
            'v1/transaction': {
                'id': 1,
                'klass': 'v1/transaction',
                'reference': '109329828',
                'amount': data.amount,
                'currency': data.currency,
                'callback_url': data.callback_url,
                'status': 'pending',
                'customer_id': data.customer_id,
                'mode': 'mtn_open',
                'created_at': '2026-01-12T09:09:03.969Z',
                'updated_at': '2026-01-12T09:09:03.969Z'
            }
        };

        nock(/horuspay\.africa/)
            .post('/v1/accounts/transactions')
            .reply(200, body);

        let transaction = await Transaction.create(data);

        exceptRequest({
            url: 'https://sandbox.horuspay.africa/v1/accounts/transactions',
            data: JSON.stringify(data),
            method: 'post'
        });

        expect(transaction).to.be.instanceof(HorusPayObject);
        expect(transaction).to.be.instanceof(Transaction);
        expect(transaction.id).to.equal(1);
        expect(transaction.amount).to.equal(100);
        expect(transaction.currency).to.equal('XOF');
        expect(transaction.status).to.equal('pending');
        expect(transaction.customer_id).to.equal(10);
    });

    it('should update transaction', async () => {
        let data = {
            'amount': 200,
            'currency': 'XOF'
        };

        let body = {
            'v1/transaction': {
                'id': 1,
                'klass': 'v1/transaction',
                'reference': '109329828',
                'amount': data.amount,
                'currency': data.currency,
                'status': 'pending',
                'created_at': '2026-01-12T09:09:03.969Z',
                'updated_at': '2026-01-12T09:09:03.969Z'
            }
        };

        nock(/horuspay\.africa/)
            .put('/v1/accounts/transactions/1')
            .reply(200, body);

        let transaction = await Transaction.update(1, data);

        exceptRequest({
            url: 'https://sandbox.horuspay.africa/v1/accounts/transactions/1',
            data: JSON.stringify(data),
            method: 'put'
        });

        expect(transaction).to.be.instanceof(Transaction);
        expect(transaction.id).to.equal(1);
        expect(transaction.amount).to.equal(200);
    });

    it('should delete transaction', async () => {
        let body = {
            'v1/transaction': {
                'id': 1,
                'klass': 'v1/transaction',
                'reference': '109329828',
                'amount': 100,
                'status': 'pending',
                'created_at': '2026-01-12T09:09:03.969Z',
                'updated_at': '2026-01-12T09:09:03.969Z'
            }
        };

        nock(/horuspay\.africa/)
            .post('/v1/accounts/transactions')
            .reply(200, body);

        let transaction = await Transaction.create({ amount: 100 });

        nock(/horuspay\.africa/)
            .delete('/v1/accounts/transactions/1')
            .reply(200);

        await transaction.delete();

        exceptRequest({
            url: 'https://sandbox.horuspay.africa/v1/accounts/transactions/1',
            method: 'delete'
        });
    });

    it('should generate transaction token', async () => {
        let body: any = {
            'v1/transaction': {
                'id': 1,
                'klass': 'v1/transaction',
                'reference': '109329828',
                'amount': 100,
                'status': 'pending',
                'created_at': '2026-01-12T09:09:03.969Z',
                'updated_at': '2026-01-12T09:09:03.969Z'
            }
        };

        nock(/horuspay\.africa/)
            .post('/v1/accounts/transactions')
            .reply(200, body);

        let transaction = await Transaction.create({ amount: 100 });

        body = {
            'token': 'PAYMENT_TOKEN',
            'url': 'https://pay.horuspay.com/PAYMENT_TOKEN'
        };
        nock(/horuspay\.africa/)
            .post('/v1/accounts/transactions/1/generate_token')
            .reply(200, body);

        const tokenObject = await transaction.generateToken();

        exceptRequest({
            url: 'https://sandbox.horuspay.africa/v1/accounts/transactions/1/generate_token',
            method: 'post'
        });

        expect(tokenObject).to.be.instanceof(HorusPayObject);
        expect(tokenObject.token).to.equal('PAYMENT_TOKEN');
        expect(tokenObject.url).to.equal('https://pay.horuspay.com/PAYMENT_TOKEN');
    });

    it('should pay transaction', async () => {
        let body: any = {
            'v1/transaction': {
                'id': 1,
                'klass': 'v1/transaction',
                'reference': '109329828',
                'amount': 100,
                'status': 'pending',
                'created_at': '2026-01-12T09:09:03.969Z',
                'updated_at': '2026-01-12T09:09:03.969Z'
            }
        };

        nock(/horuspay\.africa/)
            .post('/v1/accounts/transactions')
            .reply(200, body);

        let transaction = await Transaction.create({ amount: 100 });

        body = { 'message': 'success' };
        nock(/horuspay\.africa/)
            .post('/v1/accounts/transactions/1/pay')
            .reply(200, body);

        const result = await transaction.pay();

        exceptRequest({
            url: 'https://sandbox.horuspay.africa/v1/accounts/transactions/1/pay',
            method: 'post'
        });

        expect(result).to.be.instanceof(HorusPayObject);
        expect(result.message).to.equal('success');
    });

    it('should refund transaction', async () => {
        let body: any = {
            'v1/transaction': {
                'id': 1,
                'klass': 'v1/transaction',
                'reference': '109329828',
                'amount': 100,
                'status': 'approved',
                'created_at': '2026-01-12T09:09:03.969Z',
                'updated_at': '2026-01-12T09:09:03.969Z'
            }
        };

        nock(/horuspay\.africa/)
            .post('/v1/accounts/transactions')
            .reply(200, body);

        let transaction = await Transaction.create({ amount: 100 });

        body = { 'message': 'refund initiated' };
        nock(/horuspay\.africa/)
            .post('/v1/accounts/transactions/1/refund')
            .reply(200, body);

        const result = await transaction.refund();

        exceptRequest({
            url: 'https://sandbox.horuspay.africa/v1/accounts/transactions/1/refund',
            method: 'post'
        });

        expect(result).to.be.instanceof(HorusPayObject);
        expect(result.message).to.equal('refund initiated');
    });

    it('should check wasPaid', () => {
        let tx = new Transaction();
        tx.status = 'approved';
        expect(tx.wasPaid()).to.be.true;

        tx.status = 'pending';
        expect(tx.wasPaid()).to.be.false;

        tx.status = 'refunded';
        expect(tx.wasPaid()).to.be.true;
    });
});
