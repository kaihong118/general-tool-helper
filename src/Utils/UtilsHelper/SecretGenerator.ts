import { createHmac, createHash } from 'crypto';

export default class SecretGenerator {
  public static generateHashedSecret(
    email: string,
    password: string,
    salt?: string
  ) {
    if (salt) {
      const hashedPassword = createHmac('sha256', password, {
        encoding: 'utf8',
      })
        .update(`${email}${salt}`)
        .digest('hex');
      return hashedPassword;
    }

    const hashedPassword = createHash('sha256')
      .update(`${email}${password}`)
      .digest('hex');
    return hashedPassword;
  }

  public static generateMd5HashedString(stringValue: string) {
    const hashedString = createHash('md5').update(stringValue).digest('hex');
    return hashedString;
  }

  public static verifyHmacBySHA256(
    data: string,
    key: string,
    signature: string
  ) {
    const sign = createHash('sha256').update(data).digest('hex');
    return sign;
  }

  /**
   * Generate Sha 256 hashed value
   * @param content content
   * @returns hashed value
   */
  static generateSha256HashedSecret(content: string, secret: string): string {
    return createHash('sha256').update(`${content}`).digest('hex');
  }
}
