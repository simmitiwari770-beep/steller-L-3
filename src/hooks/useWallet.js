import { useState, useCallback, useEffect } from 'react';
import { kit, horizonServer } from '../lib/stellar';
import { connectMetaMask } from '../lib/ethereum';
import { toast } from 'react-hot-toast';
import { ethers } from 'ethers';

export function useWallet() {
  const [address, setAddress] = useState(null);
  const [walletType, setWalletType] = useState(null);
  const [balance, setBalance] = useState('0.00');
  const [isConnecting, setIsConnecting] = useState(false);

  const fetchBalance = useCallback(async (addr, type) => {
    try {
      if (['freighter', 'albedo', 'xbull'].includes(type)) {
        const account = await horizonServer.loadAccount(addr);
        const native = account.balances.find(b => b.asset_type === 'native');
        setBalance(parseFloat(native.balance).toFixed(4));
      } else if (type === 'metamask') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const bal = await provider.getBalance(addr);
        setBalance(parseFloat(ethers.formatEther(bal)).toFixed(4));
      }
    } catch (e) {
      console.error('Balance fetch error:', e);
      // If balance fetch fails (e.g. rate limit), don't set it to 0.00 silently.
      toast.error('Balance fetch failed: ' + (e.message || 'Network error'));
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
      toast.success(`${id.charAt(0).toUpperCase() + id.slice(1)} connected!`);
      
      // Fetch balance asynchronously in the background so UI doesn't block
      fetchBalance(address, id);
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
      toast.success('MetaMask connected!');
      
      // Fetch balance asynchronously in the background
      fetchBalance(addr, 'metamask');
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
