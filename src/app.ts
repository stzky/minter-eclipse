import { BigNumber, Contract, Wallet, ethers } from 'ethers';
import abi from './Eclipse.json';
import { formatUnits } from 'ethers/lib/utils';
function encodeMintData(
  artistAccount: string,
  maxSupplyMinter: number,
  startTime: number,
  endTime: number
) {
  const gateCalldata = ethers.utils.defaultAbiCoder.encode(
    [
      {
        components: [
          {
            internalType: 'uint24',
            name: 'allowedPerWallet',
            type: 'uint24',
          },
          {
            internalType: 'uint8',
            name: 'allowedPerTransaction',
            type: 'uint8',
          },
        ],
        name: 'params',
        type: 'tuple',
      },
    ] as any,
    [
      {
        allowedPerWallet: 0,
        allowedPerTransaction: 0,
      },
    ]
  );
  return ethers.utils.defaultAbiCoder.encode(
    [
      {
        components: [
          {
            internalType: 'address',
            name: 'artist',
            type: 'address',
          },
          {
            internalType: 'uint48',
            name: 'startTime',
            type: 'uint48',
          },
          {
            internalType: 'uint48',
            name: 'endTime',
            type: 'uint48',
          },
          {
            internalType: 'uint24',
            name: 'maxSupply',
            type: 'uint24',
          },
          {
            components: [
              {
                internalType: 'uint8',
                name: 'gateType',
                type: 'uint8',
              },
              {
                internalType: 'bytes',
                name: 'gateCalldata',
                type: 'bytes',
              },
            ],
            name: 'gate',
            type: 'tuple',
            internalType: 'GateParams',
          },
        ],
        name: 'params',
        type: 'tuple',
        internalType: 'FixedPriceParams',
      },
    ] as any,
    [
      {
        artist: artistAccount,
        startTime,
        endTime,
        maxSupply: maxSupplyMinter,
        gate: {
          gateType: 0,
          gateCalldata,
        },
      },
    ]
  );
}

export const callContract = async ({
  collectionAddress,
  maxSupply,
  startTime,
  endTime,
  test = true,
}: {
  collectionAddress: string;
  startTime: number;
  endTime: number;
  maxSupply: number;
  test?: boolean;
}) => {
  const PK = process.env.PRIVATE_KEY;
  if (!PK)
    throw new Error(`No private key defined in ENV variable <PRIVATE_KEY>`);

  const ethersProvider = new ethers.providers.JsonRpcProvider(
    'https://mainnet.infura.io/v3/23374c5ad6e746918433c3b954ea6a5c'
  );
  const wallet = new Wallet(PK).connect(ethersProvider);
  const data = encodeMintData(wallet.address, maxSupply, startTime, endTime);
  const contract = new Contract(
    '0x71AA097B3B9dab88a4b755dAF6bb581Ca0aeD4CA',
    abi
  );
  if (test) {
    const gas = await contract
      .connect(wallet)
      .estimateGas.enableMinterForCollection(collectionAddress, 2, data, true);

    const gasPrice = await ethersProvider.getGasPrice();
    console.log(
      'call gas estimate',
      formatUnits(BigNumber.from(gasPrice).mul(gas), 18),
      'ETH'
    );
    return;
  }
  const tx = await contract
    .connect(wallet)
    .enableMinterForCollection(collectionAddress, 2, data, true);

  console.log('contract call done', tx);
};
