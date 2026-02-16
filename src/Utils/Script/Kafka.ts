import { KafkaHelper } from '@wallet-manager/node-package-kafka';
import winston from 'winston';

export async function assignKafka(message: any) {
  const logger = winston.createLogger({
    level: 'info',
    transports: [new winston.transports.Console()],
  });

  const producerKafkaConfig = {
    clientId: 'testingServer',
    brokers: ['54.150.196.237:9092'],
    groupId: 'PMP_PRODUCE_LOCAL',
    callbackTimeOut: 10000,
  };
  const kafkaHelper = new KafkaHelper(producerKafkaConfig, logger);
  await kafkaHelper.createProducer('EVENT_OUT_PMP_PROGRAM');

  await kafkaHelper.sendMessage('EVENT_OUT_PMP_PROGRAM', [
    {
      value: JSON.stringify(message),
      key: `${message.orderId}`,
      //   headers: this.generateHeader(message),
    },
  ]);
  logger.info(
    `[Kafka Service] ${message.orderId} Sent Kafka Message to EVENT_OUT_PMP_PROGRAM`
  );
}

export async function start() {
  await assignKafka({
    type: 'customer-receiving-address-changed',
    data: {
      eventId: 'abcd',
      eventType: 'customer-receiving-address-changed',
      merchantId: 6,
      headers: {
        programName: 'programName',
        customerNumber: 'customerNumber',
      },
      parameters: {
        programDisplayName: 'programDisplayName',
        customerNumber: 'customerNumber',
        riskLevel: 5,
        nameWalletName: 'nameWalletName',
        clientId: 'clientId',
        lastModifiedDate: 1745372522555,
      },
    },
  });
}

start();
