import type { Meta, StoryObj } from '@storybook/react';
import { ScoreBadge } from '@autonexhub/react';

const meta: Meta<typeof ScoreBadge> = {
  title: '2-Molecules/ScoreBadge',
  component: ScoreBadge,
  tags: ['autodocs'],
  argTypes: {
    score: {
      control: 'number',
      description: 'Valor del score en la escala indicada. null/undefined pinta N/A.',
    },
    scale: {
      control: 'select',
      options: [5, 10, 100],
      description: 'Escala del dato: 5 (1-5), 10 (RAP 0-10) o 100 (0-100). Default 100.',
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: 'Tamaño de la píldora. Default sm.',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Única fuente de verdad de scores. Umbrales: ≥80% verde, ≥60% ámbar, resto rojo.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ScoreBadge>;

export const Default: Story = {
  args: { score: 87 },
};

export const Escala10: Story = {
  args: { score: 8.7, scale: 10 },
};

export const Umbrales: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Escala 100</p>
        <div className="flex gap-3">
          <ScoreBadge score={95} />
          <ScoreBadge score={72} />
          <ScoreBadge score={45} />
        </div>
        <div className="flex gap-3">
          <ScoreBadge score={95} size="md" />
          <ScoreBadge score={72} size="md" />
          <ScoreBadge score={45} size="md" />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Escala 10</p>
        <div className="flex gap-3">
          <ScoreBadge score={9.2} scale={10} />
          <ScoreBadge score={6.5} scale={10} />
          <ScoreBadge score={3.1} scale={10} />
        </div>
        <div className="flex gap-3">
          <ScoreBadge score={9.2} scale={10} size="md" />
          <ScoreBadge score={6.5} scale={10} size="md" />
          <ScoreBadge score={3.1} scale={10} size="md" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Los umbrales se normalizan por porcentaje: ≥80% verde, ≥60% ámbar, resto rojo — idénticos en escala 100 (95/72/45) y escala 10 (9.2/6.5/3.1).',
      },
    },
  },
};

export const NA: Story = {
  args: { score: null },
  parameters: {
    docs: {
      description: {
        story: 'Sin score (null/undefined) se muestra "N/A" en texto muted, sin píldora.',
      },
    },
  },
};
