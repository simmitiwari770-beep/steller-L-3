import { rpc, Networks as SDKNetworks } from '@stellar/stellar-sdk';
import { StellarWalletsKit, Networks } from '@creit.tech/stellar-wallets-kit';
import { FreighterModule } from '@creit.tech/stellar-wallets-kit/modules/freighter';
import { AlbedoModule } from '@creit.tech/stellar-wallets-kit/modules/albedo';
import { xBullModule } from '@creit.tech/stellar-wallets-kit/modules/xbull';

export const STELLAR_NETWORK = Networks.TESTNET;
export const RPC_URL = 'https://soroban-testnet.stellar.org';
export const PASSPHRASE = SDKNetworks.TESTNET;

// Initialize the kit with modules
StellarWalletsKit.init({
  network: STELLAR_NETWORK,
  modules: [
    new FreighterModule(),
    new AlbedoModule(),
    new xBullModule(),
  ],
});

export const kit = StellarWalletsKit; // Export the class as 'kit' for compatibility with previous hooks
export const server = new rpc.Server(RPC_URL);

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
