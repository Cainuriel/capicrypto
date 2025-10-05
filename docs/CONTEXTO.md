# CapiCrypto - Documentación para IAs

## 📋 Descripción General del Proyecto

**CapiCrypto** es una implementación educativa de **curvas elípticas criptográficas** donde los parámetros son **números capicúa** (palíndromos). 

### Concepto Principal: La Propiedad Multiplicadora

El proyecto se basa en la propiedad matemática de que **algunos números capicúa generan nuevos capicúa al multiplicarse**:

```javascript
// Base capicúa
11 × 11 = 121           // ¡capicúa²!
111 × 111 = 12321       // ¡capicúa²!
1111 × 1111 = 1234321   // ¡patrón continúa!

// Aplicado en CapiCrypto
base_a = 11n;
a = base_a * base_a;    // 121 (capicúa²)
```

Este concepto hace que los parámetros sean:
1. Capicúa por sí mismos
2. Resultado de multiplicar capicúas (cuadrados perfectos)
3. Matemáticamente elegantes para enseñanza

## 🔢 Parámetros de la Curva Actual (p=383)

### Ecuación de Weierstrass
```
y² ≡ x³ + ax + b (mod p)
```

### Parámetros Capicúa Encontrados
```javascript
p = 383              // ← primo capicúa (verificado)
n = 353              // ← orden del grupo (primo)
a = 121              // ← 11² (capicúa²)
b = 11               // ← capicúa
G = (2, 133)         // ← punto generador
```

**Propiedades verificadas:**
- ✅ p es primo Y capicúa
- ✅ n es primo (orden del grupo)
- ✅ Discriminante Δ ≠ 0
- ✅ Teorema de Hasse satisfecho
- ✅ G genera todo el grupo

## 🏠 Formato de Dirección CapiCrypto

Las claves públicas se representan con formato propio (NO Ethereum):

```
CAPI:239A11504A21F344B93C6D9EF184B2A9:ABCD
 ↑    ↑                                ↑
 │    │                                └─ Checksum (4 hex)
 │    └─────────────────────────────────── Dirección (32 hex)
 └──────────────────────────────────────── Prefijo único
```

**¿Por qué no formato 0x... (Ethereum)?**
- Evita confusión (no es compatible con Ethereum real)
- Identidad propia del proyecto
- Propósito educativo claro
- Como un loro que tiene su propia voz 🦜

## 🔐 Funcionalidades Implementadas

## 🔐 Funcionalidades Implementadas

### 1. Generación de Curva (index.js)
```javascript
// Búsqueda automática de punto generador
// Cálculo de orden usando Teorema de Hasse
// Creación de curva con @noble/curves
// Generación de par de claves
// Formato de dirección CAPI:
```

### 2. Firma Digital ECDSA (sign.js)
```javascript
// Firma de mensajes con SHA-256
// Verificación de firmas
// Detección de mensajes alterados
// Detección de claves incorrectas
```

### 3. Generación Aleatoria (función exportada)
```javascript
import { generateRandomKeyPair } from './index.js';

const newKeys = generateRandomKeyPair();
// Retorna: { privateKey, publicKey, capiAddress, ... }
```

### 4. Interfaz Web (index.html)
- Generación de claves aleatorias
- Firma de mensajes
- Verificación de firmas
- Información técnica de la curva
- Diseño visual con tema capicúa

## 📚 Tecnologías Utilizadas

### @noble/curves v2.0.1
Librería criptográfica auditada que proporciona:
- `weierstrass()` - Crear curvas personalizadas
- `ecdsa()` - Firma digital
- Aritmética de puntos completa
- Operaciones de campo modulares

### @noble/hashes
- `sha256` para hash de mensajes
- Funciones criptográficas seguras

### Node.js (ESM)
- Módulos ES6
- Crypto para aleatoriedad
- Scripts npm para ejecución

## 🎯 Limitaciones y Alcance

### Propósito Educativo
- **Nivel de seguridad**: ~9 bits (solo demostración)
- **NO usar en producción**: Curva demasiado pequeña
- **Para aprender**: Conceptos de ECC, ECDSA, curvas custom

### Curvas de 256 bits
El proyecto originalmente intentó usar curvas de 256 bits pero:
- Calcular orden `n` requiere algoritmo de Schoof
- JavaScript puro no es adecuado (O(log⁸ p))
- Se optó por curva educativa p=383

### Archivos Legacy (docs/tools/ y docs/legacy/)
- `calculate-order.js` - Intento de calcular orden 256-bit
- `find-good-curve.js` - Buscador que encontró p=383
- `find-point.js` - Herramienta de búsqueda de puntos
- `index-old.js` - Versión antigua del proyecto
- `test.js` - Suite de tests obsoleta

## 🔄 Flujo de Ejecución

### npm start (index.js)
1. Buscar punto generador G en la curva
2. Calcular orden n usando Hasse
3. Crear curva con @noble/curves
4. Generar par de claves aleatorio
5. Derivar dirección CAPI:
6. Verificar que todo esté en la curva

### npm run sign (sign.js)
1. Importar curva de index.js
2. Generar nuevo par de claves
3. Firmar mensaje con ECDSA
4. Verificar firma original
5. Probar con mensaje alterado (debe fallar)
6. Probar con clave incorrecta (debe fallar)

### npm run web
1. Iniciar servidor HTTP en puerto 8080
2. Abrir navegador automáticamente
3. Simular operaciones criptográficas
4. Mostrar resultados con estilo visual

## 🦜 Filosofía del Proyecto

Como un loro que repite, los capicúas se leen igual al derecho y al revés:
- 121, 12321, 1234554321
- "Anita lava la tina"
- "¿Dábale arroz a la zorra el abad?"

El proyecto usa esta simetría natural para enseñar conceptos criptográficos complejos de forma memorable y visual.

---

**Autor**: Fernando López López (cainuriel)  
**Licencia**: MIT  
**Repositorio**: github.com/cainuriel/capicrypto
├── sign.js              # Firma y verificación de mensajes
├── test.js              # Suite de pruebas completa
└── CONTEXTO.md          # Este documento
```

## 🔬 Componentes

### `index.js`
- Define los parámetros de la curva capicúa
- Implementa operaciones de aritmética modular
- Implementa suma y multiplicación de puntos
- Genera par de claves (privada/pública)
- Exporta funciones y datos para otros módulos

### `sign.js`
- Importa el wallet de `index.js`
- Firma mensajes usando ECDSA estándar de Ethereum
- Verifica firmas y recupera direcciones
- Demuestra la integración con Ethereum

### `test.js` (nuevo)
- Pruebas de aritmética modular
- Pruebas de operaciones de puntos
- Pruebas de firma y verificación
- Validación de propiedades de la curva

## 🚀 Uso

### Instalación
```bash
npm install
```

### Ejecutar generación de claves
```bash
node index.js
```

### Ejecutar firma y verificación
```bash
node sign.js
```

### Ejecutar pruebas completas
```bash
node test.js
```

## ⚠️ Consideraciones de Seguridad

**IMPORTANTE**: Esta es una implementación educativa, NO usar en producción:

1. **Curva no estándar**: Los parámetros capicúa no han sido validados criptográficamente
2. **Generador arbitrario**: El punto G no ha sido verificado que tenga orden alto
3. **Sin auditoría**: El código no ha sido auditado por expertos en seguridad
4. **Propósito educativo**: Solo para aprendizaje y experimentación

## 🎯 Conceptos Demostrados

1. **Curvas Elípticas**: Implementación desde cero de operaciones ECC
2. **Aritmética Modular**: Inversión modular y operaciones en campos finitos
3. **Criptografía**: Generación de claves y firmas digitales
4. **JavaScript BigInt**: Uso de enteros de precisión arbitraria
5. **Integración Web3**: Conexión con ecosistema Ethereum

## 📚 Referencias

- [Elliptic Curve Cryptography (ECC)](https://en.wikipedia.org/wiki/Elliptic-curve_cryptography)
- [Weierstrass Form](https://en.wikipedia.org/wiki/Elliptic_curve#Elliptic_curves_over_finite_fields)
- [ECDSA Signature Algorithm](https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm)
- [ethers.js Documentation](https://docs.ethers.org/)

## 🎨 Características Únicas

- **Números Capicúa**: Los parámetros a y b son palíndromos, lo que hace la curva única y memorable
- **Educativo**: Código limpio y comentado para aprendizaje
- **Híbrido**: Combina curva personalizada con estándares de Ethereum
- **Visualizable**: Console logs con emojis para mejor comprensión

---

**Autor**: Fernando  
**Fecha**: Octubre 2025  
**Versión**: 1.0.0  
**Licencia**: ISC (Experimental/Educativo)
