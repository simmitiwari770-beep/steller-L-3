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
      const sourceAccount = new StellarSdk.Account(address, accountResponse.sequence);

      // 2. Build the initial transaction for Payment
      let tx = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: '1000', // Increased fee for faster ledger inclusion
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
      const sourceAccount = new StellarSdk.Account(address, accountResponse.sequence);

      const Contract = new StellarSdk.Contract(REGISTRY_CONTRACT_ID);
      const userAddress = new StellarSdk.Address(address);

      let tx = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: '1000',
        networkPassphrase: PASSPHRASE,
      })
        .addOperation(Contract.call('set_data', userAddress.toScVal(), StellarSdk.nativeToScVal(content, { type: 'string' })))
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
      
      let attempts = 0;
      let txStatus;
      while (attempts < 20) {
        try {
          txStatus = await server.getTransaction(sendResponse.hash);
          if (txStatus.status !== 'NOT_FOUND' && txStatus.status !== 'PENDING') break;
        } catch (e) {
          console.warn('Polling error, retrying...', e);
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
        attempts++;
      }

      if (!txStatus || txStatus.status === 'FAILED') {
        throw new Error('Contract invocation failed or timed out on network');
      }
      return { hash: sendResponse.hash };
    },
    onSuccess: (data, variables) => {
      toast.success('Data successfully saved to Soroban!');
      // Optimistically update the query data to make it feel "fast"
      queryClient.setQueryData(['registryData', address], variables.content);
      queryClient.invalidateQueries({ queryKey: ['registryData', address] });
      queryClient.invalidateQueries({ queryKey: ['globalCount'] });
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
    staleTime: 1000 * 60 * 5, // 5 minutes caching
    gcTime: 1000 * 60 * 30, // 30 minutes garbage collection
  });

  const { data: globalCount } = useQuery({
    queryKey: ['globalCount'],
    queryFn: getGlobalCount,
    refetchInterval: 10000,
    staleTime: 1000 * 5, // 5 seconds caching
  });

  return {
    storedData,
    globalCount: globalCount || 0,
    isLoadingData,
    submitData: registryMutation.mutateAsync,
    isSubmitting: registryMutation.isPending,
    setData: setDataMutation.mutateAsync,
    isSettingData: setDataMutation.isPending,
    lastTxHash: (!registryMutation.isPending && registryMutation.isSuccess ? registryMutation.data?.hash : null) || 
                (!setDataMutation.isPending && setDataMutation.isSuccess ? setDataMutation.data?.hash : null),
  };
}
