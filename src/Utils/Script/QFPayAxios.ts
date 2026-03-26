import { AxiosHelper } from '@wallet-manager/node-package-axios';
import moment from 'moment';
import winston from 'winston';
import SecretGenerator from '../UtilsHelper/SecretGenerator';

type SignType = 'SHA256' | 'MD5';

interface HostedCheckoutParams {
  appcode: string;
  sign_type: SignType;
  paysource: string;
  txamt: string;
  txcurrcd: string;
  out_trade_no: string;
  txdtm: string;
  return_url: string;
  failed_url: string;
  notify_url: string;
  goods_name?: string;
  lang?: 'zh-hk' | 'zh-cn' | 'en';
  cancel_url?: string;
  mchntid?: string;
}

function buildSortedQuery(params: HostedCheckoutParams): string {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== '')
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join('&');
}

function buildHostedCheckoutUrl(
  baseURL: string,
  params: HostedCheckoutParams,
  clientKey: string,
): string {
  const sortedQuery = buildSortedQuery(params);
  const sign = SecretGenerator.generateSha256HashedSecret(
    `${sortedQuery}${clientKey}`,
  );
  return `${baseURL}/checkstand/#/?${sortedQuery}&sign=${sign}`;
}

export async function testHostedCheckoutApiRequest() {
  const logger = winston.createLogger({
    level: 'info',
    transports: [new winston.transports.Console()],
  });

  const baseURL = 'https://test-openapi-hk.qfapi.com';
  const appcode = 'YOUR_APPCODE';
  const clientKey = 'YOUR_CLIENT_KEY';

  const requestParams: HostedCheckoutParams = {
    appcode,
    sign_type: 'SHA256',
    paysource: 'remotepay_checkout',
    txamt: '1099',
    txcurrcd: 'HKD',
    out_trade_no: 'TXN1234567890',
    txdtm: moment().format('YYYY-MM-DD HH:mm:ss'),
    return_url: 'https://merchant.example/success',
    failed_url: 'https://merchant.example/failed',
    notify_url: 'https://merchant.example/notify',
    goods_name: 'checkout_product',
    lang: 'en',
    cancel_url: 'https://merchant.example/cancel',
  };

  const checkoutUrl = buildHostedCheckoutUrl(baseURL, requestParams, clientKey);
  logger.info(`Checkout redirect URL: ${checkoutUrl}`);

  const axiosInstance = await AxiosHelper.createAxios(
    {
      baseURL,
      timeout: 30000,
      sensitiveEndpointSetting: {},
    },
    logger,
  );

  // Smoke check: hosted checkout is a redirect page, so a 200 HTML response means request URL is accepted.
  const endpoint = checkoutUrl.replace(`${baseURL}`, '');
  const result = await axiosInstance.get<string>(endpoint);
  logger.info(`Checkout page response data: ${result.data}`);
  logger.info(`Checkout page response status: ${result.status}`);
}

export async function test() {
  await testHostedCheckoutApiRequest();
}
test();
