# 🌌 StellarPay: Soroban-Powered Secure Ledger

A production-ready, high-performance decentralized application (dApp) that enables users to execute secure registry entries on the **Stellar Soroban Testnet**. Built with a focus on premium aesthetics, secure Stellar wallet integration, and real-time on-chain tracking.

---

## 🔗 Submission Deliverables

- **🚀 Live Demo**: https://steller-l-3-6omq6unj2-simmi-tiwaris-projects.vercel.app/
- **🎥 Demo Video**: https://drive.google.com/file/d/1GYEZxoIZJEwIN90P4TLN81StKMJmb3T1/view?usp=sharing
- **🧪 Test Coverage**: Soroban contracts verified + Frontend hooks pass integration.

---

## 📸 Visual Showcase (Screenshots)

### 1. Soroban Integration
*Pure Rust smart contracts built for the future of Stellar.*

<img width="940" height="654" alt="Screenshot 2026-04-10 at 5 22 17 PM" src="https://github.com/user-attachments/assets/a3027af2-7a12-4e86-95c6-efde9334085c" />

### 2. Modern Stellar Wallet Connection 
*Universal support for Freighter, Albedo, and xBull with instant, non-blocking real-time balance fetching.*

<img width="1440" height="900" alt="Screenshot 2026-04-10 at 5 31 08 PM" src="https://github.com/user-attachments/assets/8aee0c18-0398-4411-a267-032a7f1529c0" />

### 3. Secure Transaction Workflow
*Authorizing transactions with live balance tracking and instant receipt generation via Soroban host functions.*

<img width="1440" height="900" alt="Screenshot 2026-04-10 at 5 31 49 PM" src="https://github.com/user-attachments/assets/bf8724ad-3619-4483-b746-a11ddbdfc26f" />

<img width="1440" height="900" alt="Screenshot 2026-04-10 at 5 32 20 PM" src="https://github.com/user-attachments/assets/d569b3c3-d322-4af4-848d-2189a6e8f26d" />

---

## 🏗 Project Architecture & File Structure

StellarPay follows a modular, scalable architecture separating Soroban logic from the presentation layer.

```text
steller-L-3/
├── contracts/               # Smart Contract logic (Soroban Registry/Rust)
│   ├── registry/            # Main contract crate
│   └── Cargo.toml           # Soroban Workspace
├── src/
│   ├── components/          # Reusable UI (Navbar, Modal, Ledger Form)
│   ├── hooks/               # Custom Logic (Stellar Wallet management, Soroban API)
│   ├── lib/                 # SDK Configurations (Stellar SDK & RPC clients)
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

The project maintains a rigorous verification path.

- **Soroban Contracts**: Unit tests in Rust for `set_data` and `get_data`.
- **Wallet Hooks**: Tests for connection states, address fetching, and Stellar provider switching.
- **Ledger Services**: Verification of host function calls and hash propagation.
- **Component Integrity**: Rendering tests for the glassmorphism UI and dynamic data states.

---

## 🚀 Key Features

- **🔐 Stellar Wallet Suite**: Native integration for **Freighter**, **Albedo**, and **xBull**.
- **💰 Real-Time Balance Tracking**: Live fetching of XLM balances with instant updates.
- **📜 Soroban Smart Contracts**: Protocol-layer data persistence with auth verification.
- **🎨 Premium UI**: Modern dark-themed glassmorphism design using React 19 and Tailwind CSS.

---

## 💻 Local Setup

1. **Clone & Install**:
   ```bash
   npm install
   ```

2. **Initialize Contracts**:
   ```bash
   cd contracts
   cargo build --target wasm32-unknown-unknown --release
   ```

3. **Run Frontend**:
   ```bash
   npm run dev
   ```

---
