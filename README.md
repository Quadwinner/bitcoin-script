# Bitcoin Script Implementation Lab

## Overview

This project provides a comprehensive, hands-on implementation of Bitcoin scripting, exploring the intricacies of Bitcoin's transaction and script validation mechanisms. It serves as an educational resource for developers and blockchain enthusiasts interested in understanding Bitcoin's low-level scripting system.

## 🚀 Features

### Script Types Implemented
- **Legacy Scripts**
  - P2PKH (Pay to Public Key Hash)
  - P2SH (Pay to Script Hash)
- **Segwit Scripts**
  - P2WPKH (Pay to Witness Public Key Hash)
  - P2WSH (Pay to Witness Script Hash)

### Key Components
- Transaction creation and signing
- Script validation mechanisms
- Cryptographic primitives
- Visualization of script execution

## 🛠 Technologies

- **Language**: JavaScript
- **Libraries**: 
  - `bitcoinjs-lib`
  - `noble-secp256k1`
  - Custom cryptographic utilities

## 📦 Installation

```bash
git clone https://github.com/Quadwinner/bitcoin-script.git
cd bitcoin-script
npm install
```

## 🧪 Usage

Explore different script types and transaction scenarios by running the example scripts:

```bash
node bitcoin-script-lab.js
node transaction-examples.js
```

## 📚 Learning Resources

- Bitcoin Script Reference
- Transaction Validation Techniques
- Cryptographic Signature Schemes

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/Quadwinner/bitcoin-script/issues).

## 📝 License

Open-source project for educational purposes.

**Disclaimer**: This is a learning project and should not be used for production cryptocurrency transactions.

2. **Segwit Scripts**
   - P2WPKH (Pay to Witness Public Key Hash)
   - P2WSH (Pay to Witness Script Hash)

## Features

- **Interactive Learning Interface**: Menu-driven application for exploring different aspects of Bitcoin scripting
- **Visual Script Execution**: Step-by-step visualization of how scripts are executed on the stack
- **Transaction Examples**: Real-world transaction examples for each script type
- **Size Comparison**: Comparison of transaction sizes between legacy and segwit formats
- **Manual Script Simulation**: Low-level manual execution of Bitcoin scripts to understand the stack operations

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation

1. Clone this repository or download the files
2. Navigate to the project directory
3. Install the required dependencies:

```bash
npm install
```

## Usage

To start the interactive Bitcoin Script Lab:

```bash
node bitcoin-script-lab.js
```

This will display a menu with various options:

1. Bitcoin Script Basics
2. Legacy Scripts (P2PKH and P2SH)
3. Segwit Scripts (P2WPKH and P2WSH)
4. Visual Script Execution Simulation
5. Transaction Examples and Size Comparison
6. Exit

## Project Files

- **bitcoin-script-lab.js**: Main entry point with an interactive menu
- **index.js**: Implementation of Bitcoin script using bitcoinjs-lib
- **bitcoin-script-manual.js**: Manual implementation of script execution
- **visualization.js**: ASCII art visualization of stack operations
- **transaction-examples.js**: Examples of creating transactions with different script types

## Key Concepts Explained

### Bitcoin Script

Bitcoin Script is a stack-based, forth-like programming language used in Bitcoin to determine if a transaction is valid. It consists of opcodes (operations) that manipulate data on a stack.

### Legacy vs Segwit

Segwit (Segregated Witness) is an upgrade to the Bitcoin protocol that separates signature data from transaction data. Benefits include:

1. **Transaction Malleability Fix**: Transaction IDs cannot be modified by third parties
2. **Smaller Transaction Size**: Signatures are moved to a separate "witness" section
3. **Lower Fees**: Due to smaller transaction size
4. **Increased Block Capacity**: Without changing the block size limit

### Script Types

#### Legacy P2PKH
- Standard transaction type in early Bitcoin
- **Locking Script**: `OP_DUP OP_HASH160 <publicKeyHash> OP_EQUALVERIFY OP_CHECKSIG`
- **Unlocking Script**: `<signature> <publicKey>`

#### Legacy P2SH
- Allows for more complex scripts like multisig
- **Locking Script**: `OP_HASH160 <redeemScriptHash> OP_EQUAL`
- **Unlocking Script**: `<signatures...> <redeemScript>`

#### Segwit P2WPKH
- Segwit version of P2PKH with improved efficiency
- **Locking Script**: `OP_0 <publicKeyHash>`
- **Witness Data**: `<signature> <publicKey>`

#### Segwit P2WSH
- Segwit version of P2SH for complex scripts
- **Locking Script**: `OP_0 <witnessScriptHash>`
- **Witness Data**: `<signatures...> <witnessScript>`

## Example Output

The project includes comprehensive examples and visualizations of each script type in action, showing:

1. How scripts are executed step-by-step
2. How the stack changes during execution
3. How transactions are constructed and validated
4. Size comparisons between different transaction types

## Learning Outcomes

After working with this implementation, you will understand:

1. How Bitcoin's script system works
2. The differences between legacy and segwit transactions
3. How different script types are structured and executed
4. The benefits of segwit in terms of transaction size and fees
5. How multisignature scripts are implemented #
