
import React from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { ADDRESSES, ABIS } from '../constants';
import { Wallet, CircleUser, TrendingUp, Info, Trophy, ExternalLink } from 'lucide-react';

// Moved component to top and updated to use 'class' prop
const ShieldCheck = ({ class: className }: { class?: string }) => (
  <svg class={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
);

const Dashboard = () => {
  const { address, isConnected } = useAccount();

  const { data: usdcBalance } = useReadContract({
    address: ADDRESSES.USDC,
    abi: ABIS.USDC,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  const { data: username } = useReadContract({
    address: ADDRESSES.USERNAME_REGISTRY,
    abi: ABIS.USERNAME_REGISTRY,
    functionName: 'getUsername',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  const { data: sharesAvailable } = useReadContract({
    address: ADDRESSES.SHARES_REGISTRY,
    abi: ABIS.SHARES_REGISTRY,
    functionName: 'getSharesAvailable',
  });

  const { data: rafflePool } = useReadContract({
    address: ADDRESSES.RAFFLE_ROUND_ACTIVE,
    abi: ABIS.RAFFLE_ROUND,
    functionName: 'getTotalPool',
  });

  if (!isConnected) {
    return (
      <div class="flex flex-col items-center justify-center h-[60vh] text-center">
        <div class="w-20 h-20 bg-gray-900 rounded-3xl flex items-center justify-center mb-6 border border-gray-800 shadow-2xl">
          <Wallet class="text-blue-500" size={40} />
        </div>
        <h2 class="text-2xl font-bold mb-2">Connect your wallet</h2>
        <p class="text-gray-500 max-w-sm">Access the Arbitrum Suite to manage your profile, buy shares, and participate in raffles.</p>
      </div>
    );
  }

  return (
    <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* User Card */}
        <div class="bg-[#111] p-6 rounded-3xl border border-gray-800 shadow-sm hover:border-blue-500/30 transition-all">
          <div class="flex justify-between items-start mb-4">
            <div class="p-3 bg-blue-500/10 rounded-2xl">
              <CircleUser class="text-blue-500" size={24} />
            </div>
            <span class="text-[10px] font-bold text-blue-400 bg-blue-400/10 px-2 py-1 rounded-full uppercase">Profile</span>
          </div>
          <h3 class="text-gray-400 text-sm mb-1">Username</h3>
          <div class="text-xl font-bold truncate">
            {username || <span class="text-gray-600 italic">No Registry</span>}
          </div>
        </div>

        {/* Balance Card */}
        <div class="bg-[#111] p-6 rounded-3xl border border-gray-800 shadow-sm hover:border-green-500/30 transition-all">
          <div class="flex justify-between items-start mb-4">
            <div class="p-3 bg-green-500/10 rounded-2xl">
              <Wallet class="text-green-500" size={24} />
            </div>
            <span class="text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full uppercase">USDC</span>
          </div>
          <h3 class="text-gray-400 text-sm mb-1">Your Balance</h3>
          <div class="text-xl font-bold tracking-tight">
            {usdcBalance ? parseFloat(formatUnits(usdcBalance, 6)).toLocaleString() : '0.00'}
          </div>
        </div>

        {/* Raffle Pool Card */}
        <div class="bg-[#111] p-6 rounded-3xl border border-gray-800 shadow-sm border-yellow-500/20 hover:border-yellow-500/40 transition-all">
          <div class="flex justify-between items-start mb-4">
            <div class="p-3 bg-yellow-500/10 rounded-2xl">
              <Trophy class="text-yellow-500" size={24} />
            </div>
            <span class="text-[10px] font-bold text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded-full uppercase">Live Pool</span>
          </div>
          <h3 class="text-gray-400 text-sm mb-1">Active Raffle</h3>
          <div class="text-xl font-bold tracking-tight text-yellow-500">
            {rafflePool ? formatUnits(rafflePool, 6) : '0.00'} <span class="text-xs text-gray-600">USDC</span>
          </div>
        </div>

        {/* Shares Card */}
        <div class="bg-[#111] p-6 rounded-3xl border border-gray-800 shadow-sm hover:border-purple-500/30 transition-all">
          <div class="flex justify-between items-start mb-4">
            <div class="p-3 bg-purple-500/10 rounded-2xl">
              <TrendingUp class="text-purple-500" size={24} />
            </div>
          </div>
          <h3 class="text-gray-400 text-sm mb-1">Available Shares</h3>
          <div class="text-xl font-bold tracking-tight">
            {sharesAvailable ? sharesAvailable.toString() : '0'}
          </div>
        </div>
      </div>

      {/* Protocol Banner */}
      <div class="bg-gradient-to-br from-blue-600 to-purple-600 p-10 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl">
        <div class="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 class="text-4xl font-black mb-4 leading-tight">Maximize seu Capital na Arbitrum.</h2>
            <p class="text-blue-100 text-lg mb-8 leading-relaxed">Participe de sorteios verificáveis via Chainlink VRF ou torne-se um investidor do protocolo adquirindo cotas de lucro real.</p>
            <div class="flex gap-4">
               <div class="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-xl text-sm border border-white/10">
                 <ShieldCheck class="w-4 h-4" /> Smart Contract Secured
               </div>
               <div class="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-xl text-sm border border-white/10">
                 <ExternalLink class="w-4 h-4" /> Fully Audit-ready
               </div>
            </div>
          </div>
          <div class="hidden lg:flex justify-end">
             <div class="bg-white/10 backdrop-blur-3xl p-8 rounded-[2rem] border border-white/20 shadow-2xl">
                <div class="text-sm font-bold uppercase tracking-widest text-blue-200 mb-2">Rede Ativa</div>
                <div class="text-2xl font-mono font-bold text-white">Arbitrum One</div>
                <div class="mt-4 flex items-center gap-2 text-green-400 font-bold text-xs uppercase">
                  <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Nodes Synchronized
                </div>
             </div>
          </div>
        </div>
        {/* Decor */}
        <div class="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full -mr-40 -mt-40 blur-[100px]" />
      </div>
    </div>
  );
};

export default Dashboard;
