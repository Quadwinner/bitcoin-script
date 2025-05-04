/**
 * Bitcoin Script Visualization Tool
 * 
 * This file creates ASCII art visualization of the stack operations
 * during Bitcoin script execution, making it easier to understand
 * how scripts work.
 */

// Basic stack implementation with visualization
class VisualStack {
    constructor(name) {
        this.items = [];
        this.name = name;
        this.history = [];
        this.operations = [];
    }
    
    push(item) {
        this.items.push(item);
        this.recordState(`Push: ${item}`);
        return this.items.length;
    }
    
    pop() {
        if (this.items.length === 0) return null;
        const item = this.items.pop();
        this.recordState(`Pop: ${item}`);
        return item;
    }
    
    recordState(operation) {
        this.operations.push(operation);
        this.history.push([...this.items]);
    }
    
    renderHistory() {
        console.log(`\n===== ${this.name} Stack Execution =====`);
        
        // Find maximum item length for formatting
        let maxLength = 0;
        for (const state of this.history) {
            for (const item of state) {
                if (String(item).length > maxLength) {
                    maxLength = String(item).length;
                }
            }
        }
        
        // Add padding
        maxLength += 2;
        
        // Print header
        console.log(`\nOperation${''.padEnd(20)} Stack (bottom to top)`);
        console.log('-'.repeat(30 + maxLength));
        
        // Print initial empty state
        console.log(`Initial${''.padEnd(23)} |`);
        
        // Print each state with its operation
        for (let i = 0; i < this.operations.length; i++) {
            const state = this.history[i];
            const operation = this.operations[i];
            
            let stackVisual = '|';
            if (state.length > 0) {
                for (const item of state) {
                    stackVisual += ` ${String(item).padEnd(maxLength)}|`;
                }
            }
            
            console.log(`${operation.padEnd(30)} ${stackVisual}`);
        }
        
        console.log('-'.repeat(30 + maxLength));
    }
}

// -------------------------------------------------
// P2PKH Visualization
// -------------------------------------------------
function visualizeP2PKH() {
    const stack = new VisualStack('P2PKH (Pay to Public Key Hash)');
    
    // Mock data
    const signature = "Sig-Alice";
    const publicKey = "PubKey-Alice";
    const publicKeyHash = "PKHash-Alice";
    
    console.log("\n=========== P2PKH Script Visualization ===========");
    console.log("\nLocking script:    OP_DUP OP_HASH160 <PKHash-Alice> OP_EQUALVERIFY OP_CHECKSIG");
    console.log("Unlocking script:  <Sig-Alice> <PubKey-Alice>\n");
    
    // Step 1: Add the unlocking script items
    stack.push(signature);
    stack.push(publicKey);
    
    // Step 2: Execute OP_DUP
    const dupItem = stack.items[stack.items.length - 1];
    stack.push(dupItem);
    
    // Step 3: Execute OP_HASH160
    stack.pop(); // Remove the top item
    stack.push(publicKeyHash.substring(0, 6)); // Push the hashed version
    
    // Step 4: Push the hash from the locking script
    stack.push(publicKeyHash);
    
    // Step 5: Execute OP_EQUALVERIFY
    const hash1 = stack.pop();
    const hash2 = stack.pop();
    // In real execution, this would compare and fail if not equal
    stack.recordState(`OP_EQUALVERIFY: ${hash1 === hash2 ? "Equal, continue" : "Not equal, fail"}`);
    
    // Step 6: Execute OP_CHECKSIG
    const pk = stack.pop();
    const sig = stack.pop();
    // In real execution, this would verify the signature
    stack.push(1); // Assume success (1=true)
    
    // Render the visualization
    stack.renderHistory();
}

// -------------------------------------------------
// P2SH Visualization
// -------------------------------------------------
function visualizeP2SH() {
    const stack = new VisualStack('P2SH (Pay to Script Hash)');
    
    // Mock data for a simple 2-of-2 multisig
    const sig1 = "Sig-Alice";
    const sig2 = "Sig-Bob";
    const redeemScript = "2-of-2 MultiSig Script";
    const redeemScriptHash = "RSHash";
    
    console.log("\n=========== P2SH Script Visualization ===========");
    console.log("\nLocking script:    OP_HASH160 <RSHash> OP_EQUAL");
    console.log("Unlocking script:  <Sig-Alice> <Sig-Bob> <2-of-2 MultiSig Script>\n");
    
    // Step 1: Add the unlocking script items
    stack.push(sig1);
    stack.push(sig2);
    stack.push(redeemScript);
    
    // Step 2: Execute OP_HASH160
    const script = stack.pop();
    stack.push("RSHash"); // Hash of the redeem script
    
    // Step 3: Push the hash from the locking script
    stack.push(redeemScriptHash);
    
    // Step 4: Execute OP_EQUAL
    const hash1 = stack.pop();
    const hash2 = stack.pop();
    stack.push(hash1 === hash2 ? 1 : 0);
    
    // Step 5: Check result and execute redeem script if successful
    if (stack.items[stack.items.length - 1] === 1) {
        stack.recordState("OP_EQUAL: Success, now execute redeem script");
        stack.pop(); // Remove the result
        
        // Now would execute the redeem script (multisig)
        stack.recordState("Execute redeem script (2-of-2 multisig)");
        
        // Simple simulation of multisig verification
        const s2 = stack.pop();
        const s1 = stack.pop();
        
        // In a real implementation, this would verify both signatures
        // against the public keys in the redeem script
        stack.push(1); // Assume success
    } else {
        stack.recordState("OP_EQUAL: Failed, script invalid");
    }
    
    // Render the visualization
    stack.renderHistory();
}

// -------------------------------------------------
// P2WPKH Visualization (Segwit)
// -------------------------------------------------
function visualizeP2WPKH() {
    const stack = new VisualStack('P2WPKH (Pay to Witness Public Key Hash)');
    
    // Mock data
    const signature = "Sig-Alice";
    const publicKey = "PubKey-Alice";
    const publicKeyHash = "PKHash-Alice";
    
    console.log("\n=========== P2WPKH (Segwit) Script Visualization ===========");
    console.log("\nLocking script:    OP_0 <PKHash-Alice>");
    console.log("Witness data:      <Sig-Alice> <PubKey-Alice>");
    console.log("\nNote: The witness data is not in scriptSig but in a separate witness field.");
    console.log("      The signature includes the previous output value (fixing malleability).\n");
    
    // Step 1: After validation of the witness program version
    stack.recordState("Execute witness program (validation of version 0)");
    
    // Step 2: Witnessdata is used to construct the script
    stack.push(signature);
    stack.push(publicKey);
    
    // Steps 3-7: The exact same procedure as P2PKH
    // Step 3: Execute OP_DUP
    const dupItem = stack.items[stack.items.length - 1];
    stack.push(dupItem);
    
    // Step 4: Execute OP_HASH160
    stack.pop(); // Remove the top item
    stack.push(publicKeyHash.substring(0, 6)); // Push the hashed version
    
    // Step 5: Push the hash from the witness program
    stack.push(publicKeyHash);
    
    // Step 6: Execute OP_EQUALVERIFY
    const hash1 = stack.pop();
    const hash2 = stack.pop();
    stack.recordState(`OP_EQUALVERIFY: ${hash1 === hash2 ? "Equal, continue" : "Not equal, fail"}`);
    
    // Step 7: Execute OP_CHECKSIG
    const pk = stack.pop();
    const sig = stack.pop();
    stack.push(1); // Assume success (1=true)
    
    // Render the visualization
    stack.renderHistory();
}

// -------------------------------------------------
// P2WSH Visualization (Segwit)
// -------------------------------------------------
function visualizeP2WSH() {
    const stack = new VisualStack('P2WSH (Pay to Witness Script Hash)');
    
    // Mock data for a simple 2-of-2 multisig
    const sig1 = "Sig-Alice";
    const sig2 = "Sig-Bob";
    const witnessScript = "2-of-2 MultiSig Script";
    const witnessScriptHash = "WSHash";
    
    console.log("\n=========== P2WSH (Segwit) Script Visualization ===========");
    console.log("\nLocking script:    OP_0 <WSHash>");
    console.log("Witness data:      <Sig-Alice> <Sig-Bob> <2-of-2 MultiSig Script>");
    console.log("\nNote: The witness data is in a separate field.");
    console.log("      The hash is SHA256 (not HASH160).");
    console.log("      Signatures cover the previous output value.\n");
    
    // Step 1: After validation of the witness program version
    stack.recordState("Execute witness program (validation of version 0)");
    
    // Step 2: Validate that the witness script matches the hash
    stack.recordState("Validate: SHA256(witnessScript) == witnessScriptHash");
    
    // Step 3: If valid, execute the witness script with witness data
    stack.push(sig1);
    stack.push(sig2);
    
    // Step 4: Execute witness script (multisig in this case)
    stack.recordState("Execute witness script (2-of-2 multisig)");
    
    // Step 5: Simple simulation of multisig verification
    const s2 = stack.pop();
    const s1 = stack.pop();
    
    // In a real implementation, this would verify both signatures
    // against the public keys in the witness script
    stack.push(1); // Assume success
    
    // Render the visualization
    stack.renderHistory();
}

// Run the visualizations
visualizeP2PKH();
visualizeP2SH();
visualizeP2WPKH();
visualizeP2WSH(); 