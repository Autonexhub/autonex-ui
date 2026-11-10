import type { Meta, StoryObj } from '@storybook/react';
import { MarginStatusBadge } from '@autonexhub/react';

const meta: Meta<typeof MarginStatusBadge> = {
  title: '2-Molecules/MarginStatusBadge',
  component: MarginStatusBadge,
  tags: ['autodocs'],
  argTypes: {
    percent: {
      control: { type: 'range', min: 0, max: 100 },
      description: 'Porcentaje de margen',
    },
    showPercent: {
      control: 'boolean',
      description: 'Muestra el porcentaje en vez del texto de estado',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Etiqueta de salud del margen por color: rojo (< 20%), ámbar (20-50%) y verde (> 50%). Se usa en la tabla y el panel de Márgenes (Finanzas).',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MarginStatusBadge>;

export const Critico: Story = {
  name: 'Crítico',
  args: { percent: 6 },
};

export const Ajustado: Story = {
  args: { percent: 40 },
};

export const Sano: Story = {
  args: { percent: 68 },
};

export const Todos: Story = {
  name: 'Los tres estados',
  render: () => (
    <div className="flex gap-4">
      <MarginStatusBadge percent={6} />
      <MarginStatusBadge percent={40} />
      <MarginStatusBadge percent={68} />
    </div>
  ),
};

export const ConTexto: Story = {
  name: 'Con texto de estado',
  render: () => (
    <div className="flex gap-4">
      <MarginStatusBadge percent={6} showPercent={false} />
      <MarginStatusBadge percent={40} showPercent={false} />
      <MarginStatusBadge percent={68} showPercent={false} />
    </div>
  ),
};
