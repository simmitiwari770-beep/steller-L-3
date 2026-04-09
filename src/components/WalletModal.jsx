import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Zap } from 'lucide-react';

export default function WalletModal({ isOpen, onClose, onConnectStellar, onConnectAlbedo, onConnectXbull, onConnectEth }) {
  if (!isOpen) return null;

  const wallets = [
    { name: 'Freighter', network: 'Stellar', icon: 'https://www.stellar.org/icons/stellar-rocket.svg', action: onConnectStellar, color: 'primary' },
    { name: 'Albedo', network: 'Stellar', icon: 'https://albedo.link/static/images/logo.svg', action: onConnectAlbedo, color: 'primary' },
    { name: 'xBull', network: 'Stellar', icon: 'https://xbull.app/img/logo.png', action: onConnectXbull, color: 'primary' },
    { name: 'MetaMask', network: 'Ethereum', icon: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Logo.svg', action: onConnectEth, color: 'orange' }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-md glass-card bg-[#0d0a1b] p-8"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-full"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Connect Wallet</h2>
            <p className="text-slate-400 text-sm">Select your preferred blockchain provider</p>
          </div>

          <div className="grid gap-3">
            {wallets.map((wallet) => (
              <button 
                key={wallet.name}
                onClick={() => { wallet.action(); onClose(); }}
                className={`flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-${wallet.color}-500/10 hover:border-${wallet.color}-500/30 transition-all group`}
              >
                <div className={`w-10 h-10 rounded-xl bg-${wallet.color}-500/20 flex items-center justify-center overflow-hidden`}>
                  <img src={wallet.icon} className="w-6 h-6 object-contain grayscale group-hover:grayscale-0 transition-all" alt={wallet.name} />
                </div>
                <div className="text-left flex-1">
                  <div className="font-bold text-white">{wallet.name}</div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">{wallet.network}</div>
                </div>
                <Zap className="w-4 h-4 text-slate-600 group-hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-all" />
              </button>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
            <ShieldCheck className="w-3 h-3" />
            Verified & Encrypted Session
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
