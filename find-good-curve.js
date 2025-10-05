// 🦜 CAPICRYPTO - Buscador de Curvas Capicúa con Orden Primo
// Encuentra primos capicúa que generen curvas con orden primo

console.log("🦜 === BUSCADOR DE CURVAS CAPICÚA ÓPTIMAS === 🦜\n");
console.log("Concepto: Los coeficientes son CUADRADOS de números capicúa");
console.log("Objetivo: Encontrar p capicúa donde n (orden) sea primo\n");

// ============================================
// LISTA DE PRIMOS CAPICÚA
// ============================================

const palindromePrimes = [
  101n, 131n, 151n, 181n, 191n,           // 3 dígitos
  313n, 353n, 373n, 383n,                 // 3 dígitos
  727n, 757n, 787n, 797n,                 // 3 dígitos
  919n, 929n,                             // 3 dígitos
  10301n, 10501n, 10601n,                 // 5 dígitos
  11311n, 11411n, 12421n, 12721n,         // 5 dígitos
  12821n, 13331n, 13831n, 13931n,         // 5 dígitos
  14741n, 14841n, 15451n, 15551n,         // 5 dígitos
  16061n, 16361n, 16561n, 16661n,         // 5 dígitos
  17471n, 17971n, 18181n, 18481n,         // 5 dígitos
  19391n, 19891n, 19991n,                 // 5 dígitos
];

// Filtrar solo los que cumplen p ≡ 3 (mod 4) para simplificar raíz cuadrada
const validPrimes = palindromePrimes.filter(p => p % 4n === 3n);

console.log("📋 Primos capicúa válidos (p ≡ 3 mod 4):");
validPrimes.forEach(p => console.log(`   ${p}`));
console.log(`\nTotal: ${validPrimes.length} primos a probar\n`);

// ============================================
// FUNCIONES AUXILIARES
// ============================================

function mod(n, m) {
  return ((n % m) + m) % m;
}

function modPow(base, exp, mod) {
  let result = 1n;
  base = base % mod;
  while (exp > 0n) {
    if (exp % 2n === 1n) result = (result * base) % mod;
    exp = exp / 2n;
    base = (base * base) % mod;
  }
  return result;
}

function isPrime(n) {
  if (n < 2n) return false;
  if (n === 2n) return true;
  if (n === 3n) return true;
  if (n % 2n === 0n) return false;
  if (n % 3n === 0n) return false;
  
  // Prueba de primalidad simple para números pequeños
  if (n < 1000000n) {
    for (let i = 5n; i * i <= n; i += 6n) {
      if (n % i === 0n || n % (i + 2n) === 0n) return false;
    }
    return true;
  }
  
  // Miller-Rabin para números más grandes
  let d = n - 1n;
  let r = 0n;
  while (d % 2n === 0n) {
    d /= 2n;
    r++;
  }
  
  const witnesses = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n];
  
  for (const a of witnesses) {
    if (a >= n) continue;
    
    let x = modPow(a, d, n);
    if (x === 1n || x === n - 1n) continue;
    
    let continueLoop = false;
    for (let i = 0n; i < r - 1n; i++) {
      x = modPow(x, 2n, n);
      if (x === n - 1n) {
        continueLoop = true;
        break;
      }
    }
    
    if (!continueLoop) return false;
  }
  
  return true;
}

function modSqrt(n, p) {
  n = mod(n, p);
  if (p % 4n === 3n) {
    return modPow(n, (p + 1n) / 4n, p);
  }
  throw new Error("p debe ser ≡ 3 (mod 4)");
}

function isQuadraticResidue(n, p) {
  return modPow(n, (p - 1n) / 2n, p) === 1n;
}

function findPoint(p, a, b) {
  for (let x = 2n; x < Math.min(1000, Number(p)); x++) {
    const xBig = BigInt(x);
    const y2 = mod(xBig * xBig * xBig + a * xBig + b, p);
    if (isQuadraticResidue(y2, p)) {
      const y = modSqrt(y2, p);
      // Verificar que está en la curva
      const left = mod(y * y, p);
      const right = mod(xBig * xBig * xBig + a * xBig + b, p);
      if (left === right) {
        return { x: xBig, y };
      }
    }
  }
  return null;
}

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

function pointDouble(point, p, a) {
  const { x, y } = point;
  if (y === 0n) return null;
  
  const inv = modInv(mod(2n * y, p), p);
  if (inv === null) return null;
  
  const slope = mod((3n * x * x + a) * inv, p);
  const x3 = mod(slope * slope - 2n * x, p);
  const y3 = mod(slope * (x - x3) - y, p);
  
  return { x: x3, y: y3 };
}

function pointAdd(p1, p2, p, a) {
  if (p1 === null) return p2;
  if (p2 === null) return p1;
  
  if (p1.x === p2.x && p1.y === p2.y) {
    return pointDouble(p1, p, a);
  }
  
  if (p1.x === p2.x) return null;
  
  const inv = modInv(mod(p2.x - p1.x, p), p);
  if (inv === null) return null;
  
  const slope = mod((p2.y - p1.y) * inv, p);
  const x3 = mod(slope * slope - p1.x - p2.x, p);
  const y3 = mod(slope * (p1.x - x3) - p1.y, p);
  
  return { x: x3, y: y3 };
}

function pointMultiply(point, k, p, a) {
  if (k === 0n) return null;
  if (k === 1n) return point;
  
  let result = null;
  let addend = point;
  
  while (k > 0n) {
    if (k % 2n === 1n) {
      result = pointAdd(result, addend, p, a);
    }
    addend = pointDouble(addend, p, a);
    if (addend === null) break;  // Evitar error si llegamos al infinito
    k = k / 2n;
  }
  
  return result;
}

function findOrder(G, p, a, maxSearch = 200n) {
  const pPlus1 = p + 1n;
  
  // Buscar cerca de p+1 usando teorema de Hasse
  for (let offset = 0n; offset <= maxSearch; offset++) {
    for (const delta of [0n, offset, -offset]) {
      if (offset === 0n && delta !== 0n) continue;
      
      const candidate = pPlus1 + delta;
      if (candidate <= 0n) continue;
      
      const result = pointMultiply(G, candidate, p, a);
      
      if (result === null) {
        return candidate;
      }
    }
  }
  
  return null;
}

// ============================================
// BÚSQUEDA DE CURVA ÓPTIMA
// ============================================

console.log("🔍 Iniciando búsqueda...\n");

let foundCount = 0;

for (const p of validPrimes) {
  console.log(`${"=".repeat(70)}`);
  console.log(`🦜 Probando p = ${p} (${p.toString().length} dígitos)`);
  console.log("=".repeat(70));
  
  // 🪞 CONCEPTO: Cuadrados Capicúa
  // Probar diferentes bases capicúa para generar a = base²
  const testParams = [
    { base_a: 1n, base_b: 1n, desc: "1² × 1" },
    { base_a: 2n, base_b: 2n, desc: "2² × 2" },
    { base_a: 3n, base_b: 3n, desc: "3² × 3" },
    { base_a: 5n, base_b: 5n, desc: "5² × 5" },
    { base_a: 7n, base_b: 7n, desc: "7² × 7" },
    { base_a: 11n, base_b: 7n, desc: "11² × 7" },
    { base_a: 7n, base_b: 11n, desc: "7² × 11" },
    { base_a: 11n, base_b: 11n, desc: "11² × 11" },
  ];
  
  for (const { base_a, base_b, desc } of testParams) {
    const a = mod(base_a * base_a, p);  // 🦜 CUADRADO CAPICÚA
    const b = mod(base_b, p);
    
    // Saltar si a o b son 0
    if (a === 0n || b === 0n) continue;
    
    // Verificar discriminante no singular: 4a³ + 27b² ≠ 0 (mod p)
    const discriminant = mod(4n * a * a * a + 27n * b * b, p);
    if (discriminant === 0n) continue;
    
    process.stdout.write(`   Probando ${desc}: a=${a}, b=${b}...`);
    
    // Buscar punto generador
    const G = findPoint(p, a, b);
    if (!G) {
      console.log(" ✗ Sin punto");
      continue;
    }
    
    // Calcular orden
    const n = findOrder(G, p, a, 200n);
    
    if (!n) {
      console.log(" ✗ Orden no encontrado");
      continue;
    }
    
    // Verificar si n es primo
    const nIsPrime = isPrime(n);
    
    if (nIsPrime) {
      foundCount++;
      console.log(" ✅ ¡PRIMO!");
      console.log("");
      console.log("   🎉".repeat(35));
      console.log("   ¡¡¡ ENCONTRADO !!!");
      console.log("   🎉".repeat(35));
      console.log("");
      console.log("   📊 PARÁMETROS ÓPTIMOS:");
      console.log("   ────────────────────────────────────────");
      console.log(`   p = ${p}n  (primo capicúa)`);
      console.log(`   base_a = ${base_a}n  (capicúa)`);
      console.log(`   base_b = ${base_b}n  (capicúa)`);
      console.log(`   a = ${base_a}² = ${a}n  (cuadrado capicúa)`);
      console.log(`   b = ${b}n  (capicúa)`);
      console.log(`   Gx = ${G.x}n`);
      console.log(`   Gy = ${G.y}n`);
      console.log(`   n = ${n}n  ← ¡¡¡PRIMO!!!`);
      console.log(`   h = 1n  (cofactor)`);
      console.log("   ────────────────────────────────────────");
      console.log("");
      console.log("   💡 Copia estos valores a index.js");
      console.log("");
      
      // Si encontramos uno, podemos seguir buscando más o parar
      // Para este ejercicio, mostramos todos los que encontremos
    } else {
      // Factorizar n para mostrar por qué no es primo
      let factors = [];
      let temp = n;
      for (let i = 2n; i * i <= temp && factors.length < 3; i++) {
        while (temp % i === 0n) {
          factors.push(i);
          temp = temp / i;
        }
      }
      if (temp > 1n) factors.push(temp);
      
      console.log(` ✗ n=${n} (${factors.slice(0, 2).join('×')}${factors.length > 2 ? '...' : ''})`);
    }
  }
  
  console.log("");
}

console.log("=".repeat(70));
console.log(`\n🏁 Búsqueda completada. Encontrados: ${foundCount} curvas óptimas\n`);

if (foundCount === 0) {
  console.log("💡 Sugerencias:");
  console.log("   - Prueba con primos capicúa más grandes");
  console.log("   - Aumenta el rango de búsqueda en findOrder()");
  console.log("   - Prueba más combinaciones de base_a y base_b");
  console.log("");
}
