/**
 * mean the signature’s recovery byte, v, which is the final byte of a 65-byte Ethereum signature:
 * 1b is hex for 27
 * 1c is hex for 28
 */

import { Signature } from 'ethers';

const signature =
  '0xa7f68df7ef7646670b0df4b04f8c18509d1e39ed968048e1e005092a3427dcb8098087aea57060df3e7836d6f67fcac1ca7b2d7f484c1a57559ca0469bb95f071b';
const parsed = Signature.from(signature);

console.log(parsed.v); // 27 or 28
console.log(parsed.yParity); // 0 or 1
