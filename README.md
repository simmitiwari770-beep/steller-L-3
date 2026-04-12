# 🌌 StellarPay: Soroban-Powered Secure Ledger

A production-ready, high-performance decentralized application (dApp) that enables users to execute secure registry entries on the **Stellar Soroban Testnet**. Built with a focus on premium aesthetics, secure Stellar wallet integration, and real-time on-chain tracking.

---

## 🔗 Submission Deliverables

- **🚀 Live Demo**: https://steller-l-3.vercel.app/
- **🎥 Demo Video**: https://drive.google.com/file/d/1WfZWez-3qCUTAzUrECty5lOHUVUwDvKd/view?usp=sharing
- **🧪 Test Coverage**: Soroban contracts verified + Frontend hooks pass integration.

---

## 📸 Visual Showcase (Screenshots)

### 1. Test Output

<img width="757" height="582" alt="Screenshot 2026-04-12 at 12 28 52 PM" src="https://github.com/user-attachments/assets/61f41f30-23d6-4a15-97d8-76ee1540e250" />

### 2. Modern Stellar Wallet Connection

<img width="1440" height="900" alt="Screenshot 2026-04-12 at 12 32 01 PM" src="https://github.com/user-attachments/assets/9ca793f7-4fa4-40c4-9b8c-f2dcd9714588" />
<img width="1440" height="900" alt="Screenshot 2026-04-12 at 12 33 36 PM" src="https://github.com/user-attachments/assets/af3a52bc-8021-4a5d-8815-0b83169238b1" />

### 3. Secure Transaction Workflow

<img width="1440" height="900" alt="Screenshot 2026-04-12 at 12 34 15 PM" src="https://github.com/user-attachments/assets/96551b91-6b11-4a97-a6ad-eac498d0616b" />

<img width="1440" height="900" alt="Screenshot 2026-04-12 at 12 34 44 PM" src="https://github.com/user-attachments/assets/61016806-5c9f-4279-acda-36848827a5cb" />


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
