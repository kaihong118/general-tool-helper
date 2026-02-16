import csv from 'csv';
import fs from 'fs';

const parser = csv.parse({ columns: true }, function (err, records) {
  console.log(records);
});

fs.createReadStream(`excel/sample.csv`).pipe(parser);
