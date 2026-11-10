/**
 * Tipos de datos de Finanzas de dirección (contrato `/api/v1/finance`). Definidos en el paquete y
 * compatibles estructuralmente con los de la app: el dinero viaja en céntimos enteros con signo (`*_cents`),
 * los porcentajes en puntos básicos (`*_bp`) o fracción (`pct`) según el campo. Los componentes solo presentan.
 */

/** Método de cobro de un contacto (lo decide Cobros). */
export type FinanceBillingMethod = 'sepa' | 'transfer' | 'none';

export type AgingBucketKey = 'por_vencer' | '1_30' | '31_60' | '61_90' | '90_mas' | 'sin_vencimiento';
export type DocumentFlag = 'sin_vencimiento' | 'posible_cobro_sin_conciliar' | 'importe_de_prueba' | 'anulada';

export interface AgingBucket {
  key: AgingBucketKey;
  label: string;
  count: number;
  pending_cents: number;
}

export interface AgingDocument {
  holded_id: string;
  number: string;
  contact_name: string;
  date: string;
  due_date: string | null;
  total_cents: number;
  pending_cents: number;
  days_overdue: number | null;
  bucket: AgingBucketKey;
  payment_method: string | null;
  flags: DocumentFlag[];
  /** Si la API lo manda, el enlace exacto al documento en Holded. */
  holded_url?: string | null;
}

/** Pendiente agrupado por contacto (GET /cash v2): una fila por cliente o proveedor. */
export interface AgingContact {
  contact_id: string;
  contact_name: string;
  pending_cents: number;
  overdue_cents: number;
  oldest_number: string | null;
  oldest_date: string | null;
  max_days_overdue: number;
  count: number;
}

/** Método de cobro de Cobros por id de contacto de Holded (solo en `receivable`). */
export type MethodsByContact = Record<string, { method: FinanceBillingMethod; organization_id: number | null }>;

export interface FinanceAging {
  /** Pendiente según Holded (incluye anuladas y cobros ya hechos sin conciliar). */
  total_cents: number;
  /** Estimado real: `total_cents` menos anuladas y ya cobrado sin conciliar. */
  estimated_real_cents: number;
  cancelled_cents?: number;
  matched_unreconciled_cents?: number;
  /** Lo que vence en los próximos 30 días (por fecha de vencimiento). */
  expected_30d_cents?: number;
  dso_days: number | null;
  buckets: AgingBucket[];
  documents: AgingDocument[];
  by_contact?: AgingContact[];
  /** Objeto (puede llegar vacío `{}`); solo en cuentas a cobrar. */
  methods_by_contact?: MethodsByContact;
}

/** Movimientos de MRR de un mes (`kpis.mrr_movements`, 6 meses). Contracción y churn pueden llegar con signo. */
export interface MrrMovementMonth {
  month: string;
  /** MRR del mes anterior. */
  start_cents?: number;
  new_cents: number;
  expansion_cents: number;
  reactivation_cents?: number;
  contraction_cents: number;
  churn_cents: number;
  /** Sin facturar / atrasadas: cuotas tardías o ausentes. start + movimientos + timing = end. */
  timing_cents?: number;
  /** MRR del mes. */
  end_cents?: number;
  net_cents: number;
}

/** Las 9 categorías de `CostCategory` (backend/src/Modules/Finance/Domain/Model/CostCategory.php). */
export type CostCategory =
  | 'cogs_saas'
  | 'cogs_servicios'
  | 'comercial'
  | 'id'
  | 'general'
  | 'personal'
  | 'tributos'
  | 'financiero'
  | 'otros';

export const COST_CATEGORIES: CostCategory[] = [
  'personal',
  'cogs_saas',
  'cogs_servicios',
  'comercial',
  'id',
  'general',
  'tributos',
  'financiero',
  'otros',
];

export type RecurringFrequency = 'monthly' | 'quarterly' | 'yearly';
export const RECURRING_FREQUENCIES: RecurringFrequency[] = ['monthly', 'quarterly', 'yearly'];

/**
 * Gasto recurrente conocido (`RecurringCost` en snake_case). `amount_cents` = sin IVA por cada pago;
 * `vat_basis_points` = IVA soportado (2100 = 21 %, 0 en nóminas y SS). `months_of_year` solo para
 * trimestral/anual (1-12). Meses en AAAA-MM.
 */
export interface RecurringCost {
  id: number;
  name: string;
  category: CostCategory;
  amount_cents: number;
  vat_basis_points: number;
  frequency: RecurringFrequency;
  day_of_month: number;
  months_of_year: number[];
  start_month: string;
  end_month: string | null;
  active: boolean;
  notes: string;
  /** Si la API lo manda: equivalente mensual sin IVA (para no calcularlo aquí). */
  monthly_equivalent_cents?: number;
}

export type RecurringCostInput = Omit<RecurringCost, 'id' | 'monthly_equivalent_cents'>;

export interface FinanceSyncRun {
  started_at: string;
  finished_at: string | null;
  status: string;
  api_calls: number;
  error?: string | null;
}

/** Origen de un mes: Holded antiguo (AJE GAMAN), Holded nuevo o los dos. */
export type MonthSource = 'legacy' | 'holded' | 'mixed';

export interface RevenueByLine {
  recurring: number;
  services: number;
  usage: number;
  other?: number;
}

export type KpiUnit = 'eur' | 'pct' | 'months' | 'days' | 'ratio' | 'count';
/** Bloque de Métricas SaaS (spec v3 §4.6). `null` = no se pinta (Rule of 40). */
export type KpiGroupKey = 'growth' | 'retention' | 'unit' | 'cash';
export type IndicatorBand = 'good' | 'watch' | 'bad';

/** Un KPI de `/overview`, `/kpis` y `results.indicators`. `display` = texto seco ya formateado por la API. */
export interface FinanceKpi {
  key: string;
  label: string;
  value: number | null;
  unit: KpiUnit;
  display: string;
  spark: { month: string; value: number | null }[];
  band: IndicatorBand | null;
  definition: string | null;
  meaning?: string | null;
  formula: string | null;
  benchmark?: string | null;
  available: boolean;
  why_unavailable: string | null;
  /** YYYY-MM: si no está disponible por falta de base, primer mes con dato (el cliente localiza el texto). */
  first_data_month?: string | null;
  /** Clasificación aproximada (histórico del Holded antiguo). */
  approx: boolean;
  /** El mes de referencia no tiene todas las compras: la cifra está inflada. */
  costs_incomplete: boolean;
  // Campos propios de algunos KPIs
  month_cents?: number;
  cash_out_month?: string | null;
  not_applicable?: boolean;
  arr_cents?: number;
  prev_cents?: number;
  delta_mom?: number | null;
  contracted_cents?: number;
  contracted_label?: string;
  margin?: number | null;
  /** Salvedad seca («Sin nóminas ni costes fijos cargados»): marca pequeña + tooltip. */
  caveat?: string | null;
  /** Bloque de Métricas SaaS; `null` = fuera de la vista. Solo en `/kpis`. */
  group?: KpiGroupKey | null;
  /** Umbral escrito («objetivo ≥ 95 %», «umbral 30 días»). */
  threshold_label?: string | null;
  /** Pasos del cálculo para el tooltip: importe en céntimos o, en el churn de clientes, un recuento. */
  breakdown?: { label: string; cents?: number; count?: number }[];
  /** Detalle propio (clientes en riesgo: sus nombres). */
  detail?: string[] | null;
}

/** Fila de «Alertas»: tipo · descripción · importe · acción. */
export interface FinanceAlert {
  id: string;
  type?: string | null;
  severity: 'high' | 'medium' | 'low';
  title: string;
  description?: string | null;
  detail?: string | null;
  amount_cents: number | null;
  action?: { label: string; href: string; external?: boolean } | null;
}

export interface PnlMonth {
  month: string;
  revenue: RevenueByLine;
  /** Ingresos de la serie: incluye lo sin clasificar (la serie cuadra sola). */
  revenue_cents: number;
  /** Ingresos de la PyG (sin no clasificado): denominador de los «% sobre ingresos». */
  pnl_revenue_cents?: number;
  cost_to_serve_cents: number;
  opex_cents: number;
  overhead_cents?: number;
  costs_cents: number;
  ebitda_cents: number;
  result_cents: number;
  source: MonthSource;
  costs_incomplete: boolean;
}

/** Frescura de los datos (cabecera de Dirección): `as_of` y `last_sync_at` en «Y-m-d H:i». */
export interface FinanceFreshness {
  as_of: string;
  last_sync_at: string | null;
  last_closed_month: string;
  /** Primer mes con datos completos (null = todos). Las variaciones no comparan contra un mes anterior a este. */
  first_full_month?: string | null;
}

/** Fila de «Vs plan»: importes en céntimos (MRR, MRR nuevo) o unidades (centros). `actual` null = aún sin facturar. */
export interface PlanVsActualRow {
  key: 'mrr' | 'new_mrr' | 'customers' | string;
  label: string;
  plan_cents?: number | null;
  actual_cents?: number | null;
  delta_cents?: number | null;
  plan?: number;
  actual?: number | null;
  delta?: number | null;
}

/**
 * `overview.plan_vs_actual`: plan Cielo (escenario `upside`, 1 M€ de ARR en dic-27) frente al real. Solo puntúa el último mes cerrado (`scored`; desvíos null si
 * no); `current` es el mes en curso, informativo: plan del mes y MRR facturado a fecha, sin desvío.
 */
export interface PlanVsActual {
  month: string;
  /** Mes de arranque del plan: si `month` ≤ este, es el punto de partida (plan = real). */
  /** Escenario con el que se mide el plan (hoy siempre `upside`, Cielo). */
  scenario?: PlanScenarioKey;
  baseline_month?: string;
  scored?: boolean;
  rows: PlanVsActualRow[];
  current: { month: string; as_of: string; rows: PlanVsActualRow[] } | null;
  next_milestone: {
    month: string;
    arr_cents: number;
    distance_cents: number;
    required_new_mrr_cents?: number;
    /** ARR actual (MRR × 12) y avance sobre el hito en puntos básicos (0–10000). */
    arr_now_cents?: number;
    progress_bp?: number;
  } | null;
}

/** GET /overview (alias /home): KPI strip, caja real + forecast base, PyG 12m y alertas. */
export interface FinanceOverview {
  freshness: FinanceFreshness;
  as_of: string;
  reference_month: string;
  headline: string;
  kpis: FinanceKpi[];
  forecast_base: {
    cash_out_month: string | null;
    runway_months: number | null;
    break_even_month: string | null;
    below_cushion_month: string | null;
    costs_missing: boolean;
    sentences: string[];
  };
  cash: {
    balance_cents: number;
    as_of: string;
    cushion_cents: number;
    /** Caja disponible: saldo total menos lo apartado en la(s) cuenta(s) de IVA. Sin cuenta de IVA = `balance_cents`. */
    available_cents?: number;
    /** Cuenta(s) de IVA marcadas; null si no hay ninguna (o ya no existe en Holded). */
    vat?: FinanceVat | null;
    bank_accounts?: FinanceBankAccount[];
    actual: { date: string; balance_cents: number }[];
    forecast: { month: string; closing_cents: number }[];
    /** Cierre de 12 meses de cada escenario del plan (Infierno, Tierra, Cielo). */
    forecast_scenarios?: Partial<Record<PlanScenarioKey, { month: string; closing_cents: number }[]>>;
  };
  pnl_12m: PnlMonth[];
  /** `cents` = estimado real (Holded menos anuladas y ya cobrados sin conciliar). */
  receivable: {
    cents: number;
    overdue_cents: number;
    holded_cents?: number | null;
    cancelled_cents?: number;
    matched_unreconciled_cents?: number;
    dso_days: number | null;
    expected_30d_cents?: number;
  };
  plan_vs_actual?: PlanVsActual | null;
  alerts: FinanceAlert[];
  alerts_total: number;
}

/** Cuenta de IVA apartada (Tesorería y Resumen): lo que hay en ella frente al IVA del trimestre en curso. */
export interface FinanceVat {
  account_ids: string[];
  accounts: FinanceBankAccount[];
  reserved_cents: number;
  quarter_label: string;
  due_date: string | null;
  due_cents: number;
  shortfall_cents: number;
}

export interface FinanceBankAccount {
  id: string;
  name: string;
  balance_cents: number;
}

export type CashLineKind = 'invoice' | 'recurring_billing' | 'fixed_cost' | 'purchase' | 'vat' | 'other' | string;

export interface CashPeriodLine {
  kind: CashLineKind;
  /** Fila de la tabla de cash flow a la que va (collections_invoices, payments_fixed…). */
  type?: string;
  direction: 'in' | 'out';
  label: string;
  amount_cents: number;
  date: string | null;
  href: string | null;
  is_estimate?: boolean;
}

export interface CashPeriod {
  start: string;
  end: string;
  label: string;
  opening_cents?: number;
  in_cents: number;
  out_cents: number;
  net_cents?: number;
  closing_cents: number;
  below_cushion?: boolean;
  /** Cobros de facturas ya emitidas (pendientes de cobro). */
  in_pending_cents?: number;
  /** Importes del periodo por tipo de fila de la tabla (`vat`, `payments_fixed`…). */
  by_type?: Record<string, number>;
  /** Cobros previstos: cuotas recurrentes y servicios aún sin factura. */
  in_forecast_cents?: number;
  lines: CashPeriodLine[];
}

export interface CashTableRow {
  key: string;
  label: string;
  level: number;
  values: number[];
  children?: CashTableRow[];
}

export type TreasuryHorizon = 'months' | 'weeks';

/** GET /cash?horizon=weeks|months: cash flow directo, colchón y aging AR/AP. */
export interface FinanceTreasury {
  freshness: FinanceFreshness;
  horizon: TreasuryHorizon;
  scenario?: string;
  as_of?: string;
  opening_cents: number;
  cushion_cents: number;
  /** Caja disponible: saldo total menos lo apartado en la cuenta de IVA (= `opening_cents` sin cuenta marcada). */
  available_cents?: number;
  vat?: FinanceVat | null;
  bank_accounts?: FinanceBankAccount[];
  headline: string;
  breach: { period_start: string; balance_cents: number } | null;
  low_point?: { period_start: string; label: string; balance_cents: number; reason: string | null } | null;
  periods: CashPeriod[];
  table: { columns: { start: string; end: string; label: string }[]; rows: CashTableRow[] };
  /** Metodología (tooltip, nunca a la vista). */
  how: string[];
  actual?: { week_start: string; in_cents: number; out_cents: number }[];
  receivable: FinanceAging;
  payable: FinanceAging;
}

export interface MrrBridgeV2 {
  month?: string;
  start_cents: number;
  new_cents: number;
  new_count?: number;
  expansion_cents: number;
  reactivation_cents?: number;
  /** Negativo (o positivo: la UI usa el valor absoluto). */
  contraction_cents: number;
  churn_cents: number;
  churn_count?: number;
  /** Diferencia hasta cuadrar con la fila «Recurrente» del PyG (rectificativas, cruces de contacto). */
  adjustments_cents?: number;
  end_cents: number;
  approx: boolean;
}

export interface StatementColumn {
  key: string;
  label: string;
  /** `prev`: el mes anterior al pedido; `delta`: mes − mes anterior (el frontend la recalcula al comparar). */
  type: 'month' | 'quarter' | 'ytd' | 'prev' | 'delta' | 'period';
  from: string;
  to: string;
  source: MonthSource | null;
  /** Vistas por trimestre/año: el periodo no ha terminado y `span` dice qué meses lleva («oct», «ene–oct»). */
  partial?: boolean;
  span?: string | null;
}

/**
 * Fila plana del PyG de gestión; la jerarquía va en `parent`. `kind: cost` llega en positivo. Nivel 3:
 * cuenta contable de Holded (`key` «account:<n>», con prefijo `venta:`/`compra:` a veces; `label` = nombre
 * de la cuenta o el número si Holded no lo tiene; `account` = número).
 */
export interface StatementRow {
  key: string;
  label: string;
  level: number;
  kind: 'subtotal' | 'cost' | 'pct' | 'revenue' | string;
  parent: string | null;
  values: (number | null)[];
  account?: string;
}

/** GET /results?month=: PyG de gestión (12 meses + QTD + YTD), serie para el gráfico y puente de MRR. */
export interface FinanceResults {
  freshness: FinanceFreshness;
  month: string;
  months_available: string[];
  legacy_until: string | null;
  source: MonthSource | null;
  costs_incomplete: boolean;
  headline: string;
  statement: { columns: StatementColumn[]; rows: StatementRow[] };
  /** Cuenta de resultados por trimestre y por año (columnas `period`, `prev` comparable y `delta`). */
  statements?: Partial<Record<'quarter' | 'year', { period: 'quarter' | 'year'; columns: StatementColumn[]; rows: StatementRow[] }>>;
  series: PnlMonth[];
  mrr_bridge: MrrBridgeV2 | null;
  indicators: FinanceKpi[];
}

/** GET /kpis?month=. */
export interface FinanceKpis {
  freshness: FinanceFreshness;
  month: string;
  kpis: FinanceKpi[];
  /** Bloques en orden, con las claves de sus KPIs en orden. */
  groups?: { key: KpiGroupKey; label: string; kpis: string[] }[];
  /** Movimientos de MRR de 6 meses. */
  mrr_movements?: MrrMovementMonth[];
  /** Qué ha pasado en el mes, por cliente (importe con signo). */
  mrr_clients?: MrrClientMovement[];
}

export type MrrMovementKind = 'new' | 'expansion' | 'contraction' | 'churn' | 'reactivation' | 'unbilled';
/** Factura recurrente que explica un movimiento (mes del movimiento y el anterior). */
export interface MrrEvidence {
  month: string;
  number: string;
  date: string;
  cents: number;
  /** Id del documento en Holded: da el enlace a la factura. */
  holded_id?: string;
}
export interface MrrClientMovement {
  contact: string;
  kind: MrrMovementKind;
  cents: number;
  evidence?: MrrEvidence[];
}

export type PlanScenarioKey = 'base' | 'downside' | 'upside';
export const PLAN_SCENARIOS: PlanScenarioKey[] = ['downside', 'base', 'upside'];

export interface PlanHire {
  role: string;
  monthly_cents: number;
  start_month: string;
}

/** Drivers de un escenario (lo que se edita y se manda a simulate / PUT /plan/{scenario}). */
export interface PlanLevers {
  new_customers_per_month: number;
  arpa_new_cents: number;
  churn_pct: number;
  services_cents_per_month: number;
  usage_cents_per_month: number;
  cost_to_serve_pct: number;
  dso_days: number;
  hires: PlanHire[];
  // Embudo comercial (v3 §4.5). Tasas ACUMULADAS sobre discoveries (0.21 = 21 % de las discoveries llega a
  // demo), close ≤ proposal ≤ demo. null = escenario sin embudo (drivers antiguos); el servidor completa los
  // que falten con los del deck. Con embudo, new_customers_per_month y arpa_new_cents se derivan de él.
  discoveries_per_month?: number | null;
  demo_rate?: number | null;
  proposal_rate?: number | null;
  close_rate?: number | null;
  centers_per_close?: number | null;
  cents_per_center_month?: number | null;
}

/** Claves del embudo comercial (las que se editan en el grupo «Embudo comercial»). */
export const PLAN_FUNNEL_FIELDS = ['discoveries_per_month', 'demo_rate', 'proposal_rate', 'close_rate', 'centers_per_close', 'cents_per_center_month'] as const;

export type PlanScenario = PlanLevers & {
  key?: PlanScenarioKey;
  label?: string;
  origin?: 'saved' | 'history' | 'derived' | 'deck';
  new_mrr_cents_per_month?: number;
  /** Calculados por el servidor: discoveries × tasa (cierres = discoveries × close_rate). */
  closes_per_month?: number | null;
  demos_per_month?: number | null;
  proposals_per_month?: number | null;
};

/** Hito del plan (GET/PUT /plan/milestones): ARR objetivo a final de mes. */
export interface PlanMilestone {
  month: string;
  arr_cents: number;
  label?: string | null;
}

/** ARR real (recurrente facturada × 12) de un mes cerrado. */
export interface ActualArrPoint {
  month: string;
  arr_cents: number;
}

/** Una columna de «Escenarios lado a lado» (GET /plan → compare), a final del horizonte del plan. */
export interface PlanCompareRow {
  label?: string;
  month: string;
  discoveries_per_month: number | null;
  closes_per_month: number;
  customers_dec: number | null;
  mrr_dec_cents: number;
  arr_dec_cents: number;
  arr_target_pct: number | null;
  costs_monthly_cents: number;
  ebitda_dec_cents: number;
  cash_min_cents: number;
  cash_min_month: string;
  break_even_month: string | null;
  /** EBITDA ya ≥ 0 desde el primer mes del plan. */
  break_even_already?: boolean;
  /** Sin costes cargados: el break-even es n/d (no «fuera del horizonte»). */
  costs_missing?: boolean;
}

export interface FixedCostCategoryTotal {
  category: CostCategory;
  label: string;
  monthly_cents: number;
}

export interface PlanSuggestion {
  supplier: string;
  category: CostCategory;
  category_label?: string;
  avg_monthly_cents: number;
  months_seen: number;
  last_seen: string;
  already_added?: boolean;
}

export interface FinancePlan {
  freshness: FinanceFreshness;
  scenarios: Record<PlanScenarioKey, PlanScenario>;
  defaults_from_history: {
    months_used: number;
    from?: string;
    to?: string;
    base: Partial<PlanScenario>;
    opex_monthly_cents?: number;
    cogs_monthly_cents?: number;
    notes: string[];
  } | null;
  cushion_cents: number;
  contracted_mrr_cents?: number;
  fixed_costs: {
    monthly_total_cents: number;
    annual_total_cents?: number;
    items: RecurringCost[];
    by_category: FixedCostCategoryTotal[];
    using_history_fallback?: boolean;
    fallback_monthly_cents?: number;
    note?: string | null;
  };
  suggestions: PlanSuggestion[];
  /** Último mes del plan (AAAA-MM, «2027-12»): la simulación llega hasta aquí por defecto. */
  horizon_to?: string;
  milestones?: PlanMilestone[];
  /** ARR real de los 12 últimos meses cerrados. */
  actual_arr?: ActualArrPoint[];
  compare?: Partial<Record<PlanScenarioKey, PlanCompareRow>>;
}

export interface PlanSimulateInput {
  scenario?: PlanScenarioKey;
  overrides?: Partial<PlanLevers>;
  months?: number;
}

export interface PlanMonth {
  month: string;
  mrr_cents: number;
  arr_cents?: number;
  revenue_cents: number;
  cost_to_serve_cents?: number;
  opex_cents?: number;
  costs_cents: number;
  ebitda_cents: number;
  net_cents: number;
  cash_in_cents?: number;
  cash_out_cents?: number;
  closing_cents: number;
}

export interface PlanSimulation {
  scenario: PlanScenarioKey;
  drivers?: PlanScenario;
  opening_cents?: number;
  current_month_closing_cents?: number;
  cushion_cents?: number;
  months: PlanMonth[];
  answers: {
    cash_out: { month: string; last_month_positive?: string | null } | null;
    runs_out?: { month: string } | null;
    runway_months: number | null;
    below_cushion: { month: string } | null;
    break_even: { month: string; already?: boolean } | null;
    mrr_in_12_cents: number | null;
    arr_in_12_cents?: number | null;
    sentences: string[];
  };
  costs_missing?: boolean;
  others: Partial<Record<PlanScenarioKey, { month: string; closing_cents: number; mrr_cents?: number; arr_cents?: number }[]>>;
}

export interface FinanceSettings {
  cushion_cents?: number;
  /** Ids de cuenta bancaria de Holded que guardan el IVA (hasta 10). */
  vat_account_ids?: string[];
}
