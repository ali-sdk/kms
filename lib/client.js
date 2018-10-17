'use strict';

const utility = require('utility');
const debug = require('debug')('kms:client');

class KMSClient {
  constructor(options) {
    this._httpclient = options.httpclient || require('urllib');
    // accessKeyId
    // accessKeySecret
    // endpoint
    // timeout
    options.timeout = options.timeout || 10000;
    this._options = options;
  }

  async listKeys(options) {
    return await this.requestAction('ListKeys', options);
  }

  async listAliases(options) {
    return await this.requestAction('ListAliases', options);
  }

  async encrypt(KeyId, Plaintext, options) {
    const data = await this.requestAction('Encrypt', {
      KeyId,
      Plaintext,
      ...options,
    });
    return data.CiphertextBlob;
  }

  async decrypt(CiphertextBlob, options) {
    const data = await this.requestAction('Decrypt', {
      CiphertextBlob,
      ...options,
    });
    return data.Plaintext;
  }

  async requestAction(action, params) {
    const method = 'POST';
    const requestParams = this.formatParams(method, {
      Action: action,
      ...params,
    });
    const endpoint = this._options.endpoint;
    debug('%s %s => %j', method, endpoint, requestParams);
    const result = await this._httpclient.request(endpoint, {
      method,
      data: requestParams,
      timeout: this._options.timeout,
      dataType: 'json',
    });
    const data = result.data || {};
    const RequestId = data.RequestId;
    debug('result status: %s, headers: %j, RequestId: %s, data: %j',
      result.status, result.headers, RequestId, result.data);
    if (result.status >= 500) {
      const err = new Error(data.Message || `KMS Server Error, status: ${result.status}`);
      err.name = 'KMSServerResponseError';
      err.headers = result.headers;
      err.RequestId = RequestId;
      err.data = data;
      throw err;
    } else if (result.status >= 400) {
      const err = new Error(data.Message || `KMS Client Error, status: ${result.status}`);
      err.name = `KMSClient${data.Code || 'Unknow'}Error`;
      err.headers = result.headers;
      err.RequestId = RequestId;
      err.data = data;
      throw err;
    }
    return data;
  }

  formatParams(method, params) {
    const allParams = {
      // public params
      // https://help.aliyun.com/document_detail/69007.html
      Format: 'json',
      Version: '2016-01-20',
      AccessKeyId: this._options.accessKeyId,
      SignatureMethod: 'HMAC-SHA1',
      Timestamp: new Date().toJSON(),
      SignatureVersion: '1.0',
      ...params,
    };
    allParams.Signature = this._signature(method, allParams);
    return allParams;
  }

  // https://help.aliyun.com/document_detail/69009.html
  _percentEncode(v) {
    return encodeURIComponent(v);
  }

  _canonicalizedParams(params) {
    const keys = Object.keys(params).sort();
    const kvs = [];
    for (const k of keys) {
      kvs.push(`${this._percentEncode(k)}=${this._percentEncode(params[k])}`);
    }
    return kvs.join('&');
  }

  _signature(method, params) {
    const kvs = this._canonicalizedParams(params);
    const baseString = method + '&' +
      this._percentEncode('/') + '&' +
      this._percentEncode(kvs);
    return utility.hmac('sha1', `${this._options.accessKeySecret}&`, baseString);
  }
}

module.exports = KMSClient;
