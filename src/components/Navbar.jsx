import { Wallet, LogOut, Hexagon, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function Navbar({ address, onConnect, onDisconnect, isConnected }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass-card px-6 py-3 border-white/5 bg-black/40">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center p-2">
            <Hexagon className="text-white fill-white/20" />
          </div>
          <span className="text-xl font-bold tracking-tight gradient-text">
            Stellar<span className="text-white">Pay</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          {isConnected ? (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-xs text-slate-400 font-medium">Connected Wallet</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-primary-300">
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </span>
                  <button 
                    onClick={() => {
                        navigator.clipboard.writeText(address);
                        toast.success('Address copied!');
                    }}
                    className="p-1 hover:bg-white/5 rounded transition-colors"
                  >
                    <Copy className="w-3 h-3 text-slate-500" />
                  </button>
                </div>
              </div>
              <button 
                onClick={onDisconnect}
                className="glass-button bg-red-500/10 border-red-500/20 hover:bg-red-500/20 group"
              >
                <LogOut className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          ) : (
            <button 
              onClick={onConnect}
              className="glass-button bg-primary-500/20 border-primary-500/30 hover:bg-primary-500/30 flex items-center gap-2"
            >
              <Wallet className="w-4 h-4" />
              <span>Connect Wallet</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
