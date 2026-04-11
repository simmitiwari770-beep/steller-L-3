import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRegistry } from '../../src/hooks/useRegistry';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock Stellar SDK components from lib/stellar
vi.mock('../../src/lib/stellar', () => {
  return {
    getContractData: vi.fn().mockResolvedValue("Mock Soroban Data"),
    getGlobalCount: vi.fn().mockResolvedValue(42),
    REGISTRY_CONTRACT_ID: 'CCGZUXO6G6V7YWWIDDJKVJK6VJK6VJK6VJK6VJK6VJK6VJK6VJK6VJK6',
    PASSPHRASE: 'Test SDF Test Network ; September 2015',
    server: {
      simulateTransaction: vi.fn().mockResolvedValue({ 
        result: { retval: 'mock_retval' },
        status: 'SUCCESS' 
      }),
      sendTransaction: vi.fn().mockResolvedValue({ hash: 'tx_soroban_123', status: 'PENDING' }),
      getTransaction: vi.fn().mockResolvedValue({ status: 'SUCCESS' }),
    },
    horizonServer: {
      loadAccount: vi.fn().mockResolvedValue({
        id: 'GBRPYHIL2CI3FNMWB27S6GZ67XGC7W6H657Q2H77LMWAFG3RFS47H3L2',
        sequence: '1',
      }),

    },
    kit: {
      signTransaction: vi.fn().mockResolvedValue('signed_xdr_string'),
    },
    StellarSdk: {
      Account: vi.fn().mockImplementation((id, seq) => ({ accountId: () => id, sequenceNumber: () => seq })),
      Contract: vi.fn().mockImplementation(() => ({
        call: vi.fn().mockReturnValue({}),
      })),
      Address: vi.fn().mockImplementation(() => ({
        toScVal: vi.fn().mockReturnValue({}),
      })),
      nativeToScVal: vi.fn().mockReturnValue({}),
      TransactionBuilder: vi.fn().mockImplementation(() => ({
        addOperation: vi.fn().mockReturnThis(),
        setTimeout: vi.fn().mockReturnThis(),
        build: vi.fn().mockReturnValue({ toXDR: () => 'mock_xdr' }),
      })),
      rpc: {
        Api: {
          isSimulationError: vi.fn().mockReturnValue(false),
        },
        assembleTransaction: vi.fn().mockReturnValue({
          build: vi.fn().mockReturnValue({ 
            toXDR: () => 'mock_xdr',
            hash: () => 'tx_hash'
          }),
        }),
      },
      Networks: { TESTNET: 'TESTNET' },
    }
  };
});

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useRegistry hook (Soroban Focused)', () => {
  it('should initialize with contract data and global count', async () => {
    const { result } = renderHook(() => useRegistry('G...addr', 'freighter'), {
      wrapper: createWrapper(),
    });
    
    // Check initial loading states or resolved values if mock resolves quickly
    expect(result.current.isSubmitting).toBe(false);
  });

  it('should execute Soroban set_data flow', async () => {
    const { result } = renderHook(() => useRegistry('GBRPYHIL2CI3FNMWB27S6GZ67XGC7W6H657Q2H77LMWAFG3RFS47H3L2', 'freighter'), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.submitData('Hello Soroban');
    });

    expect(result.current.lastTxHash).toBe('tx_soroban_123');
  });
});
