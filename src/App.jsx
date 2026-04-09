import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useWallet } from './hooks/useWallet';
import Navbar from './components/Navbar';
import WalletModal from './components/WalletModal';
import RegistryForm from './components/RegistryForm';
import { Activity, Shield, Zap, Globe } from 'lucide-react';

function App() {
  const { 
    address, 
    isConnected, 
    walletType, 
    balance,
    connectStellar, 
    connectAlbedo,
    connectXbull,
    connectEth, 
    disconnect 
  } = useWallet();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="hero-glow" />
      <Toaster position="bottom-right" />
      
      <Navbar 
        address={address} 
        isConnected={isConnected} 
        onConnect={() => setIsModalOpen(true)}
        onDisconnect={disconnect}
      />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-bold uppercase tracking-wider mb-6">
              <Zap className="w-3 h-3 fill-primary-400" />
              Live Multi-Chain Environment
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white leading-none mb-6">
              The Next Gen <br />
              <span className="gradient-text">Secure Ledger</span>
            </h1>
            
            <p className="text-lg text-slate-400 max-w-lg mb-10 leading-relaxed">
              Experience the power of multi-chain interoperability. Execute secure transfers on Stellar Soroban or Ethereum Sepolia with real-time balance tracking.
            </p>

            <div className="grid grid-cols-2 gap-6">
              <StatCard icon={Globe} label="Interoperability" value="4+ Wallets" />
              <StatCard icon={Shield} label="Security" value="Encrypted" />
              <StatCard icon={Activity} label="Balance" value="Real-Time" />
              <StatCard icon={Zap} label="Latency" value="~5 Seconds" />
            </div>
          </motion.div>

          {/* Right Column: Interaction Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              {!isConnected && (
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-purple-600 rounded-3xl blur opacity-20 animate-pulse-slow" />
              )}
              <RegistryForm 
                isConnected={isConnected} 
                walletType={walletType} 
                address={address} 
                balance={balance}
              />
            </div>
          </motion.div>
        </div>
      </main>

      <WalletModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConnectStellar={connectStellar}
        onConnectAlbedo={connectAlbedo}
        onConnectXbull={connectXbull}
        onConnectEth={connectEth}
      />
      
      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-black/40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-500 text-sm font-medium">
            © 2026 StellarPay. Built for the Future of Web3.
          </div>
          <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-slate-400">
            <a href="#" className="hover:text-primary-400 transition-colors">Explorer</a>
            <a href="#" className="hover:text-primary-400 transition-colors">Documentation</a>
            <a href="#" className="hover:text-primary-400 transition-colors">Github</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group">
      <Icon className="w-5 h-5 text-primary-400 mb-2 group-hover:scale-110 transition-transform" />
      <div className="text-xs text-slate-500 font-bold uppercase tracking-tighter">{label}</div>
      <div className="text-sm font-bold text-white mt-0.5">{value}</div>
    </div>
  );
}

export default App;
