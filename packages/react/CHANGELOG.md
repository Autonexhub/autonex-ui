# @autonexhub/react

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
