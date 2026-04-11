# Soroban Smart Contracts

This directory contains the Soroban smart contracts for StellarPay.

## Structure

- `Cargo.toml`: Workspace configuration.
- `registry/`: The main Registry contract.
    - `src/lib.rs`: Contract logic.
    - `src/test.rs`: Unit tests.
    - `Cargo.toml`: Package configuration.

## Setup

1. Install [Rust](https://rustup.rs/).
2. Install [Soroban CLI](https://soroban.stellar.org/docs/install-cli).
3. Add the WASM target:
   ```bash
   rustup target add wasm32-unknown-unknown
   ```

## Building

To build the contracts, run:
```bash
cargo build --target wasm32-unknown-unknown --release
```

## Testing

To run the contract tests:
```bash
cargo test
```

## Deployment

To deploy to Testnet:
```bash
soroban contract deploy --wasm target/wasm32-unknown-unknown/release/registry.wasm --source <your-secret-key> --network testnet
```
