# @autonexhub/react

## 11.2.0

### Minor Changes

- Quality (RAP) components, `molecules/quality`: `GateBadge` (open / closed / not measured, `lowConfidence` marker, optional `label`), `GateRow` (gate with description and quoted evidence; "Ir al momento" shows m:ss or "turno N" and calls `onSeek(quote)`), `RapVerdictBadge` (`pass` Aprobada, `fail` No aprobada, `indeterminate` Indeterminada, `no_basis` Sin base), `SeverityBadge` (Crítica/Alta/Media/Baja/Limpia with a colour dot), `DimensionBars` + `RAP_DIMENSIONS` (VE Veracidad 32, PR Proceso 30, CO Conducción 22, TE Técnica 16; `null` = "Sin evaluar", tone below `threshold`), `FindingCard` (pattern, severity, dimension, confidence, penalty, quote and reason, "Ir al momento", Confirmado/Rechazado chip, `actions` slot, `active`), `TranscriptEvidence` (forwardRef `scrollToTurn`, highlighted turn scrolled into view, evidence markers, timestamps call `onSeek(seconds, turn)`), `ToolCallTimeline` (seek, duration, error, collapsible input/output JSON) and `Sparkline` (inline SVG, nulls break the line, optional fill). Helpers `formatOffset`, `momentLabel`, `sparklineSegments`. Spanish defaults, overridable by props.
- Stories under 2-Molecules/Quality and vitest tests.

### Patch Changes

- @autonexhub/tokens@11.2.0

## 11.1.0

### Minor Changes

- FilterBar (moved up from the Marta panel): search, per-field filters, date filter, Group by, Sort, Columns and "More filters". Applied filters show as pills below the bar (with ✕ and "Clear all"); clicking a pill reopens that filter for editing, also inside "More filters" (like Linear); buttons keep a reserved counter slot and a fixed order, so they don't shift when toggling; every menu is built from the system `Command` items, with search only above 7 options; the custom date range uses the system `DatePicker` (no native date inputs). Texts by `labels` (Spanish defaults, `defaultFilterBarLabels`), `extraChips` for app-specific filters, `disabled`, `inlineLimit`, `hideSearch`. Helpers `resolveDateRange` (local dates, Monday-first weeks), `applyLocalFilters`, `groupItems` and `FILTER_NULL`. Types `FilterBarState`, `FilterField`, `FilterBarOption`, `FilterValue`, `FilterDateRange`, `FilterDatePreset`, `SortOption`, `GroupByOption`, `FilterBarExtraChip`, `FilterBarLabels`.
- PropSelect + PropOption: clickable property chip that opens a system `Command` menu (groups, "None …", check, person avatar / colour dot / icon / hint per option, footer `actions`, search above 7 options); read-only without `onChange`.
- TagChip: clickable tag with a colour dot (empty, suffix, removable, disabled).
- PersonAvatar: `avatarUrl`/`avatar_url` photo or initials, unassigned placeholder, sizes `xs` (20px) and `sm` (24px).
- KanbanBoard: subtle 24px edge fade while scrolling horizontally (mask, only on the side with more content). On by default; `fadeEdges={false}` turns it off, `fadeWidth` changes it. New `KanbanBoardProps` type.
- ActiveFilters: optional `onSelect` / `isSelectable` / `editLabel` so a pill's text reopens its filter; the ✕ still removes it.
- InfoTip: dedicated story (2-Molecules/InfoTip).
- Also first published here: the ChannelBadge icon-only change listed under 11.0.0 (Phosphor icon in the channel colour, 16/18px) was committed after the 11.0.0 publish.
- Tests: vitest + happy-dom setup for the package (`pnpm test`).

### Patch Changes

- @autonexhub/tokens@11.1.0

## 11.0.0

### Minor Changes

- ChannelBadge: add the `facebook` channel (Messenger) — gray badge with a `bg-chart-4` dot and the "Facebook" label, same style as the other channels. `ChannelType` now includes `'facebook'`.
- ChannelBadge: icon-only (`showLabel={false}`) now shows the channel's Phosphor icon in the channel color (Phone, Globe, WhatsappLogo, InstagramLogo, FacebookLogo, PencilSimple) instead of the colored dot, with the label as tooltip and aria-label.

### Patch Changes

- @autonexhub/tokens@11.0.0

## 10.0.0

### Minor Changes

- Add Kanban (KanbanBoard, KanbanColumn, KanbanColumnTitle, KanbanEmpty, KanbanCard, KanbanCardSection) — the one board recipe used by Negocios, Tareas, Candidatos and Incidencias — and Plane-style priority (PriorityIcon, PrioritySelect, PRIORITY_ORDER, PRIORITY_META, priorityKey, priorityRank) for Marta's Incidencias.

### Patch Changes

- @autonexhub/tokens@10.0.0

## 9.0.0

### Minor Changes

- Remove the Linear-only pieces (the internal Linear task module was retired; tasks live in Plane):
  LinearFilterBar, MarkdownContent/MarkdownView, MicroConfetti/BigCelebration, LinearIssuesSkeleton, LinearKanbanSkeleton, BacklogPageSkeleton, their stories, and the canvas-confetti dependency. Docs/comments no longer mention the Linear context.
  Storybook deploy: ship an .htaccess so index.html, iframe.html and index.json are always revalidated (no stale "Couldn't find story" after a release).

### Patch Changes

- Updated dependencies
  - @autonexhub/tokens@9.0.0

## 8.0.0

### Minor Changes

- Move the remaining portable app UI into the package with stories, and give every component part a story:
  - ColumnsButton, WhatsAppIcon, MicroConfetti/BigCelebration, Drive (FileCard, FileContextMenu, GridView), LinearFilterBar, MarkdownContent/MarkdownView.
  - Services and pricing: FamilySelect, ServicePriceEditor, ServicePriceIssues, ServiceReviewBadges, ServicePriceMatrix, FamilyServiceMatrix (+ pricing helpers).
  - Billing: MoneyCell, BillingStatusBadge, MandateStatus, InvoiceBreakdown, InvoiceTimeline. Margins: MarginStatusBadge, MarginFilters, CostBreakdownPanel, MarginTable, MarginsSummaryCards, MarginCharts.
  - New stories for AutonexIsotipo, FinanceChartKit, FinanceStat, SidebarBookmarksDialog, LocationFilterSection and the small parts of Bubble, Alert, Item, Popover, Table, Sidebar, Dialog and Sheet.
    New dependency: canvas-confetti. All translatable components take `labels` props (Spanish defaults).

### Patch Changes

- Updated dependencies
  - @autonexhub/tokens@8.0.0

## 7.0.0

### Minor Changes

- Move the remaining app UI into the package, each with stories (single source of truth for the Storybook):
  - Finanzas: KpiTile/KpiStrip, FinanceStat, ForecastTable, ForecastDrivers, StatementTable, CashFlowTable, PlanVsActualTable, ReceivablesPanel, FixedCosts, AlertsTable, CashPeriodDetail, ScenarioCards, VatAccountCard, SyncButton, CushionEditor, Milestone/RecurringCost dialogs, and the cash/ARR/MRR/paired-bar charts + chart kit.
  - Charts: AreaChart, BarChart, TopicsBubbleChart, DailyStatsChart, VoiceHourly, LanguageDistribution, ConversionFunnel, EmailTiming, ChannelStackedHourly, ConversationOutcome.
  - ImageCropModal, AutonexScore, EditableNameTable, 17 page skeletons, PanelTooltipShell/PanelTooltipRow.
  - Stories for Atoms, Molecules and Organisms consolidated (Spanish text), plus page templates.
    All translatable components take `labels` props with Spanish defaults.

### Patch Changes

- Updated dependencies
  - @autonexhub/tokens@7.0.0

## 6.0.0

### Minor Changes

- 596ddf6: Add presentational navigation and assistant components, each with stories:
  AppShell, RealmRail, SidebarShell/SidebarNavItem/SidebarBookmarks (+ sidebar styles), UserMenu, WorkspaceSwitcher, ContextDropdown, AutonexIsotipo;
  AssistantSidePanel, AssistantChat, AssistantChatsPanel, AssistantComposer, AssistantMessage, AssistantThread, AssistantThinking (+ useReducedMotion, useWordReveal).
  Links go through a `renderLink` prop; text through `labels` props (Spanish defaults).

### Patch Changes

- Updated dependencies [596ddf6]
  - @autonexhub/tokens@6.0.0

## 5.0.0

### Minor Changes

- 0dd2e43: Move generic marta-backend components into the package, each with stories:
  SectionHeader, StatusDot, StatCard/StatCardGrid, OrganizationAvatar, DocumentAttachmentCard, PanelChartTooltip, LocationFilter, LocationMultiSelect, ResponsiveList, WhatsAppPreview, ErrorBoundary, ThemeToggle, ImageViewerModal.
  Alert: `quiet-*` variants. FilterPopover: searchable list (`searchThreshold`, `searchPlaceholder`, `noResultsLabel`). SheetContent: `closeLabel`. Bubble `tinted` variant and QuotaCard hover updated.
  Components that had translations take `labels` props (Spanish defaults).

### Patch Changes

- Updated dependencies [0dd2e43]
  - @autonexhub/tokens@5.0.0

## 4.0.0

### Minor Changes

- 7e2e8cf: Add molecules moved from marta-backend: EmptyState/ChartEmptyState, ChannelBadge, ScoreBadge, SortableTableHead, ViewToggle, FilterPopover, ActiveFilters, DateRangeFilter, QuotaCard, ColumnManager (+ useColumnManager/useColumnOrder), and generic skeletons (TableSkeleton, TableRowSkeleton, AudioPlayerSkeleton, CardGridSkeleton, FormSkeleton, ListSkeleton). Texts for i18n-bound components (ActiveFilters, DateRangeFilter, QuotaCard) are passed via props with Spanish defaults. Adds @dnd-kit dependencies.

### Patch Changes

- Updated dependencies [7e2e8cf]
  - @autonexhub/tokens@4.0.0

## 3.0.0

### Major Changes

- cb29af6: Resizable: migrate to react-resizable-panels v4 (`Group`/`Panel`/`Separator`). Props change: `orientation` replaces `direction`, sizes accept numbers or strings like "30%", `onLayoutChanged` replaces `onLayout`.

### Patch Changes

- Updated dependencies [cb29af6]
  - @autonexhub/tokens@3.0.0

## 2.0.1

### Patch Changes

- Add missing exports: ComboboxOption, ComboboxTrigger, KbdGroup
  - @autonexhub/tokens@2.0.1

## 2.0.0

### Minor Changes

- 2213dc7: Add new UI components: Bubble, ButtonGroup, Calendar, Carousel, Chart, Combobox, Command, DatePicker, Field, InputGroup, InputOTP, Item, Kbd, Pagination, Resizable, RichTextEditor, Sidebar

  - Migrated 18 new components from marta-backend
  - Added comprehensive exports for Field (FieldGroup, FieldLegend, FieldSeparator, FieldSet, FieldContent, FieldTitle)
  - Added comprehensive exports for InputGroup (InputGroupAddon, InputGroupInput, InputGroupTextarea)
  - Added Storybook stories for Calendar, Item, Combobox, DatePicker

### Patch Changes

- Updated dependencies [2213dc7]
  - @autonexhub/tokens@2.0.0

## 1.1.0

### Minor Changes

- feat(sheet): add inline variant for non-modal floating panel

  - Added `inline` prop to SheetContent for non-modal side panels
  - Added `container` prop for custom portal mounting
  - Added `inlineSheetVariants` for floating card styling (rounded-xl, shadow-lg)
  - Added shell panel host integration (`[data-shell-panel-host]`)
  - Inline variant floats with 8px margin inside the host container
  - Default width 58% of host (min 560px, max 1100px)

## 1.0.0

### Minor Changes

- Initial release of Autonex UI component library

  - 40+ React components built on Radix UI primitives
  - Core: Button, Card, Dialog, Input, Label
  - Form: Checkbox, Form, RadioGroup, Select, Slider, Switch, Textarea, Toggle, ToggleGroup
  - Overlay: Accordion, AlertDialog, Avatar, Collapsible, ContextMenu, DropdownMenu, HoverCard, Menubar, NavigationMenu, Popover, Progress, ScrollArea, Separator, Tabs, Tooltip
  - Additional: Alert, AspectRatio, Badge, Breadcrumb, Drawer, Sheet, Skeleton, Sonner (toasts), Table
  - Utilities: cn() class merging, useIsMobile hook

### Patch Changes

- Updated dependencies
  - @autonexhub/tokens@0.1.0
