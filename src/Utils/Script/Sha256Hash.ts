import SecretGenerator from '../UtilsHelper/SecretGenerator';

const signature =
  '535dc4b893640f7f4aa3d78867ea885bf85370ab9ba6bded8d826fdf50731c0c';

const sid = '416';
const rcode = '96d68833f51c3631dde24142feb9512360acf47d';
const txid = '1742295996000844';
const status1 = 'EXC';
const amount = '1.00';
const currency = 'GBP';
const txaction = 'PREAUTH';

const dataString = `${sid};${rcode};${txid};${status1};${amount};${currency};${txaction}`;
console.log(dataString);

const result = SecretGenerator.generateSha256HashedSecret(dataString, '');
console.log(result);
