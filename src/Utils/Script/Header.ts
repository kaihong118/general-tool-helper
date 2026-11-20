/**
 * Message Helper Testing
 */

import { ethers } from 'ethers';
import MessageHelper from '../UtilsHelper/MessageHelper';

const data: any = undefined;
const privateKey =
  '0x9236301278d19619904e13ca6b3a6efe6427deef320b6285361382c7b984a209';
const address = '0x95382148924366AB4a8E40fd54024486433f02B5';
const session = '2802689';
const sequence = 5775;
const timestamp = 1795050989621;

function genHashedMessage(
  timestamp: string,
  session: string,
  sequence: string,
  body: string,
) {
  const _temp = `${timestamp}#${session}#${sequence}#${body}`;
  const _hashedMsg = ethers.toUtf8Bytes(_temp);
  return ethers.sha256(_hashedMsg);
}

function sign(hashedMessage: string, privateKey: string) {
  const _signingKey = new ethers.SigningKey(privateKey);
  const _signDigest = _signingKey.sign(hashedMessage);
  return ethers.Signature.from(_signDigest).serialized;
}

const test = async () => {
  // const timeStamp = moment().valueOf().toString();
  // const _dataStr = !data || data === '' ? '' : JSON.stringify(data);

  // const Hash = genHashedMessage(
  //   timeStamp,
  //   session,
  //   sequence.toString(),
  //   _dataStr,
  // );

  // const Signature = sign(Hash, privateKey);

  // const headers = {
  //   'X-Message-Address': address,
  //   'X-Message-Timestamp': timeStamp,
  //   'X-Message-Session': session,
  //   'X-Message-Sequence': sequence,
  //   'X-Message-Signature': Signature,
  // };

  const headers = await MessageHelper.createRequestHeader(
    privateKey,
    address,
    session,
    sequence,
    data,
  );

  // const headers = await MessageHelper.createRequestHeaderWithoutRecoverParam(
  //   privateKey,
  //   address,
  //   session,
  //   sequence,
  //   data,
  // );

  console.log(headers);
};

test();
