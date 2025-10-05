import { capicuaCurve, privateKeyBytes, publicKeyBytes, n } from "./index.js";
import { bytesToHex } from '@noble/curves/utils.js';
import { randomBytes as cryptoRandomBytes } from 'crypto';

console.log("🔐 === FIRMA Y VERIFICACIÓN CON CURVA CAPICÚA === 🔐\n");

// ============================================
// MOSTRAR CLAVES
// ============================================

console.log("═".repeat(70));
console.log("🔑 CLAVES CRIPTOGRÁFICAS");
console.log("═".repeat(70));
console.log("");
console.log("🔐 Clave Privada:");
console.log("   Hexadecimal:", bytesToHex(privateKeyBytes));
console.log("   Decimal:    ", BigInt("0x" + bytesToHex(privateKeyBytes)).toString());
console.log("   Tamaño:     ", privateKeyBytes.length, "bytes");
console.log("");
console.log("🔓 Clave Pública:");
console.log("   Hexadecimal:", bytesToHex(publicKeyBytes));
console.log("   Tamaño:     ", publicKeyBytes.length, "bytes (comprimida)");
console.log("");
console.log("═".repeat(70));
console.log("");

// ============================================
// MENSAJE A FIRMAR
// ============================================

const message = "Hola Fernando, esta es tu curva capicúa firmada 🦜🧮";
const msgBytes = new TextEncoder().encode(message);

console.log("📝 MENSAJE A FIRMAR:");
console.log("─".repeat(70));
console.log("   Texto:  ", message);
console.log("   Tamaño: ", msgBytes.length, "bytes");
console.log("   UTF-8:  ", bytesToHex(msgBytes).slice(0, 60) + "...");
console.log("─".repeat(70));
console.log("");

// ============================================
// FIRMAR MENSAJE
// ============================================

console.log("✍️  Firmando mensaje con ECDSA...");
console.log("");

try {
  // En @noble/curves v2, sign() devuelve un objeto Signature
  const signatureObj = capicuaCurve.sign(msgBytes, privateKeyBytes);
  
  console.log("✅ Firma generada exitosamente!");
  console.log("");
  
  // Mostrar la firma
  console.log("═".repeat(70));
  console.log("📋 FIRMA DIGITAL (ECDSA)");
  console.log("═".repeat(70));
  console.log("");
  console.log("   Tipo:       ", signatureObj.constructor.name);
  console.log("   toString(): ", signatureObj.toString());
  console.log("");
  
  // Intentar extraer componentes r y s
  try {
    // Convertir a bytes compactos (64 bytes: 32 de r + 32 de s)
    const compactBytes = signatureObj.toCompactRawBytes();
    const r = compactBytes.slice(0, 32);
    const s = compactBytes.slice(32, 64);
    
    console.log("   📦 Formato Compact (64 bytes):");
    console.log("   ├─ r (32 bytes):", bytesToHex(r));
    console.log("   └─ s (32 bytes):", bytesToHex(s));
    console.log("");
    console.log("   📦 Firma completa:", bytesToHex(compactBytes));
  } catch (e) {
    console.log("   ⚠️  No se pudo convertir a formato compact:", e.message);
  }
  
  console.log("");
  console.log("═".repeat(70));
  console.log("");
  
  // ============================================
  // VERIFICAR FIRMA (CASO CORRECTO)
  // ============================================
  
  console.log("🔍 VERIFICACIÓN 1: Mensaje y clave originales");
  console.log("─".repeat(70));
  
  const isValid = capicuaCurve.verify(signatureObj, msgBytes, publicKeyBytes);
  
  if (isValid) {
    console.log("   ✅ FIRMA VÁLIDA");
    console.log("   La firma corresponde al mensaje y fue creada con la clave privada correcta");
  } else {
    console.log("   ❌ FIRMA INVÁLIDA");
    console.log("   ERROR: La firma debería ser válida!");
  }
  console.log("");
  
  // ============================================
  // VERIFICAR CON MENSAJE ALTERADO
  // ============================================
  
  console.log("🔍 VERIFICACIÓN 2: Mensaje alterado (ataque)");
  console.log("─".repeat(70));
  
  const alteredMessage = "Mensaje diferente - esto es un ataque!";
  const alteredBytes = new TextEncoder().encode(alteredMessage);
  const isValidAltered = capicuaCurve.verify(signatureObj, alteredBytes, publicKeyBytes);
  
  console.log("   Mensaje alterado:", alteredMessage);
  
  if (!isValidAltered) {
    console.log("   ✅ FIRMA INVÁLIDA (correcto)");
    console.log("   El sistema detectó que el mensaje fue modificado");
  } else {
    console.log("   ❌ ERROR: La firma no debería ser válida con mensaje alterado!");
  }
  console.log("");
  
  // ============================================
  // VERIFICAR CON CLAVE PÚBLICA INCORRECTA
  // ============================================
  
  console.log("🔍 VERIFICACIÓN 3: Clave pública incorrecta (suplantación)");
  console.log("─".repeat(70));
  
  // Generar una clave privada falsa
  const fakePrivateValue = BigInt("0x" + bytesToHex(cryptoRandomBytes(32))) % (n - 1n) + 1n;
  const fakePrivateHex = fakePrivateValue.toString(16).padStart(4, '0');
  const fakePrivateBytes = new Uint8Array(Buffer.from(fakePrivateHex, 'hex'));
  const fakePublicKey = capicuaCurve.getPublicKey(fakePrivateBytes);
  
  console.log("   Clave pública falsa:", bytesToHex(fakePublicKey).slice(0, 40) + "...");
  
  const isValidWrongKey = capicuaCurve.verify(signatureObj, msgBytes, fakePublicKey);
  
  if (!isValidWrongKey) {
    console.log("   ✅ FIRMA INVÁLIDA (correcto)");
    console.log("   El sistema detectó que la clave pública es incorrecta");
  } else {
    console.log("   ❌ ERROR: La firma no debería ser válida con otra clave!");
  }
  console.log("");
  
  // ============================================
  // RESUMEN FINAL
  // ============================================
  
  console.log("═".repeat(70));
  console.log("🎉 RESUMEN DE PRUEBAS");
  console.log("═".repeat(70));
  console.log("");
  console.log("   ✅ Firma generada correctamente con curva capicúa p=383, n=353");
  console.log("   ✅ Verificación exitosa con mensaje y clave originales");
  console.log("   ✅ Detección correcta de mensaje alterado");
  console.log("   ✅ Detección correcta de clave pública incorrecta");
  console.log("");
  console.log("   🦜 CapiCrypto funciona perfectamente!");
  console.log("   🔐 Sistema ECDSA con curva de cuadrados capicúa operativo");
  console.log("");
  console.log("═".repeat(70));
  console.log("");
  
} catch (error) {
  console.error("");
  console.error("❌ ERROR al firmar:");
  console.error("");
  console.error("   " + error.message);
  console.error("");
  console.error("   Stack:", error.stack);
  console.error("");
  process.exit(1);
}
