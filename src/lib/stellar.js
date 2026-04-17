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
  selectedWalletId: 'freighter',
  network: STELLAR_NETWORK,
  projectId: 'stellarpay',
  appName: 'StellarPay',
  appDescription: 'Secure Soroban Registry',
  appUrl: window.location.origin,
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
 * Registry Contract ID on Testnet
 */
export const REGISTRY_CONTRACT_ID = 'CB62EURWHESKXC4DSVFEGYMNSY7K3XHOUIZDUUWEHLIRSQ6WB3ZM2M7J'; 

export async function getContractData(address) {
  if (!address) return null;
  try {
    const contract = new StellarSdk.Contract(REGISTRY_CONTRACT_ID);
    const userAddress = new StellarSdk.Address(address);
    const invocation = contract.call('get_data', userAddress.toScVal());
    
    // Using a random funded account for simulation if user is not yet loaded, 
    // but here we use the user's address as it's a read-only call
    const tx = new StellarSdk.TransactionBuilder(new StellarSdk.Account(address, '0'), { 
      fee: '100', 
      networkPassphrase: PASSPHRASE 
    })
    .addOperation(invocation)
    .setTimeout(0)
    .build();

    const response = await server.simulateTransaction(tx);
    if (StellarSdk.rpc.Api.isSimulationSuccess(response)) {
      return StellarSdk.scValToNative(response.result.retval);
    }
    return null;
  } catch (error) {
    console.warn('Simulation for get_data failed - contract might not be deployed yet:', error.message);
    return null;
  }
}

export async function getGlobalCount() {
  try {
    const contract = new StellarSdk.Contract(REGISTRY_CONTRACT_ID);
    // Use a dummy address for public read simulation
    const dummyAddr = 'GBAQJ7SPTYGY47Q7AG67O3JSCUZ7KNYNBC4JLZO4YPZHMCEOPVQSYY64';


    const invocation = contract.call('get_count');
    
    const tx = new StellarSdk.TransactionBuilder(new StellarSdk.Account(dummyAddr, '0'), { 
      fee: '100', 
      networkPassphrase: PASSPHRASE 
    })
    .addOperation(invocation)
    .setTimeout(0)
    .build();

    const response = await server.simulateTransaction(tx);
    if (StellarSdk.rpc.Api.isSimulationSuccess(response)) {
      return StellarSdk.scValToNative(response.result.retval);
    }
    return 0;
  } catch (error) {
    return 0;
  }
}

export async function setContractData(address, content) {
  if (!address) throw new Error('Wallet not connected');

  const accountResponse = await horizonServer.loadAccount(address);
  // In SDK 14.x, loadAccount response provides the sequence
  const sourceAccount = new StellarSdk.Account(address, accountResponse.sequence);

  const contract = new StellarSdk.Contract(REGISTRY_CONTRACT_ID);
  const userAddress = new StellarSdk.Address(address);

  let tx = new StellarSdk.TransactionBuilder(sourceAccount, {
    fee: '1000', // Increased fee for priority
    networkPassphrase: PASSPHRASE,
  })
    .addOperation(contract.call('set_data', userAddress.toScVal(), StellarSdk.nativeToScVal(content, { type: 'string' })))
    .setTimeout(300)
    .build();

  const preparedTx = await server.prepareTransaction(tx);
  const xdr = preparedTx.toXDR();
  
  const signResult = await kit.signTransaction(xdr, { 
    network: 'TESTNET', 
    networkPassphrase: PASSPHRASE 
  });

  const signedXdr = typeof signResult === 'string' ? signResult : (signResult.signedTxXdr || signResult.signedTransaction);
  if (!signedXdr) throw new Error('Failed to get signed transaction from wallet.');

  const signedTx = StellarSdk.TransactionBuilder.fromXDR(signedXdr, PASSPHRASE);

  const sendResponse = await server.sendTransaction(signedTx);
  
  // We wait for the result
  let attempts = 0;
  let txStatus;
  
  while (attempts < 20) {
    try {
      txStatus = await server.getTransaction(sendResponse.hash);
      if (txStatus.status !== 'NOT_FOUND' && txStatus.status !== 'PENDING') {
        break;
      }
    } catch (e) {
      console.warn('Polling error, retrying...', e);
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
    attempts++;
  }

  if (!txStatus || txStatus.status === 'FAILED') {
    throw new Error('Contract invocation failed or timed out on network');
  }
  
  if (txStatus.status !== 'SUCCESS') {
    throw new Error(`Transaction timed out or has unknown status: ${txStatus.status}`);
  }

  return { hash: sendResponse.hash };
}
