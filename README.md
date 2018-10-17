# kms client for alicloud

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
