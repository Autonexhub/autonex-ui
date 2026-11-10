import type { Meta, StoryObj } from '@storybook/react';
import { VoiceHourlyChart } from '@autonexhub/react';

const data = Array.from({ length: 24 }, (_, hour) => ({
  hour,
  calls: hour < 8 || hour > 21 ? 0 : Math.round(30 * Math.exp(-Math.pow((hour - 12) / 4, 2)) + (hour % 3) * 2),
}));

const meta: Meta<typeof VoiceHourlyChart> = {
  title: '3-Organisms/VoiceHourlyChart',
  component: VoiceHourlyChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Uso por horas de un canal (área de un solo color, relleno 0.30 → 0). El color es el del canal (`var(--chart-N)`); sin actividad muestra el vacío de métricas.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-3xl rounded-xl border bg-card p-4">
        <Story />
      </div>
    ),
  ],
  args: { data },
};

export default meta;
type Story = StoryObj<typeof VoiceHourlyChart>;

export const Default: Story = {};

export const OtroCanal: Story = {
  name: 'Color de otro canal',
  args: { color: 'var(--chart-2)', labels: { title: 'Mensajes por horas', callsSeries: 'Mensajes' } },
};

export const SinActividad: Story = {
  name: 'Sin actividad',
  args: { data: data.map((d) => ({ ...d, calls: 0 })) },
};
