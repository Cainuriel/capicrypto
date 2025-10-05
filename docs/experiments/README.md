# 🧪 Experimentos CapiCrypto

Esta carpeta contiene scripts experimentales para explorar diferentes aspectos matemáticos de los números capicúa y su relación con la criptografía.

## 📂 Contenido

### `iterate-to-palindrome.js`

**Experimento**: Proceso iterativo de suma con reversos para generar capicúas.

**Concepto**:
```
45 + 54 = 99           ← capicúa en 1 iteración
89 + 98 = 187
187 + 781 = 968
...
→ 1716517              ← capicúa en varias iteraciones
```

**Pregunta**: ¿Este método genera más primos capicúa que el método directo?

**Ejecutar**:
```bash
node docs/experiments/iterate-to-palindrome.js
```

**Experimentos incluidos**:
1. 🎯 **Casos específicos**: Analiza semillas conocidas (45, 89, 125, 196...)
2. 📊 **Búsqueda masiva**: Prueba 1000 semillas y calcula estadísticas
3. 🔄 **Comparación de métodos**: Directo vs Iterativo
4. ⚠️ **Números de Lychrel**: Semillas que no convergen a capicúa

**Resultados esperados**:
- Tasa de convergencia a capicúa: ~98%
- Tasa de primos entre capicúas: < 5% (según Banks 2004)
- Conclusión: El método iterativo NO mejora la probabilidad de encontrar primos

---

## 🎓 Propósito Educativo

Estos experimentos sirven para:
- ✅ Explorar propiedades matemáticas de capicúas
- ✅ Validar teorías (como el paper de Banks)
- ✅ Comparar diferentes métodos de generación
- ✅ Aprender sobre números de Lychrel
- ❌ NO para uso criptográfico en producción

---

## 🦜 Contribuciones

¿Tienes ideas para más experimentos? ¡Añádelos aquí!

Sugerencias:
- Análisis de distribución de primos capicúa por tamaño
- Búsqueda de patrones en factorización de capicúas compuestos
- Comparación con secuencias conocidas (Fibonacci palindrómico, etc.)
- Visualización gráfica de convergencia iterativa

---

## 📚 Referencias

- **Banks (2004)**: "Almost All Palindromes Are Composite"
- **Conjetura de Lychrel**: [Wikipedia](https://en.wikipedia.org/wiki/Lychrel_number)
- **Proceso 196**: [MathWorld](https://mathworld.wolfram.com/196-Algorithm.html)
