import moment from 'moment-timezone';
import winston from 'winston';

export default class TimeStampHelper {
  public static testing(logger: winston.Logger) {
    const timeBefore = moment().format('YYYY-MM-DD HH:mm:ss');
    logger.info(timeBefore);

    const timeAfter = moment().utcOffset('+0800').format('YYYY-MM-DD HH:mm:ss');
    logger.info(timeAfter);

    const timestamp = 1720678873167;
    const time = moment
      .tz(timestamp, 'Asia/Hong_Kong')
      .format('YYYY-MM-DD HH:mm:ss (z)');
    logger.info(time);
  }
}
