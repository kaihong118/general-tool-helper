import { AxiosConfig } from '@wallet-manager/node-package-axios';

export default interface APIConfig {
  name: string;
  axios: {
    swapAgentAccessServer: AxiosConfig;
    abccWalletAccessServer: AxiosConfig;
  };
}
