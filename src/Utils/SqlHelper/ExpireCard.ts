import moment from 'moment';
import UtilHelper from './UtilsHelper';

const insertNewRecordTemplate = `
insert into
	pmp.expire_cards (
  merchant_id,
	program_name,
	card_profile_name,
	customer_number,
	card_number,
	type,
	pan_last4,
	expiry,
	card_profile_expire_month,
	status,
	renew_card_status,
	e6_card_state,
	retry_count,
	mark_date,
	created_date,
	last_modified_date
    )
select
	':merchantId',
	':programName',
	':cardProfileName',
	':customerNumber',
	':cardNumber',
	':type',
	':panLast4',
	':expiry',
	24,
	1,
	1,
	':e6CardState',
	0,
	now(),
	now(),
	now()
where
	not exists (
	select
		id
	from
		pmp.expire_cards
	where
		merchant_id = :merchantId
		and card_number = ':cardNumber'
    );
`;

const data = [
  {
    id: 8453,
    merchant_id: 6,
    order_id: 'CO-000000118',
    program_name: 'GL_TITAN_CARD',
    partner_name: 'pfhfinance',
    customer_number: '3002X10002137650598',
    embossed_name: 'LAM\/EVA',
    card_number: '2794361195299874369',
    pan_last4: '0234',
    card_created_time: '2025-03-24T08:27:57.000Z',
    sequence: 1,
    state: 6,
    type: 'phy',
    expiry: '202703',
    card_profile_name: 'TitanSign1',
    blocked: false,
    status: 3,
    assigned: true,
    order_seq: 0,
    is_imported: false,
    reissue: false,
    reissue_order_id: '',
    old_card_number: '',
    deactivate_on_new_card_activation: false,
    created_by: 'CreditAPIServer1',
    modified_by: 'CreditAPIServer1',
    created_date: '2025-03-24T08:27:58.222Z',
    last_modified_date: '2025-04-11T06:35:27.523Z',
    pre_created_card: false,
    state_updated_time: '2025-04-11T06:35:26.855Z',
    card_activated_date: '2025-04-11T06:35:26.805Z',
    blocked_updated_time: '2025-04-11T06:35:27.335Z',
    e6_program_name: 'GL_TITAN_CARD',
    renewed: false,
  },
  {
    id: 8308,
    merchant_id: 6,
    order_id: 'CO-000000117',
    program_name: 'GL_TITAN_CARD',
    partner_name: 'pfhfinance',
    customer_number: '3002X10002137650598',
    embossed_name: 'LAM\/EVA',
    card_number: '9639620099859858712',
    pan_last4: '9514',
    card_created_time: '2025-03-18T10:33:52.000Z',
    sequence: 1,
    state: 6,
    type: 'phy',
    expiry: '202703',
    card_profile_name: 'TitanSign',
    blocked: false,
    status: 3,
    assigned: true,
    order_seq: 0,
    is_imported: false,
    reissue: false,
    reissue_order_id: '',
    old_card_number: '',
    deactivate_on_new_card_activation: false,
    created_by: 'CreditAPIServer1',
    modified_by: 'CreditAPIServer1',
    created_date: '2025-03-18T10:33:52.752Z',
    last_modified_date: '2025-04-11T06:35:06.586Z',
    pre_created_card: false,
    state_updated_time: '2025-04-11T06:35:05.827Z',
    card_activated_date: '2025-04-11T06:35:05.773Z',
    blocked_updated_time: '2025-04-11T06:35:06.400Z',
    e6_program_name: 'GL_TITAN_CARD',
    renewed: false,
  },
  {
    id: 8005,
    merchant_id: 6,
    order_id: 'PC-000000743',
    program_name: 'GL_TITAN_CARD',
    partner_name: 'pfhfinance',
    customer_number: '3002X10002137650598',
    embossed_name: 'FINTECH LIMITED\/PFH',
    card_number: '7396656715260056473',
    pan_last4: '8946',
    card_created_time: '2025-02-11T07:25:56.000Z',
    sequence: 1,
    state: 6,
    type: 'phy',
    expiry: '202702',
    card_profile_name: 'TitanSign',
    blocked: false,
    status: 3,
    assigned: true,
    order_seq: 1,
    is_imported: false,
    reissue: false,
    reissue_order_id: '',
    old_card_number: '',
    deactivate_on_new_card_activation: false,
    created_by: 'CreditAPIServer1',
    modified_by: 'CreditAPIServer1',
    created_date: '2025-02-11T07:25:56.183Z',
    last_modified_date: '2025-03-19T03:30:56.800Z',
    pre_created_card: true,
    state_updated_time: '2025-02-11T09:42:08.780Z',
    card_activated_date: '2025-02-11T09:42:08.693Z',
    blocked_updated_time: '2025-03-19T03:30:56.624Z',
    e6_program_name: 'GL_TITAN_CARD',
    renewed: false,
  },
];

async function run() {
  let ticketNo = '00000';
  // const isDevOpsTicket = await UtilHelper.askQuestion(
  //   'Do you have a devOps Ticket Number? (Y/N)',
  // );
  // if (isDevOpsTicket === 'Y') {
  //   ticketNo = await UtilHelper.askQuestion('Enter the ticket number: ');
  // }

  let outputSql = 'BEGIN;\n';
  outputSql += '\n--Insert New Record of expire card';

  for (const x of data) {
    const sql = UtilHelper.generateSQL(insertNewRecordTemplate, {
      merchantId: x.merchant_id,
      programName: x.program_name,
      cardProfileName: x.card_profile_name,
      customerNumber: x.customer_number,
      cardNumber: x.card_number,
      type: x.type,
      panLast4: x.pan_last4,
      expiry: x.expiry,
      e6CardState: x.state,
    });
    outputSql += sql;
  }

  UtilHelper.writeFile(
    `/Users/lucas/Downloads/SQL/${moment().format('YYYY-MM-DD HHmm')} [pmp] data patch expire card (${ticketNo}).sql`,
    `${outputSql}\nCOMMIT;`,
  );

  console.log(`✅ SQL file written`);
}

run();
