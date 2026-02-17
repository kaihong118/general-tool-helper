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
    'info'
  );

  const configPath = `${process.cwd()}/config/${constant.configName}.json`;
  const config = await FileHelper.readFile<APIConfig>(configPath);
  globalThis.serviceConfig = config.data;

  //local
  const baseURL = 'http://localhost:8087/';

  //dev
  // const baseURL = 'https://pmp-agent-api-access.dev.pfh-in.com';

  const axiosConfig = {
    ...globalThis.serviceConfig.axios.swapAgentAccessServer,
    baseURL,
    sensitiveEndpointSetting: {},
  };
  globalThis.axiosSwapAgentServer = await AxiosHelper.createAxios(
    axiosConfig,
    logger
  );

  return logger;
};

const testApi = async (logger: winston.Logger) => {
  //Portal Login
  const portalLoginBody = {
    email: 'eu39@18m.dev',
    password: 'Abcd1234.',
    deviceId: 'e22375e7-e5d5-4e16-bc50-09ea38c60296',
    programAgentId: 'PA-123456',
  };

  const portalLogin = (await globalThis.axiosSwapAgentServer.post(
    '/agent-portal/auth/login',
    portalLoginBody
  )) as unknown as { data: { result: { accessToken: string } } };
  const headers = {
    authorization: `Bearer ${portalLogin.data.result['accessToken']}`,
  };
  const params = {
    limit: 20,
    offset: 0,
  };

  const resp = await globalThis.axiosSwapAgentServer.get(
    `/agent-portal/pa-management/program-list/get-all`,
    { headers, params }
  );

  logger.info(resp.data);
};

const startServer = async () => {
  const logger = await assignServerConfig();
  testApi(logger);
};

startServer();
