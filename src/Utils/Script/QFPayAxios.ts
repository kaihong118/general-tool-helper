import { AxiosHelper } from '@wallet-manager/node-package-axios';
import { createHash } from 'crypto';
import winston from 'winston';

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
  return Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&');
}

function buildHostedCheckoutUrl(
  baseURL: string,
  params: HostedCheckoutParams,
  clientKey: string,
): string {
  const sortedQuery = buildSortedQuery(params);
  const signPayload = `${sortedQuery}${clientKey}`;
  const sign = createHash('sha256').update(signPayload, 'utf8').digest('hex');
  return `${baseURL}/checkstand/#/?${sortedQuery}&sign=${sign}`;
}

export async function testHostedCheckoutApiRequest() {
  const logger = winston.createLogger({
    level: 'info',
    transports: [new winston.transports.Console()],
  });

  const baseURL = 'https://test-openapi-hk.qfapi.com';
  const appcode = '90951A2954FE4CD7AD49BA5DCB010533';
  const clientKey = '4AFD0D10C54E42B5A9E9DE4217322A32';

  const requestParams: HostedCheckoutParams = {
    appcode,
    sign_type: 'SHA256',
    paysource: 'remotepay_checkout',
    txamt: '3',
    txcurrcd: 'HKD',
    out_trade_no: 'TXN1234567890101213',
    txdtm: '2025-03-30 15:13:00',
    return_url: 'https://merchant.example/success',
    failed_url: 'https://merchant.example/failed',
    notify_url: 'https://merchant.example/notify',
    goods_name: 'checkout_product',
  };

  const checkoutUrl = buildHostedCheckoutUrl(baseURL, requestParams, clientKey);
  // logger.info(`Checkout redirect URL: ${checkoutUrl}`);
  logger.info(
    `Checkout redirect URL (Decoded): ${decodeURIComponent(checkoutUrl)}`,
  );

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
