import PasswordHelper from '../UtilsHelper/PasswordHelper';

console.log(
  PasswordHelper.generatePassword({
    length: 8,
    symbols: false,
    numbers: true,
    lowercase: false,
    uppercase: true,
    excludeSimilarCharacters: true,
  }),
);
