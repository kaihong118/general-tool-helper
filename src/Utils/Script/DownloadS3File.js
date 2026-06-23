import { S3Client, ListObjectsCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { promises, existsSync } from "fs";
import { join, basename } from "path";

const outputBaseDir = join(process.cwd(), "daily-report", "uat-DailyReport");


async function downloadFile(bucket, key, filePath) {
  try {
    const getObjectCommand = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    const response = await s3Client.send(getObjectCommand);
    await promises.writeFile(filePath, response.Body);
    console.log(`Downloaded: ${filePath}`);
  } catch (err) {
    console.error(`Error downloading file: ${key}`, err);
  }
}

async function processFiles(bucket, prefix, dateRange) {
  for (let date of dateRange) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const folderPath = join(outputBaseDir, `${year}${month}${day}`);

    if (!existsSync(folderPath)) {
      await promises.mkdir(folderPath, { recursive: true });
    }

    const keyPrefix = `${prefix}/${year}${month}${day}000000-`;
    const keys = [
      "iso8583MessageAuthDailyReport-pfhfinance-",
      "detailReport-pfhfinance-",
      "iso8583MessageSettlementDailyReport-pfhfinance-",
    ];

    await Promise.all(
      keys.map((key) => {
        const listObjectsCommand = new ListObjectsCommand({
          Bucket: bucket,
          Prefix: `${keyPrefix}${key}`,
        });

        return s3Client.send(listObjectsCommand).then((response) =>
          Promise.all(
            response.Contents.map((obj) => {
              const filePath = join(folderPath, basename(obj.Key));
              return downloadFile(bucket, obj.Key, filePath);
            }),
          ),
        );
      }),
    );
  }
}

const startDate = new Date("2026-06-06");
const endDate = new Date("2026-06-08");
const bucket = "uat-e6-to-pfhf-rpt";
const prefix = "pfhfinance";
const dateRange = [];
let currentDate = new Date(startDate);
while (currentDate <= endDate) {
  dateRange.push(new Date(currentDate));
  currentDate.setDate(currentDate.getDate() + 1);
}

processFiles(bucket, prefix, dateRange)
  .then(() => {
    console.log("All files processed.");
  })
  .catch((err) => {
    console.error("Error processing files:", err);
  });