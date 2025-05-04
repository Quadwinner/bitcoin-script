/**
 * Bitcoin Script Lab - Main Entry Point
 * 
 * This script serves as the main entry point for the Bitcoin Script implementation lab.
 * It demonstrates both Legacy and Segwit Bitcoin Script types, their execution,
 * and simulated transactions.
 */

const bitcoin = require('bitcoinjs-lib');
const { ECPairFactory } = require('ecpair');
const tinysecp = require('tiny-secp256k1');

const ECPair = ECPairFactory(tinysecp);

// Welcome message
console.log('\n===========================================================');
console.log('                BITCOIN SCRIPT LAB                         ');
console.log('       Legacy and Segwit Bitcoin Script Implementation     ');
console.log('===========================================================\n');

// Menu for navigation
function displayMenu() {
    console.log('\nSelect an option:');
    console.log('1. Bitcoin Script Basics');
    console.log('2. Legacy Scripts (P2PKH and P2SH)');
    console.log('3. Segwit Scripts (P2WPKH and P2WSH)');
    console.log('4. Visual Script Execution Simulation');
    console.log('5. Transaction Examples and Size Comparison');
    console.log('6. Exit');
    
    process.stdout.write('\nEnter your choice (1-6): ');
}

// Handle user input
process.stdin.setEncoding('utf8');

process.stdin.on('data', (data) => {
    const choice = data.trim();
    
    switch (choice) {
        case '1':
            console.log('\n==== Bitcoin Script Basics ====\n');
            console.log('Bitcoin Script is a simple stack-based language used for transaction validation.');
            console.log('It consists of:');
            console.log('1. Opcodes - Simple functions that operate on data');
            console.log('2. Data - Such as public keys and signatures');
            console.log('\nScript Execution:');
            console.log('- Scripts are executed from left to right');
            console.log('- Data is pushed onto the stack');
            console.log('- Opcodes operate on the stack items');
            console.log('- A script is valid if it leaves a non-zero value on top of the stack');
            console.log('\nCommon Bitcoin Script Patterns:');
            console.log('- P2PKH: Pay to Public Key Hash (most common legacy format)');
            console.log('- P2SH: Pay to Script Hash (enables complex scripts like multisig)');
            console.log('- P2WPKH: Pay to Witness Public Key Hash (Segwit version of P2PKH)');
            console.log('- P2WSH: Pay to Witness Script Hash (Segwit version of P2SH)');
            console.log('- P2TR: Pay to Taproot (newest format with enhanced privacy)');
            break;
            
        case '2':
            console.log('\n==== Legacy Scripts ====\n');
            
            // P2PKH Example
            console.log('=== P2PKH (Pay to Public Key Hash) ===\n');
            console.log('Locking Script (ScriptPubKey):');
            console.log('OP_DUP OP_HASH160 <publicKeyHash> OP_EQUALVERIFY OP_CHECKSIG');
            console.log('\nUnlocking Script (ScriptSig):');
            console.log('<signature> <publicKey>');
            console.log('\nExecution Flow:');
            console.log('1. Push <signature> onto the stack');
            console.log('2. Push <publicKey> onto the stack');
            console.log('3. Duplicate the public key (OP_DUP)');
            console.log('4. Hash the public key (OP_HASH160)');
            console.log('5. Push <publicKeyHash> onto the stack');
            console.log('6. Verify the hashes are equal (OP_EQUALVERIFY)');
            console.log('7. Verify the signature against the public key (OP_CHECKSIG)');
            
            // P2SH Example
            console.log('\n=== P2SH (Pay to Script Hash) ===\n');
            console.log('Locking Script (ScriptPubKey):');
            console.log('OP_HASH160 <redeemScriptHash> OP_EQUAL');
            console.log('\nUnlocking Script (ScriptSig):');
            console.log('<sig1> <sig2> ... <redeemScript>');
            console.log('\nExecution Flow:');
            console.log('1. Push all signatures onto the stack');
            console.log('2. Push the redeem script onto the stack');
            console.log('3. Hash the redeem script (OP_HASH160)');
            console.log('4. Push <redeemScriptHash> onto the stack');
            console.log('5. Compare the hashes for equality (OP_EQUAL)');
            console.log('6. If equal, execute the redeem script with the signatures');
            break;
            
        case '3':
            console.log('\n==== Segwit Scripts ====\n');
            
            // P2WPKH Example
            console.log('=== P2WPKH (Pay to Witness Public Key Hash) ===\n');
            console.log('Locking Script (ScriptPubKey):');
            console.log('OP_0 <publicKeyHash>');
            console.log('\nWitness Data:');
            console.log('<signature> <publicKey>');
            console.log('\nKey Differences from P2PKH:');
            console.log('1. Signature data is in the separate witness field, not in scriptSig');
            console.log('2. The signature covers the previous output value (fixing transaction malleability)');
            console.log('3. Smaller transaction size and lower fees');
            
            // P2WSH Example
            console.log('\n=== P2WSH (Pay to Witness Script Hash) ===\n');
            console.log('Locking Script (ScriptPubKey):');
            console.log('OP_0 <witnessScriptHash>');
            console.log('\nWitness Data:');
            console.log('<sig1> <sig2> ... <witnessScript>');
            console.log('\nKey Differences from P2SH:');
            console.log('1. Uses SHA256 for hashing (not HASH160)');
            console.log('2. Signature data is in the witness field');
            console.log('3. The signature covers the previous output value');
            console.log('4. More secure due to 256-bit hash versus 160-bit hash');
            break;
            
        case '4':
            console.log('\nRunning the visual script execution simulation...\n');
            // Execute the visualization script
            require('./visualization.js');
            break;
            
        case '5':
            console.log('\nShowing transaction examples and size comparison...\n');
            // Execute the transaction examples script
            require('./transaction-examples.js');
            break;
            
        case '6':
            console.log('\nExiting Bitcoin Script Lab. Goodbye!\n');
            process.exit(0);
            break;
            
        default:
            console.log('\nInvalid choice. Please enter a number between 1 and 6.');
            break;
    }
    
    // Display the menu again
    displayMenu();
});

// Initial menu display
displayMenu(); 