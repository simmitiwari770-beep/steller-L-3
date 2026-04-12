import { useMutation, useQuery } from '@tanstack/react-query';
import { horizonServer, kit, PASSPHRASE, StellarSdk } from '../lib/stellar';
import { toast } from 'react-hot-toast';

export function useRegistry(address, walletType) {
  // We can keep data fetching if we want to show balance history, but we'll focus on transfer logic
  const registryMutation = useMutation({
    mutationFn: async ({ destination, amount }) => {
      if (!address) throw new Error('Wallet not connected');

      // 1. Fetch current account info from Horizon
      const accountResponse = await horizonServer.loadAccount(address);
      const sourceAccount = new StellarSdk.Account(accountResponse.id, accountResponse.sequence);

      // 2. Build the initial transaction for Payment
      let tx = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: '100', // Standard basic fee
        networkPassphrase: PASSPHRASE,
      })
        .addOperation(StellarSdk.Operation.payment({
            destination: destination,
            asset: StellarSdk.Asset.native(),
            amount: String(amount)
        }))
        .setTimeout(300)
        .build();

      // 3. Request wallet signature
      const xdr = tx.toXDR();
      const signResult = await kit.signTransaction(xdr, { 
        network: 'TESTNET', 
        networkPassphrase: PASSPHRASE 
      });

      const signedXdr = typeof signResult === 'string' ? signResult : (signResult.signedTxXdr || signResult.signedTransaction);
      if (!signedXdr) throw new Error('Failed to get signed transaction from wallet.');

      const signedTx = StellarSdk.TransactionBuilder.fromXDR(signedXdr, PASSPHRASE);

      // 4. Submit to Horizon RPC natively
      toast('Transaction submitted. Awaiting ledger confirmation...', { icon: '⏳' });
      const sendResponse = await horizonServer.submitTransaction(signedTx);
      
      return { hash: sendResponse.hash };
    },
    onSuccess: () => {
      toast.success('Funds successfully transferred!');
    },
    onError: (error) => {
      console.error('Transfer Mutation Error:', error);
      toast.error(error.message || 'Payment transaction failed');
    }
  });

  return {
    storedData: null,
    globalCount: 0,
    isLoadingData: false,
    submitData: registryMutation.mutateAsync,
    isSubmitting: registryMutation.isPending,
    lastTxHash: registryMutation.data?.hash,
  };
}
