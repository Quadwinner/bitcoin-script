const bitcoin = require('bitcoinjs-lib');
const { ECPairFactory } = require('ecpair');
const tinysecp = require('tiny-secp256k1');

const ECPair = ECPairFactory(tinysecp);
const network = bitcoin.networks.testnet;

// Generate a random key pair
const keyPair = ECPair.makeRandom({ network });
const publicKey = keyPair.publicKey;
const publicKeyHash = bitcoin.crypto.hash160(publicKey);

console.log('----- Bitcoin Script Implementation -----');
console.log('\nKey Information:');
console.log('Private Key (WIF):', keyPair.toWIF());
console.log('Public Key (hex):', publicKey.toString('hex'));
console.log('Public Key Hash (hex):', publicKeyHash.toString('hex'));

// ---------------------------------------------------
// 1. Legacy P2PKH (Pay to Public Key Hash)
// ---------------------------------------------------
function demonstrateP2PKH() {
    console.log('\n----- Legacy P2PKH -----');
    
    // Create P2PKH address
    const p2pkhAddress = bitcoin.payments.p2pkh({ 
        pubkey: publicKey, 
        network 
    }).address;
    
    console.log('P2PKH Address:', p2pkhAddress);
    
    // Locking Script (ScriptPubKey)
    console.log('\nLocking Script (ScriptPubKey):');
    console.log('OP_DUP OP_HASH160 <publicKeyHash> OP_EQUALVERIFY OP_CHECKSIG');
    
    // Unlocking Script (ScriptSig)
    console.log('\nUnlocking Script (ScriptSig):');
    console.log('<signature> <publicKey>');
    
    // How it works when combined
    console.log('\nCombined Script Execution:');
    console.log('1. <signature> <publicKey> OP_DUP OP_HASH160 <publicKeyHash> OP_EQUALVERIFY OP_CHECKSIG');
    console.log('2. Stack: [<signature>, <publicKey>]');
    console.log('3. OP_DUP duplicates the top item (publicKey)');
    console.log('   Stack: [<signature>, <publicKey>, <publicKey>]');
    console.log('4. OP_HASH160 hashes the top item');
    console.log('   Stack: [<signature>, <publicKey>, <hash of publicKey>]');
    console.log('5. <publicKeyHash> is pushed to the stack');
    console.log('   Stack: [<signature>, <publicKey>, <hash of publicKey>, <publicKeyHash>]');
    console.log('6. OP_EQUALVERIFY compares the top two items and removes them if equal');
    console.log('   Stack: [<signature>, <publicKey>]');
    console.log('7. OP_CHECKSIG verifies that the signature is valid for this publicKey');
    console.log('   Stack: [1] (success) or [0] (failure)');
}

// ---------------------------------------------------
// 2. P2SH (Pay to Script Hash)
// ---------------------------------------------------
function demonstrateP2SH() {
    console.log('\n----- Legacy P2SH -----');
    
    // Create a simple redeem script (2-of-2 multisig)
    const keyPair2 = ECPair.makeRandom({ network });
    
    const redeemScript = bitcoin.payments.p2ms({
        m: 2,
        pubkeys: [publicKey, keyPair2.publicKey],
        network
    }).output;
    
    // Create P2SH address
    const p2shAddress = bitcoin.payments.p2sh({
        redeem: { output: redeemScript, network },
        network
    }).address;
    
    console.log('P2SH Address:', p2shAddress);
    console.log('Redeem Script (hex):', redeemScript.toString('hex'));
    
    // Locking Script (ScriptPubKey)
    console.log('\nLocking Script (ScriptPubKey):');
    console.log('OP_HASH160 <redeemScriptHash> OP_EQUAL');
    
    // Unlocking Script (ScriptSig)
    console.log('\nUnlocking Script (ScriptSig):');
    console.log('<signature1> <signature2> <redeemScript>');
    
    // How it works when combined
    console.log('\nCombined Script Execution:');
    console.log('1. <signature1> <signature2> <redeemScript> OP_HASH160 <redeemScriptHash> OP_EQUAL');
    console.log('2. OP_HASH160 hashes the redeemScript');
    console.log('3. Stack: [<signature1>, <signature2>, <hash of redeemScript>, <redeemScriptHash>]');
    console.log('4. OP_EQUAL compares the top two items');
    console.log('5. If equal, the redeemScript is then executed with the remaining stack items');
    console.log('6. For multisig, it would check if the provided signatures are valid');
}

// ---------------------------------------------------
// 3. Segwit P2WPKH (Pay to Witness Public Key Hash)
// ---------------------------------------------------
function demonstrateP2WPKH() {
    console.log('\n----- Segwit P2WPKH -----');
    
    // Create P2WPKH address
    const p2wpkhAddress = bitcoin.payments.p2wpkh({ 
        pubkey: publicKey, 
        network 
    }).address;
    
    console.log('P2WPKH Address:', p2wpkhAddress);
    
    // Locking Script (ScriptPubKey)
    console.log('\nLocking Script (ScriptPubKey):');
    console.log('OP_0 <publicKeyHash>');
    
    // Unlocking (Witness)
    console.log('\nWitness Data:');
    console.log('Witness: [<signature>, <publicKey>]');
    
    // How it works
    console.log('\nExecution:');
    console.log('1. The witness data is not part of the scriptSig but in a separate witness field');
    console.log('2. Node constructs and executes: <signature> <publicKey> OP_DUP OP_HASH160 <publicKeyHash> OP_EQUALVERIFY OP_CHECKSIG');
    console.log('3. The execution is the same as P2PKH, but the signature verification includes the previous output value');
    console.log('4. This provides a fix for the transaction malleability issue and reduces transaction size');
}

// ---------------------------------------------------
// 4. Segwit P2WSH (Pay to Witness Script Hash)
// ---------------------------------------------------
function demonstrateP2WSH() {
    console.log('\n----- Segwit P2WSH -----');
    
    // Create a witness script (2-of-2 multisig)
    const keyPair2 = ECPair.makeRandom({ network });
    
    const witnessScript = bitcoin.payments.p2ms({
        m: 2,
        pubkeys: [publicKey, keyPair2.publicKey],
        network
    }).output;
    
    // Create P2WSH address
    const p2wshAddress = bitcoin.payments.p2wsh({
        redeem: { output: witnessScript, network },
        network
    }).address;
    
    console.log('P2WSH Address:', p2wshAddress);
    console.log('Witness Script (hex):', witnessScript.toString('hex'));
    
    // Locking Script (ScriptPubKey)
    console.log('\nLocking Script (ScriptPubKey):');
    console.log('OP_0 <witnessScriptHash>');
    
    // Unlocking (Witness)
    console.log('\nWitness Data:');
    console.log('Witness: [<signature1>, <signature2>, <witnessScript>]');
    
    // How it works
    console.log('\nExecution:');
    console.log('1. The witness data contains all the data needed to validate the script');
    console.log('2. The node verifies that the hash of the witness script matches the witnessScriptHash in the output');
    console.log('3. The node then executes the witness script with the provided witness data');
    console.log('4. For multisig, it checks that the required number of valid signatures are provided');
}

// Run all demonstrations
demonstrateP2PKH();
demonstrateP2SH();
demonstrateP2WPKH();
demonstrateP2WSH(); 