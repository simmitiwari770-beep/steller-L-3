#!/bin/bash

# Configuration
NETWORK="testnet"
SOURCE="default"
WASM_PATH="contracts/target/wasm32-unknown-unknown/release/registry.wasm"

echo "🚀 Building contract..."
cd contracts && cargo build --target wasm32-unknown-unknown --release
cd ..

if [ ! -f "$WASM_PATH" ]; then
    echo "❌ Error: WASM file not found at $WASM_PATH"
    exit 1
fi

echo "📦 Deploying to $NETWORK..."
CONTRACT_ID=$(stellar contract deploy --wasm "$WASM_PATH" --source "$SOURCE" --network "$NETWORK")

if [ $? -eq 0 ]; then
    echo "✅ Successfully deployed!"
    echo "📝 Contract ID: $CONTRACT_ID"
    echo "⚠️  Now update REGISTRY_CONTRACT_ID in src/lib/stellar.js with this ID."
else
    echo "❌ Deployment failed."
    exit 1
fi
