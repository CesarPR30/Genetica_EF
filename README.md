# Genética · Examen Final

Sitio estático (sin build) para estudiar el Examen Final de Genética (semanas 9–14).

**Secciones**
- **Teoría**: los 6 temas de las clases (S9 genética y genómica · S10 predictiva y diagnóstica · S11 variabilidad y mapeo · S12 farmacogenética · S13 genotipos farmacogenéticos · S14 farmacoepigenética) con tablas, esquemas SVG y un quiz por tema.
- **Cómo resolver**: receta, trampas y ejemplo resuelto para cada tipo de cálculo, con botón "Otro ejemplo"; guía para casos y estrategia para preguntas de marcar.
- **Práctica**: 172 preguntas para marcar con explicación por opción; 11 generadores de casos con autograder; 20 casos de razonamiento con respuesta modelo y rúbrica.
- **Simulacro**: 14 preguntas + 3 casos (20 puntos), temporizador configurable (120 min por defecto), nota y desglose por tema.
- **Notas**: simulador EP 20 % · EC1 30 % · EC2 20 % · EF 30 %, meta configurable.

Funciona sin conexión (PWA) y guarda el progreso en `localStorage`.

## Publicar en GitHub Pages
Settings → Pages → Source: *Deploy from a branch* → Branch `main`, carpeta `/ (root)` → Save.

## Actualizar
Al cambiar archivos, sube la constante `VERSION` en `sw.js` (p. ej. `gef-v2`) para renovar el caché sin conexión.
