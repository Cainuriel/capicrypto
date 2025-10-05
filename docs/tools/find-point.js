

// Script para encontrar un punto válido en la curva capicúa
const p = 2n ** 256n - 189n;
const a = 12345678987654321n % p;
const b = 98765432123456789n % p;

console.log("🔍 Buscando punto válido en la curva capicúa...\n");
console.log("Ecuación: y² ≡ x³ + ax + b (mod p)");
console.log(`a = ${a}`);
console.log(`b = ${b}\n`);

function mod(n, m) {
  return ((n % m) + m) % m;
}

// Función para verificar si un número es un cuadrado perfecto mod p
function isQuadraticResidue(n, p) {
  // Criterio de Euler: n^((p-1)/2) ≡ 1 (mod p) si n es residuo cuadrático
  return modPow(n, (p - 1n) / 2n, p) === 1n;
}

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

// Calcular raíz cuadrada modular usando el algoritmo de Tonelli-Shanks
function modSqrt(n, p) {
  if (!isQuadraticResidue(n, p)) return null;
  
  // Para p ≡ 3 (mod 4), podemos usar una fórmula simple
  if (p % 4n === 3n) {
    return modPow(n, (p + 1n) / 4n, p);
  }
  
  // Tonelli-Shanks para casos generales
  let q = p - 1n;
  let s = 0n;
  while (q % 2n === 0n) {
    q = q / 2n;
    s++;
  }
  
  if (s === 1n) {
    return modPow(n, (p + 1n) / 4n, p);
  }
  
  // Buscar z que no sea residuo cuadrático
  let z = 2n;
  while (isQuadraticResidue(z, p)) {
    z++;
  }
  
  let c = modPow(z, q, p);
  let r = modPow(n, (q + 1n) / 2n, p);
  let t = modPow(n, q, p);
  let m = s;
  
  while (t !== 1n) {
    let tt = t;
    let i = 0n;
    while (tt !== 1n) {
      tt = (tt * tt) % p;
      i++;
      if (i === m) return null;
    }
    
    let b = modPow(c, modPow(2n, m - i - 1n, p - 1n), p);
    r = (r * b) % p;
    c = (b * b) % p;
    t = (t * c) % p;
    m = i;
  }
  
  return r;
}

// Buscar puntos válidos en la curva
let foundPoints = [];
for (let x = 2n; x < 1000n && foundPoints.length < 5; x++) {
  const rightSide = mod(x * x * x + a * x + b, p);
  
  if (isQuadraticResidue(rightSide, p)) {
    const y = modSqrt(rightSide, p);
    if (y !== null) {
      // Verificar
      const leftSide = mod(y * y, p);
      if (leftSide === rightSide) {
        foundPoints.push([x, y]);
        console.log(`✅ Punto encontrado: G = [${x}, ${y}]`);
        
        // Verificación
        const check = mod(y * y, p) === mod(x * x * x + a * x + b, p);
        console.log(`   Verificación: ${check ? "✅" : "❌"}`);
        console.log();
      }
    }
  }
}

if (foundPoints.length > 0) {
  console.log(`\n🎉 Se encontraron ${foundPoints.length} puntos válidos!`);
  console.log(`\nPunto recomendado para usar como generador:`);
  console.log(`const G = [${foundPoints[0][0]}n, ${foundPoints[0][1]}n];`);
} else {
  console.log("❌ No se encontraron puntos válidos en el rango buscado");
}
