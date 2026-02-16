import SecretGenerator from '../UtilsHelper/SecretGenerator';

const hashedString = SecretGenerator.generateMd5HashedString(
  'dsyewdssky@gmail.com',
);
// const hashedString = SecretGenerator.generateHashedSecret(
//   'eu38+2@18m.dev',
//   'Abcd123.',
// );
console.log(hashedString);
