import { AxiosHelper } from '@wallet-manager/node-package-axios';
import { API } from '@wallet-manager/node-package-server';
import winston from 'winston';
import BigNumber from 'bignumber.js';

export async function assignAxios() {
  const logger = winston.createLogger({
    level: 'info',
    transports: [new winston.transports.Console()],
  });

  const exchangeRateAxios = await AxiosHelper.createAxios(
    {
      baseURL: 'https://v6.exchangerate-api.com',
      timeout: 30000,
      sensitiveEndpointSetting: {},
    },
    logger
  );

  const replacer = {
    apiKey: '396f4dba244b9693bd289515',
    baseCode: 'GBP',
    targetCode: 'HKD',
  };
  let endpoint = '/v6/:apiKey/pair/:baseCode/:targetCode';
  for (const key of Object.keys(replacer)) {
    endpoint = endpoint.replace(`:${key}`, encodeURIComponent(replacer[key]));
  }

  const result = await exchangeRateAxios.get<{ conversion_rate: number }>(
    endpoint
  );
  const amount = new BigNumber(8000); // Use BigNumber for the amount

  const exchangeRate = new BigNumber(result.data.conversion_rate); // Use BigNumber for precision
  const adjustmentFactor = new BigNumber(0.985);

  let finalExchangeRate = new BigNumber(1)
    .dividedBy(exchangeRate)
    .multipliedBy(adjustmentFactor); // Calculate the adjusted exchange rate

  const newGBPCurrency = amount.multipliedBy(finalExchangeRate); // Calculate the adjusted amount

  logger.info(`Exchange Rate: ${exchangeRate.toString()}`);
  logger.info(
    `Final Exchange Rate (adjusted): ${finalExchangeRate.toString()}`
  );
  logger.info(`New GBP Currency Amount: ${newGBPCurrency.toString()}`);
}

export async function test() {
  await assignAxios();
}
test();
