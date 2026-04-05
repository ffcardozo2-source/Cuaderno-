-- ══════════════════════════════════════════════════
-- CELULAR APP — SCHEMA SUPABASE
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ══════════════════════════════════════════════════

-- 1. MOVIMIENTOS (compras, ventas, gastos operativos)
CREATE TABLE IF NOT EXISTS movimientos (
  id              BIGSERIAL PRIMARY KEY,
  tipo            TEXT NOT NULL CHECK (tipo IN ('compra', 'venta', 'gasto')),
  producto        TEXT NOT NULL,
  cantidad        NUMERIC(10,2) NOT NULL DEFAULT 1,
  precio_unitario NUMERIC(12,2) NOT NULL,
  precio_venta    NUMERIC(12,2) NOT NULL DEFAULT 0,
  total           NUMERIC(14,2) NOT NULL,
  fecha           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PRODUCTOS (inventario)
CREATE TABLE IF NOT EXISTS productos (
  id              BIGSERIAL PRIMARY KEY,
  nombre          TEXT NOT NULL UNIQUE,
  stock_actual    NUMERIC(10,2) NOT NULL DEFAULT 0,
  stock_minimo    NUMERIC(10,2) NOT NULL DEFAULT 1,
  costo_promedio  NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 3. GASTOS FIJOS (alquiler, servicios, etc.)
CREATE TABLE IF NOT EXISTS gastos_fijos (
  id          BIGSERIAL PRIMARY KEY,
  nombre      TEXT NOT NULL,
  monto       NUMERIC(12,2) NOT NULL,
  frecuencia  TEXT NOT NULL CHECK (frecuencia IN ('semanal', 'mensual', 'anual')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- INDICES
CREATE INDEX IF NOT EXISTS idx_movimientos_fecha   ON movimientos(fecha DESC);
CREATE INDEX IF NOT EXISTS idx_movimientos_tipo    ON movimientos(tipo);
CREATE INDEX IF NOT EXISTS idx_movimientos_producto ON movimientos(producto);

-- Funcion updated_at automatico
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER productos_updated_at
  BEFORE UPDATE ON productos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
