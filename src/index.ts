require('dotenv').config();
import { callContract } from './app';

const run = async () => {
  // Collection address
  const collectionAddress = '0x5e5.......';

  // Max amount to mint
  const maxSupply = 5;

  // Start date of mint. Timestamp in SEC
  // const startTime = 0;
  const startTime = Math.floor(Date.now() / 1000 + 60); // start in 60 sec from now

  // End date of mint. Timestamp in SEC
  // const endTime = 0;
  const endTime = startTime + 60 * 10; // end in 10 min from startDate

  const TEST = process.env.TEST === 'true';
  await callContract({
    collectionAddress,
    endTime,
    maxSupply,
    startTime,
    test: TEST,
  });
};

run()
  .then(() => {
    console.log('minter created');
  })
  .catch(console.log);
