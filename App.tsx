
import React, { useState } from 'react';
// Use a more resilient import for react-router-dom to handle possible export issues in the environment
import * as RRD from 'react-router-dom';
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi';
import { arbitrum } from 'wagmi/chains';
import { Wallet, LayoutDashboard, UserPlus, PieChart, Trophy, Power, AlertTriangle, Menu, X } from 'lucide-react';
import Dashboard from './views/Dashboard';
import UsernameView from './views/Username';
import SharesView from './views/Shares';
import RaffleView from './views/Raffle';

// Extract components with any cast to bypass "no exported member" and prop errors
const { HashRouter, Routes, Route, NavLink } = RRD as any;

const App: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isWrongNetwork = isConnected && chainId !== arbitrum.id;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <HashRouter>
      <div class="min-h-screen bg-[#050505] text-gray-200 font-['Inter']">
        {/* Navigation Bar */}
        <header class="fixed top-0 left-0 right-0 z-[100] p-4 md:p-6">
          <div class="max-w-7xl mx-auto flex justify-between items-center bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl px-6 py-4 shadow-2xl">
            {/* Logo */}
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                <Trophy class="text-black" size={20} />
              </div>
              <h1 class="text-lg font-black tracking-tighter uppercase hidden sm:block">
                INSTANT WIN <span class="text-yellow-500 text-xs ml-1 font-bold">ARB</span>
              </h1>
            </div>

            {/* Actions */}
            <div class="flex items-center gap-4">
              {isConnected ? (
                <div class="flex items-center gap-4">
                  <div class="hidden md:flex flex-col items-end">
                    <span class="text-[10px] text-gray-500 font-black uppercase tracking-widest leading-none mb-1">Status</span>
                    <div class="flex items-center gap-1.5">
                      <div class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span class="text-xs font-mono text-gray-400">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                    </div>
                  </div>
                  <button 
                    onClick={toggleMenu}
                    class="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all text-gray-400 hover:text-white"
                  >
                    {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => connect({ connector: connectors[0] })}
                  class="bg-yellow-500 text-black px-6 py-3 rounded-2xl font-black text-sm hover:bg-yellow-400 transition-all flex items-center gap-2 shadow-lg shadow-yellow-500/10"
                >
                  <Wallet size={18} />
                  CONNECT
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Fullscreen Mobile Menu Overlay */}
        {isMenuOpen && (
          <div class="fixed inset-0 z-[90] bg-black/95 backdrop-blur-3xl animate-in fade-in duration-300 flex flex-col items-center justify-center p-8">
            <nav class="w-full max-w-sm space-y-4">
              <MobileNavLink to="/" onClick={toggleMenu} icon={<LayoutDashboard />} label="Dashboard" />
              <MobileNavLink to="/raffle" onClick={toggleMenu} icon={<Trophy />} label="Raffle Round" />
              <MobileNavLink to="/shares" onClick={toggleMenu} icon={<PieChart />} label="Shares Market" />
              <MobileNavLink to="/username" onClick={toggleMenu} icon={<UserPlus />} label="Profile Settings" />
              
              <div class="pt-8 space-y-4">
                {isWrongNetwork && (
                  <button
                    onClick={() => switchChain({ chainId: arbitrum.id })}
                    class="w-full flex items-center justify-center gap-2 bg-yellow-500 text-black py-4 rounded-2xl font-black text-sm"
                  >
                    <AlertTriangle size={18} /> SWITCH TO ARBITRUM
                  </button>
                )}
                <button
                  onClick={() => { disconnect(); toggleMenu(); }}
                  class="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-500 border border-red-500/20 py-4 rounded-2xl font-bold text-sm"
                >
                  <Power size={18} /> DISCONNECT WALLET
                </button>
              </div>
            </nav>
          </div>
        )}

        {/* Main Content Area */}
        <main class="pt-32 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/username" element={<UsernameView />} />
            <Route path="/shares" element={<SharesView />} />
            <Route path="/raffle" element={<RaffleView />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <footer class="p-12 text-center text-[10px] text-gray-700 font-bold uppercase tracking-[0.3em]">
          &copy; {new Date().getFullYear()} Instant Win Protocol • Powered by Arbitrum & Chainlink
        </footer>
      </div>
    </HashRouter>
  );
};

const MobileNavLink: React.FC<{ to: string; onClick: () => void; icon: React.ReactNode; label: string }> = ({ to, onClick, icon, label }) => (
  <NavLink
    to={to}
    onClick={onClick}
    // Use any cast for NavLink's className/class prop function as it varies between router versions and environments
    {...({
      class: ({ isActive }: any) => `
        flex items-center gap-4 px-8 py-6 rounded-[2rem] border transition-all duration-300
        ${isActive ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500' : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'}
      `
    } as any)}
  >
    {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 24 }) : icon}
    <span class="text-xl font-black uppercase tracking-tight">{label}</span>
  </NavLink>
);

export default App;
