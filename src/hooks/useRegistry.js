import { useMutation, useQuery } from '@tanstack/react-query';
import { getContractData, getGlobalCount, server, horizonServer, kit, PASSPHRASE, StellarSdk, REGISTRY_CONTRACT_ID } from '../lib/stellar';
import { toast } from 'react-hot-toast';

export function useRegistry(address, walletType) {
  // Query to fetch user-specific data
  const { data: storedData, isLoading: isLoadingData, refetch: refetchData } = useQuery({
    queryKey: ['registryData', address],
    queryFn: () => getContractData(address),
    enabled: !!address,
  });

  // Query to fetch global registration count
  const { data: globalCount, refetch: refetchCount } = useQuery({
    queryKey: ['globalRegistryCount'],
    queryFn: () => getGlobalCount(),
    refetchInterval: 10000, // Sync global state every 10s
  });

  const registryMutation = useMutation({
    mutationFn: async (content) => {
      if (!address) throw new Error('Wallet not connected');

      // 1. Fetch current account info from Horizon
      const accountResponse = await horizonServer.loadAccount(address);
      const sourceAccount = new StellarSdk.Account(accountResponse.id, accountResponse.sequence);


      // 2. Build Soroban Contract Call (set_data(user, content))
      const contract = new StellarSdk.Contract(REGISTRY_CONTRACT_ID);
      const userAddr = new StellarSdk.Address(address);
      const scContent = StellarSdk.nativeToScVal(content, { type: 'string' });
      
      const operation = contract.call('set_data', userAddr.toScVal(), scContent);

      // 3. Build the initial transaction
      let tx = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: '1000', // Pre-simulation fee
        networkPassphrase: PASSPHRASE,
      })
        .addOperation(operation)
        .setTimeout(300)
        .build();

      // 4. Simulate to get resource requirements and footprints
      const simulation = await server.simulateTransaction(tx);
      if (StellarSdk.rpc.Api.isSimulationError(simulation)) {
          throw new Error('Contract Simulation Error: ' + simulation.error);
      }

      // 5. Assemble transaction with simulation results (sets footprints, fees, etc.)
      tx = StellarSdk.rpc.assembleTransaction(tx, simulation).build();
      
      // 6. Request wallet signature
      const xdr = tx.toXDR();
      const signResult = await kit.signTransaction(xdr, { 
        network: 'TESTNET', 
        networkPassphrase: PASSPHRASE 
      });

      const signedXdr = typeof signResult === 'string' ? signResult : (signResult.signedTxXdr || signResult.signedTransaction);
      if (!signedXdr) throw new Error('Failed to get signed transaction from wallet.');

      const signedTx = StellarSdk.TransactionBuilder.fromXDR(signedXdr, PASSPHRASE);

      // 7. Submit to Soroban RPC (Using sendTransaction)
      const sendResponse = await server.sendTransaction(signedTx);
      
      if (sendResponse.status === 'ERROR') {
        throw new Error('RPC Submission Error: ' + JSON.stringify(sendResponse.error));
      }

      // 8. Poll for transaction result
      toast('Transaction submitted. Waiting for Soroban network...', { icon: '⏳' });
      
      let txResult = await server.getTransaction(sendResponse.hash);
      let attempts = 0;
      while (txResult.status === 'NOT_FOUND' || txResult.status === 'PENDING') {
        if (attempts > 15) throw new Error('Transaction polling timed out.');
        await new Promise(r => setTimeout(r, 2000));
        txResult = await server.getTransaction(sendResponse.hash);
        attempts++;
      }

      if (txResult.status === 'SUCCESS') {
        return { hash: sendResponse.hash };
      } else {
        throw new Error(`Transaction failed: ${txResult.status}`);
      }
    },
    onSuccess: () => {
      toast.success('Soroban Registry Updated!');
      refetchData();
      refetchCount();
    },
    onError: (error) => {
      console.error('Registry Mutation Error:', error);
      toast.error(error.message || 'Smart Contract interaction failed');
    }
  });

  return {
    storedData,
    globalCount: globalCount || 0,
    isLoadingData,
    submitData: registryMutation.mutateAsync,
    isSubmitting: registryMutation.isPending,
    lastTxHash: registryMutation.data?.hash,
  };
}
