import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRegistry } from '../../src/hooks/useRegistry';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock Stellar SDK components from lib/stellar
vi.mock('../../src/lib/stellar', () => {
  const mockStellarSdk = {
    Account: vi.fn().mockImplementation(function(accountId, sequence) {
      this.accountId = () => accountId;
      this.sequenceNumber = () => sequence;
      return this;
    }),
    TransactionBuilder: Object.assign(vi.fn(), {
      fromXDR: vi.fn().mockReturnValue({}),
    }),
    Operation: {
      payment: vi.fn().mockReturnValue({ type: 'payment' }),
    },
    Asset: {
      native: vi.fn().mockReturnValue({ code: 'XLM' }),
    },
    Memo: {
      text: vi.fn().mockReturnValue({ value: 'memo' }),
    },
  };

  // Setup the TransactionBuilder prototype
  mockStellarSdk.TransactionBuilder.prototype.addOperation = vi.fn().mockReturnThis();
  mockStellarSdk.TransactionBuilder.prototype.addMemo = vi.fn().mockReturnThis();
  mockStellarSdk.TransactionBuilder.prototype.setTimeout = vi.fn().mockReturnThis();
  mockStellarSdk.TransactionBuilder.prototype.build = vi.fn().mockReturnValue({
    toXDR: () => 'xdr_mock_string'
  });

  return {
    getContractData: vi.fn().mockResolvedValue("Mock Data"),
    horizonServer: {
      loadAccount: vi.fn().mockResolvedValue({
        accountId: () => 'GBRPYHIL2CI3FNMWB27S6GZ67XGC7W6H657Q2H77LMWAFG3RFS47H3L2',
        sequenceNumber: () => '1',
      }),
      submitTransaction: vi.fn().mockResolvedValue({ hash: 'tx123' }),
    },
    kit: {
      signTransaction: vi.fn().mockResolvedValue({ signedTxXdr: 'signed_xdr' }),
    },
    PASSPHRASE: 'Test SDF Test Network ; September 2015',
    StellarSdk: mockStellarSdk
  };
});

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

describe('useRegistry hook', () => {
  it('should initialize with null state', () => {
    const { result } = renderHook(() => useRegistry(null, null), {
      wrapper: createWrapper(),
    });
    expect(result.current.storedData).toBe(undefined);
    expect(result.current.isSubmitting).toBe(false);
  });

  it('should handle submission successfully', async () => {
    const validAddress = 'GBRPYHIL2CI3FNMWB27S6GZ67XGC7W6H657Q2H77LMWAFG3RFS47H3L2';
    const { result } = renderHook(() => useRegistry(validAddress, 'freighter'), {
      wrapper: createWrapper(),
    });

    const { waitFor } = await import('@testing-library/react');
    
    await act(async () => {
      await result.current.submitData('Test Data');
    });

    await waitFor(() => expect(result.current.lastTxHash).toBeDefined());
  });
});
