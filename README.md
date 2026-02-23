# 🚰 Full-Stack ERC-20 Token Faucet DApp

## 📌 Project Overview

This project is a premium full-stack decentralized application (DApp) that implements an ERC-20 token faucet with strict on-chain rate limiting and lifetime claim restrictions. It features a modern, responsive UI with real-time state synchronization, built for high usability and security.

The faucet enforces:
- **24-hour Cooldown**: Prevents consecutive claims within a day.
- **Lifetime Cap**: Limits total tokens a single address can ever receive.
- **Admin Control**: Secure pause/unpause mechanism for maintenance.
- **Direct Minting**: Token supply is managed directly by the faucet contract.

---

## 🏗️ Architecture Overview

### Smart Contracts
- **FaucetToken.sol**: Capped ERC-20 token with controlled minting access.
- **TokenFaucet.sol**: The core logic provider, enforcing time and amount constraints using on-chain storage.

### Frontend
- **Framework**: React + Vite for a blazing fast experience.
- **Styling**: Modern glassmorphic dark theme with smooth transitions.
- **Blockchain**: `ethers.js` for robust Ethereum integration.
- **Evaluation**: Fully exposed `window.EVAL` interface for automated testing.

### DevOps
- **Hardhat**: For contract compilation, local testing, and deployment.
- **Docker**: Simple, reproducible containerization using `docker compose`.
- **Ports**: Frontend exposed on `http://localhost:3008`.

---

## 🔗 Deployed Contracts (Sepolia Testnet)

- **ERC-20 Token**: `0x718953730dE37632DF2a75436c98D4dA91Ba7133`
- **Faucet Contract**: `0x0d44D515e4Fc6ce665b7a239e47d4B7CC1435E25`

---

## 🚀 Quick Start (Local Docker Setup)

### 1. Configure Environment
Create a `.env` file in the root directory (copy from `.env.example`).
```env
VITE_RPC_URL=your_rpc_url
VITE_TOKEN_ADDRESS=0x718953730dE37632DF2a75436c98D4dA91Ba7133
VITE_FAUCET_ADDRESS=0x0d44D515e4Fc6ce665b7a239e47d4B7CC1435E25
```

### 2. Launch with Docker
```bash
docker compose up --build
```

### 3. Access the DApp
- **Application**: [http://localhost:3008](http://localhost:3008)
- **Health Check**: [http://localhost:3008/health](http://localhost:3008/health)

---

## 🧪 Testing Approach

Run the comprehensive Hardhat test suite:
```bash
npx hardhat test
```
The tests cover:
- Successful and failed claim scenarios.
- Cooldown period enforcement (using `evm_increaseTime`).
- Lifetime limit reach and reversion.
- Administrative pause/unpause and access control.
- Event emission verification.

---

## 🛡️ Security Best Practices

- **Access Control**: Used OpenZeppelin's `Ownable` for sensitive administrative functions.
- **Checks-Effects-Interactions**: Followed patterns to prevent reentrancy and ensure state consistency.
- **Reversion Handling**: Implemented specific, user-friendly revert messages for all failure modes.
- **Gas Efficiency**: Optimized storage layout and limited unnecessary writes.
