import moment from 'moment';
import UtilHelper from './UtilsHelper';

const template = `
-- :email
UPDATE
    pmp_access.one_time_password_records
set
    count = 0,
    last_modified_by = ':lastModifiedBy',
    last_modified_date = now()
where
    id = ':id'
    and key = ':email';
`;

const data = [
  {
    id: 642,
    merchant_id: 6,
    key: 'melvinzhang@163.net',
    verification_type: 3,
    method: 2,
    count: 1,
    created_by: 'melvin.zhang@163.net',
    created_date: '2026-07-06T03:58:52.482Z',
    last_modified_by: 'melvin.zhang@163.net',
    last_modified_date: '2026-07-06T03:58:52.482Z',
  },
  {
    id: 641,
    merchant_id: 6,
    key: 'melvinzhang@163.net',
    verification_type: 3,
    method: 1,
    count: 1,
    created_by: 'melvin.zhang@163.net',
    created_date: '2026-07-06T03:56:19.766Z',
    last_modified_by: 'melvin.zhang@163.net',
    last_modified_date: '2026-07-06T03:56:19.766Z',
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
      email: x.key,
      lastModifiedBy: 'Data Patch',
    });

    outputSql += sql;
  }
  outputSql += '\nCOMMIT;';

  UtilHelper.writeFile(
    `/Users/lucas/Downloads/SQL/${moment().format(
      'YYYY-MM-DD HHmm',
    )} [swap_agent] Data patch one time password record (${ticketNo}).sql`,
    outputSql,
  );

  console.log(`✅ SQL file written`);
}

run();
