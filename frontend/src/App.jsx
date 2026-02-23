import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { connectWallet } from "./utils/wallet";
import {
  getTokenContract,
  getFaucetContract,
} from "./utils/contracts";
import "./index.css";

function App() {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("0");
  const [canClaim, setCanClaim] = useState(false);
  const [allowance, setAllowance] = useState("0");
  const [loading, setLoading] = useState(false);
  const [lastClaim, setLastClaim] = useState(0);
  const [countdown, setCountdown] = useState("");
  const [error, setError] = useState("");

  const loadData = useCallback(async (address) => {
    try {
      const token = await getTokenContract();
      const faucet = await getFaucetContract();

      const [rawBalance, eligible, remaining, lastClaimed] = await Promise.all([
        token.balanceOf(address),
        faucet.canClaim(address),
        faucet.remainingAllowance(address),
        faucet.lastClaimAt(address),
      ]);

      setBalance(ethers.formatUnits(rawBalance, 18));
      setCanClaim(eligible);
      setAllowance(ethers.formatUnits(remaining, 18));
      setLastClaim(Number(lastClaimed));
      setError("");
    } catch (err) {
      console.error("Data load error:", err);
      setError("Failed to fetch blockchain data");
    }
  }, []);

  useEffect(() => {
    if (account) {
      loadData(account);
      const interval = setInterval(() => loadData(account), 30000); // 30s refresh
      return () => clearInterval(interval);
    }
  }, [account, loadData]);

  useEffect(() => {
    if (lastClaim === 0) {
      setCountdown("");
      return;
    }

    const timer = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const diff = lastClaim + 86400 - now;

      if (diff <= 0) {
        setCountdown("Ready to claim!");
        clearInterval(timer);
      } else {
        const h = Math.floor(diff / 3600);
        const m = Math.floor((diff % 3600) / 60);
        const s = diff % 60;
        setCountdown(`${h}h ${m}m ${s}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [lastClaim]);

  async function handleConnect() {
    try {
      setLoading(true);
      const addr = await connectWallet();
      setAccount(addr);
      setError("");
    } catch (err) {
      setError(err.message || "Connection failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleClaim() {
    try {
      setLoading(true);
      setError("");
      const faucet = await getFaucetContract();
      const tx = await faucet.requestTokens();
      await tx.wait();
      await loadData(account);
    } catch (err) {
      setError(err.reason || err.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass-card">
      <div style={{ textAlign: 'center' }}>
        <div className={`status-badge ${account ? 'status-connected' : 'status-disconnected'}`}>
          {account ? 'Network Connected' : 'Wallet Not Connected'}
        </div>
      </div>

      <h1>Token Faucet</h1>
      <p className="subtitle">Securely request your test tokens every 24 hours.</p>

      {error && (
        <div style={{ color: 'var(--error)', textAlign: 'center', marginBottom: '16px', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      {!account ? (
        <button className="btn-primary" onClick={handleConnect} disabled={loading}>
          {loading ? "Connecting..." : "Connect Ethereum Wallet"}
        </button>
      ) : (
        <>
          <div className="stat-grid">
            <div className="stat-item">
              <div className="stat-label">Currency Balance</div>
              <div className="stat-value">{Number(balance).toFixed(2)} FTK</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Remaining Cap</div>
              <div className="stat-value">{Number(allowance).toFixed(2)} FTK</div>
            </div>
          </div>

          <div className="stat-item" style={{ marginBottom: '32px' }}>
            <div className="stat-label">Cooldown Status</div>
            <div className="stat-value countdown">
              {canClaim ? "Available Now" : countdown || "Calculating..."}
            </div>
          </div>

          <button
            className="btn-primary"
            onClick={handleClaim}
            disabled={!canClaim || loading}
          >
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <div className="loading-spinner"></div> Processing...
              </div>
            ) : (
              "Claim 100 FTK Tokens"
            )}
          </button>

          <div style={{ marginTop: '24px', fontSize: '0.7rem', color: 'var(--text-dim)', textAlign: 'center' }}>
            Connected: {account.slice(0, 6)}...{account.slice(-4)}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
