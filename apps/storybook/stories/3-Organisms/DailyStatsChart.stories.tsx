import type { Meta, StoryObj } from '@storybook/react';
import { DailyStatsChart, type DailyStatsData } from '@autonexhub/react';

const daily = Array.from({ length: 14 }, (_, i) => ({
  date: `2026-09-${String(i + 1).padStart(2, '0')}`,
  calls: 20 + ((i * 7) % 23),
  total_seconds: 3600 + i * 120,
  cost: 8 + ((i * 3) % 9) + 0.35,
  bookings: (i * 5) % 6,
}));

const data: DailyStatsData = {
  daily,
  totals: {
    total_cost: 154.2,
    cost_per_conversation: 0.42,
    cost_per_booking: 3.1,
    avg_calls_per_day: 31,
    total_calls: 434,
    total_seconds: 61000,
    avg_duration_seconds: 142,
    cost_per_minute: 0.15,
    total_bookings: 41,
    avg_bookings_per_day: 3,
    num_days: 14,
  },
};

const meta: Meta<typeof DailyStatsChart> = {
  title: '3-Organisms/DailyStatsChart',
  component: DailyStatsChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Estadísticas diarias de un módulo: franja de totales (coste, coste/conversación, media de llamadas, duración…) y barras por día con series conmutables (llamadas, coste, agendamientos). Los textos se sobrescriben con `labels`.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-4xl rounded-xl border bg-card p-4">
        <Story />
      </div>
    ),
  ],
  args: { data },
};

export default meta;
type Story = StoryObj<typeof DailyStatsChart>;

export const ConAgendamientos: Story = { name: 'Con agendamientos' };

export const SinAgendamientos: Story = {
  name: 'Sin agendamientos',
  args: {
    data: {
      daily: daily.map((d) => ({ ...d, bookings: 0 })),
      totals: { ...data.totals, total_bookings: 0, cost_per_booking: null, avg_bookings_per_day: 0 },
    },
  },
};

export const SinDatos: Story = {
  name: 'Sin datos',
  args: { data: { daily: [], totals: data.totals } },
};
