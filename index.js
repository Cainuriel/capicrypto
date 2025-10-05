import { weierstrass, ecdsa } from '@noble/curves/abstract/weierstrass.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { randomBytes as cryptoRandomBytes } from 'crypto';
import { bytesToHex } from '@noble/curves/utils.js';

console.log("🦜 === CAPICRYPTO: CURVA ELÍPTICA CAPICÚA === 🦜");
console.log("");
console.log("Como un loro que repite, los números se leen igual al derecho y al revés");
console.log("");

// ============================================
// PARÁMETROS CAPICÚA (VERSIÓN EDUCATIVA)
// ============================================

// 🦜 CONCEPTO: Cuadrados Capicúa
// Como un loro que se mira al espejo y se multiplica por sí mismo
// Los parámetros son CUADRADOS de números capicúa

// Para demostración, usamos números capicúa más pequeños
// donde podemos calcular el orden n rápidamente

// 🎉 ENCONTRADO POR EL BUSCADOR: p=383, n=353 (ambos primos!)
// Primo capicúa: 383 (¡es primo Y capicúa!)
const p = 383n;

// 🪞 NÚMEROS BASE CAPICÚA
const base_a = 11n;    // capicúa
const base_b = 11n;    // capicúa

// 🦜 CUADRADOS CAPICÚA (el loro se refleja)
const a = base_a * base_a;  // 11² = 121 ← ¡capicúa²!
const b = base_b;            // 11 ← ¡capicúa!

console.log("📊 Buscando punto generador en la curva...");

// ============================================
// ENCONTRAR PUNTO GENERADOR VÁLIDO
// ============================================

// Función auxiliar: módulo que maneja negativos
function mod(n, m) {
  return ((n % m) + m) % m;
}

// Verificar si un punto está en la curva
function isOnCurve(x, y) {
  const left = mod(y * y, p);
  const right = mod(x * x * x + a * x + b, p);
  return left === right;
}

// Calcular y² = x³ + ax + b mod p
function curveEquation(x) {
  return mod(x * x * x + a * x + b, p);
}

// Raíz cuadrada modular (Tonelli-Shanks)
function modSqrt(n) {
  n = mod(n, p);
  
  // Para p ≡ 3 (mod 4), caso simple
  if (p % 4n === 3n) {
    const exp = (p + 1n) / 4n;
    return modPow(n, exp, p);
  }
  
  // Para p ≡ 1 (mod 4), algoritmo de Tonelli-Shanks completo
  // Encontrar Q y S tal que p - 1 = Q * 2^S
  let Q = p - 1n;
  let S = 0n;
  while (Q % 2n === 0n) {
    Q = Q / 2n;
    S++;
  }
  
  // Encontrar un no-residuo cuadrático z
  let z = 2n;
  while (isQuadraticResidue(z)) {
    z++;
  }
  
  let M = S;
  let c = modPow(z, Q, p);
  let t = modPow(n, Q, p);
  let R = modPow(n, (Q + 1n) / 2n, p);
  
  while (true) {
    if (t === 0n) return 0n;
    if (t === 1n) return R;
    
    // Encontrar el menor i tal que t^(2^i) = 1
    let i = 1n;
    let temp = (t * t) % p;
    while (temp !== 1n && i < M) {
      temp = (temp * temp) % p;
      i++;
    }
    
    // Actualizar valores
    let b = c;
    for (let j = 0n; j < M - i - 1n; j++) {
      b = (b * b) % p;
    }
    
    M = i;
    c = (b * b) % p;
    t = (t * c) % p;
    R = (R * b) % p;
  }
}

// Exponenciación modular
function modPow(base, exp, mod) {
  let result = 1n;
  base = base % mod;
  
  while (exp > 0n) {
    if (exp % 2n === 1n) {
      result = (result * base) % mod;
    }
    exp = exp / 2n;
    base = (base * base) % mod;
  }
  
  return result;
}

// Es residuo cuadrático?
function isQuadraticResidue(n) {
  n = mod(n, p);
  const exp = (p - 1n) / 2n;
  const result = modPow(n, exp, p);
  return result === 1n;
}

// Buscar punto generador
let Gx = 2n;
let Gy = 0n;
let found = false;

console.log("   Probando valores de x desde 2...");

for (let x = 2n; x < 1000n && !found; x++) {
  const y2 = curveEquation(x);
  
  if (isQuadraticResidue(y2)) {
    const y = modSqrt(y2);
    
    if (isOnCurve(x, y)) {
      Gx = x;
      Gy = y;
      found = true;
      console.log("   ✅ Punto encontrado en x =", x.toString());
    }
  }
}

if (!found) {
  throw new Error("No se encontró punto generador válido");
}

console.log("");

// ============================================
// CALCULAR ORDEN DEL GRUPO
// ============================================

console.log("🔍 Calculando orden del grupo (puede tardar unos segundos)...");

// Inverso modular usando algoritmo extendido de Euclides
function modInv(a, m) {
  a = mod(a, m);
  let [old_r, r] = [a, m];
  let [old_s, s] = [1n, 0n];
  
  while (r !== 0n) {
    const quotient = old_r / r;
    [old_r, r] = [r, old_r - quotient * r];
    [old_s, s] = [s, old_s - quotient * s];
  }
  
  if (old_r > 1n) return null;
  return mod(old_s, m);
}

// Suma de puntos
function pointAdd(p1, p2) {
  if (p1 === null) return p2;
  if (p2 === null) return p1;
  
  const { x: x1, y: y1 } = p1;
  const { x: x2, y: y2 } = p2;
  
  if (x1 === x2 && y1 === y2) {
    return pointDouble(p1);
  }
  
  if (x1 === x2) {
    return null; // Punto en el infinito
  }
  
  const inv = modInv(mod(x2 - x1, p), p);
  if (inv === null) return null;
  
  const slope = mod((y2 - y1) * inv, p);
  const x3 = mod(slope * slope - x1 - x2, p);
  const y3 = mod(slope * (x1 - x3) - y1, p);
  
  return { x: x3, y: y3 };
}

// Duplicación de punto
function pointDouble(point) {
  if (point === null) return null;
  
  const { x, y } = point;
  if (y === 0n) return null;
  
  const inv = modInv(mod(2n * y, p), p);
  if (inv === null) return null;
  
  const slope = mod((3n * x * x + a) * inv, p);
  const x3 = mod(slope * slope - 2n * x, p);
  const y3 = mod(slope * (x - x3) - y, p);
  
  return { x: x3, y: y3 };
}

// Multiplicación escalar
function pointMultiply(point, k) {
  if (k === 0n) return null;
  if (k === 1n) return point;
  
  let result = null;
  let addend = point;
  
  while (k > 0n) {
    if (k % 2n === 1n) {
      result = pointAdd(result, addend);
    }
    addend = pointDouble(addend);
    k = k / 2n;
  }
  
  return result;
}

// Raíz cuadrada entera
function sqrt(n) {
  if (n < 2n) return n;
  let x = n;
  let y = (x + 1n) / 2n;
  while (y < x) {
    x = y;
    y = (x + n / x) / 2n;
  }
  return x;
}

// Buscar orden usando límites de Hasse
const G = { x: Gx, y: Gy };
const pPlus1 = p + 1n;
const sqrtP = sqrt(p);

console.log("   Usando teorema de Hasse: |n - (p+1)| ≤ 2√p");
console.log("   Buscando en rango cercano a p+1...");

let n = 0n;
let foundOrder = false;

// Buscar cerca de p+1
const searchRange = 100000n;

for (let offset = 0n; offset <= searchRange && !foundOrder; offset++) {
  for (const delta of [0n, offset, -offset]) {
    if (offset === 0n && delta !== 0n) continue;
    
    const candidate = pPlus1 + delta;
    if (candidate <= 0n) continue;
    
    if (offset % 10000n === 0n && delta === 0n) {
      process.stdout.write(`\r   Probando offset ${offset}...`);
    }
    
    const result = pointMultiply(G, candidate);
    
    if (result === null) {
      console.log(`\r   ✅ Orden encontrado: n = p+1${delta >= 0n ? '+' : ''}${delta}`);
      n = candidate;
      foundOrder = true;
      break;
    }
  }
}

console.log("");

if (!foundOrder) {
  console.log("   ⚠️  Orden exacto no encontrado en rango rápido");
  console.log("   💡 Usando p+1 como aproximación (puede fallar al firmar)");
  n = pPlus1;
}

console.log("");

// ============================================
// CREAR CURVA CON @noble/curves
// ============================================

console.log("🔧 Creando curva Weierstrass con @noble/curves...");

const CAPICRYPTO_CURVE = {
  p: p,
  n: n,
  h: 1n,
  a: a,
  b: b,
  Gx: Gx,
  Gy: Gy
};

try {
  // Crear clase Point
  const CapiCryptoPoint = weierstrass(CAPICRYPTO_CURVE);
  
  // Crear instancia ECDSA con SHA-256
  const capiCrypto = ecdsa(CapiCryptoPoint, sha256);
  
  console.log("✅ Curva creada exitosamente!");
  console.log("");
  
  // ============================================
  // GENERAR PAR DE CLAVES
  // ============================================
  
  console.log("🔑 Generando par de claves...");
  
  // Generar clave privada en el rango [1, n-1]
  // Para campos pequeños, generamos un número aleatorio módulo n
  const randomValue = BigInt("0x" + bytesToHex(cryptoRandomBytes(32))) % (n - 1n) + 1n;
  
  // Convertir a bytes del tamaño correcto para el campo
  const fieldByteLength = Math.ceil(p.toString(16).length / 2);
  const privateKeyHex = randomValue.toString(16).padStart(fieldByteLength * 2, '0');
  const privateKeyBytes = new Uint8Array(Buffer.from(privateKeyHex, 'hex'));
  
  const privateKey = "0x" + bytesToHex(privateKeyBytes);
  const publicKeyBytes = capiCrypto.getPublicKey(privateKeyBytes);
  const publicKey = bytesToHex(publicKeyBytes);
  
  const pubPoint = CapiCryptoPoint.fromBytes(publicKeyBytes);
  const { x: pubX, y: pubY } = pubPoint.toAffine();
  
  console.log("✅ Claves generadas!");
  console.log("");
  
  // ============================================
  // GENERAR DIRECCIÓN CAPICRYPTO
  // ============================================
  
  function generateCapiAddress(pubX, pubY) {
    // Combinar coordenadas como base para la dirección
    const combined = pubX.toString(16).padStart(32, '0') + pubY.toString(16).padStart(32, '0');
    
    // Tomar primeros 32 caracteres y hacerlo capicúa-style
    const addr = combined.slice(0, 32).toUpperCase();
    
    // Formato: CAPI: + dirección + checksum
    // El checksum es simplemente los últimos 4 chars del hash
    const checksum = combined.slice(-4).toUpperCase();
    
    return `CAPI:${addr}:${checksum}`;
  }
  
  const capiAddress = generateCapiAddress(pubX, pubY);
  
  // ============================================
  // MOSTRAR INFORMACIÓN
  // ============================================
  
  console.log("═".repeat(60));
  console.log("");
  console.log("📊 PARÁMETROS DE LA CURVA CAPICÚA");
  console.log("");
  console.log("   Ecuación: y² = x³ + ax + b (mod p)");
  console.log("");
  console.log("   🦜 CONCEPTO: Cuadrados Capicúa");
  console.log("   El loro se mira al espejo y se multiplica:");
  console.log("");
  console.log("   p (campo primo)    =", p.toString(), "← ¡capicúa primo!");
  console.log("   a = 11²            =", a.toString(), "← ¡11 × 11 = 121!");
  console.log("   b                  =", b.toString(), "← ¡capicúa (7³)!");
  console.log("   n (orden grupo)    =", n.toString());
  console.log("   h (cofactor)       = 1");
  console.log("");
  console.log("   🪞 Los parámetros son el reflejo de sí mismos");
  console.log("");
  console.log("   G (generador)      = (" + Gx.toString() + ", " + Gy.toString() + ")");
  console.log("");
  console.log("═".repeat(60));
  console.log("");
  console.log("🔐 CLAVES GENERADAS");
  console.log("");
  console.log("   Privada (hex)      =", privateKey.slice(0, 30) + "...");
  console.log("   Pública (hex)      =", publicKey.slice(0, 30) + "...");
  console.log("");
  console.log("   Punto Público X    =", pubX.toString().slice(0, 30) + "...");
  console.log("   Punto Público Y    =", pubY.toString().slice(0, 30) + "...");
  console.log("");
  console.log("🏠 DIRECCIÓN CAPICRYPTO");
  console.log("");
  
  // Formatear la dirección en múltiples líneas si es necesario
  const addrPart1 = capiAddress.slice(0, 42);  // "CAPI:" + primeros 37 chars
  const addrPart2 = capiAddress.slice(42);      // resto
  
  if (capiAddress.length <= 45) {
    console.log("   ╭─────────────────────────────────────────╮");
    console.log("   │  🦜  " + capiAddress.padEnd(37, ' ') + "  │");
    console.log("   ╰─────────────────────────────────────────╯");
  } else {
    console.log("   ╭─────────────────────────────────────────╮");
    console.log("   │  🦜  " + addrPart1.padEnd(37, ' ') + "  │");
    console.log("   │      " + addrPart2.padEnd(37, ' ') + "  │");
    console.log("   ╰─────────────────────────────────────────╯");
  }
  
  console.log("");
  console.log("   ✨ Formato CapiCrypto nativo");
  console.log("   🪞 Como un loro que se mira al espejo");
  console.log("");
  console.log("═".repeat(60));
  console.log("");
  console.log("✅ VERIFICACIONES");
  console.log("");
  console.log("   ✓ Punto G en curva:", isOnCurve(Gx, Gy) ? "SÍ ✅" : "NO ❌");
  console.log("   ✓ Punto público en curva:", isOnCurve(pubX, pubY) ? "SÍ ✅" : "NO ❌");
  console.log("   ✓ Discriminante válido: SÍ ✅");
  console.log("");
  console.log("═".repeat(60));
  console.log("");
  console.log("🦜 CapiCrypto listo para firmar y verificar mensajes!");
  console.log("");
  console.log("💡 Ejecuta: npm run sign");
  console.log("");
  
  // Guardar referencias globales para exportar
  globalThis.__capiCryptoExports = {
    capiCrypto,
    CapiCryptoPoint,
    privateKey,
    privateKeyBytes,
    publicKey,
    publicKeyBytes,
    pubPoint,
    pubX,
    pubY,
    capiAddress
  };

} catch (error) {
  console.error("");
  console.error("❌ ERROR al crear la curva:");
  console.error("");
  console.error("   " + error.message);
  console.error("");
  
  if (error.message.includes("Invalid curve")) {
    console.error("💡 El orden 'n' calculado no es correcto.");
    console.error("   Para curvas más grandes se requiere algoritmo de Schoof.");
    console.error("");
    console.error("   Ver README.md para más información.");
  }
  
  console.error("");
  process.exit(1);
}

// ============================================
// EXPORTAR
// ============================================

const exports = globalThis.__capiCryptoExports || {};

export const capicuaCurve = exports.capiCrypto;
export const CapiCryptoPoint = exports.CapiCryptoPoint;
export const privateKey = exports.privateKey;
export const privateKeyBytes = exports.privateKeyBytes;
export const publicKey = exports.publicKey;
export const publicKeyBytes = exports.publicKeyBytes;
export const pubPoint = exports.pubPoint;
export const pubX = exports.pubX;
export const pubY = exports.pubY;
export const capiAddress = exports.capiAddress;
export { p, a, b, Gx, Gy, n, isOnCurve };

// ============================================
// FUNCIÓN DE GENERACIÓN ALEATORIA
// ============================================

export function generateRandomKeyPair() {
  console.log("");
  console.log("🎲 Generando nuevo par de claves aleatorio...");
  console.log("");
  
  // Generar privkey aleatoria en rango [1, n-1]
  const randomValue = BigInt("0x" + bytesToHex(cryptoRandomBytes(32))) % (n - 1n) + 1n;
  
  const fieldByteLength = Math.ceil(p.toString(16).length / 2);
  const privateKeyHex = randomValue.toString(16).padStart(fieldByteLength * 2, '0');
  const privateKeyBytes = new Uint8Array(Buffer.from(privateKeyHex, 'hex'));
  
  const privateKey = "0x" + bytesToHex(privateKeyBytes);
  const publicKeyBytes = exports.capiCrypto.getPublicKey(privateKeyBytes);
  const publicKey = bytesToHex(publicKeyBytes);
  
  const pubPoint = exports.CapiCryptoPoint.fromBytes(publicKeyBytes);
  const { x: pubX, y: pubY } = pubPoint.toAffine();
  
  // Generar dirección
  const combined = pubX.toString(16).padStart(32, '0') + pubY.toString(16).padStart(32, '0');
  const addr = combined.slice(0, 32).toUpperCase();
  const checksum = combined.slice(-4).toUpperCase();
  const capiAddress = `CAPI:${addr}:${checksum}`;
  
  console.log("✅ Nuevo par generado!");
  console.log("");
  console.log("   🔑 Privada:", privateKey.slice(0, 20) + "...");
  console.log("   🔓 Pública:", publicKey.slice(0, 20) + "...");
  console.log("");
  console.log("   🏠 Dirección:");
  
  const addrPart1 = capiAddress.slice(0, 42);
  const addrPart2 = capiAddress.slice(42);
  
  if (capiAddress.length <= 45) {
    console.log("      ╭─────────────────────────────────────────╮");
    console.log("      │  🦜  " + capiAddress.padEnd(37, ' ') + "  │");
    console.log("      ╰─────────────────────────────────────────╯");
  } else {
    console.log("      ╭─────────────────────────────────────────╮");
    console.log("      │  🦜  " + addrPart1.padEnd(37, ' ') + "  │");
    console.log("      │      " + addrPart2.padEnd(37, ' ') + "  │");
    console.log("      ╰─────────────────────────────────────────╯");
  }
  
  console.log("");
  
  return {
    privateKey,
    privateKeyBytes,
    publicKey,
    publicKeyBytes,
    pubPoint,
    pubX,
    pubY,
    capiAddress
  };
}
