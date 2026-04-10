import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Zap } from 'lucide-react';

export default function WalletModal({ isOpen, onClose, onConnectStellar, onConnectAlbedo, onConnectXbull, onConnectEth }) {
  if (!isOpen) return null;

  const wallets = [
    { 
      name: 'Freighter', 
      network: 'Stellar', 
      color: 'blue',
      action: onConnectStellar,
      icon: (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[85%] h-[85%] object-contain rounded drop-shadow-md">
          <rect width="100" height="100" fill="#6B46DF"/>
          <path d="M43 37C43 41.4183 39.4183 45 35 45C30.5817 45 27 41.4183 27 37C27 32.5817 30.5817 29 35 29C39.4183 29 43 32.5817 43 37Z" stroke="white" strokeWidth="8"/>
          <path d="M43 37H63V45H73V37H79" stroke="white" strokeWidth="8" strokeLinecap="square"/>
          <path d="M57 63C57 67.4183 60.5817 71 65 71C69.4183 71 73 67.4183 73 63C73 58.5817 69.4183 55 65 55C60.5817 55 57 58.5817 57 63Z" stroke="white" strokeWidth="8"/>
          <path d="M57 63H37V55H27V63H21" stroke="white" strokeWidth="8" strokeLinecap="square"/>
        </svg>
      )
    },
    { 
      name: 'Albedo', 
      network: 'Stellar', 
      color: 'purple',
      action: onConnectAlbedo,
      icon: <img src="https://albedo.link/apple-touch-icon.png" alt="Albedo" className="w-full h-full object-contain rounded" />
    },
    { 
      name: 'xBull', 
      network: 'Stellar', 
      color: 'red',
      action: onConnectXbull,
      icon: <img src="https://freighterapi.github.io/favicon.ico" alt="xBull" className="w-full h-full object-contain rounded" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span class="font-black text-red-500">X</span>'; }} />
    },
    { 
      name: 'MetaMask', 
      network: 'Ethereum', 
      color: 'orange',
      action: onConnectEth,
      icon: <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="w-[85%] h-[85%] object-contain drop-shadow" />
    }
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
                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden border border-white/5 group-hover:border-${wallet.color}-500/30 transition-colors`}>
                  {wallet.icon}
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
