import { PasswordGenerator } from '@wallet-manager/node-lib/dist/src/generator';
import { Timeout } from '@wallet-manager/node-package-util';
import PQueue from 'p-queue';

// type TimeOutFunction<T = unknown> = (timeout: any) => Promise<T>;

// type NextFunction = () => void;

// type QueueFunction<T = void> = () => Promise<T>;

class TimerQueue {
  private queue: PQueue;

  constructor() {
    this.queue = new PQueue({ concurrency: 1 });
  }

  async getTimer(name: string, ms: number) {
    const uuid = PasswordGenerator.generateUuid();
    console.time(`${name}-${uuid}`);

    const resp = await this.queue.add(async () => {
      await Timeout(ms);
      return ms;
    });
    if (resp) {
      console.timeEnd(`${name}-${uuid}`);
      return resp;
    } else {
      throw new Error();
    }
  }
}

const main = async () => {
  const timerQueue = new TimerQueue();
  const timerQueue2 = new TimerQueue();

  Promise.all([
    timerQueue.getTimer('timerQueue', 4000),
    timerQueue.getTimer('timerQueue', 4000),
    timerQueue.getTimer('timerQueue', 4000),
    timerQueue.getTimer('timerQueue', 4000),
    timerQueue.getTimer('timerQueue', 4000),
  ]);
  Promise.all([
    timerQueue2.getTimer('timerQueue2', 2000),
    timerQueue2.getTimer('timerQueue2', 2000),
    timerQueue2.getTimer('timerQueue2', 2000),
    timerQueue2.getTimer('timerQueue2', 2000),
    timerQueue2.getTimer('timerQueue2', 2000),
    timerQueue2.getTimer('timerQueue2', 2000),
    timerQueue2.getTimer('timerQueue2', 2000),
    timerQueue2.getTimer('timerQueue2', 2000),
    timerQueue2.getTimer('timerQueue2', 2000),
    timerQueue2.getTimer('timerQueue2', 2000),
  ]);
};

main();
