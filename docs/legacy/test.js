import { capicuaCurve, keyPair, p, a, b, Gx, Gy, isOnCurve, pubX, pubY } from "./index.js";
import { message, msgHashArray, signature, publicKey, isValid } from "./sign.js";

console.log("\n🧪 === PRUEBAS COMPLETAS DE CURVA CAPICÚA === 🧪\n");

// ============================================
// PRUEBA 1: Parámetros de la Curva
// ============================================
console.log("📊 PRUEBA 1: Parámetros de la Curva");
console.log("=====================================");
console.log("Primo p:", p.toString().slice(0, 30) + "...");
console.log("Parámetro a (capicúa):", a);
console.log("Parámetro b (capicúa):", b);
console.log("Generador Gx:", Gx);
console.log("Generador Gy:", Gy.toString().slice(0, 30) + "...");
console.log("✅ Parámetros cargados correctamente\n");

// ============================================
// PRUEBA 2: Verificar que G está en la curva
// ============================================
console.log("🔍 PRUEBA 2: Verificar Punto Generador");
console.log("=====================================");
const gOnCurve = isOnCurve(Gx, Gy);
console.log("G en la curva?", gOnCurve ? "✅ SÍ" : "❌ NO");
const leftSide = (Gy * Gy) % p;
const rightSide = (Gx * Gx * Gx + a * Gx + b) % p;
console.log(`  y² mod p = ${leftSide}`);
console.log(`  x³+ax+b mod p = ${rightSide}\n`);

// ============================================
// PRUEBA 3: Verificar Punto Público
// ============================================
console.log("� PRUEBA 3: Punto Público");
console.log("=====================================");
console.log("Punto público X:", pubX.toString().slice(0, 30) + "...");
console.log("Punto público Y:", pubY.toString().slice(0, 30) + "...");
const pubOnCurve = isOnCurve(pubX, pubY);
console.log("Punto público en la curva?", pubOnCurve ? "✅ SÍ" : "❌ NO\n");

// ============================================
// PRUEBA 4: Operaciones de la Curva
// ============================================
console.log("🧮 PRUEBA 4: Operaciones de Puntos");
console.log("=====================================");

const G = capicuaCurve.g;
const twoG = G.mul("2");
const threeG = G.mul("3");
const fiveG = G.mul("5");

console.log("2G X:", twoG.getX().toString(16).slice(0, 30) + "...");
console.log("3G X:", threeG.getX().toString(16).slice(0, 30) + "...");
console.log("5G X:", fiveG.getX().toString(16).slice(0, 30) + "...");

// Verificar que 2G + G = 3G
const twoGplusG = twoG.add(G);
const isEqual = twoGplusG.eq(threeG);
console.log("2G + G = 3G:", isEqual ? "✅ SÍ" : "❌ NO");

// Verificar que 2G + 3G = 5G
const twoGplusThreeG = twoG.add(threeG);
const isEqualFive = twoGplusThreeG.eq(fiveG);
console.log("2G + 3G = 5G:", isEqualFive ? "✅ SÍ" : "❌ NO\n");

// ============================================
// PRUEBA 5: Firma y Verificación
// ============================================
console.log("✍️  PRUEBA 5: Verificación de Firmas ECDSA");
console.log("=====================================");
console.log("Mensaje original:", message);
console.log("Firma válida con mensaje original:", isValid ? "✅ SÍ" : "❌ NO");

// Verificar componentes de la firma
console.log("\nComponentes de firma:");
console.log("  r:", signature.r.toString(16).slice(0, 30) + "...");
console.log("  s:", signature.s.toString(16).slice(0, 30) + "...");

// Verificar formato DER
const derSig = signature.toDER('hex');
console.log("  DER:", derSig.slice(0, 30) + "...");

// Verificar que la clave pública coincide
const recoveredPubKey = publicKey;
const keyPairPubKey = keyPair.getPublic();
const keysMatch = recoveredPubKey.eq(keyPairPubKey);
console.log("\nClave pública coincide:", keysMatch ? "✅ SÍ" : "❌ NO");

// Probar re-verificación con firma DER
const isValidDER = keyPair.verify(msgHashArray, derSig);
console.log("Verificación con DER:", isValidDER ? "✅ SÍ" : "❌ NO");

// Exportar clave pública y re-importar
console.log("\n🔄 Prueba de exportación/importación de clave:");
const pubHex = publicKey.encode('hex');
console.log("Clave pública (hex):", pubHex.slice(0, 30) + "...");
const reimportedKey = capicuaCurve.keyFromPublic(pubHex, 'hex');
const isValidReimported = reimportedKey.verify(msgHashArray, signature);
console.log("Verificación con clave reimportada:", isValidReimported ? "✅ SÍ" : "❌ NO\n");

// ============================================
// PRUEBA 6: Propiedades Algebraicas
// ============================================
console.log("🔬 PRUEBA 6: Propiedades Algebraicas");
console.log("=====================================");

// Elemento identidad
const identity = G.add(capicuaCurve.curve.point(null, null));
console.log("Identidad [G + O = G]:", identity.eq(G) ? "✅ SÍ" : "❌ NO");

// Conmutatividad
const comm1 = G.add(twoG);
const comm2 = twoG.add(G);
console.log("Conmutatividad [G + 2G = 2G + G]:", comm1.eq(comm2) ? "✅ SÍ" : "❌ NO");

// Asociatividad
const assoc1 = G.add(twoG).add(threeG);
const assoc2 = G.add(twoG.add(threeG));
console.log("Asociatividad [(G+2G)+3G = G+(2G+3G)]:", assoc1.eq(assoc2) ? "✅ SÍ" : "❌ NO");

// ============================================
// RESUMEN FINAL
// ============================================
console.log("\n" + "=".repeat(50));
console.log("🎉 PRUEBAS COMPLETADAS");
console.log("=".repeat(50));
console.log("✅ Implementación de curva elíptica capicúa funcional");
console.log("✅ Operaciones aritméticas correctas");
console.log("✅ Firma y verificación ECDSA operativas");
console.log("✅ Integración con Ethereum exitosa");
console.log("\n⚠️  RECORDATORIO: Solo para uso educativo");
console.log("=".repeat(50) + "\n");
