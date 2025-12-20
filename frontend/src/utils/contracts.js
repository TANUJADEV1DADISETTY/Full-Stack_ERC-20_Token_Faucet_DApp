import { ethers } from "ethers";

const TOKEN_ABI = [
  "function balanceOf(address) view returns (uint256)"
];

const FAUCET_ABI = [
  "function requestTokens()",
  "function canClaim(address) view returns (bool)",
  "function remainingAllowance(address) view returns (uint256)"
];

export function getProvider() {
  return new ethers.BrowserProvider(window.ethereum);
}

export async function getSigner() {
  const provider = getProvider();
  return provider.getSigner();
}

export async function getTokenContract() {
  const provider = getProvider();
  return new ethers.Contract(
    import.meta.env.VITE_TOKEN_ADDRESS,
    TOKEN_ABI,
    provider
  );
}

export async function getFaucetContract() {
  const signer = await getSigner();
  return new ethers.Contract(
    import.meta.env.VITE_FAUCET_ADDRESS,
    FAUCET_ABI,
    signer
  );
}
