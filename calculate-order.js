// Script para calcular el orden del grupo de la curva capicúa
// Usando baby-step giant-step y búsqueda exhaustiva dentro de límites de Hasse

const p = 2n ** 256n - 189n;
const a = 12345678987654321n;
const b = 98765432123456789n;
const Gx = 4n;
const Gy = 7677010940438675858527404102889110377749302592279471034060180903517157070867n;

console.log("🔍 === CALCULADORA DE ORDEN DE CURVA ELÍPTICA === 🔍\n");
console.log("📊 Parámetros:");
console.log("   p =", p.toString(16).slice(0, 20) + "...");
console.log("   a =", a);
console.log("   b =", b);
console.log("   G = (" + Gx + ", " + Gy.toString(16).slice(0, 20) + "...)\n");

// Módulo seguro
function mod(n, m) {
  return ((n % m) + m) % m;
}

// Inverso modular
function modInv(a, m) {
  a = mod(a, m);
  let [old_r, r] = [a, m];
  let [old_s, s] = [1n, 0n];
  
  while (r !== 0n) {
    const quotient = old_r / r;
    [old_r, r] = [r, old_r - quotient * r];
    [old_s, s] = [s, old_s - quotient * s];
  }
  
  if (old_r > 1n) return null; // No tiene inverso
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
  if (k < 0n) {
    return pointMultiply({ x: point.x, y: mod(-point.y, p) }, -k);
  }
  
  let result = null;
  let addend = point;
  
  while (k > 0n) {
    if (k % 2n === 1n) {
      result = pointAdd(result, addend);
      if (result === null && k > 1n) {
        // Si llegamos al infinito antes de tiempo, k no es divisor del orden
        return undefined;
      }
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

console.log("⏱️  Iniciando búsqueda del orden...\n");

const G = { x: Gx, y: Gy };

// Límites de Hasse
const pPlus1 = p + 1n;
const sqrtP = sqrt(p);
const lowerBound = pPlus1 - 2n * sqrtP;
const upperBound = pPlus1 + 2n * sqrtP;

console.log("📐 Límites de Hasse:");
console.log("   Rango: [" + lowerBound.toString(16).slice(0, 20) + "..., " + upperBound.toString(16).slice(0, 20) + "...]");
console.log("   √p ≈", sqrtP.toString(16).slice(0, 20) + "...");
console.log("");

// Estrategia: búsqueda cerca de p+1
console.log("🎯 Buscando cerca de p+1...\n");

const searchRange = 1000n; // Buscar ±1000 desde p+1
let found = false;

for (let i = 0n; i <= searchRange && !found; i++) {
  for (const offset of [0n, i, -i]) {
    if (i === 0n && offset !== 0n) continue;
    
    const candidate = pPlus1 + offset;
    if (candidate <= 0n) continue;
    
    if (i % 100n === 0n && offset === 0n) {
      console.log(`   Probando n = p+1+${i}...`);
    }
    
    const result = pointMultiply(G, candidate);
    
    if (result === null) {
      console.log("\n🎉 ¡ORDEN ENCONTRADO!");
      console.log("   n = p+1" + (offset >= 0n ? "+" : "") + offset);
      console.log("   n =", candidate);
      console.log("   n (hex) =", candidate.toString(16));
      console.log("\n✅ Verificación: " + candidate + " * G = O (punto infinito)");
      found = true;
      break;
    }
  }
}

if (!found) {
  console.log("\n❌ No se encontró el orden en el rango ±" + searchRange);
  console.log("💡 Se necesitaría implementar Schoof's algorithm para curvas de este tamaño");
  console.log("");
  console.log("🔴 CONCLUSIÓN: Para esta curva de 256 bits con parámetros aleatorios,");
  console.log("   calcular el orden exacto requiere algoritmos avanzados (Schoof/SEA)");
  console.log("   que están fuera del alcance de JavaScript puro.");
  console.log("");
  console.log("💡 SOLUCIONES:");
  console.log("   1. Usar una curva estándar (secp256k1, p256, etc.)");
  console.log("   2. Calcular n offline con SageMath/Pari-GP");
  console.log("   3. Usar parámetros de curva donde n sea conocido");
}

console.log("");
