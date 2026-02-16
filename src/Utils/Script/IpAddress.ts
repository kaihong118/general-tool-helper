import { AxiosHelper } from '@wallet-manager/node-package-axios';
import { API } from '@wallet-manager/node-package-server';
import winston from 'winston';

export async function assignAxios() {
  const logger = winston.createLogger({
    level: 'info',
    transports: [new winston.transports.Console()],
  });

  const ipAddressAxios = await AxiosHelper.createAxios(
    {
      baseURL: 'https://ipwho.is',
      timeout: 30000,
      sensitiveEndpointSetting: {},
    },
    logger
  );

  const replacer = {
    ipAddress: '39.99.147.251',
  };
  let endpoint = '/:ipAddress';
  for (const key of Object.keys(replacer)) {
    endpoint = endpoint.replace(`:${key}`, encodeURIComponent(replacer[key]));
  }

  const result = await ipAddressAxios.get<API.ResponseBase>(endpoint);
  logger.info(result.data);
}

export async function test() {
  await assignAxios();
}
test();
