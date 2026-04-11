import * as StellarSdk from '@stellar/stellar-sdk';

const RPC_URL = 'https://soroban-testnet.stellar.org';
const PASSPHRASE = StellarSdk.Networks.TESTNET;
const CONTRACT_ID = 'CCGZUXO6G6V7YWWIDDJKVJK6VJK6VJK6VJK6VJK6VJK6VJK6VJK6VJK6';

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
    .addOperation(StellarSdk.Operation.invokeHostFunction({
      func: invocation,
      auth: []
    }))
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
const testAddress = 'GDH6766R6ZGHH65RGK6RGK6RGK6RGK6RGK6RGK6RGK6RGK6RGK6RGK6R';
simulateGetData(testAddress).catch(console.error);
