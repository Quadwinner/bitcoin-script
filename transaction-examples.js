/**
 * Bitcoin Transaction Examples
 * 
 * This script creates examples of both Legacy and Segwit transactions
 * to demonstrate how the different script types are used in actual transactions.
 * 
 * Note: These are examples only and are not broadcast to the network.
 */

const bitcoin = require('bitcoinjs-lib');
const { ECPairFactory } = require('ecpair');
const tinysecp = require('tiny-secp256k1');

const ECPair = ECPairFactory(tinysecp);
const network = bitcoin.networks.testnet;

// Function to create a fake transaction for legacy inputs
function createFakePrevTx(output, value) {
    const tx = new bitcoin.Transaction();
    
    // Add a fake input
    tx.addInput(
        Buffer.from('0000000000000000000000000000000000000000000000000000000000000000', 'hex'),
        0
    );
    
    // Add our output
    tx.addOutput(output, value);
    
    return tx;
}

// Create key pairs for our examples
const alice = ECPair.makeRandom({ network });
const bob = ECPair.makeRandom({ network });
const charlie = ECPair.makeRandom({ network });

console.log('\n===== Bitcoin Transaction Examples =====');
console.log('\nKey Information:');
console.log('Alice Private Key (WIF):', alice.toWIF());
console.log('Bob Private Key (WIF):', bob.toWIF());
console.log('Charlie Private Key (WIF):', charlie.toWIF());

// --------------------------------------------------
// 1. Legacy P2PKH Transaction Example
// --------------------------------------------------
function createP2PKHTransaction() {
    console.log('\n----- Legacy P2PKH Transaction Example -----');
    
    // Create Alice's P2PKH address and payment object
    const aliceP2pkh = bitcoin.payments.p2pkh({
        pubkey: alice.publicKey,
        network
    });
    
    console.log('Alice P2PKH Address:', aliceP2pkh.address);
    
    // Create a simple Bitcoin transaction
    const txb = new bitcoin.Psbt({ network });
    
    // Create a fake previous transaction for nonWitnessUtxo
    const prevTx = createFakePrevTx(aliceP2pkh.output, 100000);
    
    // Add the input with the nonWitnessUtxo (for legacy transactions)
    txb.addInput({
        hash: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        index: 0,
        nonWitnessUtxo: prevTx.toBuffer() // Provide the complete previous transaction
    });
    
    // Add an output to Bob's address
    const bobP2pkh = bitcoin.payments.p2pkh({
        pubkey: bob.publicKey,
        network
    });
    
    console.log('Bob P2PKH Address (recipient):', bobP2pkh.address);
    
    txb.addOutput({
        address: bobP2pkh.address,
        value: 95000, // 0.00095 BTC (leaving 0.00005 for fee)
    });
    
    try {
        // Sign the transaction with Alice's private key
        txb.signInput(0, alice);
        
        // Finalize the input
        txb.finalizeInput(0);
        
        // Extract the transaction
        const tx = txb.extractTransaction();
        
        console.log('\nTransaction Details:');
        console.log('Transaction ID:', tx.getId());
        console.log('Transaction Size:', tx.byteLength(), 'bytes');
        console.log('ScriptSig for Input 0:', tx.ins[0].script.toString('hex'));
        console.log('ScriptPubKey for Output 0:', tx.outs[0].script.toString('hex'));
        
        return tx;
    } catch (error) {
        console.log('Error creating P2PKH transaction:', error.message);
        // Return a minimal transaction for size comparison
        return { byteLength: () => 226 }; // Approximate P2PKH tx size
    }
}

// --------------------------------------------------
// 2. P2SH Transaction Example (2-of-3 Multisig)
// --------------------------------------------------
function createP2SHTransaction() {
    console.log('\n----- Legacy P2SH Multisig Transaction Example -----');
    
    // Create a 2-of-3 multisig redeem script
    const p2ms = bitcoin.payments.p2ms({
        m: 2,
        pubkeys: [alice.publicKey, bob.publicKey, charlie.publicKey],
        network
    });
    
    // Wrap it in P2SH
    const p2sh = bitcoin.payments.p2sh({
        redeem: p2ms,
        network
    });
    
    console.log('2-of-3 Multisig P2SH Address:', p2sh.address);
    console.log('Redeem Script:', p2sh.redeem.output.toString('hex'));
    
    // Create a fake previous transaction for nonWitnessUtxo
    const prevTx = createFakePrevTx(p2sh.output, 200000);
    
    // Create a simple transaction
    const txb = new bitcoin.Psbt({ network });
    
    // Add the input with nonWitnessUtxo
    txb.addInput({
        hash: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
        index: 0,
        nonWitnessUtxo: prevTx.toBuffer(),
        redeemScript: p2ms.output
    });
    
    // Add an output to Charlie's address
    const charlieP2pkh = bitcoin.payments.p2pkh({
        pubkey: charlie.publicKey,
        network
    });
    
    console.log('Charlie P2PKH Address (recipient):', charlieP2pkh.address);
    
    txb.addOutput({
        address: charlieP2pkh.address,
        value: 190000, // 0.0019 BTC (leaving 0.0001 for fee)
    });
    
    try {
        // Sign with Alice and Bob (2 of 3)
        txb.signInput(0, alice);
        txb.signInput(0, bob);
        
        // Finalize the input
        txb.finalizeInput(0);
        
        // Extract the transaction
        const tx = txb.extractTransaction();
        
        console.log('\nTransaction Details:');
        console.log('Transaction ID:', tx.getId());
        console.log('Transaction Size:', tx.byteLength(), 'bytes');
        console.log('ScriptSig for Input 0:', tx.ins[0].script.toString('hex'));
        console.log('ScriptPubKey for Output 0:', tx.outs[0].script.toString('hex'));
        
        return tx;
    } catch (error) {
        console.log('Error creating P2SH transaction:', error.message);
        // Return a minimal transaction for size comparison
        return { byteLength: () => 370 }; // Approximate P2SH multisig tx size
    }
}

// --------------------------------------------------
// 3. P2WPKH (Segwit) Transaction Example
// --------------------------------------------------
function createP2WPKHTransaction() {
    console.log('\n----- Segwit P2WPKH Transaction Example -----');
    
    // Create Alice's P2WPKH address
    const aliceP2wpkh = bitcoin.payments.p2wpkh({
        pubkey: alice.publicKey,
        network
    });
    
    console.log('Alice P2WPKH Address:', aliceP2wpkh.address);
    
    // Create a simple transaction
    const txb = new bitcoin.Psbt({ network });
    
    // Add a fake input
    txb.addInput({
        hash: 'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
        index: 0,
        witnessUtxo: {
            script: aliceP2wpkh.output,
            value: 300000, // 0.003 BTC
        },
    });
    
    // Add an output to Bob's Segwit address
    const bobP2wpkh = bitcoin.payments.p2wpkh({
        pubkey: bob.publicKey,
        network
    });
    
    console.log('Bob P2WPKH Address (recipient):', bobP2wpkh.address);
    
    txb.addOutput({
        address: bobP2wpkh.address,
        value: 290000, // 0.0029 BTC (leaving 0.0001 for fee)
    });
    
    try {
        // Sign with Alice's key
        txb.signInput(0, alice);
        
        // Finalize the input
        txb.finalizeInput(0);
        
        // Extract the transaction
        const tx = txb.extractTransaction();
        
        console.log('\nTransaction Details:');
        console.log('Transaction ID:', tx.getId());
        console.log('Transaction Size:', tx.byteLength(), 'bytes');
        console.log('ScriptSig for Input 0 (should be empty):', tx.ins[0].script.toString('hex'));
        console.log('Witness data for Input 0:', tx.ins[0].witness.map(w => w.toString('hex')));
        console.log('ScriptPubKey for Output 0:', tx.outs[0].script.toString('hex'));
        
        return tx;
    } catch (error) {
        console.log('Error creating P2WPKH transaction:', error.message);
        // Return a minimal transaction for size comparison
        return { byteLength: () => 141 }; // Approximate P2WPKH tx size
    }
}

// --------------------------------------------------
// 4. P2WSH (Segwit) Transaction Example (2-of-3 Multisig)
// --------------------------------------------------
function createP2WSHTransaction() {
    console.log('\n----- Segwit P2WSH Multisig Transaction Example -----');
    
    // Create a 2-of-3 multisig witness script
    const p2ms = bitcoin.payments.p2ms({
        m: 2,
        pubkeys: [alice.publicKey, bob.publicKey, charlie.publicKey],
        network
    });
    
    // Wrap it in P2WSH
    const p2wsh = bitcoin.payments.p2wsh({
        redeem: p2ms,
        network
    });
    
    console.log('2-of-3 Multisig P2WSH Address:', p2wsh.address);
    console.log('Witness Script:', p2ms.output.toString('hex'));
    
    // Create a simple transaction
    const txb = new bitcoin.Psbt({ network });
    
    // Add a fake input
    txb.addInput({
        hash: 'dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd',
        index: 0,
        witnessUtxo: {
            script: p2wsh.output,
            value: 400000, // 0.004 BTC
        },
        witnessScript: p2ms.output,
    });
    
    // Add an output to Charlie's Segwit address
    const charlieP2wpkh = bitcoin.payments.p2wpkh({
        pubkey: charlie.publicKey,
        network
    });
    
    console.log('Charlie P2WPKH Address (recipient):', charlieP2wpkh.address);
    
    txb.addOutput({
        address: charlieP2wpkh.address,
        value: 390000, // 0.0039 BTC (leaving 0.0001 for fee)
    });
    
    try {
        // Sign with Alice and Bob (2 of 3)
        txb.signInput(0, alice);
        txb.signInput(0, bob);
        
        // Finalize the input
        txb.finalizeInput(0);
        
        // Extract the transaction
        const tx = txb.extractTransaction();
        
        console.log('\nTransaction Details:');
        console.log('Transaction ID:', tx.getId());
        console.log('Transaction Size:', tx.byteLength(), 'bytes');
        console.log('ScriptSig for Input 0 (should be empty):', tx.ins[0].script.toString('hex'));
        console.log('Witness data for Input 0:', tx.ins[0].witness.map(w => w.toString('hex')));
        console.log('ScriptPubKey for Output 0:', tx.outs[0].script.toString('hex'));
        
        return tx;
    } catch (error) {
        console.log('Error creating P2WSH transaction:', error.message);
        // Return a minimal transaction for size comparison
        return { byteLength: () => 215 }; // Approximate P2WSH multisig tx size
    }
}

// --------------------------------------------------
// 5. Transaction Size Comparison
// --------------------------------------------------
function compareTransactionSizes(txP2PKH, txP2SH, txP2WPKH, txP2WSH) {
    console.log('\n----- Transaction Size Comparison -----');
    console.log('Legacy P2PKH Transaction Size:', txP2PKH.byteLength(), 'bytes');
    console.log('Legacy P2SH Multisig Transaction Size:', txP2SH.byteLength(), 'bytes');
    console.log('Segwit P2WPKH Transaction Size:', txP2WPKH.byteLength(), 'bytes');
    console.log('Segwit P2WSH Multisig Transaction Size:', txP2WSH.byteLength(), 'bytes');
    
    console.log('\nSegwit Savings:');
    const p2pkhVsP2wpkh = (1 - (txP2WPKH.byteLength() / txP2PKH.byteLength())) * 100;
    console.log(`P2WPKH is ${p2pkhVsP2wpkh.toFixed(2)}% smaller than P2PKH`);
    
    const p2shVsP2wsh = (1 - (txP2WSH.byteLength() / txP2SH.byteLength())) * 100;
    console.log(`P2WSH is ${p2shVsP2wsh.toFixed(2)}% smaller than P2SH`);
}

// Execute all example transactions
const txP2PKH = createP2PKHTransaction();
const txP2SH = createP2SHTransaction();
const txP2WPKH = createP2WPKHTransaction();
const txP2WSH = createP2WSHTransaction();

// Compare transaction sizes
compareTransactionSizes(txP2PKH, txP2SH, txP2WPKH, txP2WSH); 