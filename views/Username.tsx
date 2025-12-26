
import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
// Import arbitrum chain for explicit inclusion in writeContract calls
import { arbitrum } from 'wagmi/chains';
import { ADDRESSES, ABIS } from '../constants';
import { UserPlus, CheckCircle2, XCircle, Search, Loader2 } from 'lucide-react';

const UsernameView: React.FC = () => {
  const { address } = useAccount();
  const [usernameInput, setUsernameInput] = useState('');
  
  const { data: currentUsername, refetch: refetchUsername } = useReadContract({
    address: ADDRESSES.USERNAME_REGISTRY,
    abi: ABIS.USERNAME_REGISTRY,
    functionName: 'getUsername',
    args: address ? [address] : undefined,
  });

  const { data: isAvailable, isLoading: isChecking } = useReadContract({
    address: ADDRESSES.USERNAME_REGISTRY,
    abi: ABIS.USERNAME_REGISTRY,
    functionName: 'isUsernameAvailable',
    args: [usernameInput],
    query: { enabled: usernameInput.length >= 3 }
  });

  const { writeContract, data: hash, isPending: isTxPending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isSuccess) {
      refetchUsername();
      setUsernameInput('');
    }
  }, [isSuccess, refetchUsername]);

  const handleRegister = () => {
    // Ensure both usernameInput and address are available before proceeding
    if (!usernameInput || !address) return;
    // Explicitly provide account and chain to resolve wagmi v2 type missing property errors
    writeContract({
      address: ADDRESSES.USERNAME_REGISTRY,
      abi: ABIS.USERNAME_REGISTRY,
      functionName: 'registerUsername',
      args: [usernameInput],
      account: address,
      chain: arbitrum,
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Your Identity</h2>
        <p className="text-gray-500">Register a unique username on Arbitrum One to identify yourself across the suite.</p>
      </div>

      {currentUsername ? (
        <div className="bg-green-500/5 border border-green-500/20 p-8 rounded-3xl text-center space-y-4">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="text-green-500" size={32} />
          </div>
          <div className="space-y-1">
            <p className="text-gray-400 text-sm">You are registered as</p>
            <h3 className="text-4xl font-bold text-green-400">@{currentUsername}</h3>
          </div>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Username Registry Verified</p>
        </div>
      ) : (
        <div className="bg-[#111] border border-gray-800 p-8 rounded-3xl shadow-xl space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-400 ml-1">Choose Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center text-gray-500">
                <Search size={18} />
              </div>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Enter username (min 3 chars)..."
                className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-700"
              />
              <div className="absolute inset-y-0 right-4 flex items-center">
                {isChecking ? (
                  <Loader2 className="animate-spin text-blue-500" size={20} />
                ) : usernameInput.length >= 3 ? (
                  isAvailable ? (
                    <div className="flex items-center gap-1 text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-md">
                      <CheckCircle2 size={14} /> Available
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded-md">
                      <XCircle size={14} /> Taken
                    </div>
                  )
                ) : null}
              </div>
            </div>
            <p className="text-[10px] text-gray-600 ml-1">Must be between 3 and 32 characters. Avoid special characters.</p>
          </div>

          <button
            onClick={handleRegister}
            disabled={!isAvailable || isTxPending || isConfirming || usernameInput.length < 3}
            className={`
              w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300
              ${isAvailable && !isTxPending && !isConfirming
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_10px_30px_rgba(37,99,235,0.3)] hover:-translate-y-1'
                : 'bg-gray-800 text-gray-600 cursor-not-allowed'}
            `}
          >
            {(isTxPending || isConfirming) ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                Processing...
              </>
            ) : (
              <>
                <UserPlus size={24} />
                Register Username
              </>
            )}
          </button>

          {writeError && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex gap-2">
              <XCircle className="shrink-0" size={16} />
              <span>{writeError.message.includes('UsernameAlreadyTaken') ? 'This username is already taken.' : 'Failed to register. Ensure you don\'t already have a username.'}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UsernameView;
