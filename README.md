# 🦜 CapiCrypto

> **Criptografía de Curvas Elípticas con Números Capicúa**  
> _Como un loro que repite: los números se leen igual del derecho y al revés_

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org/)
[![Cryptography](https://img.shields.io/badge/crypto-educational-blue.svg)]()

---

## 🎯 ¿Qué es CapiCrypto?

**CapiCrypto** es una implementación educativa de **curvas elípticas criptográficas** donde los parámetros son **números capicúa** (palíndromos): números que se leen igual al derecho que al revés.

### ¿Por qué un loro? 🦜

¡Porque los loros repiten! Y los capicúas son como palabras que se repiten al revés:
- **1331** ← se lee igual en ambas direcciones
- **12321** ← ¡capicúa!
- **1234554321** ← ¡capicúa más grande!

---

## 🔐 Concepto Matemático

Una **curva elíptica de Weierstrass** tiene la forma:

```
y² = x³ + ax + b  (mod p)
```

En **CapiCrypto**, los parámetros `a` y `b` son números capicúa:

```javascript
a = 12345678987654321  // ← ¡se lee igual al revés!
b = 98765432123456789  // ← ¡capicúa también!
```

### Características

- ✅ **Curva válida**: Discriminante Δ = 4a³ + 27b² ≠ 0
- ✅ **Punto generador G** verificado en la curva
- ✅ **ECDSA signatures** con SHA-256
- ✅ **Basado en @noble/curves** (librería auditada)
- 🎓 **Propósito educativo**: Aprender cómo funcionan las curvas elípticas

---

## 📦 Instalación

```bash
git clone https://github.com/tu-usuario/capicrypto.git
cd capicrypto
npm install
```

---

## 🚀 Uso Rápido

### 1. Generar claves y ver la curva

```bash
npm start
```

Esto generará:
- 🔑 Par de claves (privada/pública)
- 📊 Parámetros de la curva capicúa
- ✅ Verificación de que los puntos están en la curva

### 2. Firmar y verificar mensajes

```bash
npm run sign
```

Demuestra:
- ✍️ Firma ECDSA de un mensaje
- 🔍 Verificación de la firma
- ❌ Detección de mensajes alterados
- 🔒 Detección de claves incorrectas

### 3. Ejecutar todo

```bash
npm run all
```

---

## 📐 Parámetros de la Curva

### Versión Actual (Educativa)

Para fines demostrativos, usamos una curva más pequeña donde podemos calcular el orden `n` rápidamente:

```javascript
// 🔢 Parámetros más pequeños (64-128 bits)
p = número primo capicúa pequeño
a = 12321          // capicúa
b = 54345          // capicúa
```

### ⚠️ Limitación Actual: Curvas de 256 bits

Para una curva de 256 bits (nivel de seguridad real), necesitamos:

```javascript
// 🔒 Parámetros de seguridad real (256 bits)
p = 2^256 - 189    // primo grande
a = 12345678987654321
b = 98765432123456789
G = [4, 767701094043867...] // punto generador
```

**Problema**: Calcular el orden `n` del grupo generado por `G` requiere:

#### 🧮 Algoritmo de Schoof

El **algoritmo de Schoof** (o su variante SEA - Schoof-Elkies-Atkin) es necesario para contar puntos en curvas elípticas grandes:

```
Complejidad: O(log⁸ p)  para Schoof
            O(log⁶ p)  para SEA
```

Para `p ≈ 2^256`, esto requiere:
- Días o semanas de cómputo
- Implementación en C++/Rust
- Librerías especializadas (MIRACL, Pari-GP, SageMath)

**JavaScript puro NO es adecuado para este cálculo.**

---

## 🎓 ¿Qué es el Orden `n`?

El orden `n` es el número de veces que necesitas sumar el punto generador `G` a sí mismo para llegar al **punto en el infinito** (elemento identidad):

```
n * G = O  (punto infinito)
```

### Teorema de Hasse

Para una curva sobre un campo primo `Fp`, el número de puntos satisface:

```
|n - (p + 1)| ≤ 2√p
```

Para `p ≈ 2^256`:
- Rango de búsqueda: `± 2^128` valores
- Búsqueda exhaustiva: **IMPOSIBLE** ⛔

### ¿Por qué es crítico?

Sin el orden correcto, **no podemos firmar**:
- ECDSA requiere calcular inversos modulares en `mod n`
- Si `n` es incorrecto → los inversos no existen → error

---

## 🛠️ Estructura del Proyecto

```
capicrypto/
├── 📄 index.js              # Generación de curva y claves
├── ✍️ sign.js                # Firma y verificación ECDSA
├── 🧪 test.js                # Suite de pruebas (legacy)
├── 🔍 calculate-order.js     # Intento de calcular orden
├── 🎯 find-point.js          # Encontrar puntos en curva
├── 📚 docs/
│   ├── CONTEXTO.md          # Contexto original del proyecto
│   ├── eliptics.md          # Documentación de elliptic.js (legacy)
│   └── noble-curves-custom-weierstrass.md  # Guía @noble/curves
├── 📦 package.json
└── 📖 README.md             # ¡Estás aquí! 🦜
```

---

## 🔬 Detalles Técnicos

### Tecnologías

- **[@noble/curves](https://github.com/paulmillr/noble-curves)** v2.0.1 - Librería de curvas elípticas auditada
- **[@noble/hashes](https://github.com/paulmillr/noble-hashes)** - Funciones hash criptográficas
- **Node.js** ≥ 20.0.0 (ESM modules)

### Algoritmos Implementados

1. **Generación de Curva** (`weierstrass`)
   - Validación de parámetros
   - Verificación del discriminante
   - Comprobación de punto generador

2. **ECDSA** (Elliptic Curve Digital Signature Algorithm)
   - Firma determinística (RFC 6979)
   - Low-S signatures (anti-malleabilidad)
   - Formato compact (64 bytes)

3. **Aritmética de Puntos**
   - Suma de puntos (fórmula completa Renes-Costello-Batina)
   - Duplicación de puntos
   - Multiplicación escalar (windowed NAF)

### Operaciones de Campo

```javascript
// Aritmética modular sobre Fp
mod(a, p)           // Módulo seguro
modInv(a, p)        // Inverso modular (Euclides extendido)
modSqrt(a, p)       // Raíz cuadrada modular (Tonelli-Shanks)
```

---

## 🎨 Ejemplos de Salida

### Generación de Curva

```
🦜 === CAPICRYPTO: CURVA ELÍPTICA CAPICÚA === 🦜

📊 Parámetros de la curva:
  p (primo): ffffffffffffffffff...
  n (orden): ffffffffffffffffff...
  a (capicúa): 12345678987654321
  b (capicúa): 98765432123456789

🔑 Clave privada: 0x3229e487e73ab207...
📍 Clave pública: 03239a11504a21f344...
📍 Punto público X: 239a11504a21f344...
📍 Punto público Y: b93c6d9ef184b2a9...

✅ Punto G en curva: SÍ
✅ Punto público en curva: SÍ
```

### Firma ECDSA

```
🔐 === FIRMA Y VERIFICACIÓN === 🔐

📝 Mensaje: Hola Fernando, esta es tu curva capicúa 🦜

✍️  Firmando mensaje...
✅ Firma generada!
📋 Firma (64 bytes): 7e600a3c268e2d77...

🔢 Componentes:
   r: 7e600a3c268e2d77...
   s: 07a30f836058e17b...

🔍 Verificando firma...
✓ Verificación: ✅ VÁLIDA

🧪 Probando mensaje alterado...
✓ Verificación: ❌ INVÁLIDA (esperado)
```

---

## 🚧 Roadmap

### Versión Actual: 1.0.0 (Educativa)

- [x] Curva con parámetros capicúa pequeños
- [x] Generación de claves
- [x] Firma y verificación ECDSA
- [x] Documentación completa

### Futuro: 2.0.0 (Seguridad Real)

- [ ] Implementar algoritmo de Schoof en Rust/WASM
- [ ] Calcular orden para curva de 256 bits
- [ ] Benchmarks de rendimiento
- [ ] Suite de tests con vectores conocidos

### Ideas Adicionales

- [ ] Interfaz web interactiva
- [ ] Visualización de la curva elíptica
- [ ] Comparación con curvas estándar (secp256k1, P-256)
- [ ] Generar más curvas capicúa con distintos tamaños

---

## 🧪 Testing

```bash
# Probar generación de curva
npm start

# Probar firmas
npm run sign

# Intentar calcular orden (advertencia: tarda)
npm run find-order
```

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Especialmente:

1. **Implementación de Schoof's Algorithm** en JavaScript/WASM
2. Mejoras en el cálculo del orden
3. Más ejemplos educativos
4. Documentación adicional

---

## 📚 Recursos Educativos

### Curvas Elípticas

- [A (Relatively Easy To Understand) Primer on Elliptic Curve Cryptography](https://blog.cloudflare.com/a-relatively-easy-to-understand-primer-on-elliptic-curve-cryptography/)
- [Elliptic Curve Cryptography: a gentle introduction](https://andrea.corbellini.name/2015/05/17/elliptic-curve-cryptography-a-gentle-introduction/)
- [Understanding Elliptic Curve Cryptography and Embedded Security](https://www.allaboutcircuits.com/technical-articles/elliptic-curve-cryptography-in-embedded-systems/)

### Algoritmo de Schoof

- [Wikipedia: Schoof's algorithm](https://en.wikipedia.org/wiki/Schoof%27s_algorithm)
- [Counting Points on Elliptic Curves](https://www.math.auckland.ac.nz/~sgal018/crypto-book/ch22.pdf)
- [The Schoof-Elkies-Atkin algorithm](https://crypto.stanford.edu/pbc/notes/elliptic/sea.html)

### @noble/curves

- [GitHub: paulmillr/noble-curves](https://github.com/paulmillr/noble-curves)
- [Documentation](https://paulmillr.com/noble/)

---

## ⚖️ Licencia

MIT License - Ver [LICENSE](LICENSE) para más detalles.

---

## 🦜 ¿Por qué Capicúas?

Los números capicúa (o palíndromos numéricos) son fascinantes:

- **121** es capicúa
- **1221** es capicúa
- **12321** es capicúa
- **123454321** es capicúa

En criptografía, usualmente usamos números primos grandes y "aleatorios". Pero, ¿qué pasaría si usáramos números con estructura? ¡Este proyecto explora esa idea!

**Disclaimer**: Esto es un proyecto **educativo**. No uses esta curva para aplicaciones de seguridad real. Para eso, usa curvas estándar auditadas como:
- `secp256k1` (Bitcoin)
- `P-256` / `prime256v1` (NIST)
- `ed25519` (EdDSA)

---

## 👨‍💻 Autor

**Fernando** - Explorador de curvas elípticas y amante de los capicúas 🦜

---

## 🎉 Agradecimientos

- **@noble/curves** por la excelente librería de curvas elípticas
- La comunidad de criptografía por hacer accesible este conocimiento
- Los loros, por inspirar el nombre 🦜

---



**¿Te gustó CapiCrypto?** ⭐ Dale una estrella al repo!

🦜 **Como un loro repite, los capicúas reflejan** 🦜

Creador cainuriel - Fernando lópez lópez.
