import * as StellarSdk from '@stellar/stellar-sdk';
import { StellarWalletsKit, Networks } from '@creit.tech/stellar-wallets-kit';
import { FreighterModule } from '@creit.tech/stellar-wallets-kit/modules/freighter';
import { AlbedoModule } from '@creit.tech/stellar-wallets-kit/modules/albedo';
import { xBullModule } from '@creit.tech/stellar-wallets-kit/modules/xbull';

export const STELLAR_NETWORK = Networks.TESTNET;
export const RPC_URL = 'https://soroban-testnet.stellar.org';
export const HORIZON_URL = 'https://horizon-testnet.stellar.org';
export const PASSPHRASE = StellarSdk.Networks.TESTNET;

// Initialize the kit with modules
StellarWalletsKit.init({
  network: STELLAR_NETWORK,
  modules: [
    new FreighterModule(),
    new AlbedoModule(),
    new xBullModule(),
  ],
});

export const kit = StellarWalletsKit;
export const server = new StellarSdk.rpc.Server(RPC_URL);
export const horizonServer = new StellarSdk.Horizon.Server(HORIZON_URL);
export { StellarSdk };

/**
 * Example Contract ID on Testnet for Registry/Hello world logic
 */
export const REGISTRY_CONTRACT_ID = 'CACDW5ZRT2C4R4N6R4F4R4F4R4F4R4F4R4F4R4F4R4F4R4F4R4F4R4F4'; 

export async function getContractData(address) {
  try {
    return "Stored Data from Stellar";
  } catch (error) {
    console.error('Error fetching contract data:', error);
    return null;
  }
}
