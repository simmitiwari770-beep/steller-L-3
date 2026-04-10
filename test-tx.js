import * as StellarSdk from '@stellar/stellar-sdk';
const address = 'GBRPYHIL2CI3FNMWB27S6GZ67XGC7W6H657Q2H77LMWAFG3RFS47H3L2';
const content = 'Test Data';
const PASSPHRASE = 'Test SDF Test Network ; September 2015';

async function test() {
  const horizonServer = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
  const accountResponse = await horizonServer.loadAccount(address);
  const sourceAccount = new StellarSdk.Account(accountResponse.accountId(), accountResponse.sequenceNumber());
  const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
    fee: '1000',
    networkPassphrase: PASSPHRASE,
  })
    .addOperation(
      StellarSdk.Operation.payment({
        destination: address,
        asset: StellarSdk.Asset.native(),
        amount: '0.00001', 
      })
    )
    .addMemo(StellarSdk.Memo.text(content.slice(0, 28)))
    .setTimeout(30)
    .build();
    
  console.log(transaction.toXDR());
}
test().catch(console.error);
