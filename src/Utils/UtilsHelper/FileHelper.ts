import fs, { promises as fsPromise } from 'fs';
import winston from 'winston';

export default class FileHelper {
  /**
   * Read File from provided path
   * @param path File Path
   * @param logger winston.Logger
   * @returns  path: string; data: T
   */
  public static async readFile<T>(
    path: string,
    logger: winston.Logger
  ): Promise<{ path: string; data: T }> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let jsonFile: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let jsonData: any;

    if (fs.existsSync(path)) {
      jsonFile = await fsPromise.readFile(path, 'binary');
      jsonData = Buffer.from(jsonFile);
    } else {
      logger.error(`File cannot be found - ${path}`);
    }
    return {
      path: path,
      data: JSON.parse(jsonData),
    };
  }

  /**
   * Read Text File from provided path
   * @param path File Path
   * @param logger winston.Logger
   * @returns path: string; data: string
   */
  public static async readTxtFile(
    path: string,
    logger: winston.Logger
  ): Promise<{ path: string; data: string }> {
    logger.info(`Getting txt string from ${path}`);

    let str: string;

    if (fs.existsSync(path)) {
      str = await fsPromise.readFile(path, 'utf8');
    } else {
      logger.error(`File cannot be found,[ (${path})`);
    }
    return {
      path: path,
      data: str,
    };
  }
}
