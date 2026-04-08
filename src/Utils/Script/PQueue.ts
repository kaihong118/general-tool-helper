import { Timeout } from '@wallet-manager/node-package-util';
import PQueue from 'p-queue';

type RiskGroup = 'customer' | 'card';

interface RiskRule {
  id: string;
  group: RiskGroup;
  timeoutMs: number;
  mockLatencyMs: number;
  evaluate: () => Promise<boolean>;
}

interface RiskRuleResult {
  id: string;
  group: RiskGroup;
  passed: boolean;
  elapsedMs: number;
  timeout: boolean;
}

// Simulate package call: pull configured credit-card risk rules from a shared library/service.
async function getCreditCardRiskRulesFromPackage(): Promise<RiskRule[]> {
  await Timeout(200);

  return [
    {
      id: 'CUSTOMER_DAILY_TXN_COUNT',
      group: 'customer',
      timeoutMs: 5000,
      mockLatencyMs: 1200,
      evaluate: async () => {
        await Timeout(1200);
        return true;
      },
    },
    {
      id: 'CUSTOMER_BLACKLIST_MATCH',
      group: 'customer',
      timeoutMs: 5000,
      mockLatencyMs: 800,
      evaluate: async () => {
        await Timeout(800);
        return true;
      },
    },
    {
      id: 'CARD_VELOCITY_1H',
      group: 'card',
      timeoutMs: 5000,
      mockLatencyMs: 1800,
      evaluate: async () => {
        await Timeout(1800);
        return true;
      },
    },
    {
      id: 'CARD_COUNTRY_MISMATCH',
      group: 'card',
      timeoutMs: 5000,
      mockLatencyMs: 5200,
      evaluate: async () => {
        await Timeout(5200);
        return false;
      },
    },
  ];
}

async function executeRuleWithTimeout(rule: RiskRule): Promise<RiskRuleResult> {
  const start = Date.now();
  console.log(
    `Executing rule ${rule.group} | ${rule.id} with timeout ${rule.timeoutMs}ms`,
  );

  const timeoutResult = Timeout(rule.timeoutMs).then(() => ({
    timeout: true,
    passed: false,
  }));

  const evaluateResult = rule.evaluate().then((passed) => ({
    timeout: false,
    passed,
  }));

  const result = await Promise.race([timeoutResult, evaluateResult]);

  console.log(
    `Completed rule ${rule.group} | ${rule.id} with timeout ${rule.timeoutMs}ms`,
  );
  return {
    id: rule.id,
    group: rule.group,
    passed: result.passed,
    timeout: result.timeout,
    elapsedMs: Date.now() - start,
  };
}

async function executeRuleGroup(
  group: RiskGroup,
  rules: RiskRule[],
): Promise<RiskRuleResult[]> {
  const queue = new PQueue({ concurrency: rules.length || 1 });

  const jobs = rules.map((rule) =>
    queue.add(async () => {
      const result = await executeRuleWithTimeout(rule);
      return result;
    }),
  );

  const results = await Promise.all(jobs);
  console.log(`[${group}] completed ${results.length} rule(s)`);
  return results;
}

const main = async () => {
  console.time('risk-check-total');

  const rules = await getCreditCardRiskRulesFromPackage();

  const customerRules = rules.filter((rule) => rule.group === 'customer');
  const cardRules = rules.filter((rule) => rule.group === 'card');

  // Execute groups together to reduce total runtime.
  const [customerResults, cardResults] = await Promise.all([
    executeRuleGroup('customer', customerRules),
    executeRuleGroup('card', cardRules),
  ]);

  const allResults = [...customerResults, ...cardResults];
  const blocked = allResults.some((result) => !result.passed || result.timeout);

  for (const result of allResults) {
    console.log(
      `${result.group} | ${result.id} | passed=${result.passed} | timeout=${result.timeout} | elapsed=${result.elapsedMs}ms`,
    );
  }

  console.log(`Final decision: ${blocked ? 'REJECT' : 'APPROVE'}`);
  console.timeEnd('risk-check-total');
};

main().catch((error) => {
  console.error('Risk rule execution failed', error);
  process.exitCode = 1;
});
