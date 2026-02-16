import winston from 'winston';
import PasswordHelper from '../UtilsHelper/PasswordHelper';

const logger = winston.createLogger({
  level: 'info',
  transports: [new winston.transports.Console()],
});

//DEV
//Access: 1c9f296758bc8578812d8c0b55e7a70ce384841de1b5a84a8958db2478dc02f1
//Master: 02ca6a3b17e0a5ae0cbf6447d96de13fa4c0261221b7c73bde85419eb5e4e478
//Handler: a17475dafcc1c849f9676b2cd288a03470d8a7a90a90283d39c3478573e006d6
//GwMqConnector: 0x3eb8142ada5750593e912f6754e7c440c46ad9eb3cfa4ed8fe80c979088dec1e
//Merchant1: 0x84bb085857314b6d750460f7dad0d73864a660c371cecb1cef257ffaa80a52e7
//Merchant6: 0xe4ae94d86fd7e8d29b7a0bd976fa9fe2796f5ea375e49ef14fef2f8d6ee2a993
//ABCC Server: 0x8d1f2396e33b56301ea9bb53e0373cf42d899527731a70af68ce68bbf1ab7c77

//UAT
//Master: 0x715a8ba77c8521ba846ae565c1faf74ca583ef91287504fd8592da0aff22fc31
//Handler: 0x715a8ba77c8521ba846ae565c1faf74ca583ef91287504fd8592da0aff22fc31
//Merchant6: 0x546f61c5b7b4079e62e5021aeddbf7436eeaef3a3bdabc7943a4ffab1490cc5e

const keyPair = PasswordHelper.generateKeyPair(
  '0x96e7f062b343ab083fdb91fd0eab42d836b247a81d4bf4169c902e687e2e085c',
);
logger.info(`Public Key: ${keyPair.signingKey.publicKey}`);
logger.info(`Compressed Public Key: ${keyPair.signingKey.compressedPublicKey}`);
logger.info(`Private Key: ${keyPair.signingKey.privateKey}`);
logger.info(`Address : ${keyPair.address}`);
