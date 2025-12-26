
export function calculatePrizeSplit(totalPool: bigint) {
  return {
    winners: {
      first: (totalPool * 500n) / 1000n,  // 50%
      second: (totalPool * 180n) / 1000n, // 18%
      third: (totalPool * 70n) / 1000n,   // 7%
    },
    platform: {
      dev: (totalPool * 125n) / 1000n,       // 12.5%
      investors: (totalPool * 125n) / 1000n, // 12.5%
    },
  };
}
