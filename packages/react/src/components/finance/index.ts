// Finanzas de dirección: componentes presentacionales (sin router, i18n ni servicios de la app).
// Datos: tipos del paquete (estructuralmente iguales a los de la app). Texto: prop `labels` (parcial sobre español).

export * from "./types";

// Formato y utilidades de presentación
export { setFinanceLocale, getFinanceLocale, formatCents, parseEurosToCents } from "./format";
export type { EurosInputError } from "./format";
export {
  formatBp,
  formatMonthsNumber,
  formatCentsCompact,
  formatCentsThousands,
  formatCentsRound,
  formatMonthShort,
  capFirst,
  formatMonthLong,
  formatDayShort,
  formatMetricValue,
  formatMonthAxis,
  formatMonthName,
  formatDeltaPct,
  formatPctPoints,
  formatCentsSigned,
  formatAccounting,
  formatOneDecimal,
  formatPeriodAxis,
  formatArrShort,
  milestoneLabel,
  formatSignedPlain,
} from "./format";
export * from "./ui";

// Lógica de presentación (series, filas, árboles) con la que se alimentan los componentes
export * from "./chart-data";
export * from "./cash-chart";
export * from "./statement-columns";
export * from "./forecast-view";
export * from "./receivables";
export * from "./finance-data";
export * from "./freshness";
export * from "./form-inputs";
export * from "./plan-vs-actual";

// Piezas de gráfica
export { ChartFrame, LegendRow, TooltipBox, EndLabel, todayLine } from "./chart-kit";
export type { LegendItem, TooltipRow } from "./chart-kit";
export { barShape } from "./bar-shape";

// Componentes
export { InfoTip } from "./info-tip";
export { KpiTile, KpiStrip, KpiStripSkeleton, DEFAULT_KPI_TILE_LABELS } from "./kpi-tile";
export type { KpiTileProps, KpiTileLabels, FinanceRenderLink } from "./kpi-tile";
export { FinanceStat, FinanceStatStrip, statKeys } from "./finance-stat";
export type { FinanceStatProps } from "./finance-stat";
export { FreshnessLine, DEFAULT_FRESHNESS_LINE_LABELS } from "./freshness-line";
export type { FreshnessLineLabels } from "./freshness-line";
export { AgingFigures, DEFAULT_AGING_FIGURES_LABELS } from "./aging-figures";
export type { AgingFiguresProps, AgingFiguresLabels } from "./aging-figures";
export { MilestoneProgress, DEFAULT_MILESTONE_PROGRESS_LABELS } from "./milestone-progress";
export type { MilestoneProgressLabels, MilestoneProgressValue } from "./milestone-progress";
export { ForecastTable, DEFAULT_FORECAST_TABLE_LABELS } from "./forecast-table";
export type { ForecastTableLabels } from "./forecast-table";
export { SyncButton, DEFAULT_SYNC_BUTTON_LABELS } from "./sync-button";
export type { SyncButtonLabels } from "./sync-button";
export { CushionEditor, DEFAULT_CUSHION_EDITOR_LABELS } from "./cushion-editor";
export type { CushionEditorLabels } from "./cushion-editor";
export { PlanVsActualTable, DEFAULT_PLAN_VS_ACTUAL_TABLE_LABELS } from "./plan-vs-actual-table";
export type { PlanVsActualTableLabels } from "./plan-vs-actual-table";
export { VatAccountCard, DEFAULT_VAT_ACCOUNT_CARD_LABELS } from "./vat-account-card";
export type { VatAccountCardProps, VatAccountCardLabels } from "./vat-account-card";
export { ScenarioCards, DEFAULT_SCENARIO_CARDS_LABELS } from "./scenario-cards";
export type { ScenarioCardsLabels } from "./scenario-cards";
export { PairedBarsChart, DEFAULT_PAIRED_BARS_CHART_LABELS } from "./paired-bars-chart";
export type { PairedBarsChartLabels } from "./paired-bars-chart";
export { MrrBridgeChart, DEFAULT_MRR_BRIDGE_CHART_LABELS } from "./mrr-bridge-chart";
export type { MrrBridgeChartLabels } from "./mrr-bridge-chart";
export { ArrTrajectoryChart, DEFAULT_ARR_TRAJECTORY_CHART_LABELS } from "./arr-trajectory-chart";
export type { ArrTrajectoryChartLabels } from "./arr-trajectory-chart";
export { CashFlowChart, DEFAULT_CASH_FLOW_CHART_LABELS } from "./cash-flow-chart";
export type { CashFlowChartLabels } from "./cash-flow-chart";
export { CashOverviewChart, DEFAULT_CASH_OVERVIEW_CHART_LABELS, CASH_SCENARIOS_STORAGE_KEY } from "./cash-overview-chart";
export type { CashOverviewChartLabels } from "./cash-overview-chart";
export { StatementTable, DEFAULT_STATEMENT_TABLE_LABELS } from "./statement-table";
export type { StatementTableLabels, StatementMode, StatementView } from "./statement-table";
export { CashFlowTable, DEFAULT_CASH_FLOW_TABLE_LABELS } from "./cash-flow-table";
export type { CashFlowTableLabels } from "./cash-flow-table";
export { ReceivablesPanel, DEFAULT_RECEIVABLES_PANEL_LABELS, holdedDocumentUrl } from "./receivables-panel";
export type { ReceivablesPanelLabels } from "./receivables-panel";
export { FixedCosts, DEFAULT_FIXED_COSTS_LABELS, DEFAULT_COST_CATEGORY_LABELS, DEFAULT_FREQUENCY_LABELS } from "./fixed-costs";
export type { FixedCostsLabels } from "./fixed-costs";
export { AlertsTable, DEFAULT_ALERTS_TABLE_LABELS } from "./alerts-table";
export type { AlertsTableLabels } from "./alerts-table";
export { ForecastDrivers, DEFAULT_FORECAST_DRIVERS_LABELS } from "./forecast-drivers";
export type { ForecastDriversLabels } from "./forecast-drivers";
export { CashPeriodDetail, DEFAULT_CASH_PERIOD_DETAIL_LABELS } from "./cash-period-detail";
export type { CashPeriodDetailLabels } from "./cash-period-detail";
export { RecurringCostDialog, DEFAULT_RECURRING_COST_DIALOG_LABELS } from "./recurring-cost-dialog";
export type { RecurringCostDialogLabels } from "./recurring-cost-dialog";
export { MilestonesDialog, DEFAULT_MILESTONES_DIALOG_LABELS } from "./milestones-dialog";
export type { MilestonesDialogLabels } from "./milestones-dialog";
