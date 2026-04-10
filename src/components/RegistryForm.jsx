import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Database, CheckCircle2, RefreshCcw, ExternalLink, Copy, Check, Wallet } from 'lucide-react';
import { useRegistry } from '../hooks/useRegistry';
import { toast } from 'react-hot-toast';

export default function RegistryForm({ isConnected, walletType, address, balance, onSuccess }) {
  const [inputValue, setInputValue] = useState('');
  const { storedData, isLoadingData, submitData, isSubmitting, lastTxHash, lastTxAmount } = useRegistry(address, walletType);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue) return;

    try {
      await submitData(inputValue);
      toast.success('Transaction Completed!');
      setInputValue('');
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

  const isStellar = walletType ? ['freighter', 'albedo', 'xbull'].includes(walletType) : false;
  const currency = isStellar ? 'XLM' : 'ETH';
  const totalDeducted = parseFloat(lastTxAmount || '0.00001') + 0.0001; // exact txAmount + network fee

  return (
    <div className="flex flex-col gap-6">
      <div className="glass-card p-8 border-white/5 bg-white/[0.02]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
              <Database className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Transaction Vault</h3>
              <p className="text-sm text-slate-500">Secure entry on {isStellar ? 'Stellar' : 'Ethereum'}</p>
            </div>
          </div>
          
          {isConnected && (
            <div className="flex flex-col items-end">
               <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Current Record</div>
               <div className="text-sm font-medium text-primary-300 flex items-center gap-2">
                  {isLoadingData ? <RefreshCcw className="w-3 h-3 animate-spin" /> : (storedData || 'No data')}
               </div>
            </div>
          )}
        </div>

        {isConnected && (
          <div className="mb-6 p-1 rounded-2xl bg-white/[0.03] border border-white/5 shadow-inner">
            <div className="p-4 flex flex-col items-center justify-center">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Available Funds</div>
              <div className="flex flex-col items-center">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-white">{balance}</span>
                  <span className="text-[10px] font-bold text-primary-400">{currency}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  ≈ ${isStellar ? (parseFloat(balance) * 0.11).toFixed(2) : (parseFloat(balance) * 2400).toFixed(2)} USD
                </div>
              </div>
            </div>
            <div className="px-4 py-2 border-t border-white/5 bg-white/[0.01] rounded-b-2xl flex justify-between items-center">
                <span className="text-[9px] text-slate-600 font-medium italic">Estimated Network Fee: 0.0001 {currency}</span>
                {lastTxHash && <span className="text-[9px] text-green-500 font-bold uppercase tracking-tighter animate-pulse">Updated</span>}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
              Payment Reference / Amount
            </label>
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={!isConnected || isSubmitting}
              placeholder={isConnected ? "Enter amount of XLM to push..." : "Please connect wallet first"}
              className="glass-input"
            />
          </div>

          <button 
            type="submit"
            disabled={!isConnected || isSubmitting || !inputValue}
            className={`w-full glass-button py-4 flex items-center justify-center gap-2 font-bold
              ${!isConnected || isSubmitting || !inputValue ? 'opacity-50 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-500 text-white border-primary-400/50 shadow-lg shadow-primary-500/20'}
            `}
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            {isSubmitting ? 'Processing Transaction...' : 'Authorize Transfer'}
          </button>
        </form>
      </div>

      <AnimatePresence>
        {lastTxHash && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="glass-card p-6 border-green-500/20 bg-green-500/[0.02]"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
              </div>
              <h4 className="text-lg font-bold text-white">Transaction Completed</h4>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Receipt Hash</div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-mono text-slate-300 truncate">{lastTxHash}</span>
                  <button onClick={() => copyToClipboard(lastTxHash)} className="text-slate-500 hover:text-white transition-colors">
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex flex-col items-center justify-center min-w-[120px]">
                   <div className="text-[10px] text-red-400 font-bold uppercase tracking-widest mb-1">Deducted</div>
                   <div className="text-sm font-black text-red-500">-{totalDeducted.toFixed(5)} {currency}</div>
                </div>
                <a 
                  href={`https://${isStellar ? 'stellar.expert/explorer/testnet' : 'sepolia.etherscan.io'}/tx/${lastTxHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 glass-button py-2 text-xs flex items-center justify-center gap-2 bg-white/5"
                >
                  <ExternalLink className="w-3 h-3" />
                  View Explorer
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
