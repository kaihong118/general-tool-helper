import { BigNumber } from 'bignumber.js';

export default class NumberHelper {
  public static findDuplicatedNumber(
    numberArray: number[],
    totalNumber: number,
  ) {
    const expectedSum = (totalNumber * (totalNumber + 1)) / 2;
    const actualSum = numberArray.reduce(
      (sum, currentNumber) => sum + currentNumber,
    );
    return actualSum - expectedSum;
  }

  /**
   *
   * @param amount Amount
   * @param decimals Decimals
   * @returns Amount in String
   */
  public static decimals(amount: string, decimals: number) {
    // Ensure the input is a valid number string
    if (!/^\d+$/.test(amount)) {
      throw new Error('Invalid amount format');
    }

    // Pad the amount with leading zeros if necessary
    while (amount.length <= decimals) {
      amount = '0' + amount;
    }

    // Add decimal point at the correct position
    const integerPart = amount.slice(0, -decimals);
    const decimalPart = amount.slice(-decimals);

    return `${integerPart}.${decimalPart}`;
  }

  /**
   * Convert a decimal number to a non-decimal integer by multiplying by 10^decimals
   * @param number - The decimal number to convert
   * @param decimals - Number of decimal places
   * @returns The non-decimal integer
   */
  static toNonDecimal(number: number | string, decimals: number): number {
    return BigNumber(number).times(Math.pow(10, decimals)).toNumber();
  }

  /**
   * Convert a non-decimal integer to a decimal number by dividing by 10^decimals
   * @param number - The non-decimal integer to convert
   * @param decimals - Number of decimal places
   * @returns The decimal number
   */
  static toDecimal(number: number | string, decimals: number): number {
    return BigNumber(number).dividedBy(Math.pow(10, decimals)).toNumber();
  }
}
