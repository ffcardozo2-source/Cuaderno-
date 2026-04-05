# ⚡ CELULAR APP — GUÍA DE SETUP

## Paso 1 — Crear proyecto en Supabase

1. Ir a https://supabase.com → New Project
2. Elegí nombre, contraseña y región (South America si está disponible)
3. Esperá ~2 minutos a que arranque

## Paso 2 — Crear la base de datos

1. En Supabase Dashboard → **SQL Editor**
2. Pegá todo el contenido de `schema.sql`
3. Click en **Run** ▶

## Paso 3 — Obtener tus credenciales

En Supabase → **Settings → API**:
- Copiá **Project URL** (algo como `https://xxxx.supabase.co`)
- Copiá **anon / public** key

## Paso 4 — Conectar la app

En `index.html`, líneas 3–4:

```js
const SUPABASE_URL = 'https://TU-PROYECTO.supabase.co';
const SUPABASE_KEY = 'eyJhbGci...TU_ANON_KEY';
```

## Paso 5 — Desplegar (opcional)

**Opción A — Local:** Abrí `index.html` en el navegador del celular (Chrome/Safari).

**Opción B — Netlify (gratis):**
1. Ir a https://netlify.com → Drag & drop la carpeta
2. Te da una URL pública que podés abrir desde cualquier celular

**Opción C — Vercel:**
1. `npm i -g vercel`
2. Dentro de la carpeta: `vercel --prod`

## Agregar a pantalla de inicio (PWA)

### Android (Chrome):
- Abrí la URL en Chrome
- Menú ⋮ → "Agregar a pantalla de inicio"

### iPhone (Safari):
- Abrí la URL en Safari
- Botón compartir → "Agregar a pantalla de inicio"

---

## Estructura de archivos

```
celular-app/
├── index.html     ← App completa (todo en un archivo)
└── schema.sql     ← SQL para crear las tablas en Supabase
```

## Funcionalidades implementadas

- ✅ Registro de Compras / Ventas / Gastos (1 toque)
- ✅ Cálculo automático de totales
- ✅ Control de stock (aumenta/baja automáticamente)
- ✅ Alertas de stock bajo / sin stock
- ✅ Historial agrupado por día con editar/eliminar
- ✅ Resumen Semanal / Mensual / Anual
- ✅ Ganancia y margen por producto
- ✅ Gastos fijos separados
- ✅ Costo promedio ponderado automático
- ✅ Autocompletado de productos
- ✅ Confirmación antes de eliminar
- ✅ Modo Demo (sin Supabase)
- ✅ Diseño mobile-first, uso con una mano
