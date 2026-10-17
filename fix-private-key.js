// Fix private key formatting for .env.local
const fs = require('fs');

const originalPrivateKey = `-----BEGIN PRIVATE KEY-----
MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCwQ5WiukxM7/Ye
wxpT2/i4hZAmx0EdwE5fzo37j2DKrVps8n3eBI/XeXmsL0IJCXgKS+9N9XRMPJeU
mIQGVJTm69MRXRRJnz4g92jC0m8djbypMNBks1eU8ajFU4SyO6L8SinHExc7UMhJ
Wvsdj0L1Vs6uCwZ5QYHRv3wwtVXwTCQw6EO8tR8AluR+lnQbCbBNi6UCUMn+NZEc
O7qL1Te4ejhZXfpObnjg0NwX0vicgzTPVSUDdV1H1G78MTV0M765pnf/yWa55t2E
rlx49/yfjaCaVyB/Boj8mS17rMCLvcE9N0iMgwpccs/KlWT/R5nM8lwWzGFMrlwc
omFm7jP1AgMBAAECggEAF2yr5qfWewUK0tS/23QozjDl0tl5FGCZqc7T/KH1zYmT
MlZZltdJXGvm2RSgtH2/J7MmttgPYBBPXq6UIRk9fqDJeI3Do/MXOR9YG0gG/0j2
UQ/NKgzRb1hcQvkR8fPN+bRLcArf9ACM1X7TT37Z+avTJLsPXa7wdzT45qo6pQfo
eRG3eBzMse+8YCgEcUL3scZopVOLVZ4dfeBGUY9c5dto6laG7ZFc1v7zpO72N54Z
q/UcxSkeVlQcJn38r42y0cpIYXDKtPrCwMqRGtR3DLx6xVdsNG9rf5WLwP63+SaX
woRHStJW1dTWDH2hrcnRLl5kptoZ5Qma7evBjYeyQQKBgQDx7L7V/d4LXQcQPD08
A/82WZxbyueryoD6fSVAsgwjo9qTFMych/XMXBJwrdeh5wbo5SEM/+Wf3W1aJAiP
0mxstvwu2zx/hgFqOpIHEJmXAl/ZkPmlI5wbVORhy9TOgJZ0YWwu9zhzjI8w9z3w
4uaW7esA/pKLkDmtdf3fisYj4QKBgQC6hOFL8sUfhYJjJIR/Z4WqHwWoE3jLZYdC
xxHEcNiv/YLzJwtIDQkwMIJSMrCpLxNpww7gFdjqEMFGabl6Cmg1LQ/VjCgFeEBI
fdGPdlfYhU+JDTXBb0RlP5+m6jCYpeRcIAdNhJtbY4Lrmwxg3FTQXkUJbuJiBpmh
ZNNnpcWSlQKBgQCU5qM6sKtHETX0vy7tToR5XkRHlyZqbRRfmEEihbPFB+fTGT0q
puAZrR3IbqdGxhxRoh1qk+IwOChDD+SZKOmFLEchS9z7nG4ohO42HPh7ooF+NqYB
B17gz6pVqxBLHYf9D613ZsA/FmdXuwVLy0wj30ICda2a6uUlJ3dfbFmx4QKBgQCL
8DpgkwpWdgK3g6RtOixM0O2bhtBwOgJblaO88LWChP+Ektyh+DXWk+6S4TkuFgXI
qfI1Ke8O3fdEbvobmEdK7j4dCATW5bvFJ7Dco/uQlaRwvRqBwIteM3gC8V34iS5l
+BnCjSVKUcTeI/wLiAOSOcguJaVvymflcRIzh2pOaQKBgQChJUUa8jxLKZPalt5r
Eedzzm88K94SCu/J7b4a3FrwfescubEgeMRes2MgVKgJ/EEI07pZUJx/x6K8Y3wz
K+IIpglVuh2oxm0yLOceJfH+5+pOwnc8UK6Gj69APZld2GkVSQFtU0gnwHp+7NoB
rvVmEOo5gZlfMpExTB8n2BnIPw==
-----END PRIVATE KEY-----`;

// Properly escape the private key for .env.local
const escapedPrivateKey = originalPrivateKey.replace(/\n/g, '\\n');

console.log('🔧 Here is the properly formatted private key for your .env.local file:');
console.log('');
console.log('Replace the FIREBASE_PRIVATE_KEY line in your .env.local file with:');
console.log('');
console.log(`FIREBASE_PRIVATE_KEY="${escapedPrivateKey}"`);
console.log('');
console.log('⚠️  Make sure to:');
console.log('1. Keep the double quotes around the entire key');
console.log('2. The \\n should be literally \\\\n (double backslash)');
console.log('3. Save the file and restart the dev server');

// Also write to a separate file for easy copying
fs.writeFileSync('private-key-formatted.txt', `FIREBASE_PRIVATE_KEY="${escapedPrivateKey}"`);
console.log('');
console.log('✅ Also saved to private-key-formatted.txt for easy copying!'); 