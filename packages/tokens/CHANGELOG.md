# @autonexhub/tokens

## 9.0.0

### Minor Changes

- Remove the Linear-only pieces (the internal Linear task module was retired; tasks live in Plane):
  LinearFilterBar, MarkdownContent/MarkdownView, MicroConfetti/BigCelebration, LinearIssuesSkeleton, LinearKanbanSkeleton, BacklogPageSkeleton, their stories, and the canvas-confetti dependency. Docs/comments no longer mention the Linear context.
  Storybook deploy: ship an .htaccess so index.html, iframe.html and index.json are always revalidated (no stale "Couldn't find story" after a release).

## 8.0.0

### Minor Changes

- Move the remaining portable app UI into the package with stories, and give every component part a story:
  - ColumnsButton, WhatsAppIcon, MicroConfetti/BigCelebration, Drive (FileCard, FileContextMenu, GridView), LinearFilterBar, MarkdownContent/MarkdownView.
  - Services and pricing: FamilySelect, ServicePriceEditor, ServicePriceIssues, ServiceReviewBadges, ServicePriceMatrix, FamilyServiceMatrix (+ pricing helpers).
  - Billing: MoneyCell, BillingStatusBadge, MandateStatus, InvoiceBreakdown, InvoiceTimeline. Margins: MarginStatusBadge, MarginFilters, CostBreakdownPanel, MarginTable, MarginsSummaryCards, MarginCharts.
  - New stories for AutonexIsotipo, FinanceChartKit, FinanceStat, SidebarBookmarksDialog, LocationFilterSection and the small parts of Bubble, Alert, Item, Popover, Table, Sidebar, Dialog and Sheet.
    New dependency: canvas-confetti. All translatable components take `labels` props (Spanish defaults).

## 7.0.0

### Minor Changes

- Move the remaining app UI into the package, each with stories (single source of truth for the Storybook):
  - Finanzas: KpiTile/KpiStrip, FinanceStat, ForecastTable, ForecastDrivers, StatementTable, CashFlowTable, PlanVsActualTable, ReceivablesPanel, FixedCosts, AlertsTable, CashPeriodDetail, ScenarioCards, VatAccountCard, SyncButton, CushionEditor, Milestone/RecurringCost dialogs, and the cash/ARR/MRR/paired-bar charts + chart kit.
  - Charts: AreaChart, BarChart, TopicsBubbleChart, DailyStatsChart, VoiceHourly, LanguageDistribution, ConversionFunnel, EmailTiming, ChannelStackedHourly, ConversationOutcome.
  - ImageCropModal, AutonexScore, EditableNameTable, 17 page skeletons, PanelTooltipShell/PanelTooltipRow.
  - Stories for Atoms, Molecules and Organisms consolidated (Spanish text), plus page templates.
    All translatable components take `labels` props with Spanish defaults.

## 6.0.0

### Minor Changes

- 596ddf6: Add presentational navigation and assistant components, each with stories:
  AppShell, RealmRail, SidebarShell/SidebarNavItem/SidebarBookmarks (+ sidebar styles), UserMenu, WorkspaceSwitcher, ContextDropdown, AutonexIsotipo;
  AssistantSidePanel, AssistantChat, AssistantChatsPanel, AssistantComposer, AssistantMessage, AssistantThread, AssistantThinking (+ useReducedMotion, useWordReveal).
  Links go through a `renderLink` prop; text through `labels` props (Spanish defaults).

## 5.0.0

### Minor Changes

- 0dd2e43: Move generic marta-backend components into the package, each with stories:
  SectionHeader, StatusDot, StatCard/StatCardGrid, OrganizationAvatar, DocumentAttachmentCard, PanelChartTooltip, LocationFilter, LocationMultiSelect, ResponsiveList, WhatsAppPreview, ErrorBoundary, ThemeToggle, ImageViewerModal.
  Alert: `quiet-*` variants. FilterPopover: searchable list (`searchThreshold`, `searchPlaceholder`, `noResultsLabel`). SheetContent: `closeLabel`. Bubble `tinted` variant and QuotaCard hover updated.
  Components that had translations take `labels` props (Spanish defaults).

## 4.0.0

### Minor Changes

- 7e2e8cf: Add molecules moved from marta-backend: EmptyState/ChartEmptyState, ChannelBadge, ScoreBadge, SortableTableHead, ViewToggle, FilterPopover, ActiveFilters, DateRangeFilter, QuotaCard, ColumnManager (+ useColumnManager/useColumnOrder), and generic skeletons (TableSkeleton, TableRowSkeleton, AudioPlayerSkeleton, CardGridSkeleton, FormSkeleton, ListSkeleton). Texts for i18n-bound components (ActiveFilters, DateRangeFilter, QuotaCard) are passed via props with Spanish defaults. Adds @dnd-kit dependencies.

## 3.0.0

### Major Changes

- cb29af6: Resizable: migrate to react-resizable-panels v4 (`Group`/`Panel`/`Separator`). Props change: `orientation` replaces `direction`, sizes accept numbers or strings like "30%", `onLayoutChanged` replaces `onLayout`.

## 2.0.1

## 2.0.0

### Patch Changes

- 2213dc7: Add new UI components: Bubble, ButtonGroup, Calendar, Carousel, Chart, Combobox, Command, DatePicker, Field, InputGroup, InputOTP, Item, Kbd, Pagination, Resizable, RichTextEditor, Sidebar

  - Migrated 18 new components from marta-backend
  - Added comprehensive exports for Field (FieldGroup, FieldLegend, FieldSeparator, FieldSet, FieldContent, FieldTitle)
  - Added comprehensive exports for InputGroup (InputGroupAddon, InputGroupInput, InputGroupTextarea)
  - Added Storybook stories for Calendar, Item, Combobox, DatePicker

## 0.1.0

### Minor Changes

- Initial release of Autonex design tokens

  - CSS custom properties for colors, spacing, typography
  - Tailwind CSS preset for consistent styling
  - Dark mode support via CSS variables
