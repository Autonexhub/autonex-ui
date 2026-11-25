import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Gear, MagicWand } from '@phosphor-icons/react';
import { PersonAvatar, PropSelect, TagChip, type PropOption } from '@autonexhub/react';

/**
 * PropSelect — propiedad editable de una ficha (Responsable, Departamento, Centro, Categoría): chip clicable con el
 * valor que abre un menú del sistema (`Command`) con grupos, "Sin …" y check en el elegido. Buscador solo con más
 * de 7 opciones. Sin `onChange` (o con `disabled`) es solo lectura.
 */
const meta: Meta<typeof PropSelect> = { title: '2-Molecules/PropSelect', component: PropSelect, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof PropSelect>;

const people: PropOption<number>[] = [
  { id: 1, label: 'Ana López', group: 'Recepción', hint: 'Recepcionista', person: { name: 'Ana López' } },
  { id: 2, label: 'Luis Gil', group: 'Recepción', person: { name: 'Luis Gil' } },
  { id: 3, label: 'Marta Ruiz', group: 'Dirección', hint: 'Gerente', person: { name: 'Marta Ruiz' } },
];

function Owner({ initial = null, options = people, disabled, readOnly }: {
  initial?: number | null; options?: PropOption<number>[]; disabled?: boolean; readOnly?: boolean;
}) {
  const [id, setId] = useState<number | null>(initial);
  const current = options.find((o) => o.id === id) ?? null;
  return (
    <div className="flex w-72 items-center justify-between text-sm">
      <span className="text-muted-foreground">Responsable</span>
      <PropSelect
        value={current}
        options={options}
        onChange={readOnly ? undefined : setId}
        disabled={disabled}
        emptyLabel="Sin responsable"
        ariaLabel="Cambiar responsable"
        renderValue={
          <span className="inline-flex min-w-0 items-center gap-2">
            <PersonAvatar person={current?.person ?? null} size="xs" />
            <span className={current ? 'truncate' : 'text-muted-foreground'}>{current?.label ?? 'Sin responsable'}</span>
          </span>
        }
      />
    </div>
  );
}

export const Empty: Story = { render: () => <Owner /> };
export const WithValue: Story = { render: () => <Owner initial={3} /> };

const many: PropOption<number>[] = ['Serrano', 'Retiro', 'Chamberí', 'Salamanca', 'Tetuán', 'Arganzuela', 'Moncloa', 'Usera', 'Vallecas'].map(
  (name, i) => ({ id: i + 1, label: name, person: { name } }),
);
/** Más de 7 opciones: sale el buscador. */
export const ManyOptions: Story = { render: () => <Owner options={many} initial={2} /> };
export const ReadOnly: Story = { render: () => <Owner initial={1} readOnly /> };
export const Disabled: Story = { render: () => <Owner initial={1} disabled /> };

const categories: PropOption<string>[] = [
  { id: 'billing', label: 'Facturación', color: 'var(--chart-1)' },
  { id: 'appointments', label: 'Citas', color: 'var(--chart-2)' },
  { id: 'results', label: 'Resultados', color: 'var(--chart-3)' },
];

/** Con un `TagChip` como disparador y acciones al pie: la base de un selector de categoría. */
export const TagTriggerWithActions: Story = {
  render: function Render() {
    const [id, setId] = useState<string | null>('billing');
    const current = categories.find((c) => c.id === id) ?? null;
    return (
      <PropSelect
        value={current}
        options={categories}
        onChange={setId}
        emptyLabel="Sin categoría"
        ariaLabel="Cambiar categoría"
        trigger={<TagChip label={current?.label} color={current?.color} emptyLabel="Sin categoría" suffix={<MagicWand className="size-3 shrink-0 text-ai" />} aria-label="Cambiar categoría" />}
        actions={[
          { label: 'Clasificar con IA', icon: <MagicWand className="text-ai" />, onSelect: () => {} },
          { label: 'Gestionar categorías', icon: <Gear />, onSelect: () => {} },
        ]}
      />
    );
  },
};
