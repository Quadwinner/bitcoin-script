/**
 * Bitcoin Script Manual Implementation
 * 
 * This file demonstrates how Bitcoin Script works at a low level by manually
 * simulating the stack operations for both Legacy and Segwit transaction types
 */

// Simple stack implementation for demonstration
class Stack {
    constructor() {
        this.items = [];
    }
    
    push(item) {
        this.items.push(item);
        return this.items.length;
    }
    
    pop() {
        if (this.items.length === 0) return null;
        return this.items.pop();
    }
    
    peek() {
        if (this.items.length === 0) return null;
        return this.items[this.items.length - 1];
    }
    
    print() {
        return '[' + this.items.join(', ') + ']';
    }
}

// Mock functions to simulate Bitcoin Script operations
function OP_DUP(stack) {
    const item = stack.peek();
    if (item === null) return false;
    stack.push(item);
    return true;
}

function OP_HASH160(stack) {
    const item = stack.pop();
    if (item === null) return false;
    // Simulate hashing by adding 'hash-' prefix
    stack.push(`hash-${item}`);
    return true;
}

function OP_EQUALVERIFY(stack) {
    const b = stack.pop();
    const a = stack.pop();
    if (a === null || b === null) return false;
    return a === b;
}

function OP_CHECKSIG(stack, publicKey, signature) {
    const pubKey = stack.pop();
    const sig = stack.pop();
    if (pubKey === null || sig === null) return false;
    
    // In a real implementation, this would verify the signature against the public key
    // For our simulation, we'll just check that the values match our expected values
    const isValid = (pubKey === publicKey && sig === signature);
    stack.push(isValid ? 1 : 0);
    return true;
}

function OP_EQUAL(stack) {
    const b = stack.pop();
    const a = stack.pop();
    if (a === null || b === null) return false;
    stack.push(a === b ? 1 : 0);
    return true;
}

console.log('===== Manual Bitcoin Script Execution =====');

// ---------------------
// 1. Legacy P2PKH
// ---------------------
console.log('\n1. Legacy P2PKH (Pay to Public Key Hash) Script\n');

// Values for demonstration
const signature = 'valid-signature';
const publicKey = 'actual-public-key';
const publicKeyHash = 'hash-actual-public-key';

// Initialize stack and simulate execution
let stack = new Stack();

console.log('Initial stack:', stack.print());
console.log('Executing: <signature> <publicKey> OP_DUP OP_HASH160 <publicKeyHash> OP_EQUALVERIFY OP_CHECKSIG');

// Push initial values (unlocking script)
stack.push(signature);
stack.push(publicKey);
console.log('After pushing signature and publicKey:', stack.print());

// OP_DUP
OP_DUP(stack);
console.log('After OP_DUP:', stack.print());

// OP_HASH160
OP_HASH160(stack);
console.log('After OP_HASH160:', stack.print());

// Push publicKeyHash
stack.push(publicKeyHash);
console.log('After pushing publicKeyHash:', stack.print());

// OP_EQUALVERIFY
const equalResult = OP_EQUALVERIFY(stack);
console.log('After OP_EQUALVERIFY:', stack.print(), equalResult ? '(values equal)' : '(values not equal)');

// OP_CHECKSIG
OP_CHECKSIG(stack, publicKey, signature);
console.log('After OP_CHECKSIG:', stack.print());

console.log('P2PKH validation result:', stack.peek() === 1 ? 'VALID' : 'INVALID');

// ---------------------
// 2. Legacy P2SH (simplified)
// ---------------------
console.log('\n2. Legacy P2SH (Pay to Script Hash) Script\n');

// Values for demonstration
const sig1 = 'signature-1';
const sig2 = 'signature-2';
const redeemScript = 'redeem-script';
const redeemScriptHash = 'hash-redeem-script';

// Initialize new stack
stack = new Stack();

console.log('Initial stack:', stack.print());
console.log('Executing: <sig1> <sig2> <redeemScript> OP_HASH160 <redeemScriptHash> OP_EQUAL');

// Push unlocking script values
stack.push(sig1);
stack.push(sig2);
stack.push(redeemScript);
console.log('After pushing signatures and redeemScript:', stack.print());

// OP_HASH160
OP_HASH160(stack);
console.log('After OP_HASH160:', stack.print());

// Push redeemScriptHash
stack.push(redeemScriptHash);
console.log('After pushing redeemScriptHash:', stack.print());

// OP_EQUAL
OP_EQUAL(stack);
console.log('After OP_EQUAL:', stack.print());

console.log('P2SH script validation result:', stack.peek() === 1 ? 'VALID' : 'INVALID');
console.log('(In a real P2SH, the redeemScript would now be executed with the remaining stack items)');

// ---------------------
// 3. Segwit P2WPKH
// ---------------------
console.log('\n3. Segwit P2WPKH (Pay to Witness Public Key Hash)\n');

console.log('For P2WPKH, the script is:');
console.log('Locking Script: OP_0 <publicKeyHash>');
console.log('Witness Data (not in scriptSig): <signature> <publicKey>');

console.log('\nExecution happens similarly to P2PKH, but with these differences:');
console.log('1. Signature data is in the witness field, not in scriptSig');
console.log('2. The signature covers the previous output value (fixing transaction malleability)');
console.log('3. The actual executed script is basically the same as P2PKH');

// ---------------------
// 4. Segwit P2WSH
// ---------------------
console.log('\n4. Segwit P2WSH (Pay to Witness Script Hash)\n');

console.log('For P2WSH, the script is:');
console.log('Locking Script: OP_0 <witnessScriptHash>');
console.log('Witness Data: <sig1> <sig2> ... <witnessScript>');

console.log('\nExecution happens similarly to P2SH, but with these differences:');
console.log('1. Witness data is in a separate field');
console.log('2. The hash is SHA256 (not HASH160)');
console.log('3. Signatures cover the previous output value');
console.log('4. The witness script is executed with the witness stack');

console.log('\n===== End of Manual Script Execution ====='); 