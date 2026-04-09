import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Database, CheckCircle2, RefreshCcw, ExternalLink, Copy, Check, Wallet } from 'lucide-react';
import { useRegistry } from '../hooks/useRegistry';
import { toast } from 'react-hot-toast';

export default function RegistryForm({ isConnected, walletType, address, balance }) {
  const [inputValue, setInputValue] = useState('');
  const { storedData, isLoadingData, submitData, isSubmitting, lastTxHash } = useRegistry(address, walletType);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue) return;

    try {
      await submitData(inputValue);
      toast.success('Transaction Completed!');
      setInputValue('');
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

  const isStellar = ['freighter', 'albedo', 'xbull'].includes(walletType);
  const currency = isStellar ? 'XLM' : 'ETH';

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
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Wallet className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Initial Balance</div>
                <div className="text-sm font-bold text-white">{balance} {currency}</div>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary-500/10">
                <RefreshCcw className="w-4 h-4 text-primary-400" />
              </div>
              <div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Est. After Tx</div>
                <div className="text-sm font-bold text-slate-300">
                  {lastTxHash ? (parseFloat(balance) - 0.0001).toFixed(4) : (parseFloat(balance) > 0 ? (parseFloat(balance) - 0.0001).toFixed(4) : '0.00')} {currency}
                </div>
              </div>
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
              placeholder={isConnected ? "Enter transaction details..." : "Please connect wallet first"}
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
