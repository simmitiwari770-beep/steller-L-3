import { useState, useCallback, useEffect } from 'react';
import { kit, server } from '../lib/stellar';
import { connectMetaMask } from '../lib/ethereum';
import { toast } from 'react-hot-toast';
import { Asset } from '@stellar/stellar-sdk';
import { ethers } from 'ethers';

export function useWallet() {
  const [address, setAddress] = useState(null);
  const [walletType, setWalletType] = useState(null);
  const [balance, setBalance] = useState('0.00');
  const [isConnecting, setIsConnecting] = useState(false);

  const fetchBalance = useCallback(async (addr, type) => {
    try {
      if (['freighter', 'albedo', 'xbull'].includes(type)) {
        const account = await server.getAccount(addr);
        const native = account.balances.find(b => b.asset_type === 'native');
        setBalance(parseFloat(native.balance).toFixed(2));
      } else if (type === 'metamask') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const bal = await provider.getBalance(addr);
        setBalance(parseFloat(ethers.formatEther(bal)).toFixed(4));
      }
    } catch (e) {
      console.error('Balance fetch error:', e);
      setBalance('0.00');
    }
  }, []);

  const connectStellarWallet = useCallback(async (id) => {
    setIsConnecting(true);
    try {
      kit.setWallet(id);
      const { address } = await kit.fetchAddress();
      setAddress(address);
      setWalletType(id);
      await fetchBalance(address, id);
      toast.success(`${id.charAt(0).toUpperCase() + id.slice(1)} connected!`);
    } catch (error) {
      console.error(`${id} connection error:`, error);
      toast.error(`${id} connection failed`);
    } finally {
      setIsConnecting(false);
    }
  }, [fetchBalance]);

  const connectEth = useCallback(async () => {
    setIsConnecting(true);
    try {
      const addr = await connectMetaMask();
      setAddress(addr);
      setWalletType('metamask');
      await fetchBalance(addr, 'metamask');
      toast.success('MetaMask connected!');
    } catch (error) {
           console.error(error);
      toast.error(error.message || 'MetaMask connection failed');
    } finally {
      setIsConnecting(false);
    }
  }, [fetchBalance]);

  const disconnect = useCallback(() => {
    setAddress(null);
    setWalletType(null);
    setBalance('0.00');
    toast('Wallet disconnected');
  }, []);

  // Update balance when address changes
  useEffect(() => {
    if (address && walletType) {
      fetchBalance(address, walletType);
    }
  }, [address, walletType, fetchBalance]);

  return {
    address,
    walletType,
    balance,
    isConnecting,
    connectStellar: () => connectStellarWallet('freighter'),
    connectAlbedo: () => connectStellarWallet('albedo'),
    connectXbull: () => connectStellarWallet('xbull'),
    connectEth,
    disconnect,
    refreshBalance: () => fetchBalance(address, walletType),
    isConnected: !!address
  };
}
