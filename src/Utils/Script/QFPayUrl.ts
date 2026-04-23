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
  [key: string]: string | SignType | undefined;
}

function buildHostedCheckoutUrl(
  baseURL: string,
  params: HostedCheckoutParams,
  clientKey: string,
): string {
  const sortedQuery = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&');
  const signPayload = `${sortedQuery}${clientKey}`;
  const sign = createHash('sha256').update(signPayload, 'utf8').digest('hex');
  return `${baseURL}/checkstand/#/?${sortedQuery}&sign=${sign}`;
}

export async function testHostedCheckoutApiRequest() {
  const logger = winston.createLogger({
    level: 'info',
    transports: [new winston.transports.Console()],
  });

  const baseURL = 'https://openapi-int.qfapi.com';
  const appcode = 'FA01F8A3328945A491DA223C6D7700F1';
  const clientKey = '8C1D50C198EE4D51939746CD70485F7F';

  const requestParams: HostedCheckoutParams = {
    appcode,
    sign_type: 'SHA256',
    paysource: 'remote_checkout',
    txamt: '33300',
    txcurrcd: 'HKD',
    out_trade_no: '64382132-32a5-4746-af94-a4b204ef392a',
    txdtm: '2026-04-16 02:20:02',
    return_url: 'https://gw-paywiser-web.dev.pfh-in.com/status',
    failed_url: 'https://gw-paywiser-web.dev.pfh-in.com/status',
    notify_url: 'https://gw-qfpay-handler.dev.pfh-in.com/qfpay-callback',
  };

  const checkoutUrl = buildHostedCheckoutUrl(baseURL, requestParams, clientKey);
  // logger.info(`Checkout redirect URL: ${checkoutUrl}`);
  logger.info(
    `Checkout redirect URL (Decoded): ${decodeURIComponent(checkoutUrl)}`,
  );

  // const axiosInstance = await AxiosHelper.createAxios(
  //   {
  //     baseURL,
  //     timeout: 30000,
  //     sensitiveEndpointSetting: {},
  //   },
  //   logger,
  // );

  // Smoke check: hosted checkout is a redirect page, so a 200 HTML response means request URL is accepted.
  // const endpoint = checkoutUrl.replace(`${baseURL}`, '');
  // const result = await axiosInstance.get<string>(endpoint);
  // logger.info(`Checkout page response data: ${result.data}`);
  // logger.info(`Checkout page response status: ${result.status}`);
}

export async function test() {
  await testHostedCheckoutApiRequest();
}
test();
