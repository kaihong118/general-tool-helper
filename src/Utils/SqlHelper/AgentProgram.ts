import { Master } from '@wallet-manager/pfh-pmp-node-def-types';
import moment from 'moment';
import UtilHelper from './UtilsHelper';

const template = `
-- :programName
UPDATE swap_agent.agent_programs
SET
  kyc_idv_method = :kycMethod,
  question_type = :questionType,
  last_modified_by = :lastModifiedBy,
  last_modified_date = now ()
WHERE
  id = ':id'
  AND program_agent_id = ':programAgentId'
  AND program_name = ':programName';
`;

const data = [
  {
    id: 25,
    program_agent_id: 'PA-E005',
    program_name: 'HKD_P58_DISTRIBUTION',
    created_by: null,
    created_date: '2024-06-14T04:01:50.680Z',
    last_modified_by: null,
    last_modified_date: '2025-12-22T07:25:49.973Z',
    program_display_name: 'P58',
    program_currency: 'HKD',
    credit_token_name: 'HKDM',
    credit_currency: 'HKDM-ERC20',
    kyc_idv_method: 1,
    question_type: 2,
    kyc_level: 1,
    vip_level: 'abcc_card',
  },
];

async function run() {
  let ticketNo = '00000';
  const isDevOpsTicket = await UtilHelper.askQuestion(
    'Do you have a devOps Ticket Number? (Y/N)',
  );

  if (isDevOpsTicket === 'Y') {
    ticketNo = await UtilHelper.askQuestion('Enter the ticket number: ');
  }

  let outputSql = 'BEGIN;\n';

  for (const x of data) {
    const sql = UtilHelper.generateSQL(template, {
      id: x.id,
      programAgentId: x.program_agent_id,
      programName: x.program_name,
      kycMethod: Master.EnumIdvMethod.Skip,
      questionType: Master.EnumQuestionType.Agent,
      lastModifiedBy: 'Data Patch',
    });

    outputSql += sql;
  }
  outputSql += '\nCOMMIT;';

  UtilHelper.writeFile(
    `/Users/lucas/Downloads/SQL/[swap_agent] Data patch to update idvMethod and questionType (${ticketNo}) ${moment().format(
      'YYYYMMDD',
    )}.sql`,
    outputSql,
  );

  console.log(`✅ SQL file written`);
}

run();
