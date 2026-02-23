import { ethers } from "ethers";

const tokenAddress = import.meta.env.VITE_TOKEN_ADDRESS;
const faucetAddress = import.meta.env.VITE_FAUCET_ADDRESS;

const TOKEN_ABI = ["function balanceOf(address) view returns (uint256)"];
const FAUCET_ABI = [
  "function requestTokens() external",
  "function canClaim(address) view returns (bool)",
  "function remainingAllowance(address) view returns (uint256)",
  "function isPaused() view returns (bool)"
];

async function getProvider() {
  if (!window.ethereum) throw new Error("MetaMask not found");
  return new ethers.BrowserProvider(window.ethereum);
}

async function getSigner() {
  const provider = await getProvider();
  return await provider.getSigner();
}

window.EVAL = {
  connectWallet: async () => {
    if (!window.ethereum) throw new Error("MetaMask not found");
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    return accounts[0];
  },

  requestTokens: async () => {
    const signer = await getSigner();
    const faucet = new ethers.Contract(faucetAddress, FAUCET_ABI, signer);
    const tx = await faucet.requestTokens();
    const receipt = await tx.wait();
    return tx.hash;
  },

  getBalance: async (address) => {
    const provider = await getProvider();
    const token = new ethers.Contract(tokenAddress, TOKEN_ABI, provider);
    const balance = await token.balanceOf(address);
    return balance.toString();
  },

  canClaim: async (address) => {
    const provider = await getProvider();
    const faucet = new ethers.Contract(faucetAddress, FAUCET_ABI, provider);
    return await faucet.canClaim(address);
  },

  getRemainingAllowance: async (address) => {
    const provider = await getProvider();
    const faucet = new ethers.Contract(faucetAddress, FAUCET_ABI, provider);
    const rem = await faucet.remainingAllowance(address);
    return rem.toString();
  },

  getContractAddresses: async () => {
    return {
      token: tokenAddress,
      faucet: faucetAddress,
    };
  },
};
