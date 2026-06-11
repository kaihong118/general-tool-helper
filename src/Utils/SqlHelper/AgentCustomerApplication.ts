import moment from 'moment';
import UtilHelper from './UtilsHelper';

const template = `
-- :applicationNumber
update swap_agent.agent_customer_applications
set
    status = '6',
    error = null
where
    application_number = ':applicationNumber'
    and id = ':id'
    and status = ':status';
`;

const data = [
  {
    id: 6381,
    merchant_id: 6,
    status: 6,
    step: 100,
    customer_id: 'f97e1191-fdaf-4d49-a93a-a55da1440320',
    customer_number: '3002X10011223050266',
    customer_level: 'R00',
    program_agent_id: 'PA-E006',
    distributor_agent_id: 'DA-0013@PA-E006',
    agent_type: '2',
    email: '1c289799d552e124fd22d52e7e76ab34',
    phone_country_code: 'e098c674433d6b6811804ab637afcc83',
    phone_number: '63101e36d42d6e9037823cd21c3533d4',
    first_name: '0d3133e7ed48278b30af611b4a8cd833',
    last_name: '51389d875752b54087e61c3f12726d4e',
    id_issued_by: '***N\/A***',
    id_type: 7,
    id_number_encrypted: 'HTU+K4TPWL\/odlg=',
    cipher: 'sFcwqjSewQRntCHGAwcEBzrVUBePGZbz',
    date_of_birth: '***',
    referral_code: '',
    application_number: '2b011d3a-5d05-4f22-a968-1f96bd38ba55',
    question_version: '-1',
    answers: '***',
    tcsp_application_number: null,
    tcsp_question_version: '-1',
    tcsp_answers: '***',
    error:
      '{"code": -5, "data": null, "message": "open \/data\/document-1655466058.png: permission denied", "InnerError": null}',
    program_name: 'VTitan-E006-P294',
    created_by: 'e006d0013@golden-leasing.com',
    created_date: '2026-06-11T03:25:31.491Z',
    last_modified_by: 'e006d0013@golden-leasing.com',
    last_modified_date: '2026-06-11T08:18:10.916Z',
  },
  {
    id: 6380,
    merchant_id: 6,
    status: 6,
    step: 100,
    customer_id: '81985694-308e-4d03-b55a-8726bfcde909',
    customer_number: '3002X10012024690730',
    customer_level: 'R00',
    program_agent_id: 'PA-E003',
    distributor_agent_id: 'DA-0003@PA-E003',
    agent_type: '2',
    email: 'a7a9d5f924ecc39667dabc37aadd0d5b',
    phone_country_code: 'c5576c81157981db3c125304c054f7e1',
    phone_number: '0120eb3cba6abc416ab0b63ff92ee0dd',
    first_name: 'd17bdc22d3b62fe8170dec912692c8df',
    last_name: 'd0cd2693b3506677e4c55e91d6365bff',
    id_issued_by: 'CHN',
    id_type: 9,
    id_number_encrypted: '4F0TjLzSGDVU+OnT5GLbC6cD',
    cipher: 'bXpGFKEHkKnIAvsHOOutdRKRwdtRYCLu',
    date_of_birth: '***',
    referral_code: '',
    application_number: '71e1672f-8554-4859-a8c4-47ad6fab15eb',
    question_version: '-1',
    answers: '***',
    tcsp_application_number: null,
    tcsp_question_version: '-1',
    tcsp_answers: '***',
    error:
      '{"code": -5, "data": null, "message": "open \/data\/document-2962506585.png: permission denied", "InnerError": null}',
    program_name: 'VGL-E003-BLUEP474',
    created_by: 'info@fivefongsolution.com',
    created_date: '2026-06-11T03:20:28.126Z',
    last_modified_by: 'info@fivefongsolution.com',
    last_modified_date: '2026-06-11T03:26:19.549Z',
  },
  {
    id: 6379,
    merchant_id: 6,
    status: 6,
    step: 100,
    customer_id: '696cba6d-d6b0-46ae-8706-42dc6c303f91',
    customer_number: '3002X10010452270496',
    customer_level: 'R00',
    program_agent_id: 'PA-E006',
    distributor_agent_id: 'DA-0020@PA-E006',
    agent_type: '2',
    email: '1bb4613ba44a127c7629f44fbeb5ec06',
    phone_country_code: '68022d64f95e59643022bcfb43d04e44',
    phone_number: 'ef20f9843ade782e6cfdc87aafa2a369',
    first_name: '35244a857c482ceebeb8adb44c1b9921',
    last_name: 'e9064b74d28acc053231170bb8c858b3',
    id_issued_by: '***N\/A***',
    id_type: 7,
    id_number_encrypted: 'lkv+w1tj97bC',
    cipher: 'kvMkyJamtNhofUUmqWQTTMbwduClPTSX',
    date_of_birth: '***',
    referral_code: '',
    application_number: '00034461-ab12-4bb3-b9bd-e7e9b7180d60',
    question_version: '-1',
    answers: '***',
    tcsp_application_number: null,
    tcsp_question_version: '-1',
    tcsp_answers: '***',
    error:
      '{"code": -5, "data": null, "message": "open \/data\/document-998323380.png: permission denied", "InnerError": null}',
    program_name: 'VTitan-E006-P294',
    created_by: 'e006d0020@golden-leasing.com',
    created_date: '2026-06-11T02:58:46.568Z',
    last_modified_by: 'e006d0020@golden-leasing.com',
    last_modified_date: '2026-06-11T08:55:51.578Z',
  },
  {
    id: 6378,
    merchant_id: 6,
    status: 6,
    step: 100,
    customer_id: '5febc4cf-4f7d-4828-93a5-0fd3c57902a7',
    customer_number: '3002X10008881560180',
    customer_level: 'R00',
    program_agent_id: 'PA-E003',
    distributor_agent_id: 'DA-0021@PA-E003',
    agent_type: '2',
    email: 'd0fa0e19d087cb79415e35f758d76b7f',
    phone_country_code: 'ed158d87c47afe658dd159c1a0f18f47',
    phone_number: 'd83912e116ba632513c923da78dcbc63',
    first_name: 'ce5225d01c39d2567bc229501d9e610d',
    last_name: '53fec4cda201806226c4852e4678eaa0',
    id_issued_by: '***N\/A***',
    id_type: 7,
    id_number_encrypted: 'OXnqoTG36lh1',
    cipher: 'MjuVqOsGHCrfjnlHOXqMqpOqBjOOkEAv',
    date_of_birth: '***',
    referral_code: '',
    application_number: '1df18a01-41fe-4c47-ba01-198644234c4f',
    question_version: '-1',
    answers: '***',
    tcsp_application_number: null,
    tcsp_question_version: '-1',
    tcsp_answers: '***',
    error:
      '{"code": -5, "data": null, "message": "open \/data\/document-479471010.png: permission denied", "InnerError": null}',
    program_name: 'VGL-E003-PURPLEP274',
    created_by: 'support@volantechain.com',
    created_date: '2026-06-11T02:52:22.444Z',
    last_modified_by: 'support@volantechain.com',
    last_modified_date: '2026-06-11T02:55:27.004Z',
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
      applicationNumber: x.application_number,
      status: x.status,
    });

    outputSql += sql;
  }
  outputSql += '\nCOMMIT;';

  UtilHelper.writeFile(
    `/Users/lucas/Downloads/SQL/${moment().format(
      'YYYY-MM-DD HHmm',
    )} [swap_agent] Data patch agent customer application (${ticketNo}).sql`,
    outputSql,
  );

  console.log(`✅ SQL file written`);
}

run();
