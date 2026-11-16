/**
 * Debug helper for FeeService.calculateFeeSetting
 *
 * Source of truth:
 *   pfh-node-ms-api-authorisation-processor/src/service/Cache/FeeService.ts
 *   pfh-node-ms-api-authorisation-processor/src/controller/CoopAuthorizationRouter/RiskAndFeeController.ts
 *
 * Run: file=DebugFeeSetting.ts npm run script
 */

import BigNumber from 'bignumber.js';

/**
 * Shapes mirror @wallet-manager/pfh-node-def-types CreditRiskAndFee.
 *
 * NOTE: fixedFee / feeRate / markupFixedFee / markupFeeRate are `DECIMAL`
 * columns in sequelize, so the real service receives them as STRINGS
 * (e.g. "6.88"), not numbers. BigNumber handles both, but the types below
 * reflect what actually arrives at runtime.
 */
interface AdditionalFeeSetting {
  id: string;
  feeSettingId: string;
  programName: string;
  cardAcceptorCountryCode?: string | null;
  acquirerCurrency?: string | null;
  fixedFee: number | string;
  feeRate: number | string;
  markupFixedFee: number | string;
  markupFeeRate: number | string;
  /** EnumFeeSettingStatus: Enabled = 1 */
  status: number;
  createdDate: string;
  lastModifiedDate: string;
}

interface FeeSetting {
  id: string;
  programName: string;
  /** EnumFeeName, e.g. 'oversea_purchase_default' */
  feeName: string;
  fixedFee: number | string;
  feeRate: number | string;
  markupFixedFee: number | string;
  markupFeeRate: number | string;
  /** EnumFeeSettingStatus: Enabled = 1 */
  status: number;
  createdDate: string;
  lastModifiedDate: string;
  effectiveDateFrom: string;
  effectiveDateTo?: string | null;
  createdBy?: string;
  lastModifiedBy?: string;
  /** Set on the OUTPUT feePlan by calculateFeeSetting when additional applies */
  additionalFeeSetting?: AdditionalFeeSetting;
}

/**
 * Input of FeeService.calculateFeeSetting.
 * `additionalFeeSetting` is a SIBLING of feeSetting here, not nested inside it.
 * (The nested shape you see in the response is the OUTPUT `feePlan`, which
 * upstream mutates with `feePlan.additionalFeeSetting = {...additionalFeeSetting}`.)
 */
interface FeePlanInput {
  feeSetting: FeeSetting;
  additionalFeeSetting: AdditionalFeeSetting | undefined;
}

// ============================================================================
// INPUT - edit these values before running
// ============================================================================

const feePlan: FeePlanInput = {
  feeSetting: {
    id: '465',
    programName: 'pfh_finance_consumer_wallet_dev',
    feeName: 'local_purchase_default',
    fixedFee: '0',
    feeRate: '2.21',
    markupFixedFee: '0',
    markupFeeRate: '2.21',
    status: 1,
    createdDate: '2026-11-04T08:12:08.523Z',
    lastModifiedDate: '2026-11-04T08:12:08.523Z',
    effectiveDateFrom: '2026-11-04T08:12:07.964Z',
    effectiveDateTo: null,
    createdBy: 'eu39@18m.dev',
    lastModifiedBy: 'eu39@18m.dev',
  },
  additionalFeeSetting: {
    id: '89',
    programName: 'pfh_finance_consumer_wallet_dev',
    feeSettingId: '465',
    cardAcceptorCountryCode: 'HK',
    acquirerCurrency: null,
    fixedFee: '0',
    feeRate: '2.21',
    markupFixedFee: '0',
    markupFeeRate: '2.21',
    status: 1,
    createdDate: '2026-11-04T08:12:08.720Z',
    lastModifiedDate: '2026-11-04T08:12:08.720Z',
  },
};

const billingAmount = '3';
const isIncrementalAuth = false;
const feeAmount = 0;
const decimals = 6;

// ============================================================================
// CLONED LOGIC - do not edit
// ============================================================================

/**
 * Clone of FeeService.calculateFeeSetting with each rate component rounded up before summing.
 */
function calculateFeeSetting(
  feePlans: FeePlanInput | null,
  billingAmount: string,
  isIncrementalAuth = false,
) {
  if (!feePlans) {
    return undefined;
  }

  const { feeSetting, additionalFeeSetting } = feePlans;
  const billingBn = BigNumber(billingAmount || 0);
  let fixedFeeAmountBn = BigNumber(0);
  let feeRateAmountBn = BigNumber(0);
  let additionalFixedFeeAmount = BigNumber(0);
  let additionalRateAmountBn = BigNumber(0);
  const feePlan = { ...feeSetting };

  if (isIncrementalAuth && billingBn.isNegative()) {
    return undefined;
  }

  fixedFeeAmountBn = BigNumber(feePlan.fixedFee || 0).plus(
    BigNumber(feePlan.markupFixedFee || 0),
  );

  feeRateAmountBn = billingBn
    .times(BigNumber(feePlan.feeRate).div(100))
    .decimalPlaces(2, BigNumber.ROUND_UP)
    .plus(
      billingBn
        .times(BigNumber(feePlan.markupFeeRate).div(100))
        .decimalPlaces(2, BigNumber.ROUND_UP),
    );

  if (additionalFeeSetting) {
    feePlan.additionalFeeSetting = { ...additionalFeeSetting };

    additionalFixedFeeAmount = BigNumber(additionalFeeSetting.fixedFee || 0)
      .decimalPlaces(2, BigNumber.ROUND_UP)
      .plus(
        BigNumber(additionalFeeSetting.markupFixedFee || 0).decimalPlaces(
          2,
          BigNumber.ROUND_UP,
        ),
      );

    additionalRateAmountBn = billingBn
      .times(BigNumber(additionalFeeSetting.feeRate || 0).div(100))
      .decimalPlaces(2, BigNumber.ROUND_UP)
      .plus(
        billingBn
          .times(BigNumber(additionalFeeSetting.markupFeeRate || 0).div(100))
          .decimalPlaces(2, BigNumber.ROUND_UP),
      );
  }

  const fixedFeeAmount = isIncrementalAuth
    ? 0
    : fixedFeeAmountBn
        .decimalPlaces(2, BigNumber.ROUND_UP)
        .plus(additionalFixedFeeAmount)
        .toNumber();
  const feeRateAmount = feeRateAmountBn
    .decimalPlaces(2, BigNumber.ROUND_UP)
    .plus(additionalRateAmountBn.decimalPlaces(2, BigNumber.ROUND_UP))
    .toNumber();

  return { feePlan, fixedFeeAmount, feeRateAmount };
}

/** Clone of NumberHelper.toNonDecimal */
function toNonDecimal(number: number | string, decimals: number): number {
  return BigNumber(number).times(Math.pow(10, decimals)).toNumber();
}

// ============================================================================
// RUN
// ============================================================================

function run() {
  console.log('===== INPUT =====');
  console.log('billingAmount     :', billingAmount);
  console.log('isIncrementalAuth :', isIncrementalAuth);
  console.log('feeAmount         :', feeAmount);
  console.log('decimals          :', decimals);
  console.log('feePlan           :', JSON.stringify(feePlan, null, 2));

  const result = calculateFeeSetting(feePlan, billingAmount, isIncrementalAuth);

  if (!result) {
    console.log('\n===== RESULT =====');
    console.log(
      'calculateFeeSetting returned undefined (feePlans was null, or isIncrementalAuth with negative billingAmount)',
    );
    return;
  }

  const { feeSetting, additionalFeeSetting } = feePlan;
  const billingBn = BigNumber(billingAmount || 0);
  const rateFeeComponents = [
    {
      name: 'feeSetting.feeRate',
      rawAmount: billingBn.times(BigNumber(feeSetting.feeRate).div(100)),
    },
    {
      name: 'feeSetting.markupFeeRate',
      rawAmount: billingBn.times(BigNumber(feeSetting.markupFeeRate).div(100)),
    },
  ];

  if (additionalFeeSetting) {
    rateFeeComponents.push(
      {
        name: 'additionalFeeSetting.feeRate',
        rawAmount: billingBn.times(
          BigNumber(additionalFeeSetting.feeRate || 0).div(100),
        ),
      },
      {
        name: 'additionalFeeSetting.markupFeeRate',
        rawAmount: billingBn.times(
          BigNumber(additionalFeeSetting.markupFeeRate || 0).div(100),
        ),
      },
    );
  }

  const roundAfterSumming = rateFeeComponents
    .reduce((total, component) => total.plus(component.rawAmount), BigNumber(0))
    .decimalPlaces(2, BigNumber.ROUND_UP);
  const roundEachBeforeSumming = rateFeeComponents.reduce(
    (total, component) =>
      total.plus(component.rawAmount.decimalPlaces(2, BigNumber.ROUND_UP)),
    BigNumber(0),
  );

  console.log('\n===== RATE ROUNDING COMPARISON =====');
  for (const component of rateFeeComponents) {
    console.log(
      `${component.name}: raw ${component.rawAmount.toString()} -> rounded ${component.rawAmount
        .decimalPlaces(2, BigNumber.ROUND_UP)
        .toString()}`,
    );
  }
  console.log('Round after summing components :', roundAfterSumming.toString());
  console.log(
    'Round each before summing      :',
    roundEachBeforeSumming.toString(),
  );
  console.log(
    'Difference (before - after)    :',
    roundEachBeforeSumming.minus(roundAfterSumming).toString(),
  );
  console.log(
    'Matches current feeRateAmount  :',
    roundEachBeforeSumming.eq(result.feeRateAmount),
  );

  console.log('\n===== STEP 1: fixed fee (feeSetting) =====');
  console.log(
    `fixedFee ${feeSetting.fixedFee} + markupFixedFee ${feeSetting.markupFixedFee} = ${BigNumber(
      feeSetting.fixedFee || 0,
    )
      .plus(BigNumber(feeSetting.markupFixedFee || 0))
      .toString()}`,
  );

  console.log('\n===== STEP 2: rate fee (feeSetting) =====');
  console.log(
    `billing ${billingBn.toString()} * (feeRate ${feeSetting.feeRate} / 100) = ${billingBn
      .times(BigNumber(feeSetting.feeRate).div(100))
      .decimalPlaces(2, BigNumber.ROUND_UP)
      .toString()}`,
  );
  console.log(
    `billing ${billingBn.toString()} * (markupFeeRate ${feeSetting.markupFeeRate} / 100) = ${billingBn
      .times(BigNumber(feeSetting.markupFeeRate).div(100))
      .decimalPlaces(2, BigNumber.ROUND_UP)
      .toString()}`,
  );

  console.log('\n===== STEP 3: additional fee setting =====');
  if (additionalFeeSetting) {
    console.log(
      `fixedFee ${additionalFeeSetting.fixedFee} + markupFixedFee ${additionalFeeSetting.markupFixedFee} = ${BigNumber(
        additionalFeeSetting.fixedFee || 0,
      )
        .plus(BigNumber(additionalFeeSetting.markupFixedFee || 0))
        .toString()}`,
    );
    console.log(
      `billing ${billingBn.toString()} * (feeRate ${additionalFeeSetting.feeRate} / 100) = ${billingBn
        .times(BigNumber(additionalFeeSetting.feeRate || 0).div(100))
        .decimalPlaces(2, BigNumber.ROUND_UP)
        .toString()}`,
    );
    console.log(
      `billing ${billingBn.toString()} * (markupFeeRate ${additionalFeeSetting.markupFeeRate} / 100) = ${billingBn
        .times(BigNumber(additionalFeeSetting.markupFeeRate || 0).div(100))
        .decimalPlaces(2, BigNumber.ROUND_UP)
        .toString()}`,
    );
  } else {
    console.log('no additionalFeeSetting');
  }

  console.log('\n===== RESULT: calculateFeeSetting =====');
  console.log('feePlan        :', JSON.stringify(result.feePlan, null, 2));
  console.log('fixedFeeAmount :', result.fixedFeeAmount);
  console.log('feeRateAmount  :', result.feeRateAmount);
  if (isIncrementalAuth) {
    console.log('(isIncrementalAuth = true, so fixedFeeAmount is forced to 0)');
  }

  // Clone of the fee block in RiskAndFeeController.authorization
  const ledgerFee = BigNumber(feeAmount || 0)
    .plus(BigNumber(result.feeRateAmount).toFixed(2, BigNumber.ROUND_UP))
    .plus(BigNumber(result.fixedFeeAmount).toFixed(2, BigNumber.ROUND_UP));

  console.log(
    '\n===== STEP 4: ledgerFee (RiskAndFeeController.authorization) =====',
  );
  console.log(
    `feeAmount ${feeAmount} + roundUp(feeRateAmount ${result.feeRateAmount}, 2) + roundUp(fixedFeeAmount ${result.fixedFeeAmount}, 2)`,
  );
  console.log('ledgerFee        :', ledgerFee.toString());
  console.log(
    'ledgerFeeNonDecimal:',
    toNonDecimal(ledgerFee.toNumber(), decimals),
  );

  // Clone of the ledger freeze orders in RiskAndFeeController.authorization
  const ledgerAmount = BigNumber(billingAmount || 0);
  const ledgerFeeRateAmount = BigNumber(result.feeRateAmount);
  const ledgerFixedFeeAmount = BigNumber(result.fixedFeeAmount);

  // rateOrderOrder (AMRATE-) freezes billing amount + rate fee
  const rateOrderFreezeAmount = ledgerAmount.plus(ledgerFeeRateAmount);
  // fixedOrder (FIXED-) freezes the fixed fee, and only exists when > 0
  const hasFixedOrder = ledgerFixedFeeAmount.gt(0);
  const fixedOrderFreezeAmount = ledgerFixedFeeAmount;
  const totalFreezeAmount = rateOrderFreezeAmount.plus(
    hasFixedOrder ? fixedOrderFreezeAmount : BigNumber(0),
  );

  console.log(
    '\n===== STEP 5: ledger freeze orders (billing amount + fee) =====',
  );
  console.log(
    `ledgerAmount ${ledgerAmount.toString()} + ledgerFeeRateAmount ${ledgerFeeRateAmount.toString()} = ${rateOrderFreezeAmount.toString()}`,
  );
  console.log(
    `rateOrderOrder (AMRATE-) freezeAmount : ${rateOrderFreezeAmount.toString()} -> ${toNonDecimal(
      rateOrderFreezeAmount.toNumber(),
      decimals,
    )}`,
  );
  if (hasFixedOrder) {
    console.log(
      `fixedOrder (FIXED-)   freezeAmount : ${fixedOrderFreezeAmount.toString()} -> ${toNonDecimal(
        fixedOrderFreezeAmount.toNumber(),
        decimals,
      )}`,
    );
  } else {
    console.log(
      'fixedOrder (FIXED-)   not created (ledgerFixedFeeAmount is not > 0)',
    );
  }
  console.log('totalFreezeAmount   :', totalFreezeAmount.toString());
  console.log(
    'totalFreezeNonDecimal:',
    toNonDecimal(totalFreezeAmount.toNumber(), decimals),
  );

  // ledgerFee (step 4) rounds the fixed fee up to 2dp before summing, but the
  // fixed order (step 5) freezes the raw value - they diverge when the fixed
  // fee has more than 2 decimal places.
  const ledgerFeeFixedFeeRounded = BigNumber(
    BigNumber(result.fixedFeeAmount).toFixed(2, BigNumber.ROUND_UP),
  );
  if (!ledgerFeeFixedFeeRounded.eq(fixedOrderFreezeAmount)) {
    console.log(
      `\n!! NOTE: fixedFeeAmount ${fixedOrderFreezeAmount.toString()} is rounded up to ${ledgerFeeFixedFeeRounded.toString()} in ledgerFee (step 4), but the FIXED- order freezes the unrounded value.`,
    );
  }
}

run();
