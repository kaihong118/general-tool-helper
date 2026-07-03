import { AxiosConfig } from '@wallet-manager/node-package-axios';

export default interface APIConfig {
  name: string;
  axios: {
    swapAgentAccessServer: AxiosConfig;
    abccWalletAccessServer: AxiosConfig;
    e6SimulatorServer: AxiosConfig;
  };

  e6SimulatorTransactionInfo: {
    e6SimulatorRequestMsg: string;
    e6SimulatorResponseMsg: string;
  };
}
