
import React, { useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
// Import arbitrum chain for explicit inclusion in writeContract calls
import { arbitrum } from 'wagmi/chains';
import { formatUnits } from 'viem';
import { ADDRESSES, ABIS } from '../constants';
import { PieChart, ShoppingCart, ShieldCheck, Loader2, AlertCircle, TrendingUp, Gift } from 'lucide-react';

const SharesView = () => {
  const { address } = useAccount();
  const [amount, setAmount] = useState('1');
  const [claimRoundId, setClaimRoundId] = useState('0');

  const { data: usdcBalance } = useReadContract({
    address: ADDRESSES.USDC,
    abi: ABIS.USDC,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: ADDRESSES.USDC,
    abi: ABIS.USDC,
    functionName: 'allowance',
    args: address ? [address, ADDRESSES.SHARES_REGISTRY] : undefined,
  });

  const { data: availableShares, refetch: refetchShares } = useReadContract({
    address: ADDRESSES.SHARES_REGISTRY,
    abi: ABIS.SHARES_REGISTRY,
    functionName: 'getSharesAvailable',
  });

  const { writeContract, data: txHash, isPending: isTxPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  React.useEffect(() => {
    if (isSuccess) {
      refetchAllowance();
      refetchShares();
    }
  }, [isSuccess, refetchAllowance, refetchShares]);

  const parsedAmount = parseInt(amount || '0');
  const usdcRequired = BigInt(isNaN(parsedAmount) ? 0 : parsedAmount * 1_000_000); 

  const needsApproval = (allowance || 0n) < usdcRequired;

  const handleApprove = () => {
    if (!address) return;
    writeContract({
      address: ADDRESSES.USDC,
      abi: ABIS.USDC,
      functionName: 'approve',
      args: [ADDRESSES.SHARES_REGISTRY, BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")],
      account: address,
      chain: arbitrum,
    });
  };

  const handleBuy = () => {
    if (!parsedAmount || isNaN(parsedAmount) || !address) return;
    writeContract({
      address: ADDRESSES.SHARES_REGISTRY,
      abi: ABIS.SHARES_REGISTRY,
      functionName: 'buyShares',
      args: [BigInt(parsedAmount)],
      account: address,
      chain: arbitrum,
    });
  };

  const handleClaim = () => {
    if (!claimRoundId || !address) return;
    writeContract({
      address: ADDRESSES.SHARES_REGISTRY,
      abi: ABIS.SHARES_REGISTRY,
      functionName: 'claimRewards',
      args: [BigInt(claimRoundId)],
      account: address,
      chain: arbitrum,
    });
  };

  return (
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto animate-in fade-in duration-700 pb-12">
      <div class="lg:col-span-7 space-y-6">
        <div class="bg-[#111] p-8 rounded-[2.5rem] border border-gray-800 shadow-2xl space-y-8">
          <div class="flex items-center gap-4 mb-2">
            <div class="p-3 bg-purple-500/10 rounded-2xl">
              <PieChart class="text-purple-500" size={28} />
            </div>
            <div>
              <h2 class="text-2xl font-bold">Buy Protocol Shares</h2>
              <p class="text-gray-500 text-sm">Convert USDC to protocol shares and participate in growth.</p>
            </div>
          </div>

          <div class="space-y-4">
            <div class="flex justify-between text-sm px-1">
              <label class="text-gray-400 font-medium">Amount to Purchase</label>
              <span class="text-gray-500">Balance: {usdcBalance ? formatUnits(usdcBalance, 6) : '0'} USDC</span>
            </div>
            <div class="relative">
              <input
                type="number"
                value={amount}
                onChange={(e: any) => setAmount(e.target.value)}
                class="w-full bg-gray-900/50 border border-gray-800 rounded-3xl py-6 px-6 text-3xl font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
                min="1"
              />
              <div class="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">SHARES</div>
            </div>
          </div>

          <div class="space-y-3 pt-2">
            {needsApproval ? (
              <button
                onClick={handleApprove}
                disabled={isTxPending || isConfirming}
                class="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl transition-all"
              >
                {(isTxPending || isConfirming) ? <Loader2 class="animate-spin" /> : <ShieldCheck size={24} />}
                Approve USDC Spending
              </button>
            ) : (
              <button
                onClick={handleBuy}
                disabled={isTxPending || isConfirming || !parsedAmount}
                class="w-full bg-purple-600 hover:bg-purple-500 text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl transition-all"
              >
                {(isTxPending || isConfirming) ? <Loader2 class="animate-spin" /> : <ShoppingCart size={24} />}
                Purchase Shares
              </button>
            )}
          </div>
        </div>

        <div class="bg-[#111] p-8 rounded-[2.5rem] border border-gray-800 shadow-xl space-y-6">
           <div class="flex items-center gap-4">
            <div class="p-3 bg-green-500/10 rounded-2xl">
              <Gift class="text-green-500" size={28} />
            </div>
            <div>
              <h2 class="text-xl font-bold">Claim Rewards</h2>
              <p class="text-gray-500 text-sm">Collect your portion of protocol earnings.</p>
            </div>
          </div>
          <div class="flex gap-4">
             <input
                type="number"
                value={claimRoundId}
                onChange={(e: any) => setClaimRoundId(e.target.value)}
                placeholder="Round ID"
                class="flex-1 bg-gray-900/50 border border-gray-800 rounded-2xl py-3 px-4 focus:outline-none"
              />
              <button
                onClick={handleClaim}
                disabled={isTxPending || isConfirming}
                class="px-8 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-bold transition-all disabled:opacity-50"
              >
                Claim
              </button>
          </div>
        </div>
      </div>

      <div class="lg:col-span-5 space-y-6">
        <div class="bg-[#111] p-8 rounded-[2.5rem] border border-gray-800 shadow-xl">
          <h3 class="text-lg font-bold mb-6 flex items-center gap-2">
            <TrendingUp size={20} class="text-green-500" />
            Market Insights
          </h3>
          <div class="space-y-6">
            <StatRow label="Available Supply" value={availableShares?.toString() || '0'} sub="Shares remaining" />
            <StatRow label="Pool Health" value="100%" sub="Optimal" />
            <StatRow label="Network Fee" value="Low" sub="Arbitrum Standard" />
          </div>
        </div>
        <div class="bg-gray-900/30 border border-dashed border-gray-800 p-6 rounded-3xl flex items-start gap-4">
          <AlertCircle class="text-gray-500 mt-1 shrink-0" size={20} />
          <p class="text-xs text-gray-500 leading-relaxed">
            Shares are non-refundable through the protocol. Rewards are distributed periodically based on round snapshots.
          </p>
        </div>
      </div>
    </div>
  );
};

const StatRow = ({ label, value, sub }: { label: string; value: string; sub: string }) => (
  <div class="flex justify-between items-end">
    <div>
      <p class="text-xs text-gray-500 uppercase font-bold tracking-wider">{label}</p>
      <p class="text-xs text-gray-600 font-medium">{sub}</p>
    </div>
    <div class="text-xl font-bold">{value}</div>
  </div>
);

export default SharesView;
