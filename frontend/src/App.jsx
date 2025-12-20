import { useState } from "react";
import { ethers } from "ethers";
import { connectWallet } from "./utils/wallet";
import {
  getTokenContract,
  getFaucetContract,
} from "./utils/contracts";

function App() {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("0");
  const [canClaim, setCanClaim] = useState(false);
  const [allowance, setAllowance] = useState("0");
  const [loading, setLoading] = useState(false);

  async function loadData(address) {
    const token = await getTokenContract();
    const faucet = await getFaucetContract();

    const rawBalance = await token.balanceOf(address);
    const formattedBalance = ethers.formatUnits(rawBalance, 18);

    const eligible = await faucet.canClaim(address);
    const remaining = await faucet.remainingAllowance(address);

    setBalance(formattedBalance);
    setCanClaim(eligible);
    setAllowance(ethers.formatUnits(remaining, 18));
  }

  async function handleConnect() {
    const addr = await connectWallet();
    setAccount(addr);
    await loadData(addr);
  }

  async function handleClaim() {
    try {
      setLoading(true);
      const faucet = await getFaucetContract();
      const tx = await faucet.requestTokens();
      await tx.wait();
      await loadData(account);
      alert("Tokens claimed successfully!");
    } catch (err) {
      alert(err.reason || err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "30px" }}>
      <h2>ERC-20 Faucet DApp</h2>

      {!account ? (
        <button onClick={handleConnect}>Connect Wallet</button>
      ) : (
        <>
          <p><b>Wallet:</b> {account}</p>
          <p><b>Balance:</b> {balance}</p>
          <p><b>Can Claim:</b> {canClaim ? "Yes" : "No (Cooldown)"}</p>
          <p><b>Remaining Allowance:</b> {allowance}</p>

          <button
            onClick={handleClaim}
            disabled={!canClaim || loading}
          >
            {loading ? "Claiming..." : "Request Tokens"}
          </button>
        </>
      )}
    </div>
  );
}

export default App;
