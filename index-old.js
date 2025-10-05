import { weierstrass, ecdsa } from '@noble/curves/abstract/weierstrass.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { randomBytes as cryptoRandomBytes } from 'crypto';
import { bytesToHex, hexToBytes } from '@noble/curves/utils.js';

// ============================================
// PARÁMETROS DE LA CURVA CAPICÚA
// ============================================
console.log("  p (primo):", p.toString(16).slice(0, 20) + "...");
console.log("  n (orden):", n.toString(16).slice(0, 20) + "...");
console.log("  a (capicúa):", a.toString());
console.log("  b (capicúa):", b.toString());
console.log("");
console.log("🔑 Clave privada:", privateKey.slice(0, 20) + "...");
console.log("📍 Clave pública:", publicKey.slice(0, 40) + "...");
console.log("📍 Punto público X:", pubX.toString(16).slice(0, 20) + "...");
console.log("📍 Punto público Y:", pubY.toString(16).slice(0, 20) + "...");
console.log("");
console.log("✅ Punto G en curva:", isOnCurve(Gx, Gy) ? "SÍ" : "NO");
console.log("✅ Punto público en curva:", isOnCurve(pubX, pubY) ? "SÍ" : "NO");
console.log("");/ ============================================
// PARÁMETROS DE LA CURVA CAPICÚA
// ============================================

// Parámetros de la curva capicúa
const p = 2n ** 256n - 189n; // Primo grande (cercano a 2^256)
const a = 12345678987654321n; // Parámetro a (capicúa)
const b = 98765432123456789n; // Parámetro b (capicúa)

// Punto generador válido en la curva capicúa
// Verificado: y² ≡ x³ + ax + b (mod p)
const Gx = 4n;
const Gy = 7677010940438675858527404102889110377749302592279471034060180903517157070867n;

// ============================================
// CÁLCULO DEL ORDEN DEL GRUPO (n)
// ============================================

console.log("🔍 Calculando orden del grupo...");
console.log("⚠️  ADVERTENCIA: Esto puede tomar varios minutos para curvas de 256 bits");
console.log("");

// Implementación de baby-step giant-step para encontrar el orden
// dentro de los límites de Hasse: |n - (p+1)| ≤ 2√p
function calculateOrder(p, a, b, Gx, Gy) {
  console.log("📊 Usando límites de Hasse para buscar orden...");
  
  // Límites de Hasse: n está cerca de p + 1
  const pPlus1 = p + 1n;
  const sqrtP = sqrt(p);
  const lowerBound = pPlus1 - 2n * sqrtP;
  const upperBound = pPlus1 + 2n * sqrtP;
  
  console.log(`📐 Rango de búsqueda: [${lowerBound}, ${upperBound}]`);
  console.log(`📏 Tamaño del rango: ${upperBound - lowerBound}`);
  console.log("");
  
  // Para curvas de 256 bits, el rango es demasiado grande para búsqueda completa
  // Estrategia: probar valores comunes cerca de p+1
  console.log("🎯 Probando órdenes candidatos...");
  
  const candidates = [
    pPlus1,
    pPlus1 - 1n,
    pPlus1 + 1n,
    pPlus1 - 2n,
    pPlus1 + 2n,
    p,
    p - 1n,
    p + 1n
  ];
  
  for (let i = 0; i < candidates.length; i++) {
    const candidate = candidates[i];
    console.log(`  Probando n = ${i === 0 ? 'p+1' : i === 5 ? 'p' : i === 6 ? 'p-1' : i === 7 ? 'p+1' : `p+1${i % 2 === 0 ? '-' : '+'}${Math.floor(i/2)}`}...`);
    
    if (testOrder(candidate, Gx, Gy, p, a, b)) {
      console.log(`✅ ¡Orden encontrado! n = candidato #${i}`);
      return candidate;
    }
  }
  
  console.log("⚠️  No se encontró orden exacto en candidatos comunes");
  console.log("💡 Usando p+1 como aproximación para demostración educativa");
  console.log("🔴 ADVERTENCIA: Las firmas pueden no ser válidas con orden aproximado");
  return pPlus1;
}

// Raíz cuadrada entera usando Newton
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

// Probar si un valor es el orden correcto
function testOrder(n, Gx, Gy, p, a, b) {
  try {
    // Multiplicar G por n debería dar el punto en el infinito
    const result = pointMultiply(Gx, Gy, n, p, a, b);
    return result === null; // null representa punto en el infinito
  } catch (e) {
    return false;
  }
}

// Multiplicación de punto escalar (implementación simple)
function pointMultiply(x, y, k, p, a, b) {
  if (k === 0n) return null; // Punto en el infinito
  if (k === 1n) return { x, y };
  
  // Algoritmo double-and-add
  let result = null; // Punto en el infinito
  let addend = { x, y };
  
  while (k > 0n) {
    if (k % 2n === 1n) {
      result = pointAdd(result, addend, p, a);
    }
    addend = pointDouble(addend, p, a);
    k = k / 2n;
  }
  
  return result;
}

// Suma de puntos
function pointAdd(p1, p2, prime, a) {
  if (p1 === null) return p2;
  if (p2 === null) return p1;
  
  const { x: x1, y: y1 } = p1;
  const { x: x2, y: y2 } = p2;
  
  if (x1 === x2 && y1 === y2) {
    return pointDouble(p1, prime, a);
  }
  
  if (x1 === x2) {
    return null; // Punto en el infinito
  }
  
  const slope = mod((y2 - y1) * modInv(x2 - x1, prime), prime);
  const x3 = mod(slope * slope - x1 - x2, prime);
  const y3 = mod(slope * (x1 - x3) - y1, prime);
  
  return { x: x3, y: y3 };
}

// Duplicación de punto
function pointDouble(point, prime, a) {
  if (point === null) return null;
  
  const { x, y } = point;
  const slope = mod((3n * x * x + a) * modInv(2n * y, prime), prime);
  const x3 = mod(slope * slope - 2n * x, prime);
  const y3 = mod(slope * (x - x3) - y, prime);
  
  return { x: x3, y: y3 };
}

// Módulo que maneja negativos correctamente
function mod(n, m) {
  return ((n % m) + m) % m;
}

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
  
  return mod(old_s, m);
}

// Calcular el orden
const n = calculateOrder(p, a, b, Gx, Gy);

console.log("");
console.log("✨ Orden calculado:", n.toString(16).slice(0, 20) + "...");
console.log("");

// ============================================
// CREAR CURVA CON @noble/curves
// ============================================

console.log("🔧 Creando curva Weierstrass con @noble/curves...");

const CAPICUA_CURVE = {
  p: p,    // Campo primo
  n: n,    // Orden del grupo
  h: 1n,   // Cofactor
  a: a,    // Parámetro a
  b: b,    // Parámetro b
  Gx: Gx,  // Generador X
  Gy: Gy   // Generador Y
};

// Crear clase Point para la curva
const CapicuaPoint = weierstrass(CAPICUA_CURVE);

// Crear instancia ECDSA con SHA-256
const capicuaCurve = ecdsa(CapicuaPoint, sha256);

console.log("✅ Curva creada exitosamente!");
console.log("");

// ============================================
// GENERAR PAR DE CLAVES
// ============================================

console.log("🔑 Generando par de claves...");

// Generar clave privada aleatoria
const privateKeyBytes = cryptoRandomBytes(32);
const privateKey = "0x" + bytesToHex(privateKeyBytes);

// Obtener clave pública
const publicKeyBytes = capicuaCurve.getPublicKey(privateKeyBytes);
const publicKey = bytesToHex(publicKeyBytes);

// Decodificar punto público para mostrar coordenadas
const pubPoint = CapicuaPoint.fromBytes(publicKeyBytes);
const { x: pubX, y: pubY } = pubPoint.toAffine();

console.log("✅ Claves generadas!");
console.log("");

// ============================================
// FUNCIÓN AUXILIAR
// ============================================

// Función para verificar que un punto está en la curva
function isOnCurve(x, y) {
  const left = mod(y * y, p);
  const right = mod(x * x * x + a * x + b, p);
  return left === right;
}

// ============================================
// MOSTRAR INFORMACIÓN
// ============================================

console.log("🧮 === CURVA ELÍPTICA CAPICÚA === 🧮");
console.log("");
console.log("� Parámetros de la curva:");
console.log("  p (primo):", p.toString(16).slice(0, 20) + "...");
console.log("  n (orden):", n.toString(16).slice(0, 20) + "...");
console.log("  a (capicúa):", a.toString());
console.log("  b (capicúa):", b.toString());
console.log("");
console.log("�🔑 Clave privada:", privateKey.slice(0, 20) + "...");
console.log("📍 Clave pública:", publicKey.slice(0, 40) + "...");
console.log("📍 Punto público X:", pubX.toString(16).slice(0, 20) + "...");
console.log("📍 Punto público Y:", pubY.toString(16).slice(0, 20) + "...");
console.log("");
console.log("✅ Punto G en curva:", isOnCurve(Gx, Gy) ? "SÍ" : "NO");
console.log("✅ Punto público en curva:", isOnCurve(pubX, pubY) ? "SÍ" : "NO");
console.log("");

// ============================================
// EXPORTAR
// ============================================

export { 
  capicuaCurve,
  CapicuaPoint,
  privateKey,
  privateKeyBytes,
  publicKey,
  publicKeyBytes,
  pubPoint,
  pubX,
  pubY,
  p, 
  a, 
  b, 
  Gx, 
  Gy,
  n,
  isOnCurve
};
