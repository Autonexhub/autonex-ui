import type { Meta, StoryObj } from '@storybook/react';
import { useMemo, useState, type ComponentProps } from 'react';
import { Switch } from '@autonexhub/react';
import {
  FilterBar,
  applyLocalFilters,
  groupItems,
  type FilterBarExtraChip,
  type FilterBarState,
  type FilterField,
} from '@autonexhub/react';

/**
 * FilterBar — la barra de filtros de una lista (Incidencias, Contactos, Tareas…).
 *
 * - Lo filtrado sale debajo como píldoras con aspa y "Limpiar todo".
 * - Pulsar una píldora reabre su filtro (como Linear), aunque viva dentro de "Más filtros".
 * - Los botones no se mueven al marcar: solo aparece un número en un hueco reservado; el orden es fijo.
 * - Todos los menús son `Command` del sistema; buscador solo con más de 7 opciones.
 * - Rango a medida con el `DatePicker` del sistema (nunca `<input type="date">`).
 */
const meta: Meta<typeof FilterBar> = {
  title: '2-Molecules/FilterBar',
  component: FilterBar,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof FilterBar>;

const status: FilterField = {
  key: 'status',
  label: 'Estado',
  options: [
    { value: 'pending', label: 'Pendiente', color: 'var(--warning)' },
    { value: 'in_progress', label: 'En progreso', color: 'var(--brand)' },
    { value: 'resolved', label: 'Resuelta', color: 'var(--success)' },
  ],
  nullable: false,
};
const owner: FilterField = {
  key: 'owner',
  label: 'Responsable',
  options: [
    { value: 1, label: 'Ana López' },
    { value: 2, label: 'Luis Gil' },
    { value: 3, label: 'Marta Ruiz' },
  ],
};
const center: FilterField = {
  key: 'center',
  label: 'Centro',
  options: ['Serrano', 'Retiro', 'Chamberí', 'Salamanca', 'Tetuán', 'Arganzuela', 'Moncloa', 'Usera', 'Vallecas', 'Latina'].map((c) => ({ value: c, label: c })),
};
const category: FilterField = {
  key: 'category',
  label: 'Categoría',
  options: [
    { value: 'billing', label: 'Facturación', color: 'var(--chart-1)' },
    { value: 'appointments', label: 'Citas', color: 'var(--chart-2)' },
    { value: 'results', label: 'Resultados', color: 'var(--chart-3)' },
  ],
};
const channel: FilterField = {
  key: 'channel',
  label: 'Canal',
  multi: false,
  options: [
    { value: 'voice', label: 'Llamada' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'web', label: 'Web' },
  ],
};

const fields = [status, owner, center, category, channel];
const sorts = [
  { value: 'newest', label: 'Más recientes' },
  { value: 'oldest', label: 'Más antiguas' },
  { value: 'priority', label: 'Prioridad' },
];
const groupBys = [
  { value: 'status', label: 'Estado' },
  { value: 'owner', label: 'Responsable' },
];
const dateFields = [
  { value: 'created_at', label: 'Creada' },
  { value: 'updated_at', label: 'Actualizada' },
];
const columns = [
  { key: 'title', label: 'Título' },
  { key: 'owner', label: 'Responsable' },
  { key: 'center', label: 'Centro' },
  { key: 'created_at', label: 'Creada' },
];

function Demo({ initial, ...rest }: { initial: FilterBarState } & Partial<ComponentProps<typeof FilterBar>>) {
  const [state, setState] = useState<FilterBarState>(initial);
  return (
    <div className="space-y-4">
      <FilterBar fields={fields} sorts={sorts} groupBys={groupBys} dateFields={dateFields} columns={columns} value={state} onChange={setState} {...rest} />
      <pre className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">{JSON.stringify(state, null, 2)}</pre>
    </div>
  );
}

/** Sin nada filtrado: no hay píldoras y los botones reservan el hueco del número. */
export const Empty: Story = { render: () => <Demo initial={{ values: {} }} /> };

/** Con valores: píldoras debajo; pulsar una la reabre, el aspa la quita. "Categoría" y "Canal" viven en "Más filtros". */
export const WithValues: Story = {
  render: () => (
    <Demo
      initial={{
        query: 'factura',
        values: { status: ['pending', 'in_progress'], owner: ['__null__'], category: ['billing'] },
        sort: 'newest',
        dateField: 'created_at',
        dateRange: { preset: 'this_month' },
      }}
    />
  ),
};

/** "Centro" tiene 10 opciones: su menú sale con buscador (más de 7). */
export const ManyOptions: Story = { render: () => <Demo initial={{ values: { center: ['Retiro'] } }} inlineLimit={5} /> };

/** Rango a medida con el DatePicker del sistema. */
export const CustomDateRange: Story = {
  render: () => <Demo initial={{ values: {}, dateField: 'created_at', dateRange: { preset: 'custom', from: '2026-11-01', to: '2026-11-15' } }} />,
};

/** Campo fijo (`defaultValue`): siempre en línea, enseña su valor y no tiene píldora. */
export const PinnedField: Story = {
  render: () => (
    <Demo
      fields={[{ key: 'rate', label: 'Tarifa', multi: false, nullable: false, defaultValue: 'member', options: [{ value: 'member', label: 'Abonado' }, { value: 'guest', label: 'No abonado' }] }, status]}
      initial={{ values: {} }}
    />
  ),
};

type WithFlags = FilterBarState & { recurring?: boolean };

/** Filtro propio de la app (interruptor en `leadingSlot`) con su píldora vía `extraChips`. */
export const ExtraChips: Story = {
  render: function Render() {
    const [state, setState] = useState<WithFlags>({ values: {}, recurring: true });
    const extra: FilterBarExtraChip<WithFlags>[] = state.recurring
      ? [{ id: 'recurring', label: 'Recurrentes', clear: (s) => ({ ...s, recurring: undefined }) }]
      : [];
    return (
      <FilterBar<WithFlags>
        fields={[status, owner]}
        value={state}
        onChange={setState}
        extraChips={extra}
        leadingSlot={
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={!!state.recurring} onCheckedChange={(v) => setState({ ...state, recurring: v || undefined })} /> Recurrentes
          </label>
        }
      />
    );
  },
};

export const Disabled: Story = {
  render: () => <Demo initial={{ values: { status: ['pending'] } }} disabled />,
};

/** Textos por `labels` (el paquete no depende de i18n). */
export const English: Story = {
  render: () => (
    <Demo
      initial={{ values: { status: ['pending'] } }}
      labels={{
        search: 'Search…',
        searchChip: (q) => `Search: "${q}"`,
        withoutField: (f) => `No ${f.toLowerCase()}`,
        searchField: (f) => `Search ${f.toLowerCase()}…`,
        moreFilters: 'More filters',
        clearAll: 'Clear all',
        sort: 'Sort',
        columns: 'Columns',
        date: 'Date',
        groupBy: (l) => `Group: ${l}`,
        none: 'None',
      }}
    />
  ),
};

export const Dark: Story = {
  render: () => (
    <div className="dark rounded-[10px] bg-background p-4 text-foreground">
      <Demo initial={{ values: { status: ['pending'], category: ['billing'] } }} />
    </div>
  ),
};

const rows = [
  { id: 1, title: 'Factura duplicada', status: 'pending', owner: 1, center: 'Retiro', created_at: '2026-11-20' },
  { id: 2, title: 'Cambio de cita', status: 'in_progress', owner: null, center: 'Serrano', created_at: '2026-11-02' },
  { id: 3, title: 'Resultados sin recibir', status: 'resolved', owner: 2, center: 'Retiro', created_at: '2026-10-14' },
];

/** `applyLocalFilters` + `groupItems`: filtrado y agrupación en cliente con el mismo estado. */
export const LocalFiltering: Story = {
  render: function Render() {
    const [state, setState] = useState<FilterBarState>({ values: {}, groupBy: 'status', dateField: 'created_at' });
    const groups = useMemo(() => {
      const filtered = applyLocalFilters(rows, state, {
        getFieldValue: (r, k) => (r as Record<string, string | number | null>)[k] ?? null,
        getDate: (r) => r.created_at,
        search: (r) => r.title,
      });
      return groupItems(filtered, state.groupBy, (r) => ({ key: String(state.groupBy === 'owner' ? r.owner : r.status), label: String(state.groupBy === 'owner' ? r.owner ?? 'Sin responsable' : r.status) }));
    }, [state]);
    return (
      <div className="space-y-4">
        <FilterBar fields={[status, owner, center]} groupBys={groupBys} dateFields={dateFields} value={state} onChange={setState} />
        {groups.map((g) => (
          <div key={g.key}>
            {g.label && <p className="mb-1 text-xs font-medium text-muted-foreground">{g.label}</p>}
            <ul className="space-y-1 text-sm">{g.items.map((r) => <li key={r.id}>{r.title} · {r.center} · {r.created_at}</li>)}</ul>
          </div>
        ))}
      </div>
    );
  },
};
