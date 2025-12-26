
export const ADDRESSES = {
  USDC: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831' as const,
  USERNAME_REGISTRY: '0xaC5B11a8180e5413aB3C31723e1e1884b7885604' as const,
  SHARES_REGISTRY: '0x88Da878CEd9CC396bD4EE02E2561d41Add27c49' as const, // Verifique se este endereço está completo (39 chars detectados)
  RAFFLE_ROUND_ACTIVE: '0xf25B48dd349013fe7E511307E8051d752a1c6250' as const,
};

export const ABIS = {
  USDC: [
    { name: "approve", type: "function", stateMutability: "nonpayable", inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }], outputs: [{ type: "bool" }] },
    { name: "balanceOf", type: "function", stateMutability: "view", inputs: [{ name: "account", type: "address" }], outputs: [{ type: "uint256" }] },
    { name: "allowance", type: "function", stateMutability: "view", inputs: [{ name: "owner", type: "address" }, { name: "spender", type: "address" }], outputs: [{ type: "uint256" }] }
  ] as const,
  USERNAME_REGISTRY: [
    { inputs: [], name: "InvalidUsername", type: "error" },
    { inputs: [], name: "UsernameAlreadyTaken", type: "error" },
    { inputs: [], name: "UsernameTooLong", type: "error" },
    { inputs: [], name: "UsernameTooShort", type: "error" },
    { inputs: [], name: "WalletAlreadyHasUsername", type: "error" },
    { inputs: [{ name: "wallet", type: "address" }], name: "getUsername", outputs: [{ type: "string" }], stateMutability: "view", type: "function" },
    { inputs: [{ name: "username", type: "string" }], name: "isUsernameAvailable", outputs: [{ type: "bool" }], stateMutability: "view", type: "function" },
    { inputs: [{ name: "username", type: "string" }], name: "registerUsername", outputs: [], stateMutability: "nonpayable", type: "function" }
  ] as const,
  SHARES_REGISTRY: [
    { inputs: [{ name: "amount", type: "uint256" }], name: "buyShares", outputs: [], stateMutability: "nonpayable", type: "function" },
    { inputs: [{ name: "roundId", type: "uint256" }], name: "claimRewards", outputs: [], stateMutability: "nonpayable", type: "function" },
    { inputs: [], name: "getSharesAvailable", outputs: [{ type: "uint256" }], stateMutability: "view", type: "function" }
  ] as const,
  RAFFLE_ROUND: [
    { inputs: [], name: "isActive", outputs: [{ type: "bool" }], stateMutability: "view", type: "function" },
    { inputs: [], name: "endTime", outputs: [{ type: "uint256" }], stateMutability: "view", type: "function" },
    { inputs: [], name: "getTotalPool", outputs: [{ type: "uint256" }], stateMutability: "view", type: "function" },
    { inputs: [], name: "getTotalTickets", outputs: [{ type: "uint256" }], stateMutability: "view", type: "function" },
    { inputs: [], name: "ticketPrice", outputs: [{ type: "uint256" }], stateMutability: "view", type: "function" },
    { inputs: [{ name: "amount", type: "uint256" }], name: "buyTickets", outputs: [], stateMutability: "nonpayable", type: "function" }
  ] as const,
};
