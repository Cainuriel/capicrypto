# 🔧 Herramientas de Desarrollo

Esta carpeta contiene scripts auxiliares utilizados durante el desarrollo de CapiCrypto.

## 📋 Scripts Disponibles

### `find-good-curve.js`
**Buscador de curvas capicúa óptimas**

Encuentra primos capicúa que generen curvas elípticas con orden primo.

```bash
node find-good-curve.js
```

**¿Qué hace?**
- Itera sobre lista de primos capicúa
- Calcula orden del grupo para cada uno
- Verifica si el orden es primo
- **Resultado**: Encontró p=383, n=353 (¡ambos primos!)

**Salida ejemplo:**
```
🦜 === BUSCADOR DE CURVAS CAPICÚA ÓPTIMAS === 🦜
Probando p = 383 (capicúa primo)
✅ ¡CURVA ÓPTIMA ENCONTRADA!
   p = 383 (primo capicúa)
   n = 353 (orden PRIMO)
```

---

### `calculate-order.js`
**Calculadora de orden para curvas de 256 bits**

Intenta calcular el orden de curvas elípticas grandes usando baby-step giant-step.

```bash
node calculate-order.js
```

**Limitaciones:**
- Para curvas de 256 bits se requiere algoritmo de Schoof
- JavaScript puro no es práctico para este cálculo
- Complejidad: O(log⁸ p) para Schoof
- Se requeriría Rust/C++ con MIRACL o Pari-GP

**Uso en el proyecto:**
Originalmente se intentó usar curvas de 256 bits, pero por las limitaciones de cálculo de orden, se optó por la curva educativa p=383.

---

### `find-point.js`
**Buscador de puntos válidos en la curva**

Encuentra puntos (x, y) que satisfacen la ecuación de la curva.

```bash
node find-point.js
```

**¿Qué hace?**
- Prueba valores de x secuencialmente
- Calcula y² = x³ + ax + b (mod p)
- Verifica si y² es residuo cuadrático
- Encuentra la raíz cuadrada modular

**Salida ejemplo:**
```
🔍 Buscando punto válido en la curva capicúa...
✅ Punto encontrado: (2, 133)
```

---

## 🎯 ¿Cuándo usar estos scripts?

- **Experimentar con otros parámetros capicúa**
- **Buscar nuevas curvas educativas**
- **Entender el proceso de creación de curvas custom**
- **Debug de problemas con puntos generadores**

## ⚠️ Nota

Estos scripts son herramientas de desarrollo, no forman parte del proyecto principal. El proyecto productivo usa los parámetros ya encontrados y verificados.

---

🦜 **CapiCrypto** - Como un loro que repite, los capicúas se reflejan
