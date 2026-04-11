import * as StellarSdk from '@stellar/stellar-sdk';

const RPC_URL = 'https://soroban-testnet.stellar.org';
const PASSPHRASE = StellarSdk.Networks.TESTNET;
const CONTRACT_ID = 'CB62EURWHESKXC4DSVFEGYMNSY7K3XHOUIZDUUWEHLIRSQ6WB3ZM2M7J';

async function simulateGetData(userAddress) {
  const server = new StellarSdk.rpc.Server(RPC_URL);
  const contract = new StellarSdk.Contract(CONTRACT_ID);
  
  console.log(`Simulating get_data for address: ${userAddress}`);
  
  const invocation = contract.call('get_data', new StellarSdk.Address(userAddress).toScVal());
  
  const response = await server.simulateTransaction(
    new StellarSdk.TransactionBuilder(
      new StellarSdk.Account(userAddress, '0'),
      { fee: '100', networkPassphrase: PASSPHRASE }
    )
    .addOperation(invocation)
    .setTimeout(0)
    .build()
  );

  if (StellarSdk.rpc.Api.isSimulationSuccess(response)) {
    const result = response.result.retval;
    const value = StellarSdk.scValToNative(result);
    console.log('Result:', value || 'No data found');
  } else {
    console.error('Simulation Failed:', response.error);
  }
}

// Example usage
const testAddress = 'GBAQJ7SPTYGY47Q7AG67O3JSCUZ7KNYNBC4JLZO4YPZHMCEOPVQSYY64';
simulateGetData(testAddress).catch(console.error);
