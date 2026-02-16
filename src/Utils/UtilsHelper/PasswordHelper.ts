import { ethers, Provider, SigningKey } from 'ethers';
import generator from 'generate-password';

export default class PasswordHelper {
  /**
   * @param options generator.GenerateOptions
   * @returns  Return random generate password
   */
  public static generatePassword(options: generator.GenerateOptions) {
    return generator.generate(options);
  }

  /**
   *
   * @returns  Return ethers.Wallet
   */
  public static generateKeyPair(
    privateKey?: string | SigningKey,
    provider?: Provider
  ): ethers.Wallet {
    let keyPair;
    if (privateKey) {
      keyPair = new ethers.Wallet(privateKey, provider);
    } else {
      keyPair = ethers.Wallet.createRandom();
    }

    return keyPair;
  }
}
