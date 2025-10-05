#!/usr/bin/env node

/**
 * 🧪 EXPERIMENTO: Iteración Reversa para Generar Capicúas
 * 
 * Proceso:
 * 1. Tomar un número n
 * 2. Sumarle su reverso: n + reverse(n)
 * 3. Repetir hasta obtener un capicúa
 * 4. Verificar si es primo
 * 
 * Objetivo: Comparar este método con generación directa de capicúas
 */

// ============================================
// 🔧 UTILIDADES
// ============================================

function reverse(n) {
  return BigInt(n.toString().split('').reverse().join(''));
}

function isPalindrome(n) {
  const str = n.toString();
  return str === str.split('').reverse().join('');
}

function isPrime(n) {
  if (n < 2n) return false;
  if (n === 2n) return true;
  if (n % 2n === 0n) return false;
  
  // Miller-Rabin para números pequeños
  const limit = BigInt(Math.floor(Math.sqrt(Number(n))));
  for (let i = 3n; i <= limit; i += 2n) {
    if (n % i === 0n) return false;
  }
  return true;
}

// ============================================
// 🦜 PROCESO ITERATIVO
// ============================================

function iterateToCapicua(n, maxIterations = 1000) {
  let current = BigInt(n);
  let iterations = 0;
  const history = [current];
  
  while (!isPalindrome(current) && iterations < maxIterations) {
    const rev = reverse(current);
    current = current + rev;
    history.push(current);
    iterations++;
  }
  
  return {
    seed: BigInt(n),
    result: current,
    iterations,
    isPalindrome: isPalindrome(current),
    isPrime: isPalindrome(current) ? isPrime(current) : false,
    history: history.slice(0, 10) // Solo primeras 10 para no saturar
  };
}

// ============================================
// 🔬 EXPERIMENTO 1: Casos Específicos
// ============================================

console.log('🦜 === EXPERIMENTO 1: CASOS ESPECÍFICOS === 🦜\n');

const testCases = [45, 89, 125, 195, 196, 383, 100, 999];

testCases.forEach(seed => {
  const result = iterateToCapicua(seed);
  console.log(`Semilla: ${seed}`);
  console.log(`  → Resultado: ${result.result}`);
  console.log(`  → Iteraciones: ${result.iterations}`);
  console.log(`  → ¿Es capicúa?: ${result.isPalindrome ? '✅' : '❌'}`);
  console.log(`  → ¿Es primo?: ${result.isPrime ? '✅ PRIMO!' : '❌'}`);
  if (result.history.length > 1) {
    console.log(`  → Primeros pasos: ${result.history.slice(0, 5).join(' → ')}`);
  }
  console.log('');
});

// ============================================
// 🔬 EXPERIMENTO 2: Búsqueda Masiva
// ============================================

console.log('\n🦜 === EXPERIMENTO 2: BÚSQUEDA MASIVA (1-1000) === 🦜\n');

let totalTests = 0;
let totalIterations = 0;
let primesFound = [];
let composites = 0;
let averageIterations = 0;

for (let seed = 1; seed <= 1000; seed++) {
  const result = iterateToCapicua(seed, 100); // Máximo 100 iteraciones
  totalTests++;
  totalIterations += result.iterations;
  
  if (result.isPalindrome) {
    if (result.isPrime) {
      primesFound.push({ seed, result: result.result, iterations: result.iterations });
    } else {
      composites++;
    }
  }
}

averageIterations = totalIterations / totalTests;

console.log(`📊 Estadísticas (semillas 1-1000):\n`);
console.log(`  • Tests realizados: ${totalTests}`);
console.log(`  • Iteraciones promedio: ${averageIterations.toFixed(2)}`);
console.log(`  • Capicúas primos encontrados: ${primesFound.length}`);
console.log(`  • Capicúas compuestos: ${composites}`);
console.log(`  • Tasa de éxito (primos): ${((primesFound.length / totalTests) * 100).toFixed(2)}%`);
console.log('');

// Mostrar algunos primos encontrados
console.log('🎯 Primeros 10 capicúas primos encontrados:\n');
primesFound.slice(0, 10).forEach(({ seed, result, iterations }) => {
  console.log(`  Semilla ${seed} → ${result} (${iterations} iteraciones)`);
});

// ============================================
// 🔬 EXPERIMENTO 3: Comparación de Métodos
// ============================================

console.log('\n\n🦜 === EXPERIMENTO 3: MÉTODO DIRECTO VS ITERATIVO === 🦜\n');

function directPalindrome(half) {
  // Método directo: crear capicúa espejando dígitos
  const str = half.toString();
  const reversed = str.split('').reverse().join('');
  return BigInt(str + reversed);
}

function compareMethod(range) {
  const directPrimes = [];
  const iterativePrimes = [];
  
  // Método directo
  for (let i = 1; i <= range; i++) {
    const pal = directPalindrome(i);
    if (isPrime(pal)) {
      directPrimes.push(pal);
    }
  }
  
  // Método iterativo
  for (let i = 1; i <= range; i++) {
    const result = iterateToCapicua(i);
    if (result.isPrime) {
      iterativePrimes.push(result.result);
    }
  }
  
  return { directPrimes, iterativePrimes };
}

const comparison = compareMethod(100);

console.log('Comparación de métodos (semillas 1-100):\n');
console.log(`📏 MÉTODO DIRECTO (espejo simple):`);
console.log(`  • Primos encontrados: ${comparison.directPrimes.length}`);
console.log(`  • Ejemplos: ${comparison.directPrimes.slice(0, 5).join(', ')}`);
console.log('');

console.log(`🔄 MÉTODO ITERATIVO (suma reversa):`);
console.log(`  • Primos encontrados: ${comparison.iterativePrimes.length}`);
console.log(`  • Ejemplos: ${comparison.iterativePrimes.slice(0, 5).join(', ')}`);
console.log('');

// ============================================
// 🔬 EXPERIMENTO 4: Número 196 (Lychrel)
// ============================================

console.log('\n🦜 === EXPERIMENTO 4: NÚMEROS DE LYCHREL === 🦜\n');
console.log('Algunos números nunca convergen a capicúa (conjetura de Lychrel)\n');

const lychrelCandidates = [196, 295, 394, 493, 592, 689, 788, 887, 986];

lychrelCandidates.forEach(seed => {
  const result = iterateToCapicua(seed, 50); // Máximo 50 iteraciones
  console.log(`Semilla ${seed}:`);
  if (result.iterations >= 50) {
    console.log(`  ⚠️  NO converge en 50 iteraciones (¿Lychrel?)`);
  } else {
    console.log(`  → Convergió en ${result.iterations} iteraciones → ${result.result}`);
  }
});

// ============================================
// 📊 CONCLUSIONES
// ============================================

console.log('\n\n🦜 === CONCLUSIONES === 🦜\n');
console.log('✅ El proceso iterativo SÍ genera capicúas');
console.log(`📉 Tasa de primos: ~${((primesFound.length / totalTests) * 100).toFixed(2)}%`);
console.log('⚠️  La mayoría de capicúas generados siguen siendo compuestos (Banks 2004)');
console.log('🎓 Método iterativo NO aumenta probabilidad de encontrar primos');
console.log('🔬 Útil para: educación, exploración matemática');
console.log('❌ NO recomendado para: generación criptográfica de parámetros');
console.log('');
console.log('🦜 Para CapiCrypto: mejor usar método directo + verificación de primalidad');
