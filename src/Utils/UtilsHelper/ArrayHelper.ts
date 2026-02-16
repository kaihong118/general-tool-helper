export default class ArrayHelper {
  /**
   *
   * @param arr Object array
   * @param key array key name
   * @returns The sorted array by key
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static sortByKey<T = any>(
    array: T[],
    key: string,
    casting?: 'Number' | 'string'
  ) {
    if (casting == 'Number') {
      return array.sort((a, b) => {
        const x = a[key];
        const y = b[key];
        return Number(x) < Number(y) ? -1 : Number(x) > Number(y) ? 1 : 0;
      });
    } else {
      return array.sort((a, b) => {
        const x = a[key];
        const y = b[key];
        return x < y ? -1 : x > y ? 1 : 0;
      });
    }
  }
}
