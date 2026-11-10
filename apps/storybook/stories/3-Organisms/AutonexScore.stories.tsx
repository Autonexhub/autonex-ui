import type { Meta, StoryObj } from '@storybook/react';
import { AutonexScore } from '@autonexhub/react';

const meta: Meta<typeof AutonexScore> = {
  title: '3-Organisms/AutonexScore',
  component: AutonexScore,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Desempeño del asistente en una conversación (1..5) como pastilla sólida: 4-5 verde, 3 ámbar, 1-2 rojo. Sin puntuación muestra una pastilla gris con un guion para que la columna nunca quede vacía.',
      },
    },
  },
  args: { value: 5 },
};

export default meta;
type Story = StoryObj<typeof AutonexScore>;

export const Default: Story = {};

export const Escala: Story = {
  name: 'Escala 1 a 5',
  render: () => (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <AutonexScore key={n} value={n} />
      ))}
      <AutonexScore value={null} />
    </div>
  ),
};

export const Pendiente: Story = { args: { value: null } };
