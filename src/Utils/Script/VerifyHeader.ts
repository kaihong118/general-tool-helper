/**
 * Verify Signature with RSV -1b
 */

import { MessageHelper } from '@wallet-manager/node-package-util';

const method: string = 'GET';
const data: any = {
  billingCurrency: 'HKD',
  ledgerBillingCurrency: 'HKD',
  targetDateTime: '2026-11-18T09:26:55.121Z',
};

const xMessageAddress = '0x95382148924366AB4a8E40fd54024486433f02B5';
const xMessageTimestamp = '1795053135104';
const xMessageSession = '2802689';
const xMessageSequence = '5775';
const xMessageSignature =
  '0xf49ad415264da1d323e2c8f851cf9dde4fb88b2af572abc2e35323880b4e77c013434de24adc85cf4efed49496b86275a38a8a38124789eaad6d2a038058ceae1c';

const test = async () => {
  let reqBodyStr = '';

  if (method !== 'GET') {
    const _reqBody = data;
    reqBodyStr = JSON.stringify(_reqBody);
  }

  const hashedMessage = MessageHelper.genHashedMessage(
    xMessageTimestamp,
    xMessageSession,
    xMessageSequence,
    reqBodyStr,
  );

  const isVerifiedSignature = MessageHelper.verify(
    hashedMessage,
    xMessageSignature,
    xMessageAddress,
  );

  console.log(`Is verified signature: ${isVerifiedSignature}`);
};

test();
