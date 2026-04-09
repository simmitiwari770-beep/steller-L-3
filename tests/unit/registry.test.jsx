import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRegistry } from '../../src/hooks/useRegistry';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Wrapper for React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

vi.mock('../../src/lib/stellar', () => ({
  getContractData: vi.fn(),
}));

describe('useRegistry hook', () => {
  it('should initialize with null state', () => {
    const { result } = renderHook(() => useRegistry(null, null), {
      wrapper: createWrapper(),
    });
    expect(result.current.storedData).toBe(undefined);
    expect(result.current.isSubmitting).toBe(false);
  });

  it('should handle submission successfully', async () => {
    const { result } = renderHook(() => useRegistry('G...123', 'freighter'), {
      wrapper: createWrapper(),
    });

    const { waitFor } = await import('@testing-library/react');
    
    await act(async () => {
      await result.current.submitData('Test Data');
    });

    await waitFor(() => expect(result.current.lastTxHash).toBeDefined());
  });
});
