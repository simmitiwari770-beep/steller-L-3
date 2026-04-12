import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Wallet, CheckCircle2, RefreshCcw, ExternalLink, Copy, Check, Users } from 'lucide-react';
import { useRegistry } from '../hooks/useRegistry';
import { toast } from 'react-hot-toast';

export default function RegistryForm({ isConnected, walletType, address, balance, onSuccess }) {
  const [destination, setDestination] = useState('');
  const [amount, setAmount] = useState('');
  
  // We're adapting the hook for real transfer
  const { submitData, isSubmitting, lastTxHash } = useRegistry(address, walletType);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!destination || !amount) return;

    try {
      await submitData({ destination, amount });
      setDestination('');
      setAmount('');
      if (onSuccess) onSuccess();
    } catch (error) {
      // Error handled in hook
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="glass-card p-8 border-white/5 bg-white/[0.02]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Stellar Transfer</h3>
              <p className="text-sm text-slate-500">Send real XLM to any address</p>
            </div>
          </div>
        </div>

        {isConnected && (
          <div className="mb-6 p-1 rounded-2xl bg-white/[0.03] border border-white/5 shadow-inner">
            <div className="p-4 flex flex-col items-center">
                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter mb-1">Your Available Balance</div>
                <div className="text-2xl font-black text-white">{balance} <span className="text-xs text-primary-400">XLM</span></div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
              Destination Address
            </label>
            <input 
              type="text" 
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              disabled={!isConnected || isSubmitting}
              placeholder={isConnected ? "G..." : "Connect your wallet first"}
              className="glass-input mb-4"
            />

            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
              Amount (XLM)
            </label>
            <input 
              type="number" 
              step="0.0000001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={!isConnected || isSubmitting}
              placeholder={isConnected ? "0.00" : "0.00"}
              className="glass-input"
            />
          </div>

          <button 
            type="submit"
            disabled={!isConnected || isSubmitting || !destination || !amount}
            className={`w-full glass-button py-4 flex items-center justify-center gap-2 font-bold mt-4
              ${!isConnected || isSubmitting || !destination || !amount ? 'opacity-50 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-500 text-white border-primary-400/50 shadow-lg shadow-primary-500/20'}
            `}
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            {isSubmitting ? 'Processing Payment...' : 'Transfer XLM'}
          </button>
        </form>
      </div>

      <AnimatePresence>
        {lastTxHash && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 border-green-500/20 bg-green-500/[0.02]"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
              </div>
              <h4 className="text-lg font-bold text-white">Transfer Successful</h4>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Transaction Hash</div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-mono text-slate-300 truncate">{lastTxHash}</span>
                  <button onClick={() => copyToClipboard(lastTxHash)} className="text-slate-500 hover:text-white transition-colors">
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <a 
                  href={`https://stellar.expert/explorer/testnet/tx/${lastTxHash}`}
                  target="_blank"
                  className="flex-1 glass-button py-2 text-xs flex items-center justify-center gap-2 bg-white/5"
                >
                  <ExternalLink className="w-3 h-3" />
                  View on Explorer
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
