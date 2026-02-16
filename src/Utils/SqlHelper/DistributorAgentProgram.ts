import { SwapAgent } from '@wallet-manager/pfh-pmp-node-def-types';
import moment from 'moment';
import UtilHelper from './UtilsHelper';

const template = `
-- :programName
UPDATE swap_agent.distributor_agent_programs
SET
    last_modified_by = 'Data Patch',
    last_modified_date = now (),
    supported_platform = :supportedPlatform
WHERE
    id = ':id'
    AND program_agent_id = ':programAgentId'
    AND distributor_agent_id = ':distributorAgentId'
    AND program_name = ':programName';
`;

const data = [
  {
    id: 667,
    program_agent_id: 'PA-E010',
    distributor_agent_id: 'DA-0001@PA-E010',
    program_name: 'VABCC-E010-BLACKP461',
    created_by: 'e010d0001@golden-leasing.com',
    created_date: '2025-10-09T07:53:07.436Z',
    last_modified_by: 'e010d0001@golden-leasing.com',
    last_modified_date: '2025-10-09T07:53:07.436Z',
    status: 1,
    rebate_mode: 2,
    da_rebate_rate: 0.0,
    customer_rebate_rate: 0.0,
    supported_platform: 1,
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
      distributorAgentId: x.distributor_agent_id,
      programName: x.program_name,
      supportedPlatform:
        SwapAgent.EnumDistributorAgentProgramSupportedPlatform.API,
    });

    outputSql += sql;
  }
  outputSql += '\nCOMMIT;';

  UtilHelper.writeFile(
    `/Users/lucas/Downloads/SQL/[swap_agent] Data patch to update supportedPlatform (${ticketNo}) ${moment().format(
      'YYYYMMDD',
    )}.sql`,
    outputSql,
  );

  console.log(`✅ SQL file written`);
}

run();
