import {
  S3Client,
  ListObjectsCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { promises, existsSync } from 'fs';
import { join, basename } from 'path';

const outputBaseDir = join(process.cwd(), 'daily-report', 'uat-DailyReport');

const s3Client = new S3Client({
  region: 'ap-east-1',
  credentials: {
    accessKeyId: '',
    secretAccessKey: '',
  },
});

async function downloadFile(bucket, key, filePath) {
  try {
    const getObjectCommand = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    const response = await s3Client.send(getObjectCommand);
    let body = response.Body;

    if (body && typeof body.transformToByteArray === 'function') {
      body = Buffer.from(await body.transformToByteArray());
    } else if (body && typeof body.transformToString === 'function') {
      body = Buffer.from(await body.transformToString('utf8'));
    } else if (body instanceof Uint8Array) {
      body = Buffer.from(body);
    } else if (typeof body === 'string') {
      body = Buffer.from(body);
    } else if (!body) {
      throw new Error(`No content returned for ${key}`);
    }

    await promises.writeFile(filePath, body);
    console.log(`Downloaded: ${filePath}`);
  } catch (err) {
    console.error(`Error downloading file: ${key}`, err);
  }
}

async function processFiles(bucket, prefix, dateRange) {
  for (let date of dateRange) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const folderPath = join(outputBaseDir, `${year}${month}${day}`);

    if (!existsSync(folderPath)) {
      await promises.mkdir(folderPath, { recursive: true });
    }

    const keyPrefix = `${prefix}/${year}${month}${day}000000-`;
    const keys = [
      'iso8583MessageAuthDailyReport-pfh_finance_ltd_rtf_po-',
      'detailReport-pfh_finance_ltd_rtf_po-',
      'iso8583MessageSettlementDailyReport-pfh_finance_ltd_rtf_po-',
    ];

    await Promise.all(
      keys.map((key) => {
        const listObjectsCommand = new ListObjectsCommand({
          Bucket: bucket,
          Prefix: `${keyPrefix}${key}`,
        });

        return s3Client.send(listObjectsCommand).then((response) => {
          const objects = response.Contents || [];
          return Promise.all(
            objects.map((obj) => {
              const filePath = join(folderPath, basename(obj.Key));
              return downloadFile(bucket, obj.Key, filePath);
            }),
          );
        });
      }),
    );
  }
}

const startDate = new Date('2026-07-01');
const endDate = new Date('2026-07-28');
const bucket = 'uat-e6-to-pfhf-rpt-cooperation';
const prefix = 'pfh_finance_ltd_rtf_po';
const dateRange = [];
let currentDate = new Date(startDate);
while (currentDate <= endDate) {
  dateRange.push(new Date(currentDate));
  currentDate.setDate(currentDate.getDate() + 1);
}

processFiles(bucket, prefix, dateRange)
  .then(() => {
    console.log('All files processed.');
  })
  .catch((err) => {
    console.error('Error processing files:', err);
  });
