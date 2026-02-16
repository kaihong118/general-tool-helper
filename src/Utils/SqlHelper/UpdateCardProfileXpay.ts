import moment from 'moment';
import UtilHelper from './UtilsHelper';

const insertNewRecordTemplate = `
insert into
    pmp_access.merchant_program_card_profile_configs (
        merchant_id,
        program_name,
        card_profile_name,
        enable_customer_apply,
        support_xpay
    )
select
    6,
    ':programName',
    ':cardProfileName',
    :defaultEnableCustomerApply,
    :defaultSupportXpay
where
    not exists (
        select
            id
        from
            pmp_access.merchant_program_card_profile_configs
        where
            merchant_id = :merchantId
            and program_name = ':programName'
            and card_profile_name = ':cardProfileName'
    );
`;

const updateXpayTemplate = `
update pmp_access.merchant_program_card_profile_configs
set
    support_xpay = :supportXpay
where
    merchant_id = :merchantId
    and program_name = ':programName'
    and card_profile_name = ':cardProfileName';
`;

const updateCardFaceInfoTemplate = `
update pmp_access.merchant_program_card_profile_configs mpcpc
set
    card_infos = mpc.card_infos,
    layout = mpc.layout,
    background_type = mpc.background_type,
    background = mpc.background,
    background_thumbnail = mpc.background_thumbnail,
    logo = mpc.logo,
    created_by = 'Auto',
    created_date = now (),
    last_modified_by = 'Auto',
    last_modified_date = now ()
from
    pmp_access.merchant_program_configs as mpc
where
    mpc.merchant_id = mpcpc.merchant_id
    and mpc.program_name = mpcpc.program_name
    and mpcpc.card_infos is null
    and mpcpc.background_thumbnail is null;
`;

const data = [
  {
    id: 86,
    merchant_id: 6,
    program_name: 'VGL-E006-BLUEP05',
    card_profile_name: 'VGL-E006-BLUEP05_009',
    status: 1,
    created_date: '2025-01-15T02:47:45.550Z',
    last_modified_date: '2025-01-15T02:47:45.550Z',
    created_by: 'import',
    modified_by: 'import',
  },
  {
    id: 210,
    merchant_id: 6,
    program_name: 'VGL-E006-BLUEP05',
    card_profile_name: 'Virtual_Quick Ext Apple Pay_001',
    status: 1,
    created_date: '2025-05-22T11:59:45.461Z',
    last_modified_date: '2025-05-22T11:59:45.461Z',
    created_by: null,
    modified_by: null,
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

  outputSql += `\n--Insert New Record if card profile is not exist`;
  for (const x of data) {
    const sql = UtilHelper.generateSQL(insertNewRecordTemplate, {
      merchantId: x.merchant_id,
      programName: x.program_name,
      cardProfileName: x.card_profile_name,
      defaultEnableCustomerApply: false,
      defaultSupportXpay: false,
    });

    outputSql += sql;
  }

  outputSql += `\n--Update support_xpay to true`;
  for (const x of data) {
    const sql = UtilHelper.generateSQL(updateXpayTemplate, {
      merchantId: x.merchant_id,
      programName: x.program_name,
      cardProfileName: x.card_profile_name,
      supportXpay: true,
    });

    outputSql += sql;
  }

  outputSql += `\n--Update record if card_infos and background_thumbnail is null`;
  outputSql += updateCardFaceInfoTemplate;

  outputSql += '\nCOMMIT;';

  UtilHelper.writeFile(
    `/Users/lucas/Downloads/SQL/[pmp_access] Data patch to update card profile xpay (${ticketNo}) ${moment().format(
      'YYYYMMDD',
    )}.sql`,
    outputSql,
  );

  console.log(`✅ SQL file written`);
}

run();
