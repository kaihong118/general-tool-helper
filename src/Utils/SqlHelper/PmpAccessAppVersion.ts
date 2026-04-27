import moment from 'moment';
import UtilHelper from './UtilsHelper';

const template = `
-- :name
UPDATE pmp_access.app_versions
SET
    latest_version = ':latestVersion',
    min_supported_version = ':minSupportedVersion'
WHERE
    merchant_id = :merchantId
    and source = :source;
`;

const data = [
  {
    name: 'IOS & Android [PFH App]',
    merchantId: 6,
    source: 1,
    latestVersion: '1.0.7',
    minSupportedVersion: '1.0.7',
  },
  {
    name: 'IOS & Android [Double Pay]',
    merchantId: 6,
    source: 2,
    latestVersion: '1.0.7',
    minSupportedVersion: '1.0.7',
  },
  {
    name: 'IOS & Android [ABCC+]',
    merchantId: 6,
    source: 3,
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
      name: x.name,
      merchantId: x.merchantId,
      source: x.source,
      latestVersion: x.latestVersion,
      minSupportedVersion: x.minSupportedVersion,
    });

    outputSql += sql;
  }
  outputSql += '\nCOMMIT;';

  UtilHelper.writeFile(
    `/Users/lucas/Downloads/SQL/${moment().format(
      'YYYY-MM-DD HHmm',
    )} [pmp_access] data patch app version.sql`,
    outputSql,
  );

  console.log(`✅ SQL file written`);
}

run();
