# kms client for alicloud

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/@alicloud/kms.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@alicloud/kms
[travis-image]: https://img.shields.io/travis/ali-sdk/kms.svg?style=flat-square
[travis-url]: https://travis-ci.org/ali-sdk/kms
[codecov-image]: https://codecov.io/github/ali-sdk/kms/coverage.svg?branch=master
[codecov-url]: https://codecov.io/github/ali-sdk/kms?branch=master
[david-image]: https://img.shields.io/david/ali-sdk/kms.svg?style=flat-square
[david-url]: https://david-dm.org/ali-sdk/kms
[download-image]: https://img.shields.io/npm/dm/@alicloud/kms.svg?style=flat-square
[download-url]: https://npmjs.org/package/@alicloud/kms

- [API Document](https://help.aliyun.com/document_detail/69005.html)

## Install

```bash
npm i @alicloud/kms
```

## Usage

```js
const KMSClient = require('@alicloud/kms');

const client = new KMSClient({
  accessKeyId: 'your accessKeyId',
  accessKeySecret: 'your accessKeySecret',
  // must be https url
  endpoint: 'https://kms.{region}.aliyuncs.com', // e.g.: 'https://kms.cn-hangzhou.aliyuncs.com'
});

(async () => {

  const plainText = 'Hello KMS';
  const encryptText = await client.encrypt('my key id', plainText);
  console.log('%s => %s', plainText, encryptText);
  assert.equal(await client.decrypt(encryptText), plainText);

})().catch(err => console.error(err));
```

## Endpoints

see https://help.aliyun.com/document_detail/69006.html
