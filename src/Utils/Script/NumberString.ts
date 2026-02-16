import NumberHelper from '../UtilsHelper/NumberHelper';

/**
 *
 * Converts the string '100000' to a decimal number with 6 decimal places.
 * Expected output: 100000.000000
 */
const num = '100000';
const decimals = 6;
console.log(NumberHelper.toDecimal(num, decimals));

/**
 *
 * Converts the decimal number 0.1 to a non-decimal representation with 6 decimal places.
 * Expected output: 100000 (0.1 * 10^6)
 */
const num1 = 0.1;
const decimals1 = 6;

console.log(NumberHelper.toNonDecimal(num1, decimals1));

/**
 *
 * Creates a new array from numArray and sorts it in ascending order (smallest to largest).
 * Original array: [5, 100, 50]
 * Expected output: [5, 50, 100]
 */
const numArray = [5, 100, 50];
console.log([...numArray].sort((a, b) => a - b));

/**
 *
 * Creates a new array from numArray and sorts it in descending order (largest to smallest).
 * Original array: [5, 100, 50]
 * Expected output: [100, 50, 5]
 */
console.log([...numArray].sort((a, b) => b - a));
