import { xml2js } from 'xml-js';

const fieldIdMapping: Record<string, string> = {
  '0': 'messageTypeIndicator',
  '2': 'primaryAccountNumber',
  '3': 'processingCode',
  '4': 'transactionAmount',
  '6': 'cardholderBillingAmount',
  '7': 'transmissionDateTime',
  '11': 'systemsTraceAuditNumber',
  '12': 'localTransactionTime',
  '13': 'localTransactionDate',
  '14': 'expirationDate',
  '15': 'settlementDate',
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
  '60': 'reservedNational',
  '62': 'reservedPrivate',
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
  '<isomsg> <field id="0" value="0200"/> <field id="2" value="*"/> <field id="3" value="050000"/> <field id="4" value="000000015000"/> <field id="6" value="000000015000"/> <field id="7" value="0605071627"/> <field id="11" value="787227"/> <field id="14" value="2606"/> <field id="15" value="0605"/> <field id="18" value="5812"/> <field id="19" value="840"/> <field id="20" value="840"/> <field id="22" value="0200" type="binary"/> <field id="23" value="001"/> <field id="25" value="02"/> <field id="32" value="12345678901"/> <field id="37" value="780643751317"/> <field id="38" value="774987"/> <field id="41" value="12345678"/> <field id="42" value="123456789012345"/> <field id="43" value="Foodpanda, Hong Kong Hong Kong HK"/> <field id="49" value="344"/> <field id="51" value="344"/> <field id="60" value="100000000000" type="binary"/> <isomsg id="62"> <field id="2" value="0178064375131797"/> </isomsg></isomsg>';

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
