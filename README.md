# 🌌 StellarPay: Multi-Chain Secure Ledger

A production-ready, high-performance decentralized application (dApp) that enables users to execute secure entries on the **Stellar Soroban Testnet** and **Ethereum Sepolia**. Built with a focus on premium aesthetics, secure multi-wallet integration, and real-time financial tracking.

---

## 🔗 Submission Deliverables

- **🚀 Live Demo**:  https://steller-l-3-6omq6unj2-simmi-tiwaris-projects.vercel.app/
- **🎥 Demo Video**: https://drive.google.com/file/d/1GYEZxoIZJEwIN90P4TLN81StKMJmb3T1/view?usp=sharing
- **🧪 Test Coverage**: 10 Tests Passing (See Screenshots below)

---

## 📸 Visual Showcase (Screenshots)

### 1. Test Output Proof
<img width="940" height="654" alt="Screenshot 2026-04-10 at 5 22 17 PM" src="https://github.com/user-attachments/assets/a3027af2-7a12-4e86-95c6-efde9334085c" />

### 2. Multi-Wallet Connection 

<img width="1440" height="900" alt="Screenshot 2026-04-10 at 5 31 08 PM" src="https://github.com/user-attachments/assets/8aee0c18-0398-4411-a267-032a7f1529c0" />

### 3. Secure Transaction Workflow

*Authorizing a transfer with live balance ledger and instant receipt generation.*

<img width="1440" height="900" alt="Screenshot 2026-04-10 at 5 31 49 PM" src="https://github.com/user-attachments/assets/bf8724ad-3619-4483-b746-a11ddbdfc26f" />

<img width="1440" height="900" alt="Screenshot 2026-04-10 at 5 32 20 PM" src="https://github.com/user-attachments/assets/d569b3c3-d322-4af4-848d-2189a6e8f26d" />



---

## 🏗 Project Architecture & File Structure

StellarPay follows a modular, scalable architecture separating cross-chain logic from the presentation layer.

```text
steller-L-3/
├── contracts/               # Smart Contract logic (Soroban Registry)
├── src/
│   ├── components/          # Reusable UI (Navbar, Modal, Ledger Form)
│   ├── hooks/               # Custom Logic (Wallet management, Registry API)
│   ├── lib/                 # SDK Configurations (Stellar & Ethereum clients)
│   ├── assets/              # Premium visual assets & animations
│   ├── App.jsx              # Main dashboard entry point
│   └── main.jsx             # React Query & Provider bridge
├── tests/
│   ├── unit/                # Vitest logic & component test suites
│   └── setup.js             # JSDOM & Testing Library configuration
├── README.md                # Project documentation
├── tailwind.config.js       # Custom Design System tokens
└── package.json             # Build & Test automation scripts
```

---

## 🧪 Testing Coverage

The project maintains a **100% success rate** across critical verification paths.

- **Wallet Hooks**: Tests for connection states, address fetching, and multi-provider switching.
- **Ledger Services**: Verification of async transaction submission and hash propagation.
- **Component Integrity**: Rendering tests for the glassmorphism UI and dynamic data states.
- **Integration**: End-to-end simulation of the balance tracking and post-transaction ledger update.

---

## 🚀 Key Features

- **🔐 Universal Wallet Support**: Native integration for **Freighter**, **Albedo**, **xBull** (Stellar), and **MetaMask** (Ethereum).
- **💰 Real-Time Balance Tracking**: Live fetching of XLM and ETH balances with instant updates after transactions.
- **📊 Financial Visibility**: Built-in balance ledger showing "Initial Balance" and "Estimated Money Left".
- **🎨 Premium UI**: Modern purple-themed glassmorphism design using React 18 and Tailwind CSS v4.

---

## 💻 Local Setup

1. **Clone & Install**:
   ```bash
   npm install
   ```

2. **Run Dev & Tests**:
   ```bash
   npm run dev
   ```

---

