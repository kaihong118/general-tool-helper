import moment from 'moment';
import UtilHelper from './UtilsHelper';

const template = `
UPDATE swap_agent.app_versions
SET
    latest_version = ':latestVersion',
    min_supported_version = ':minSupportedVersion'
WHERE
    merchant_id = :merchantId;
`;

const data = [
  {
    merchantId: 6,
    latestVersion: '1.0.7',
    minSupportedVersion: '1.0.7',
  },
];

async function run() {
  //   let ticketNo = '00000';
  //   const isDevOpsTicket = await UtilHelper.askQuestion(
  //     'Do you have a devOps Ticket Number? (Y/N)',
  //   );

  //   if (isDevOpsTicket === 'Y') {
  //     ticketNo = await UtilHelper.askQuestion('Enter the ticket number: ');
  //   }

  let outputSql = 'BEGIN;\n';

  for (const x of data) {
    const sql = UtilHelper.generateSQL(template, {
      merchantId: x.merchantId,
      latestVersion: x.latestVersion,
      minSupportedVersion: x.minSupportedVersion,
    });

    outputSql += sql;
  }
  outputSql += '\nCOMMIT;';

  UtilHelper.writeFile(
    `/Users/lucas/Downloads/SQL/${moment().format(
      'YYYY-MM-DD HHmm',
    )} [swap_agent] data patch app version.sql`,
    outputSql,
  );

  console.log(`✅ SQL file written`);
}

run();
