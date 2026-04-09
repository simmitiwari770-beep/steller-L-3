import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWallet } from '../../src/hooks/useWallet';

// Mock the kit and ethereum lib
vi.mock('../../src/lib/stellar', () => ({
  kit: {
    setWallet: vi.fn(),
    fetchAddress: vi.fn(),
  },
  Networks: { TESTNET: 'TESTNET' }
}));

vi.mock('../../src/lib/ethereum', () => ({
  connectMetaMask: vi.fn(),
}));

describe('useWallet hook', () => {
  it('should initialize with no address', () => {
    const { result } = renderHook(() => useWallet());
    expect(result.current.address).toBe(null);
    expect(result.current.isConnected).toBe(false);
  });

  it('should connect to Stellar', async () => {
    const { kit } = await import('../../src/lib/stellar');
    kit.fetchAddress.mockResolvedValue({ address: 'G...1234' });

    const { result } = renderHook(() => useWallet());
    
    await act(async () => {
      await result.current.connectStellar();
    });

    expect(kit.setWallet).toHaveBeenCalledWith('freighter');
    expect(result.current.address).toBe('G...1234');
    expect(result.current.walletType).toBe('freighter');
  });

  it('should disconnect correctly', async () => {
    const { result } = renderHook(() => useWallet());
    
    await act(async () => {
      result.current.disconnect();
    });

    expect(result.current.address).toBe(null);
    expect(result.current.walletType).toBe(null);
  });
});
