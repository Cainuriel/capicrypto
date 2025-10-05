================
CODE SNIPPETS
================
TITLE: Run scrypt-async Unit Tests with Mocha
DESCRIPTION: This snippet sets up the Mocha testing framework for the scrypt-async library. It configures the test environment, runs the tests, and captures results, including detailed information about any test failures.

SOURCE: https://github.com/indutny/elliptic/blob/master/test/unittests.html#_snippet_0

LANGUAGE: javascript
CODE:
```
mocha.setup('bdd');
mocha.timeout(20000);
var runner = mocha.run();
var failedTests = [];
runner.on('end', function() {
    window.mochaResults = runner.stats;
    window.mochaResults.reports = failedTests;
});
runner.on('fail', function(test, err) {
    var flattenTitles = function(test) {
        var titles = [];
        while (test.parent.title) {
            titles.push(test.parent.title);
            test = test.parent;
        }
        return titles.reverse();
    };
    failedTests.push({
        name: test.title,
        result: false,
        message: err.message,
        stack: err.stack,
        titles: flattenTitles(test)
    });
});
```

--------------------------------

TITLE: Instantiate Elliptic Curve
DESCRIPTION: Creates an instance of the elliptic curve object, specifically configured for the secp256k1 curve.

SOURCE: https://github.com/indutny/elliptic/blob/master/__wiki__/Home.md#_snippet_0

LANGUAGE: javascript
CODE:
```
const ec = elliptic.ec('secp256k1');
```

--------------------------------

TITLE: Benchmark Elliptic vs eccjs
DESCRIPTION: Compares the performance of the elliptic library against eccjs for signing, verification, key generation, and key exchange operations using Node.js.

SOURCE: https://github.com/indutny/elliptic/blob/master/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
$ node benchmarks/index.js
Benchmarking: sign
elliptic#sign x 262 ops/sec ±0.51% (177 runs sampled)
eccjs#sign x 55.91 ops/sec ±0.90% (144 runs sampled)
------------------------
Fastest is elliptic#sign
========================
Benchmarking: verify
elliptic#verify x 113 ops/sec ±0.50% (166 runs sampled)
eccjs#verify x 48.56 ops/sec ±0.36% (125 runs sampled)
------------------------
Fastest is elliptic#verify
========================
Benchmarking: gen
elliptic#gen x 294 ops/sec ±0.43% (176 runs sampled)
eccjs#gen x 62.25 ops/sec ±0.63% (129 runs sampled)
------------------------
Fastest is elliptic#gen
========================
Benchmarking: ecdh
elliptic#ecdh x 136 ops/sec ±0.85% (156 runs sampled)
------------------------
Fastest is elliptic#ecdh
========================

```

--------------------------------

TITLE: EdDSA Key Generation, Signing, and Verification
DESCRIPTION: Shows how to implement EdDSA cryptography using the elliptic library. This includes creating an EdDSA context, generating keys from a secret, signing, and verifying messages.

SOURCE: https://github.com/indutny/elliptic/blob/master/README.md#_snippet_2

LANGUAGE: javascript
CODE:
```
var EdDSA = require('elliptic').eddsa;

// Create and initialize EdDSA context
// (better do it once and reuse it)
var ec = new EdDSA('ed25519');

// Create key pair from secret
var key = ec.keyFromSecret('693e3c...'); // hex string, array or Buffer

// Sign the message's hash (input must be an array, or a hex-string)
var msgHash = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
var signature = key.sign(msgHash).toHex();

// Verify signature
console.log(key.verify(msgHash, signature));

// CHECK WITH NO PRIVATE KEY

// Import public key
var pub = '0a1af638...';
var key = ec.keyFromPublic(pub, 'hex');

// Verify signature
var signature = '70bed1...';
console.log(key.verify(msgHash, signature));
```

--------------------------------

TITLE: ECDSA Key Generation, Signing, and Verification
DESCRIPTION: Demonstrates how to use the ECDSA functionality from the elliptic library to generate key pairs, sign message hashes, and verify signatures. It covers exporting signatures in DER format and importing public keys.

SOURCE: https://github.com/indutny/elliptic/blob/master/README.md#_snippet_1

LANGUAGE: javascript
CODE:
```
var EC = require('elliptic').ec;

// Create and initialize EC context
// (better do it once and reuse it)
var ec = new EC('secp256k1');

// Generate keys
var key = ec.genKeyPair();

// Sign the message's hash (input must be an array, or a hex-string)
var msgHash = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
var signature = key.sign(msgHash);

// Export DER encoded signature in Array
var derSign = signature.toDER();

// Verify signature
console.log(key.verify(msgHash, derSign));

// CHECK WITH NO PRIVATE KEY

var pubPoint = key.getPublic();
var x = pubPoint.getX();
var y = pubPoint.getY();

// Public Key MUST be either:
// 1) '04' + hex string of x + hex string of y; or
// 2) object with two hex string properties (x and y); or
// 3) object with two buffer properties (x and y)
var pub = pubPoint.encode('hex');                                 // case 1
var pub = { x: x.toString('hex'), y: y.toString('hex') };         // case 2
var pub = { x: x.toBuffer(), y: y.toBuffer() };                   // case 3
var pub = { x: x.toArrayLike(Buffer), y: y.toArrayLike(Buffer) }; // case 3

// Import public key
var key = ec.keyFromPublic(pub, 'hex');

// Signature MUST be either:
// 1) DER-encoded signature as hex-string; or
// 2) DER-encoded signature as buffer; or
// 3) object with two hex-string properties (r and s); or
// 4) object with two buffer properties (r and s)

var signature = '3046022100...'; // case 1
var signature = new Buffer('...'); // case 2
var signature = { r: 'b1fc...', s: '9c42...' }; // case 3

// Verify signature
console.log(key.verify(msgHash, signature));
```

--------------------------------

TITLE: ECDH Key Exchange (Two Parties)
DESCRIPTION: Demonstrates the Elliptic Curve Diffie-Hellman (ECDH) key exchange protocol for two parties using the elliptic library. It shows how to generate key pairs and derive shared secrets.

SOURCE: https://github.com/indutny/elliptic/blob/master/README.md#_snippet_3

LANGUAGE: javascript
CODE:
```
var EC = require('elliptic').ec;
var ec = new EC('curve25519');

// Generate keys
var key1 = ec.genKeyPair();
var key2 = ec.genKeyPair();

var shared1 = key1.derive(key2.getPublic());
var shared2 = key2.derive(key1.getPublic());

console.log('Both shared secrets are BN instances');
console.log(shared1.toString(16));
console.log(shared2.toString(16));
```

--------------------------------

TITLE: ECDH Key Exchange (Three Parties)
DESCRIPTION: Illustrates a three-party Elliptic Curve Diffie-Hellman (ECDH) key exchange using the elliptic library. It shows how to generate multiple key pairs and compute shared secrets among all parties.

SOURCE: https://github.com/indutny/elliptic/blob/master/README.md#_snippet_4

LANGUAGE: javascript
CODE:
```
var EC = require('elliptic').ec;
var ec = new EC('curve25519');

var A = ec.genKeyPair();
var B = ec.genKeyPair();
var C = ec.genKeyPair();

var AB = A.getPublic().mul(B.getPrivate())
var BC = B.getPublic().mul(C.getPrivate())
var CA = C.getPublic().mul(A.getPrivate())

var ABC = AB.mul(C.getPrivate())
var BCA = BC.mul(A.getPrivate())
var CAB = CA.mul(B.getPrivate())

console.log(ABC.getX().toString(16))
console.log(BCA.getX().toString(16))
console.log(CAB.getX().toString(16))
```

--------------------------------

TITLE: Derive Compressed Public Key
DESCRIPTION: Calculates the 33-byte compressed public key from a given private key. The private key and the resulting public key are handled as hexadecimal strings.

SOURCE: https://github.com/indutny/elliptic/blob/master/__wiki__/Home.md#_snippet_1

LANGUAGE: javascript
CODE:
```
const compressed = true;
const pub = ec.keyFromPrivate(pri, 'hex').getPublic(compressed, 'hex');
```

--------------------------------

TITLE: Generate Recoverable Signature
DESCRIPTION: Generates a recoverable signature in libsecp256k1 format (65-byte R | S | index). The message must be a byte array, and the output signature components are formatted as hexadecimal strings.

SOURCE: https://github.com/indutny/elliptic/blob/master/__wiki__/Home.md#_snippet_5

LANGUAGE: javascript
CODE:
```
const canonical = { canonical: true };
const array = elliptic.utils.toArray(msg, 'hex'); // HASHED MSG MUST BE BYTE ARRAY
const sig_obj = ec.sign(array, pri, 'hex', canonical);
const r = sig_obj.r.toString('hex', 32); // MUST SPECIFY 32 BYTES TO KEEP LEADING ZEROS
const s = sig_obj.s.toString('hex', 32);
const i = sig_obj.recoveryParam.toString(16).padStart(2, '0');
const sig = r + s + i;
```

--------------------------------

TITLE: Generate Canonical DER Signature
DESCRIPTION: Generates a Bitcoin-compatible DER-encoded signature with canonical (normalized) S values. Requires the message hash, private key, and specifies hexadecimal encoding.

SOURCE: https://github.com/indutny/elliptic/blob/master/__wiki__/Home.md#_snippet_3

LANGUAGE: javascript
CODE:
```
const canonical = { canonical: true };
const der = ec.sign(msg, pri, 'hex', canonical).toDER('hex');
```

--------------------------------

TITLE: Recover Public Key from Signature
DESCRIPTION: Recovers the compressed public key from a 65-byte recoverable signature. The message must be provided as a byte array, and the signature is parsed from a hexadecimal string.

SOURCE: https://github.com/indutny/elliptic/blob/master/__wiki__/Home.md#_snippet_6

LANGUAGE: javascript
CODE:
```
const compressed = true;
const sig_obj = { r: sig.slice(0, 64), s: sig.slice(64, 128) };
const recoveryParam = parseInt(sig.slice(128, 130), 16);
const array = elliptic.utils.toArray(msg, 'hex'); // HASHED MSG MUST BE BYTE ARRAY
const pub = ec.recoverPubKey(array, sig_obj, recoveryParam, 'hex').encode('hex', compressed);
```

--------------------------------

TITLE: Hash Message (UTF-8 and Hex)
DESCRIPTION: Hashes a message using SHA-256 from the hash.js library. Supports both UTF-8 strings and hexadecimal inputs, returning the hash as a hexadecimal string.

SOURCE: https://github.com/indutny/elliptic/blob/master/__wiki__/Home.md#_snippet_2

LANGUAGE: javascript
CODE:
```
// utf8 input
const msg_utf8 = hash.sha256().update(string).digest('hex');

// hex input
const msg_hex = hash.sha256().update(hex, 'hex').digest('hex');
```

--------------------------------

TITLE: Verify DER Signature
DESCRIPTION: Verifies a DER-encoded signature against a message hash and public key. Both the message and public key are expected in hexadecimal format.

SOURCE: https://github.com/indutny/elliptic/blob/master/__wiki__/Home.md#_snippet_4

LANGUAGE: javascript
CODE:
```
const bool = ec.verify(msg, der, pub, 'hex');
```