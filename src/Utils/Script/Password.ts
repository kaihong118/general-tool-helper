import PasswordHelper from '../UtilsHelper/PasswordHelper';

console.log(
  `A-abccAccountId-${PasswordHelper.generatePassword({
    length: 5,
    lowercase: false,
    uppercase: true,
    excludeSimilarCharacters: true,
    numbers: true,
  })}`
);
