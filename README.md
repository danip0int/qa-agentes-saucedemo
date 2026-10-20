# QA con agentes de Playwright: práctica sobre SauceDemo

Proyecto de práctica para aprender automatización de pruebas (QA Automation) usando los agentes de IA que ofrece Playwright: planner, generator y healer. El objetivo es entender cómo se trabaja con agentes para agilizar tareas de QA, y sobre todo cómo **dirigirlos y revisar lo que producen**.

La aplicación bajo prueba fue [SauceDemo](https://www.saucedemo.com/), clásico sitio para hacer pruebas de testing.

## Qué hay en este proyecto

- Un **seed test** (`tests/seed.spec.ts`) que hace login y deja la aplicación en un estado usable para los agentes.
- Un **plan de pruebas** del flujo de checkout, generado por el planner y luego revisado y corregido por mí (`specs/checkout-plan.md`).
- **Tests automatizados** generados a partir de ese plan, en `tests/` y `tests/checkout/`.
- Las definiciones de los agentes, creadas con `npx playwright init-agents --loop=vscode`.

## Stack

- Playwright Test con TypeScript
- Agentes de Playwright (planner, generator, healer), usados desde el chat de VS Code con GitHub Copilot (plan gratuito)
- Git y GitHub

## Qué hice con cada agente

### Planner: armar el plan de pruebas

Le pedí un plan para el flujo de checkout (agregar producto, completar datos y finalizar la compra), con casos felices y negativos, partiendo del seed para no repetir el login.

Después **revisé los planes manualmente**: probé el sitio a mano para copiar los mensajes de error literales, reemplacé datos genéricos ("valid first name...") por datos concretos y verifiqué que los montos de impuestos y totales fueran correctos.

### Generator: convertir el plan en tests

Generé tres tests a partir del plan:

| Escenario | Archivo |
|---|---|
| 1.1 Compra con un producto | `tests/checkout.spec.ts` |
| 1.2 Compra con varios productos y totales | `tests/checkout/multiple-items-totals.spec.ts` |
| 1.3 Validación de campos obligatorios | `tests/checkout/required-fields-validation.spec.ts` |

Lo que aprendí y observé en el proceso:

- **El agente trabaja mejor con el plan dentro del pedido.** En el primer intento no recibió el contenido del plan e inventó datos y rutas; al pasarle el escenario completo respetó nombres, datos y estructura. Seguramente haya una manera de que lea los planes automáticamente, pero al estar haciendo pruebas de momento sólo me enfoqué en probar los agentes y las herramientas.
- **Los tests generados no incluyeron el login** y fallaron al correrlos. Lo corregí agregando los pasos del seed, y en los siguientes pedidos lo indiqué desde el principio.
- **Siempre hay que correr y leer el código**: comparé cada test contra el plan para detectar verificaciones faltantes.

### Healer: reparar tests que fallan

Hice dos ejercicios, rompiendo un test a propósito:

1. **Locator roto** (cambié el nombre de un botón). Con un pedido corto en el chat, el healer **reescribió el test completo** y dejó una sola aserción de las nueve originales. El test pasaba, pero ya casi no verificaba nada.
Esto fue terrible, el agente reescribió el test entero saltandose todas las expecificaciones que le di en el primer mensaje, básicamente hizo otra prueba. Descarté todos los cambios con `git restore`.
2. **Valor esperado incorrecto** (cambié el impuesto esperado). Esta vez le di reglas explícitas: no reescribir, no cambiar valores esperados y reportar si parecía un bug de la aplicación. No modificó nada, y lo verifiqué con `git diff`.

Conclusión: un healer puede ser útil, pero **un test en verde no significa que esté bien**. Hay que revisar el `diff` y decidir cuándo corresponde arreglar el test y cuándo reportar un bug.

## Cómo ejecutar los tests

```bash
npm install
npx playwright install chromium
npx playwright test
```

Para ver el reporte:

```bash
npx playwright show-report
```

## Mejoras hechas a mano

Después de generar los tests con los agentes, los revisé y mejoré:

- **Test 1.1 (compra con un producto):** agregué las verificaciones que el agente había salteado: botón "Remove", contador y cantidad del carrito, título del formulario, información de pago y envío, y contador vacío al final y reemplacé un locator que dependía del orden de la lista por uno específico de la mochila en este caso específico.
- **Login reutilizable:** un proyecto de *setup* hace el login una sola vez y guarda la sesión (`storageState`). Los tests de checkout la reutilizan en lugar de loguearse en cada uno. En pruebas locales, la suite pasó de 25 segundos a 14 segundos apróximadamente (en 3 mediciones, el tiempo varía dado los componentes limitantes de mi PC).
- **CI:** los tests corren automáticamente en GitHub Actions en cada push y pull request a `main`.

## Limitaciones conocidas y próximos pasos

- Los tests 1.2 y 1.3 todavía no tienen todas las verificaciones del plan (por ejemplo, la cantidad en el carrito) y el 1.2 usa `.first()` para agregar productos, lo que depende del orden de la lista.
- Las validaciones del escenario 1.3 están en un solo test; conviene separarlas en un test por regla.
- `seed.spec.ts` sigue haciendo su propio login, porque es el punto de partida de los agentes.
- Los escenarios 1.4 y 1.5 quedaron en el plan, sin automatizar.
