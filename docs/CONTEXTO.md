# Curva Criptográfica Capicúa - Documentación

## 📋 Descripción General

Este proyecto implementa una **curva elíptica personalizada** usando números capicúa (palíndromos) como parámetros. Es un experimento educativo que combina:
- Criptografía de curva elíptica (ECC)
- Números capicúa para los parámetros de la curva
- Integración con Ethereum (ethers.js)

## 🔢 Matemáticas de la Curva

### Ecuación de la Curva Elíptica
La curva sigue la ecuación de Weierstrass:
```
y² ≡ x³ + ax + b (mod p)
```

### Parámetros Capicúa
- **p** (primo): `2^256 - 189` - Primo grande para seguridad
- **a**: `12345678987654321` (capicúa) mod p
- **b**: `98765432123456789` (capicúa) mod p
- **G** (generador): `[2, 37]` - Punto base arbitrario

## 🔐 Operaciones Implementadas

### 1. Aritmética Modular
- `mod(n, m)`: Módulo que maneja negativos correctamente
- `inverseMod(a, m)`: Inverso multiplicativo usando algoritmo extendido de Euclides

### 2. Operaciones de Puntos
- `pointAdd(P, Q)`: Suma de dos puntos en la curva
  - Maneja punto en infinito (identidad)
  - Calcula pendiente para puntos distintos o iguales
  - Usa duplicación de punto cuando P = Q

- `scalarMult(k, G)`: Multiplicación escalar (método binario)
  - Multiplica un punto por un escalar eficientemente
  - Implementación "double-and-add"

### 3. Generación de Claves
- **Clave privada**: Número aleatorio generado por ethers.js
- **Clave pública**: Punto en la curva = privKey × G
- **Dirección Ethereum**: Derivada de la clave privada estándar

## 🧩 Estructura del Proyecto

```
curva-capicua/
├── package.json          # Dependencias (ethers.js)
├── index.js             # Implementación de la curva + generación de claves
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
