import { xml2js } from 'xml-js';

const fieldIdMapping: Record<string, string> = {
  '0': 'messageTypeIndicator',
  '2': 'primaryAccountNumber',
  '3': 'processingCode',
  '4': 'transactionAmount',
  '6': 'cardholderBillingAmount',
  '7': 'transmissionDateTime',
  '10': 'conversionRateCardholderBilling',
  '11': 'systemsTraceAuditNumber',
  '12': 'localTransactionTime',
  '13': 'localTransactionDate',
  '14': 'expirationDate',
  '15': 'settlementDate',
  '16': 'conversionDate',
  '18': 'merchantType',
  '19': 'acquiringInstitutionCountryCode',
  '20': 'panExtendedCountryCode',
  '22': 'pointOfServiceEntryMode',
  '23': 'cardSequenceNumber',
  '25': 'pointOfServiceConditionCode',
  '32': 'acquiringInstitutionIdentificationCode',
  '37': 'retrievalReferenceNumber',
  '38': 'authorizationIdentificationResponse',
  '41': 'cardAcceptorTerminalIdentification',
  '42': 'cardAcceptorIdentificationCode',
  '43': 'cardAcceptorNameLocation',
  '49': 'transactionCurrencyCode',
  '51': 'cardholderBillingCurrencyCode',
  '55': 'iccData',
  '56': 'originalDataElements',
  '61': 'reservedPrivate1',
  '60': 'reservedNational',
  '62': 'reservedPrivate',
  '63': 'reservedPrivate2',
  '62.2': 'originalRetrievalReferenceNumber',
};

type XmlJsField = {
  _attributes?: {
    id?: string;
    value?: string;
    type?: string;
  };
};

type XmlJsIsoMsg = {
  field?: XmlJsField | XmlJsField[];
};

const xmlData =
  '<isomsg><field id=\"0\" value=\"0100\"/><field id=\"2\" value=\"*\"/><field id=\"3\" value=\"000000\"/><field id=\"4\" value=\"000000005633\"/><field id=\"6\" value=\"000000003755\"/><field id=\"7\" value=\"0315160425\"/><field id=\"10\" value=\"76666000\"/><field id=\"11\" value=\"000004\"/><field id=\"12\" value=\"160425\"/><field id=\"13\" value=\"0315\"/><field id=\"15\" value=\"0315\"/><field id=\"16\" value=\"0315\"/><field id=\"18\" value=\"5311\"/><field id=\"22\" value=\"072\"/><field id=\"23\" value=\"001\"/><field id=\"32\" value=\"999901\"/><field id=\"37\" value=\"085037100011\"/><field id=\"41\" value=\"MTF TEST\"/><field id=\"42\" value=\"ABC123TESTMTF19\"/><field id=\"43\" value=\"Department Store       Las Vegas         USA \"/><field id=\"49\" value=\"840\"/><field id=\"51\" value=\"826\"/><field id=\"55\" value=\"5F2A020840820258008407A0000000041010950500000000009A032203159C01009F02060000000056339F10120110250000044000DAC100000000000000009F1A0208409F2608F74B81A9433809289F2701809F3303E0E8E89F34034103029F360201409F37042B65FF1F\" type=\"binary\"/><field id=\"56\" value=\"013301295001ABCDEFGHIJ123456789012345\"/><field id=\"61\" value=\"000000000030084011111-1111\"/><field id=\"63\" value=\"MRW011B63\"/></isomsg>';

const jsonData = xml2js(xmlData, { compact: true }) as {
  isomsg?: XmlJsIsoMsg;
};

const asArray = <T>(value?: T | T[]): T[] => {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
};

const mappedResult: Record<string, unknown> = {};

for (const field of asArray(jsonData.isomsg?.field)) {
  const id = field._attributes?.id;
  if (!id) {
    continue;
  }

  const mappedKey = fieldIdMapping[id] ?? id;
  const value = field._attributes?.value ?? '';

  mappedResult[mappedKey] = value;
}
console.log(JSON.stringify(jsonData, null, 2));
console.log(JSON.stringify(mappedResult, null, 2));
