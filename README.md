# 🚰 Full-Stack ERC-20 Token Faucet DApp

## 📌 Project Overview

This project is a full-stack decentralized application (DApp) that implements an ERC-20 token faucet with on-chain rate limiting and lifetime claim restrictions.  
It demonstrates end-to-end Web3 development including smart contracts, frontend wallet integration, Dockerized deployment, and blockchain interaction.

The faucet enforces:
- 24-hour cooldown between claims
- Lifetime maximum claim limit per wallet
- Admin-controlled pause/unpause
- Fully on-chain rule enforcement

---

## 🏗️ Architecture Overview

### Smart Contracts
- FaucetToken.sol: ERC-20 token with capped supply
- TokenFaucet.sol: Faucet controlling minting and rate limits

### Frontend
- React (Vite)
- ethers.js for blockchain interaction
- MetaMask wallet integration
- Real-time balance and eligibility updates

### DevOps
- Hardhat for development and deployment
- Docker & Docker Compose
- Sepolia testnet deployment
- Etherscan verification

---

## 🔗 Deployed Contracts (Sepolia Testnet)

### ERC-20 Token
- Address: 0x718953730dE37632DF2a75436c98D4dA91Ba7133
- Etherscan: https://sepolia.etherscan.io/address/0x718953730dE37632DF2a75436c98D4dA91Ba7133#code

### Faucet Contract
- Address: 0x0d44D515e4Fc6ce665b7a239e47d4B7CC1435E25
- Etherscan: https://sepolia.etherscan.io/address/0x0d44D515e4Fc6ce665b7a239e47d4B7CC1435E25#code

---

## ⚙️ Features

### Smart Contract
- Fully ERC-20 compliant
- Fixed max supply
- Faucet-only minting
- 24-hour cooldown
- Lifetime claim limit
- Admin pause/unpause
- Clear revert messages
- Event emissions for all actions

### Frontend
- Wallet connect/disconnect
- Shows connected address
- Displays token balance
- Shows cooldown timer
- Shows remaining allowance
- Disabled claim button when ineligible
- Transaction loading states
- User-friendly error handling

---

## 🧪 Testing

- Unit tests written with Hardhat
- Covered:
  - Successful claims
  - Cooldown enforcement
  - Lifetime limit enforcement
  - Pause/unpause behavior
  - Admin-only access
  - Multiple user interactions
- All tests passing

---

## 🔐 Security Considerations

- Minting restricted to faucet contract
- All limits enforced on-chain
- Solidity 0.8.x overflow protection
- Admin access control
- Minimal storage writes for gas efficiency

---

## 🧮 Design Decisions

- Fixed faucet amount per claim
- 24-hour cooldown to prevent abuse
- Lifetime cap to ensure fair distribution
- Capped token supply
- Dockerized frontend for consistency

---

## 🚀 Local Setup (Docker)

### 1. Clone Repository
```bash
git clone <your-github-repo-url>
cd Full-Stack_ERC-20_Token
```

### 2. Environment Variables
cp .env.example .env


Edit .env:

VITE_RPC_URL=https://sepolia.infura.io/v3/0b10105294e64712bc9b670344da50cc
VITE_TOKEN_ADDRESS=0x718953730dE37632DF2a75436c98D4dA91Ba7133
VITE_FAUCET_ADDRESS=0x0d44D515e4Fc6ce665b7a239e47d4B7CC1435E25

### 3. Run Application
docker compose up --build

### 4. Access

App: http://localhost:3000

Health: http://localhost:3000/health
