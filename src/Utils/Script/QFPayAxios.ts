import axios from 'axios';
import { createHash } from 'crypto';
import winston from 'winston';

interface TradeQueryRequest {
  mchid?: string;
  syssn?: string;
  out_trade_no?: string;
  pay_type?: string;
  respcd?: string;
  start_time?: string;
  end_time?: string;
  page?: string;
  page_size?: string;
  [key: string]: string | undefined;
}

interface TradeQueryRecord {
  syssn?: string;
  out_trade_no?: string;
  txamt?: string;
  txcurrcd?: string;
  respcd?: string;
  errmsg?: string;
  pay_type?: string;
  order_type?: string;
  txdtm?: string;
  sysdtm?: string;
  cancel?: string;
  cash_fee?: string;
  cash_fee_type?: string;
  origssn?: string;
  [key: string]: unknown;
}

interface TradeQueryResponse {
  respcd: string;
  resperr?: string;
  data?: TradeQueryRecord[];
  [key: string]: unknown;
}

function buildSortedQuery(params: TradeQueryRequest): string {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== '')
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
}

function createTradeQuerySignature(
  params: TradeQueryRequest,
  clientKey: string,
): string {
  return createHash('md5')
    .update(`${buildSortedQuery(params)}${clientKey}`, 'utf8')
    .digest('hex')
    .toUpperCase();
}

export async function queryTrade(
  baseURL: string,
  appCode: string,
  clientKey: string,
  params: TradeQueryRequest,
): Promise<TradeQueryResponse> {
  const requestBody = new URLSearchParams();

  Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== '')
    .forEach(([key, value]) => {
      requestBody.append(key, value as string);
    });

  const sign = createTradeQuerySignature(params, clientKey);
  const response = await axios.post<TradeQueryResponse>(
    `${baseURL}/trade/v1/query`,
    requestBody.toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-QF-APPCODE': appCode,
        'X-QF-SIGN': sign,
      },
      timeout: 30000,
    },
  );

  return response.data;
}

export async function testTradeQueryApiRequest() {
  const logger = winston.createLogger({
    level: 'info',
    transports: [new winston.transports.Console()],
  });

  const baseURL = 'https://openapi-int.qfapi.com';
  const appCode = 'FA01F8A3328945A491DA223C6D7700F1';
  const clientKey = '8C1D50C198EE4D51939746CD70485F7F';

  const requestParams: TradeQueryRequest = {
    out_trade_no: '58735127-d5cc-431b-a386-0a4e52151b76',
  };

  logger.info(`Trade query request body: ${buildSortedQuery(requestParams)}`);

  const result = await queryTrade(baseURL, appCode, clientKey, requestParams);
  logger.info(`Trade query response: ${JSON.stringify(result, null, 2)}`);
}

export async function test() {
  await testTradeQueryApiRequest();
}

test().catch((error: unknown) => {
  const logger = winston.createLogger({
    level: 'error',
    transports: [new winston.transports.Console()],
  });
  logger.error(error);
});
