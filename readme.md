# Create Free Minter Eclipse

## How to use

1. `yarn install`
2. add `PRIVATE_KEY` env variable in `.env` file
3. edit `src/index.ts` to your needs
4. `yarn start`

### Testing

Before emitting the transaction, run a test to get a gas estimate. Simply set the env variable `TEST=true` in `.env` file.

## Minting

Tokens can now be minted from the [Minter](https://etherscan.io/address/0x3E28E8D80D4d76CD22Fe1FB83c64DA032c76bf15#writeContract) using one of the mint functions (`mint` or `mintOne`).
![eclipse](./img/etherscan.png 'Etherscan')
