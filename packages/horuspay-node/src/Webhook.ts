import * as crypto from 'crypto';
import { Resource, HorusPayObject } from '.';
import { Base as ErrorBase, SignatureVerificationError } from './Error';
import { secureCompare, arrayToHorusPayObject } from './Util';

/**
 * Class Webhook
 *
 * @property int $id
 * @property string $url
 * @property string $created_at
 * @property string $updated_at
 */
export class Webhook extends Resource {
    protected static ressourceName = 'webhook';
    protected static pathPrefix = '/accounts';

    static DEFAULT_TOLERANCE = 300; // 5 minutes

    static constructEvent(payload, header, secret, tolerance?) {
        WebhookSignature.verifyHeader(
            payload,
            header,
            secret,
            tolerance || Webhook.DEFAULT_TOLERANCE
        );

        const jsonPayload = JSON.parse(payload);
        return jsonPayload;
    }

    /**
     * Generates a header to be used for webhook mocking
     */
    static generateTestHeaderString(opts?) {
        if (!opts) {
            throw new ErrorBase('Options are required');
        }

        opts.timestamp =
            Math.floor(opts.timestamp) || Math.floor(Date.now() / 1000);
        opts.scheme = opts.scheme || WebhookSignature.EXPECTED_SCHEME;

        opts.signature =
            opts.signature ||
            WebhookSignature.computeSignature(
                opts.timestamp + '.' + opts.payload,
                opts.secret
            );

        var generatedHeader = [
            't=' + opts.timestamp,
            opts.scheme + '=' + opts.signature,
        ].join(',');

        return generatedHeader;
    }

    /**
     * @param {Object|null} params
     * @param {Object|null} headers
     * @returns {Promise<Webhook>}
     */
    static create(params = {}, headers = {}): Promise<Webhook> {
        return <Promise<Webhook>>this._create(params, headers);
    }

    /**
     * @param {Object|null} params
     * @param {Object|null} headers
     * @returns {Promise<HorusPayObject>}
     */
    static all(params = {}, headers = {}): Promise<HorusPayObject> {
        return <Promise<HorusPayObject>> this._all(params, headers);
    }

    /**
     * @param {string|number} id
     * @param {Object|null} params
     * @param {Object|null} headers
     * @returns {Promise<Webhook>}
     */
    static retrieve(id, params = {}, headers = {}): Promise<Webhook> {
        return <Promise<Webhook>> this._retrieve(id, params, headers);
    }

    /**
     * @param {string|number} id The ID of the webhook to update.
     * @param {object|null} params
     * @param {object|null} headers
     * @returns {Promise<Webhook>}
     */
    static update(id, params = {}, headers = {}): Promise<Webhook> {
        return <Promise<Webhook>>this._update(id, params, headers);
    }

    /**
     * @param {Object|null} headers
     * @returns {Promise<Webhook>} The saved webhook.
     */
    save(headers = {}): Promise<Webhook> {
        return <Promise<Webhook>>this._save(headers);
    }

    /**
     * @param {Object|null} headers
     * @returns {Promise<Webhook>} The deleted webhook.
     */
    delete(headers = {}): Promise<Webhook> {
        return <Promise<Webhook>>this._delete(headers);
    }
}

export class WebhookSignature {
    static EXPECTED_SCHEME = 's';

    static computeSignature (payload, secret) {
        return crypto
          .createHmac('sha256', secret)
          .update(payload, 'utf8')
          .digest('hex');
    }

    protected static parseHeader(header: any, scheme: string) {
        if (typeof header !== 'string') {
          return null;
        }

        return header.split(',').reduce((accum, item) => {
            const kv = item.split('=');

            if (kv[0] === 't') {
              accum.timestamp = parseInt(kv[1]);
            }

            if (kv[0] === scheme) {
              accum.signatures.push(kv[1]);
            }

            return accum;
        }, { timestamp: -1, signatures: [] });
    }

    static verifyHeader(payload, header, secret, tolerance?) {
        payload = Buffer.isBuffer(payload) ? payload.toString('utf8') : payload;
        header = Buffer.isBuffer(header) ? header.toString('utf8') : header;

        const details = this.parseHeader(header, this.EXPECTED_SCHEME);

        if (!details || details.timestamp === -1) {
            throw new SignatureVerificationError(
                'Unable to extract timestamp and signatures from header',
                header,
                payload
            );
        }

        if (!details.signatures.length) {
            throw new SignatureVerificationError(
                'No signatures found with expected scheme',
                header,
                payload
            );
        }

        const expectedSignature = this.computeSignature(
          `${details.timestamp}.${payload}`,
          secret
        );

        const signatureFound = !!details.signatures
            .find(v => secureCompare(v, expectedSignature));

        if (!signatureFound) {
            throw new SignatureVerificationError(
                'No signatures found matching the expected signature for payload.' +
                ' Are you passing the raw request body you received from HorusPay?',
                header,
                payload
            );
        }

        const timestampAge = Math.floor(Date.now() / 1000) - details.timestamp;

        if (tolerance && tolerance > 0 && timestampAge > tolerance) {
            throw new SignatureVerificationError(
                'Timestamp outside the tolerance zone',
                header,
                payload
            );
        }

        return true;
    }
}
