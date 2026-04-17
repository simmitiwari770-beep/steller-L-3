# 🌌 StellarPay: Soroban-Powered Secure Ledger

A production-ready, high-performance decentralized application (dApp) that enables users to execute secure registry entries on the **Stellar Soroban Testnet**. Built with a focus on premium aesthetics, secure Stellar wallet integration, and real-time on-chain tracking.

---

## 🔗 Submission Deliverables

- **🚀 Live Demo**: https://steller-l-3.vercel.app/
- **🎥 Demo Video**: https://drive.google.com/file/d/1lt32Fz0w8vq2pTq-jKE6twZeLSsfosOD/view?usp=sharing
- **🧪 Test Coverage**: Soroban contracts verified + Frontend hooks pass integration.

---

## 📸 Visual Showcase (Screenshots)

### 1. Test Output

<img width="757" height="582" alt="Screenshot 2026-04-12 at 12 28 52 PM" src="https://github.com/user-attachments/assets/61f41f30-23d6-4a15-97d8-76ee1540e250" />

### 2. Modern Stellar Wallet Connection

<img width="1436" height="861" alt="Screenshot 2026-04-14 at 6 04 07 PM" src="https://github.com/user-attachments/assets/eea70f38-4893-4f3a-94e1-29a33cf9ce3d" />
<img width="1440" height="860" alt="Screenshot 2026-04-14 at 6 04 37 PM" src="https://github.com/user-attachments/assets/dcdbaf0d-7d96-402e-a8da-a4f876fb1559" />

### 3. Secure Transaction Workflow

<img width="1439" height="855" alt="Screenshot 2026-04-14 at 6 05 37 PM" src="https://github.com/user-attachments/assets/b730c77a-45b4-42aa-9112-04dc443e536a" />
<img width="1430" height="845" alt="Screenshot 2026-04-14 at 6 06 56 PM" src="https://github.com/user-attachments/assets/a650afdd-a64f-4796-85c8-3455f855c707" />
<img width="1440" height="900" alt="Screenshot 2026-04-14 at 6 06 13 PM" src="https://github.com/user-attachments/assets/5bd0d5b2-c36d-49f2-a6ad-7323fb968495" />

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
- **⏳ Robust Loading States & Progress Indicators**: Every asynchronous action (wallet connection, fetching history, submitting transactions) has clear visual feedback, minimizing bounce rate.
- **⚡ Advanced Caching**: Implements basic caching implementation using default Tanstack React Query integrations with explicit staleTime settings to prevent unnecessary network requests.


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
