import { AxiosHelper } from '@wallet-manager/node-package-axios';
import { FileHelper, LoggerHelper } from '@wallet-manager/node-package-util';
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import path from 'path';
import winston from 'winston';
import { constant } from '../../Const';
import APIConfig from '../../Model/APIConfig';

const assignServerConfig = async () => {
  dotenv.config();

  const logger = LoggerHelper.createRotateLogger(
    'general-tool-helper',
    undefined,
    true,
    {
      dist:
        process.env.NODE_ENV == 'local'
          ? path.join(__dirname, '../logs')
          : path.join(__dirname, '../../logs'),
      proj: 'logs',
    },
    'server',
    'info',
  );

  const env = process.env.NODE_ENV || 'local';
  const configPath = `${process.cwd()}/config/${constant.configName}-${env}.json`;
  const config = await FileHelper.readFile<APIConfig>(configPath);
  globalThis.serviceConfig = config.data;

  const baseURL =
    'https://visa-paysim.h3apac2-uat.aws.tst.e6tech.net/restful/v1';

  const axiosConfig = {
    ...globalThis.serviceConfig.axios.e6SimulatorServer,
    baseURL,
    sensitiveEndpointSetting: {},
  };
  globalThis.axiosE6SimulatorServer = await AxiosHelper.createAxios(
    axiosConfig,
    logger,
  );

  return logger;
};

const testApi = async (logger: winston.Logger) => {
  const endpoint = '/payment/simulator/clear';

  const acquirerAmount = 100;
  const billingAmount = 100;
  const mcc = '5812';
  const pan = '4518880055555090';
  const expiry = '202906';

  const reqBody = {
    acquirerAmount: {
      amount: acquirerAmount,
      currencyCode: 'HKD',
    },
    billingAmount: {
      amount: billingAmount,
      currencyCode: 'HKD',
    },
    mcc,
    acceptorAddress: 'POS',
    acceptorCity: 'Hong Kong',
    acceptorCountryCode: 'HK',
    pan,
    expiry,
    cardPresent: true,
    transactionType: 'Purchase',
    partialAuth: false,
  };

  const response = await globalThis.axiosE6SimulatorServer.post(
    endpoint,
    reqBody,
  );

  console.log(JSON.stringify(response.data, null, 2));
};

const startServer = async () => {
  const logger = await assignServerConfig();
  testApi(logger);
};

startServer();
