/**
 * Message Helper Testing
 */

import { MessageHelper } from '@wallet-manager/node-package-util';

const data = {
  amount: 1.99,
  cardNumber: '4178311074545099722',
  currency: 'HKD',
  customerNumber: '3002X10002713730632',
  e6ProgramName: 'pfh_finance_consumer_wallet',
  feeAmount: 0,
  forcePost: true,
  interchangeName: 'visa_pfhfinance_hk',
  needsAccountName: false,
  partnerName: 'pfh_finance_ltd_rtf_po',
  partnerTransactionType: 'load',
  paymentContext: {
    acquirerAmount: '1.99',
    acquirerCurrency: 'HKD',
    acquiringInstitutionId: '12345678901',
    authReleasedTime: '0',
    authorization: 'false',
    billingAmount: '1.99',
    billingCurrency: 'HKD',
    cardAcceptorCity: 'Hong Kong',
    cardAcceptorCountryCode: 'HK',
    cardAcceptorId: '123456789012345',
    cardAcceptorTerminalId: '12345678',
    cardPresent: 'true',
    complianceAmount: '-1.99',
    complianceCurrency: 'HKD',
    forcePost: 'true',
    mcc: '5812',
    originalReferenceNumber: '0176535040756781',
    posCondition: '02',
    posEntryMode: '05',
    referenceNumber: '0200123456',
    reversal: 'false',
    settlementDate: '20251210',
    transactionSource: 'InWalletPOS',
    transactionType: 'purchase',
    transmissionDateTime: '1210071931',
  },
  programName: '',
  rawReferenceNumber: '0200123456',
  rawRequest:
    '<isomsg>\\n  <field id="0" value="0200"/>\\n  <field id="2" value="*"/>\\n  <field id="3" value="050000"/>\\n  <field id="4" value="000000000199"/>\\n  <field id="6" value="000000000199"/>\\n  <field id="7" value="1210071931"/>\\n  <field id="11" value="171059"/>\\n  <field id="14" value="2810"/>\\n  <field id="15" value="1210"/>\\n  <field id="18" value="5812"/>\\n  <field id="19" value="840"/>\\n  <field id="20" value="840"/>\\n  <field id="22" value="0200" type="binary"/>\\n  <field id="23" value="001"/>\\n  <field id="25" value="02"/>\\n  <field id="32" value="12345678901"/>\\n  <field id="37" value="765350407567"/>\\n  <field id="41" value="12345678"/>\\n  <field id="42" value="123456789012345"/>\\n  <field id="43" value="                         Hong Kong    HK"/>\\n  <field id="49" value="344"/>\\n  <field id="51" value="344"/>\\n  <field id="60" value="100000000000" type="binary"/>\\n  <isomsg id="62">\\n    <field id="2" value="0176535040756781"/>\\n  </isomsg>\\n  <originalMessage type="base2">303530302A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A202020313233343536202020202020202020202020202020202031323334353637382020202020202020202020202031393920202020202020202020202031393920202020202020202020202020202020202020202020202020202020486F6E67204B6F6E6720202020484B20313233342020202020202020202020202020202020202020202020202030352020202020303530353137363533353034303735363738312020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020203030303030303030303030303030302020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020</originalMessage>\\n</isomsg>\\n',
  retrievalId: '1000001646039',
  transactionId: '1000001646039',
  transactionSourceCode: 1,
  transactionTypeCode: 3,
  type: 'transaction',
  verificationList: '',
};
const privateKey =
  '0x96e7f062b343ab083fdb91fd0eab42d836b247a81d4bf4169c902e687e2e085c';
const address = '0xa11476cd61e377E19e1FC394eAF7C46f76125112';
const session = '1996885768085180416';
const sequence = 13;
const timestamp = 1765350993041;

const test = async () => {
  const headers = await MessageHelper.createRequestHeader(
    privateKey,
    address,
    session,
    sequence,
    data,
  );

  console.log(headers);
};

test();
