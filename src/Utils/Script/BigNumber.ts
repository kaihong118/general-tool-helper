/**
 * Array Helper Testing
 */

import BigNumber from 'bignumber.js';

const thresholdAmount = new BigNumber(5000);
const balance = new BigNumber(4000);
const stepAmount = new BigNumber(100);

const alertLevel = BigNumber(
  thresholdAmount
    .minus(balance)
    .dividedBy(stepAmount)
    .toFormat(0, BigNumber.ROUND_FLOOR)
);

const alertStep = thresholdAmount
  .minus(alertLevel.multipliedBy(stepAmount))
  .toFormat();

console.log(alertLevel.multipliedBy(stepAmount).toFormat());
console.log(alertStep);
