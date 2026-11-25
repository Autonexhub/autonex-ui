import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { MagicWand } from '@phosphor-icons/react';
import { TagChip } from '@autonexhub/react';

/**
 * TagChip — etiqueta con punto de color (categoría, tipo, fase): Badge `secondary` + punto + texto truncado.
 * Con `onClick` es un botón (o el disparador de un `PropSelect`); con `onRemove` lleva aspa; sin `label` pinta
 * `emptyLabel` en contorno.
 */
const meta: Meta<typeof TagChip> = {
  title: '2-Molecules/TagChip',
  component: TagChip,
  tags: ['autodocs'],
  args: { label: 'Facturación', color: 'var(--chart-1)' },
};
export default meta;
type Story = StoryObj<typeof TagChip>;

export const Default: Story = {};

export const Colors: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)', '#e11d48'].map((c, i) => (
        <TagChip key={c} label={`Etiqueta ${i + 1}`} color={c} />
      ))}
      <TagChip label="Sin color" />
    </div>
  ),
};

export const Empty: Story = { args: { label: undefined, emptyLabel: 'Sin categoría' } };

/** Con sufijo: la varita lila marca que la puso la IA. */
export const AiSuggested: Story = { args: { suffix: <MagicWand className="size-3 shrink-0 text-ai" />, title: 'Puesta por la IA' } };

export const Clickable: Story = { args: { onClick: () => alert('click') } };

export const Removable: Story = {
  render: function Render() {
    const [tags, setTags] = useState(['Facturación', 'Citas', 'Resultados']);
    return (
      <div className="flex flex-wrap gap-2">
        {tags.map((t, i) => (
          <TagChip key={t} label={t} color={`var(--chart-${i + 1})`} onRemove={() => setTags(tags.filter((x) => x !== t))} />
        ))}
      </div>
    );
  },
};

export const Truncated: Story = {
  render: () => <div className="w-40"><TagChip label="Una categoría con un nombre larguísimo" color="var(--chart-2)" /></div>,
};

export const Disabled: Story = { args: { onClick: () => {}, disabled: true } };

export const Dark: Story = {
  render: () => (
    <div className="dark flex gap-2 rounded-[10px] bg-background p-4">
      <TagChip label="Facturación" color="var(--chart-1)" />
      <TagChip emptyLabel="Sin categoría" />
    </div>
  ),
};
