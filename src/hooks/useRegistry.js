import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { horizonServer, kit, PASSPHRASE, StellarSdk, REGISTRY_CONTRACT_ID, server, getContractData, getGlobalCount } from '../lib/stellar';
import { toast } from 'react-hot-toast';

export function useRegistry(address, walletType) {
  const queryClient = useQueryClient();
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

  const setDataMutation = useMutation({
    mutationFn: async ({ content }) => {
      if (!address) throw new Error('Wallet not connected');

      const accountResponse = await horizonServer.loadAccount(address);
      const sourceAccount = new StellarSdk.Account(accountResponse.id, accountResponse.sequence);

      const contract = new StellarSdk.Contract(REGISTRY_CONTRACT_ID);
      const userAddress = new StellarSdk.Address(address);

      let tx = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: '100',
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

      toast('Invoking contract...', { icon: '⏳' });
      const sendResponse = await server.sendTransaction(signedTx);
      
      // We wait for the result
      let txStatus = await server.getTransaction(sendResponse.hash);
      while (txStatus.status === 'NOT_FOUND') {
        await new Promise(resolve => setTimeout(resolve, 2000));
        txStatus = await server.getTransaction(sendResponse.hash);
      }

      if (txStatus.status === 'FAILED') {
        throw new Error('Contract invocation failed on network');
      }

      return { hash: sendResponse.hash };
    },
    onSuccess: () => {
      toast.success('Data successfully saved to Soroban!');
      queryClient.invalidateQueries({ queryKey: ['registryData', address] });
    },
    onError: (error) => {
      console.error('setData Mutation Error:', error);
      toast.error(error.message || 'Contract transaction failed');
    }
  });

  const { data: storedData, isLoading: isLoadingData } = useQuery({
    queryKey: ['registryData', address],
    queryFn: () => getContractData(address),
    enabled: !!address,
  });

  const { data: globalCount } = useQuery({
    queryKey: ['globalCount'],
    queryFn: getGlobalCount,
    refetchInterval: 10000,
  });

  return {
    storedData,
    globalCount: globalCount || 0,
    isLoadingData,
    submitData: registryMutation.mutateAsync,
    isSubmitting: registryMutation.isPending,
    setData: setDataMutation.mutateAsync,
    isSettingData: setDataMutation.isPending,
    lastTxHash: registryMutation.data?.hash || setDataMutation.data?.hash,
  };
}
