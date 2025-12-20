import { ethers } from "ethers";
import tokenAbi from "./Token.json";
import faucetAbi from "./TokenFaucet.json";

const tokenAddress = import.meta.env.VITE_TOKEN_ADDRESS;
const faucetAddress = import.meta.env.VITE_FAUCET_ADDRESS;

let provider;
let signer;

async function getProvider() {
  if (!provider) {
    provider = new ethers.BrowserProvider(window.ethereum);
  }
  return provider;
}

async function getSigner() {
  if (!signer) {
    const p = await getProvider();
    signer = await p.getSigner();
  }
  return signer;
}

async function getToken() {
  const s = await getSigner();
  return new ethers.Contract(tokenAddress, tokenAbi, s);
}

async function getFaucet() {
  const s = await getSigner();
  return new ethers.Contract(faucetAddress, faucetAbi, s);
}

window._EVAL_ = {
  connectWallet: async () => {
    if (!window.ethereum) throw new Error("MetaMask not found");
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    return accounts[0];
  },

  requestTokens: async () => {
    const faucet = await getFaucet();
    const tx = await faucet.requestTokens();
    await tx.wait();
    return tx.hash;
  },

  getBalance: async (address) => {
    const token = await getToken();
    const balance = await token.balanceOf(address);
    return balance.toString();
  },

  canClaim: async (address) => {
    const faucet = await getFaucet();
    return await faucet.canClaim(address);
  },

  getRemainingAllowance: async (address) => {
    const faucet = await getFaucet();
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
