import { Master } from '@wallet-manager/pfh-pmp-node-def-types';
import moment from 'moment';
import UtilHelper from './UtilsHelper';

const template = `
-- :programName
UPDATE swap_agent.agent_programs
SET
  kyc_idv_method = :kycMethod,
  question_type = :questionType,
  last_modified_by = ':lastModifiedBy',
  last_modified_date = now ()
WHERE
  id = ':id'
  AND program_agent_id = ':programAgentId'
  AND program_name = ':programName';
`;

const data = [
  {
    id: 188,
    program_agent_id: 'PA-E020',
    program_name: 'VTitanSign-E020-P80',
    created_by: null,
    created_date: '2025-12-02T09:52:38.021Z',
    last_modified_by: null,
    last_modified_date: '2025-12-22T07:25:49.973Z',
    program_display_name: 'HKDM Titan Signature',
    program_currency: 'HKD',
    credit_token_name: 'HKDM',
    credit_currency: 'HKDM-ERC20',
    kyc_idv_method: 1,
    question_type: 2,
    kyc_level: 1,
    vip_level: 'credit_card',
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
    `/Users/lucas/Downloads/SQL/${moment().format(
      'YYYY-MM-DD HHmm',
    )} [swap_agent] Data patch agent program (${ticketNo}).sql`,
    outputSql,
  );

  console.log(`✅ SQL file written`);
}

run();
