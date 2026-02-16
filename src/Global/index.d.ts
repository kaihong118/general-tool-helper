/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-var */
import {
  AxiosError as OgAxiosError,
  AxiosInstance as OgAxiosInstance,
  AxiosRequestConfig as OgAxiosRequestConfig,
  AxiosResponse as OgAxiosResponse,
} from '@wallet-manager/node-package-axios';
import APIConfig from '../Model/APIConfig';

type AllowedEnv = 'testnet' | 'prod' | 'dev' | 'local';

export interface ServiceStartInfo {
  privateKey: string;
  publicKey: string;
  address: string;
  session: string;
  seq: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

declare global {
  var serviceConfig: APIConfig;
  // var auditLogs: AuditLog[];
  var axiosSwapAgentServer: AxiosInstance;
  var axiosAbccWalletAccessServer: AxiosInstance;

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: AllowedEnv;
    }
  }

  interface AxiosResponse<T = any> extends OgAxiosResponse<T> {
    config: AxiosRequestConfig;
  }
  interface AxiosRequestConfig extends OgAxiosRequestConfig {
    auditLog?: any;
  }
  interface AxiosInstance extends OgAxiosInstance {
    // eslint-disable-next-line unused-imports/no-unused-vars, @typescript-eslint/no-unused-vars
    get<T = unknown, R = AxiosResponse<T>, D = unknown>(
      url: string,
      config?: AxiosRequestConfig,
    ): Promise<R>;
    post<T = unknown, R = AxiosResponse<T>, D = unknown>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig,
    ): Promise<R>;
    postForm<T = unknown, R = AxiosResponse<T>, D = unknown>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig,
    ): Promise<R>;
  }
  interface AxiosError extends OgAxiosError {
    // eslint-disable-next-line unused-imports/no-unused-vars, @typescript-eslint/no-unused-vars
    config: AxiosRequestConfig;
  }
}
