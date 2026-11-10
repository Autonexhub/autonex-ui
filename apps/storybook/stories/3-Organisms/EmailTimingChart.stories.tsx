import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { EmailTimingChart, type EmailTimingPeriod } from '@autonexhub/react';

const horas = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, '0')}:00`,
  sent: Math.round(12 * Math.exp(-Math.pow((i - 11) / 4, 2))),
  failed: i === 9 || i === 15 ? 2 : 0,
}));

const dias = Array.from({ length: 30 }, (_, i) => ({
  time: `${String((i % 28) + 1).padStart(2, '0')}/09`,
  sent: 20 + ((i * 7) % 25),
  failed: i % 9 === 0 ? 3 : 0,
}));

const meta: Meta<typeof EmailTimingChart> = {
  title: '3-Organisms/EmailTimingChart',
  component: EmailTimingChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Actividad de correos (enviados y fallidos) en una tarjeta con selector de periodo 24h / 30d. Es presentacional y controlado: el consumidor carga la serie y gestiona `period` / `onPeriodChange`.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof EmailTimingChart>;

export const Interactivo: Story = {
  render: () => {
    const [period, setPeriod] = useState<EmailTimingPeriod>('24h');
    return (
      <EmailTimingChart
        period={period}
        onPeriodChange={setPeriod}
        data={period === '24h' ? horas : dias}
      />
    );
  },
};

export const Cargando: Story = {
  args: { data: [], loading: true, period: '24h', onPeriodChange: () => {} },
};

export const SinDatos: Story = {
  name: 'Sin datos',
  args: { data: [], period: '30d', onPeriodChange: () => {} },
};
