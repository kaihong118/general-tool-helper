import moment from 'moment';
import { ethers } from 'ethers';

export default class MessageHelper {
  public static genHashedMessage(
    timestamp: string,
    session: string,
    sequence: string,
    body: string
  ) {
    const _temp = `${timestamp}#${session}#${sequence}#${body}`;
    const _hashedMsg = ethers.utils.toUtf8Bytes(_temp);
    return ethers.utils.sha256(_hashedMsg);
  }

  public static sign(hashedMessage: string, privateKey: string) {
    const _signingKey = new ethers.utils.SigningKey(privateKey);
    const _signDigest = _signingKey.signDigest(hashedMessage);
    return ethers.utils.joinSignature(_signDigest);
  }

  public static createRequestHeader(
    privateKey: string,
    address: string,
    session: string,
    sequence: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any
  ) {
    const timeStamp = moment().valueOf().toString();
    const _dataStr = !data || data === '' ? '' : JSON.stringify(data);
    const Hash = this.genHashedMessage(
      timeStamp,
      session,
      sequence.toString(),
      _dataStr
    );
    const Signature = this.sign(Hash, privateKey);
    const headers = {
      'X-Message-Address': address,
      'X-Message-Timestamp': timeStamp,
      'X-Message-Session': session,
      'X-Message-Sequence': sequence,
      'X-Message-Signature': Signature,
    };
    return headers;
  }
}
