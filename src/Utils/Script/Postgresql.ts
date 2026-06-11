const example1 = { applicationNumber: '19ca5a92-e824-40d4-ac36-d927612df7c5' };

/**
 * Extracts JSON object field with the given key
 * {columnName} ::json ->> '{paramName}' = '{value}';
 */

const example2 = {
  '1': {
    source: 1,
    kycLevel: 1,
    vipLevel: 'credit_card',
    kycIdvMethod: 1,
    questionType: 2,
  },
  '2': { kycLevel: 1, vipLevel: 'credit_card' },
};

/**
 * -> gets JSON object/value
 * ->> gets text value
 * @> checks whether JSON contains another JSON object
 */

/**
 * Does the text string exist as a TOP-LEVEL key or array element within the JSON value
 * {columnName}::jsonb ? '{paramName}'
 * ({columnName}::jsonb -> '{top_level_paramName}') ? 'second_level_paramName'
 * Expected Result: true or false
 */

/**
 * Extracts JSON object field with the given key, as text
 * {columnName}::jsonb -> '{paramName}' ->> '{paramName}' = '{value}';
 * Expected Result: data
 */
