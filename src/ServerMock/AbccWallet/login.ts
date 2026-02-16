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
    'general-tools',
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
    'info'
  );

  const configPath = `${process.cwd()}/config/${constant.configName}.json`;
  const config = await FileHelper.readFile<APIConfig>(configPath);
  globalThis.serviceConfig = config.data;

  //local
  const baseURL = 'http://localhost:8095/';

  //dev
  // const baseURL = 'https://awt-api-access.dev-wallet.pfh-in.com';

  const axiosConfig = {
    ...globalThis.serviceConfig.axios.abccWalletAccessServer,
    baseURL,
    sensitiveEndpointSetting: {},
  };
  globalThis.axiosAbccWalletAccessServer = await AxiosHelper.createAxios(
    axiosConfig,
    logger
  );

  return logger;
};

const testApi = async (logger: winston.Logger) => {
  const email = 'eu14@test.com';

  const vu1Body = {
    merchantId: 268,
    secret: 'ER6HhdB',
    email,
    phoneNumber: '1',
    type: 2,
  };
  const vu1Resp = (await globalThis.axiosAbccWalletAccessServer.post(
    '/webapp/request-verify-token',
    vu1Body
  )) as unknown as { data: { result: { verifyToken: string } } };
  let headers = {
    authorization: `Bearer ${vu1Resp.data.result.verifyToken}`,
  };

  const vu2Body = {
    email,
    lang: 'en',
  };
  (await globalThis.axiosAbccWalletAccessServer.post(
    '/webapp/request-email-code',
    vu2Body,
    { headers }
  )) as unknown as { data: { result: { verifyToken: string } } };

  const vu3Body = {
    email,
    code: '000000',
  };
  const vu3Resp = (await globalThis.axiosAbccWalletAccessServer.post(
    '/webapp/verify-email-code',
    vu3Body,
    { headers }
  )) as unknown as { data: { result: { verifyToken: string } } };
  headers = {
    authorization: `Bearer ${vu3Resp.data.result.verifyToken}`,
  };

  const vu6Body = {
    signAddress: '0x4268B05FfAEAEFecFBa15961B1B2498CaBD275b6', //eu14@test.com
    // signAddress: '0x5E42E6896C42b970aeB9c78e27042EA61B9eD62F', //eu39+4@test.com
  };
  const lu6Resp = (await globalThis.axiosAbccWalletAccessServer.post(
    '/webapp/verify-wallet-address',
    vu6Body,
    { headers }
  )) as unknown as { data: { result: { verifyToken: string } } };
  headers = {
    authorization: `Bearer ${lu6Resp.data.result.verifyToken}`,
  };

  const lu1Body = {
    email,
    abccPassword: 'Abcd123.',
  };
  const lu1Resp = (await globalThis.axiosAbccWalletAccessServer.post(
    '/webapp/get-login-info',
    lu1Body,
    { headers }
  )) as unknown as { data: { result: { verifyToken: string } } };
  headers = {
    authorization: `Bearer ${lu1Resp.data.result.verifyToken}`,
  };

  const lu4Body = {};
  const lu4Resp = (await globalThis.axiosAbccWalletAccessServer.post(
    '/webapp/login',
    lu4Body,
    { headers }
  )) as unknown as { data: { result: { accessToken: string } } };

  logger.info(`accessToken: ${lu4Resp.data.result.accessToken}`);
};

const startServer = async () => {
  const logger = await assignServerConfig();
  testApi(logger);
};

startServer();
