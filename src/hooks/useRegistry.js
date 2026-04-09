import { useMutation, useQuery } from '@tanstack/react-query';
import { getContractData } from '../lib/stellar';
import { toast } from 'react-hot-toast';

export function useRegistry(address, walletType) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['registryData', address],
    queryFn: () => getContractData(address),
    enabled: !!address,
    staleTime: 30000,
  });

  const registryMutation = useMutation({
    mutationFn: async (content) => {
      // Logic for actual contract call would go here
      // For the demo, we simulate the interaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { hash: Math.random().toString(16).slice(2) };
    },
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      toast.error('Submission failed: ' + error.message);
    }
  });

  return {
    storedData: data,
    isLoadingData: isLoading,
    submitData: registryMutation.mutateAsync,
    isSubmitting: registryMutation.isPending,
    lastTxHash: registryMutation.data?.hash
  };
}
