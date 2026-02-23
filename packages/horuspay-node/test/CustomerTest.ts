import 'mocha';
import { expect } from 'chai';
import * as nock from 'nock';
import { ApiConnectionError, Customer, HorusPayObject } from '../src';
import { exceptRequest, setUp, tearDown } from './utils';

describe('CustomerTest', () => {

    beforeEach(setUp);
    afterEach(tearDown);

    it('should return customers', async () => {
        let body = {
            'v1/customers': [{
                'id': 1,
                'klass': 'v1/customer',
                'firstname': 'Marie',
                'lastname': 'Durand',
                'email': 'marie.durand@example.com',
                'country_code': 'BJ',
                'phone_prefix': '+229',
                'phone_number': '67462549',
                'created_at': '2026-01-12T09:09:03.969Z',
                'updated_at': '2026-01-12T09:09:03.969Z'
            }],
            'meta': { 'page': 1 }
        };

        nock(/horuspay\.africa/)
            .get('/v1/accounts/customers')
            .reply(200, body);

        let object = await Customer.all();

        exceptRequest({
            url: 'https://sandbox.horuspay.africa/v1/accounts/customers',
            method: 'get'
        });
        expect(object).to.be.instanceof(HorusPayObject);
        expect(object.meta).to.be.instanceof(HorusPayObject);
        expect(object.customers[0]).to.be.instanceof(Customer);
        expect(object.customers[0].firstname).to.equal('Marie');
        expect(object.customers[0].lastname).to.equal('Durand');
        expect(object.customers[0].email).to.equal('marie.durand@example.com');
        expect(object.customers[0].country_code).to.equal('BJ');
    });

    it('should fail customer creation', async () => {
        let data = {'firstname': 'Myfirstname' };
        let body = {
            'message': 'Customer creation failed',
            'errors': {
                'lastname': ['lastname field required']
            }
        };

        nock(/horuspay\.africa/)
            .post('/v1/accounts/customers')
            .reply(500, body);

        try {
            await Customer.create(data);
        } catch (e) {
            exceptRequest({
                url: 'https://sandbox.horuspay.africa/v1/accounts/customers',
                data: JSON.stringify(data),
                method: 'post'
            });
            expect(e).to.be.instanceof(ApiConnectionError);
            expect(e.hasErrors()).to.be.true;
            expect(e.errorMessage).to.not.be.null;
            expect(e.errors).to.have.keys('lastname');
        }
    });

    it('should create a customer', async () => {
        let data = {
            'firstname': 'Marie',
            'lastname': 'Durand',
            'email': 'marie.durand@example.com',
            'country_code': 'BJ',
            'phone_prefix': '+229',
            'phone_number': '67462549'
        };

        let body = {
            'v1/customer': {
                'id': 1,
                'klass': 'v1/customer',
                'firstname': data.firstname,
                'lastname': data.lastname,
                'email': data.email,
                'country_code': data.country_code,
                'phone_prefix': data.phone_prefix,
                'phone_number': data.phone_number,
                'created_at': '2026-01-12T09:09:03.969Z',
                'updated_at': '2026-01-12T09:09:03.969Z'
            }
        };

        nock(/horuspay\.africa/)
            .post('/v1/accounts/customers')
            .reply(200, body);

        let customer = await Customer.create(data);

        exceptRequest({
            url: 'https://sandbox.horuspay.africa/v1/accounts/customers',
            data: JSON.stringify(data),
            method: 'post'
        });
        expect(customer).to.be.instanceof(Customer);
        expect(customer.firstname).to.equal(data.firstname);
        expect(customer.lastname).to.equal(data.lastname);
        expect(customer.email).to.equal(data.email);
        expect(customer.id).to.equal(1);
    });

    it('should retrieve a customer', async () => {
        let body = {
            'v1/customer': {
                'id': 1,
                'klass': 'v1/customer',
                'firstname': 'Marie',
                'lastname': 'Durand',
                'email': 'marie.durand@example.com',
                'created_at': '2026-01-12T09:09:03.969Z',
                'updated_at': '2026-01-12T09:09:03.969Z'
            }
        };

        nock(/horuspay\.africa/)
            .get('/v1/accounts/customers/1')
            .reply(200, body);

        let customer = await Customer.retrieve(1);

        exceptRequest({
            url: 'https://sandbox.horuspay.africa/v1/accounts/customers/1',
            method: 'get'
        });
        expect(customer).to.be.instanceof(Customer);
        expect(customer.firstname).to.equal('Marie');
        expect(customer.id).to.equal(1);
    });

    it('should update a customer', async () => {
        let data = {
            'firstname': 'Awa',
            'lastname': 'Diop'
        };

        let body = {
            'v1/customer': {
                'id': 1,
                'klass': 'v1/customer',
                'firstname': data.firstname,
                'lastname': data.lastname,
                'email': 'marie.durand@example.com',
                'created_at': '2026-01-12T09:09:03.969Z',
                'updated_at': '2026-01-12T09:09:03.969Z'
            }
        };

        nock(/horuspay\.africa/)
            .put('/v1/accounts/customers/1')
            .reply(200, body);

        let customer = await Customer.update(1, data);

        exceptRequest({
            url: 'https://sandbox.horuspay.africa/v1/accounts/customers/1',
            data: JSON.stringify(data),
            method: 'put'
        });
        expect(customer).to.be.instanceof(Customer);
        expect(customer.firstname).to.equal('Awa');
        expect(customer.lastname).to.equal('Diop');
        expect(customer.id).to.equal(1);
    });

    it('should delete customer', async () => {
        let body = {
            'v1/customer': {
                'id': 1,
                'klass': 'v1/customer',
                'firstname': 'Marie',
                'lastname': 'Durand',
                'created_at': '2026-01-12T09:09:03.969Z',
                'updated_at': '2026-01-12T09:09:03.969Z'
            }
        };

        nock(/horuspay\.africa/)
            .post('/v1/accounts/customers')
            .reply(200, body);

        let customer = await Customer.create({ firstname: 'Marie', lastname: 'Durand' });

        nock(/horuspay\.africa/)
            .delete('/v1/accounts/customers/1')
            .reply(200);

        await customer.delete();

        exceptRequest({
            url: 'https://sandbox.horuspay.africa/v1/accounts/customers/1',
            method: 'delete'
        });
    });
});
