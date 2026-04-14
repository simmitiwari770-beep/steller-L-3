import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWallet } from '../../src/hooks/useWallet';

// Mock the kit and stellar lib
vi.mock('../../src/lib/stellar', () => ({
  kit: {
    setWallet: vi.fn(),
    fetchAddress: vi.fn(),
  },
  horizonServer: {
    loadAccount: vi.fn().mockResolvedValue({
      accountId: () => 'G...1234',
      sequenceNumber: () => '1',
      balances: [{ asset_type: 'native', balance: '100.00' }]
    })
  },
  Networks: { TESTNET: 'TESTNET' }
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

  it('should connect to Albedo', async () => {
    const { kit } = await import('../../src/lib/stellar');
    kit.fetchAddress.mockResolvedValue({ address: 'G...ALBE' });

    const { result } = renderHook(() => useWallet());

    await act(async () => {
      await result.current.connectAlbedo();
    });

    expect(kit.setWallet).toHaveBeenCalledWith('albedo');
    expect(result.current.address).toBe('G...ALBE');
    expect(result.current.walletType).toBe('albedo');
  });

  it('should connect to xBull', async () => {
    const { kit } = await import('../../src/lib/stellar');
    kit.fetchAddress.mockResolvedValue({ address: 'G...XBUL' });

    const { result } = renderHook(() => useWallet());

    await act(async () => {
      await result.current.connectXbull();
    });

    expect(kit.setWallet).toHaveBeenCalledWith('xbull');
    expect(result.current.address).toBe('G...XBUL');
    expect(result.current.walletType).toBe('xbull');
  });

  it('should gracefully handle connection errors', async () => {
    const { kit } = await import('../../src/lib/stellar');
    kit.fetchAddress.mockRejectedValue(new Error('User rejected'));

    const { result } = renderHook(() => useWallet());

    await act(async () => {
      await result.current.connectStellar();
    });

    // Address should remain null if connection fails
    expect(result.current.address).toBe(null);
    expect(result.current.isConnecting).toBe(false);
  });
});
