import 'mocha';
import { expect } from 'chai';
import * as nock from 'nock';
import { Auth, HorusPayObject } from '../src';
import { exceptRequest, setUp, tearDown } from './utils';

describe('AuthTest', () => {

    beforeEach(setUp);
    afterEach(tearDown);

    it('should login', async () => {
        let data = { 'email': 'user@test.com', 'password': 'secret' };
        let body = { 'token': 'jwt_token_123', 'user': { 'id': 1, 'email': 'user@test.com' } };

        nock(/horuspay\.africa/)
            .post('/v1/auth/sessions')
            .reply(200, body);

        let result = await Auth.login(data);

        exceptRequest({
            url: 'https://sandbox.horuspay.africa/v1/auth/sessions',
            data: JSON.stringify(data),
            method: 'post'
        });

        expect(result).to.be.instanceof(HorusPayObject);
        expect(result.token).to.equal('jwt_token_123');
    });

    it('should register', async () => {
        let data = {
            'email': 'newuser@test.com',
            'password': 'secret',
            'password_confirmation': 'secret',
            'fullname': 'New User'
        };
        let body = { 'message': 'Registration successful' };

        nock(/horuspay\.africa/)
            .post('/v1/auth/registrations')
            .reply(200, body);

        let result = await Auth.register(data);

        exceptRequest({
            url: 'https://sandbox.horuspay.africa/v1/auth/registrations',
            data: JSON.stringify(data),
            method: 'post'
        });

        expect(result).to.be.instanceof(HorusPayObject);
        expect(result.message).to.equal('Registration successful');
    });

    it('should get profile', async () => {
        let body = { 'id': 1, 'email': 'user@test.com', 'fullname': 'Test User' };

        nock(/horuspay\.africa/)
            .get('/v1/auth/profile')
            .reply(200, body);

        let result = await Auth.getProfile();

        exceptRequest({
            url: 'https://sandbox.horuspay.africa/v1/auth/profile',
            method: 'get'
        });

        expect(result).to.be.instanceof(HorusPayObject);
        expect(result.email).to.equal('user@test.com');
    });

    it('should update profile', async () => {
        let data = { 'fullname': 'Updated Name' };
        let body = { 'id': 1, 'fullname': 'Updated Name' };

        nock(/horuspay\.africa/)
            .put('/v1/auth/profile')
            .reply(200, body);

        let result = await Auth.updateProfile(data);

        exceptRequest({
            url: 'https://sandbox.horuspay.africa/v1/auth/profile',
            data: JSON.stringify(data),
            method: 'put'
        });

        expect(result).to.be.instanceof(HorusPayObject);
        expect(result.fullname).to.equal('Updated Name');
    });

    it('should change password', async () => {
        let data = { 'password': 'newpassword', 'password_confirmation': 'newpassword' };
        let body = { 'message': 'Password updated' };

        nock(/horuspay\.africa/)
            .put('/v1/auth/profile/password')
            .reply(200, body);

        let result = await Auth.changePassword(data);

        exceptRequest({
            url: 'https://sandbox.horuspay.africa/v1/auth/profile/password',
            data: JSON.stringify(data),
            method: 'put'
        });

        expect(result).to.be.instanceof(HorusPayObject);
        expect(result.message).to.equal('Password updated');
    });

    it('should switch account', async () => {
        let data = { 'account_id': 2 };
        let body = { 'token': 'new_jwt_token', 'account_id': 2 };

        nock(/horuspay\.africa/)
            .put('/v1/auth/profile/switch_account')
            .reply(200, body);

        let result = await Auth.switchAccount(data);

        exceptRequest({
            url: 'https://sandbox.horuspay.africa/v1/auth/profile/switch_account',
            data: JSON.stringify(data),
            method: 'put'
        });

        expect(result).to.be.instanceof(HorusPayObject);
        expect(result.account_id).to.equal(2);
    });

    it('should request password reset', async () => {
        let data = { 'email': 'user@test.com' };
        let body = { 'message': 'Reset email sent' };

        nock(/horuspay\.africa/)
            .post('/v1/auth/passwords')
            .reply(200, body);

        let result = await Auth.requestPasswordReset(data);

        exceptRequest({
            url: 'https://sandbox.horuspay.africa/v1/auth/passwords',
            data: JSON.stringify(data),
            method: 'post'
        });

        expect(result).to.be.instanceof(HorusPayObject);
        expect(result.message).to.equal('Reset email sent');
    });

    it('should reset password with token', async () => {
        let data = { 'password': 'newpwd', 'password_confirmation': 'newpwd' };
        let body = { 'message': 'Password has been reset' };

        nock(/horuspay\.africa/)
            .put('/v1/auth/passwords/reset_token_abc')
            .reply(200, body);

        let result = await Auth.resetPassword('reset_token_abc', data);

        exceptRequest({
            url: 'https://sandbox.horuspay.africa/v1/auth/passwords/reset_token_abc',
            data: JSON.stringify(data),
            method: 'put'
        });

        expect(result).to.be.instanceof(HorusPayObject);
        expect(result.message).to.equal('Password has been reset');
    });

    it('should get profile accounts', async () => {
        let body = {
            'accounts': [
                { 'id': 1, 'name': 'Shop 1' },
                { 'id': 2, 'name': 'Shop 2' }
            ]
        };

        nock(/horuspay\.africa/)
            .get('/v1/auth/profile/accounts')
            .reply(200, body);

        let result = await Auth.getProfileAccounts();

        exceptRequest({
            url: 'https://sandbox.horuspay.africa/v1/auth/profile/accounts',
            method: 'get'
        });

        expect(result).to.be.instanceof(HorusPayObject);
    });
});
