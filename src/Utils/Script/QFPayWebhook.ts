import crypto from 'crypto';

// Client Credentials
const clientKey = '3ABB1BFFE2E0497BB9270978B0BXXXXX';

// Raw Content Data
const data: Record<string, string> = {
  status: '1',
  pay_type: '800101',
  sysdtm: '2020-06-15 10:32:58',
  paydtm: '2020-06-15 10:33:35',
  goods_name: '',
  txcurrcd: 'HKD',
  txdtm: '2020-06-15 10:32:58',
  mchid: 'O37MRh6Qq5',
  txamt: '10',
  exchange_rate: '',
  chnlsn2: '',
  out_trade_no: '9G3ZIWTG1R3IVSC2AH2O5EGKJQ7I72QO',
  syssn: '20200615000200020000641807',
  cash_fee_type: '',
  cancel: '0',
  respcd: '0000',
  goods_info: '',
  cash_fee: '0',
  notify_type: 'payment',
  chnlsn: '2020061522001453561406303428',
  cardcd: '2088032341453564',
};

// Python json.dumps(data) style for flat objects: {"k": "v", "k2": "v2"}
const pythonStyleJson = `{${Object.entries(data)
  .map(([k, v]) => `${JSON.stringify(k)}: ${JSON.stringify(v)}`)
  .join(', ')}}`;

const combineStr = pythonStyleJson + clientKey;
const signature = crypto
  .createHash('md5')
  .update(combineStr, 'utf8')
  .digest('hex')
  .toUpperCase();

console.log(signature);
