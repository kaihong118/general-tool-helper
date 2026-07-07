import moment from 'moment';
import UtilHelper from './UtilsHelper';

const template = `
-- :programName
update
	merchant_program_configs
set
	background_thumbnail = ':backgroundThumbnail',
where
	id = :id
  and merchant_id = :merchantId
  and program_name = ':programName';
`;

const data = [
  {
    id: 130,
    merchant_id: 6,
    seq: 9954,
    program_name: 'VAFFILIATE-G001-SGreenP983',
    default: false,
    default_referral_code: null,
    card_infos:
      '[{"linkUrl": "https:\/\/pfhcard.com\/", "cardName": "Signature Card", "language": "en", "linkName": "More details", "rewardDesc": "Enjoy HKDM rebate with your spending", "watermarkUrl": "https:\/\/static.prod.pfh-in.com\/app\/pfh_water_mark.png"}, {"linkUrl": "https:\/\/pfhcard.com\/", "cardName": "Signature Card", "language": "zh-TW", "linkName": "更多資料", "rewardDesc": "簽賬可獲HKDM回贈", "watermarkUrl": "https:\/\/static.prod.pfh-in.com\/app\/pfh_water_mark.png"}, {"linkUrl": "https:\/\/pfhcard.com\/", "cardName": "Signature Card", "language": "zh-CN", "linkName": "更多资料", "rewardDesc": "签账可获HKDM回赠", "watermarkUrl": "https:\/\/static.prod.pfh-in.com\/app\/pfh_water_mark.png"}]',
    layout: 4,
    background_type: 1,
    background: 'https:\/\/static.prod.pfh-in.com\/app\/pfh_water_mark.png',
    background_thumbnail:
      'https:\/\/static.prod.pfh-in.com\/app\/GreenCard.png',
    logo: 'https:\/\/static.prod.pfh-in.com\/app\/gl_logo.png',
    created_by: 'auto',
    created_date: '2025-02-13T11:33:33.091Z',
    last_modified_by: 'auto',
    last_modified_date: '2025-02-13T11:33:33.091Z',
    vip_level: null,
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
      merchantId: x.merchant_id,
      programName: x.program_name,
      backgroundThumbnail: 'https://static.prod.pfh-in.com/app/QuickCard.png',
    });

    outputSql += sql;
  }

  outputSql += '\nCOMMIT;';

  UtilHelper.writeFile(
    `/Users/lucas/Downloads/SQL/${moment().format(
      'YYYY-MM-DD HHmm',
    )} [pmp_access] data patch program card face (${ticketNo}).sql`,
    outputSql,
  );

  console.log(`✅ SQL file written`);
}

run();
