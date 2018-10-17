'use strict';

const assert = require('assert');
const KMSClient = require('..');

describe('test/client.test.js', () => {
  let client;
  before(() => {
    client = new KMSClient(require('./config'));
  });

  // before(async () => {
  //   const plainText = 'foo';
  //   const e = await client.encrypt('alias/bar', plainText);
  //   console.log(e);
  //   assert.equal(await client.decrypt(e), plainText);
  // });

  describe('formatParams()', () => {
    it('should create Signature work', () => {
      const client = new KMSClient({
        accessKeyId: 'testid',
        accessKeySecret: 'testsecret',
      });
      const params = client.formatParams('GET', {
        Action: 'CreateKey',
        Timestamp: '2016-03-28T03:13:08Z',
      });
      assert(params.Signature === '41wk2SSX1GJh7fwnc5eqOfiJPFg=');
    });
  });

  describe('listKeys()', () => {
    it('should success', async () => {
      const data = await client.listKeys();
      // console.log(data);
      // console.log(data.Keys);
      assert(data.Keys);
      assert(data.Keys.Key.length === data.TotalCount);
      data.Keys.Key.forEach(key => {
        assert(key.KeyId);
        assert(key.KeyArn);
      });
      assert(data.TotalCount);
      assert(data.PageNumber === 1);
      assert(data.PageSize === 10);
      assert(data.RequestId);
    });
  });

  describe('listAliases()', () => {
    it('should success', async () => {
      const data = await client.listAliases();
      // console.log(data);
      // console.log(data.Aliases);
      assert(data.Aliases);
      assert(data.Aliases.Alias.length === data.TotalCount);
      data.Aliases.Alias.forEach(key => {
        assert(key.AliasName);
        assert(key.KeyId);
        assert(key.AliasArn);
      });
      assert(data.TotalCount);
      assert(data.PageNumber === 1);
      assert(data.PageSize === 10);
      assert(data.RequestId);
    });
  });

  describe('encrypt() and decrypt()', () => {
    it('should success on keyId', async () => {
      const data = await client.listKeys();
      const KeyId = data.Keys.Key[0].KeyId;
      const encryptText = await client.encrypt(KeyId, 'hello kms，支持中文和😈');
      console.log(encryptText);
      const plainText = await client.decrypt(encryptText);
      assert(plainText === 'hello kms，支持中文和😈');
    });

    it('should success on alias key', async () => {
      const data = await client.listAliases();
      const AliasName = data.Aliases.Alias[0].AliasName;
      const encryptText = await client.encrypt(AliasName, 'hello kms alias，支持中文和😈');
      console.log(encryptText);
      const plainText = await client.decrypt(encryptText);
      assert(plainText === 'hello kms alias，支持中文和😈');
    });

    it('should fail on wrong keyId', async () => {
      const data = await client.listKeys();
      const KeyId = data.Keys.Key[0].KeyId;
      try {
        await client.encrypt(KeyId + 'notexists', 'hello kms，支持中文和😈');
        throw new Error('should not run this');
      } catch (err) {
        assert(err.name === 'KMSClientInvalidParameterError');
        assert(err.message === 'The specified parameter KeyId is not valid.');
      }
    });
  });
});
