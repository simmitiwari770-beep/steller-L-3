import { useMutation, useQuery } from '@tanstack/react-query';
import { getContractData, horizonServer, kit, PASSPHRASE, StellarSdk } from '../lib/stellar';
import { toast } from 'react-hot-toast';
import { ethers } from 'ethers';

export function useRegistry(address, walletType) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['registryData', address],
    queryFn: () => getContractData(address),
    enabled: !!address,
    staleTime: 30000,
  });

  const registryMutation = useMutation({
    mutationFn: async (content) => {
      if (['freighter', 'albedo', 'xbull'].includes(walletType)) {
        // Real Stellar Transaction
        let accountResponse;
        try {
           accountResponse = await Promise.race([
               horizonServer.loadAccount(address),
               new Promise((_, reject) => setTimeout(() => reject(new Error('Horizon Server timeout fetching account. Please try again.')), 10000))
           ]);
        } catch (e) {
           throw new Error(e.response?.status === 404 ? 'Wallet account not funded on Testnet. Please fund your wallet.' : e.message);
        }
        
        const sourceAccount = new StellarSdk.Account(accountResponse.accountId(), accountResponse.sequenceNumber());

        // Parse amount from user input, fallback to 0.00001 if text
        const parsedAmount = parseFloat(content);
        const txAmount = (isNaN(parsedAmount) || parsedAmount <= 0) ? '0.00001' : parsedAmount.toFixed(7);
        // Realistic transfer out to a confirmed active testnet account so balance deducts
        const destinationAccount = 'GAMSEIMWYTKKOULRIJWWK77BFQF7HNPYIFTOH6WLNLGFQ4XBT7FQWITZ';

        const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
          fee: StellarSdk.BASE_FEE || '1000',
          networkPassphrase: PASSPHRASE,
        })
          .addOperation(
            StellarSdk.Operation.payment({
              destination: destinationAccount,
              asset: StellarSdk.Asset.native(),
              amount: txAmount.toString(), 
            })
          )
          .addMemo(StellarSdk.Memo.text(content.slice(0, 28) || 'Transaction Vault'))
          .setTimeout(300) 
          .build();

        const xdr = transaction.toXDR();
        
        let signResult;
        try {
           signResult = await kit.signTransaction(xdr, { 
               network: 'TESTNET', 
               networkPassphrase: PASSPHRASE 
           });
        } catch (e) {
           throw new Error('Wallet connection dropped or transaction was rejected by user.');
        }

        if (!signResult) {
           throw new Error('No signature returned from the wallet. Please ensure Freighter is active.');
        }

        // Support both old and new stellar-wallets-kit payload formats
        const finalSignedXdr = typeof signResult === 'string' ? signResult : (signResult.signedTxXdr || signResult.signedTransaction);
        
        if (!finalSignedXdr) {
           throw new Error(signResult.error || 'Wallet did not return a valid signature block.');
        }

        const parsedTx = StellarSdk.TransactionBuilder.fromXDR(finalSignedXdr, PASSPHRASE);
        
        const result = await Promise.race([
             horizonServer.submitTransaction(parsedTx),
             new Promise((_, reject) => setTimeout(() => reject(new Error('Horizon Server timeout validating transaction. Consensus may be slow.')), 30000))
        ]);

        return { hash: result.hash, amount: txAmount };

      } else if (walletType === 'metamask') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        
        const tx = await signer.sendTransaction({
          to: address,
          value: 0,
          data: ethers.hexlify(ethers.toUtf8Bytes(content))
        });
        
        const receipt = await tx.wait();
        return { hash: receipt.hash };
      }
      
      throw new Error('Unsupported wallet type');
    },
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      console.error('Transaction Error Details:', error);
      let errorMsg = error.message;
      if (error.response?.data?.extras?.result_codes) {
        const codes = error.response.data.extras.result_codes;
        errorMsg = `Stellar Network Error: ${codes.transaction || ''} ${codes.operations ? codes.operations.join(',') : ''}`;
      } else if (error.response?.data?.title) {
        errorMsg = error.response.data.title;
      }
      toast.error('Transaction failed: ' + errorMsg);
    }
  });

  return {
    storedData: data,
    isLoadingData: isLoading,
    submitData: registryMutation.mutateAsync,
    isSubmitting: registryMutation.isPending,
    lastTxHash: registryMutation.data?.hash,
    lastTxAmount: registryMutation.data?.amount
  };
}
