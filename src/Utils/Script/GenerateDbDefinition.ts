/**
 * String Helper Testing
 */

import StringHelper from '../UtilsHelper/StringHelper';

const stringArr = [
  'customer_number',
  'program_name',
  'ledger_account_id',
  'ledger_currency',
  'billing_currency',
  'update_sequence',
  'created_by',
  'last_modified_by',
  'created_date',
  'last_modified_date',
];

for (const string of stringArr) {
  console.log(`${StringHelper.snakeToCamel(string)}: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '${StringHelper.snakeToSpace(string)}',
        field: '${string}',
      },`);
}
