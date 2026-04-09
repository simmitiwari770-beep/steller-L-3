import { ethers } from 'ethers';

export const ETHEREUM_NETWORK = 'sepolia';

export async function connectMetaMask() {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed');
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send('eth_requestAccounts', []);
    return accounts[0];
  } catch (error) {
    console.error('MetaMask connection error:', error);
    throw error;
  }
}

export async function getEthBalance(address) {
  if (!window.ethereum) return "0";
  const provider = new ethers.BrowserProvider(window.ethereum);
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance);
}
