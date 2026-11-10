import type { Meta, StoryObj } from '@storybook/react';
import { ChannelStackedHourlyChart } from '@autonexhub/react';

const data = Array.from({ length: 24 }, (_, hour) => {
  const peak = Math.max(0, Math.round(20 * Math.exp(-Math.pow((hour - 13) / 4, 2))));
  return {
    hour,
    voice: peak,
    web: Math.round(peak * 0.6),
    whatsapp: Math.round(peak * 0.8),
    instagram: hour % 4 === 0 ? Math.round(peak * 0.2) : 0,
  };
});

const meta: Meta<typeof ChannelStackedHourlyChart> = {
  title: '3-Organisms/ChannelStackedHourlyChart',
  component: ChannelStackedHourlyChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Uso por horas por canal: una línea/área por canal con su valor real; solo se pintan los canales con datos. Sin ningún dato muestra el vacío de métricas.',
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
type Story = StoryObj<typeof ChannelStackedHourlyChart>;

export const Default: Story = {};

export const SoloVozYWeb: Story = {
  name: 'Solo voz y web',
  args: { data: data.map((d) => ({ ...d, whatsapp: 0, instagram: 0 })) },
};

export const SinActividad: Story = {
  name: 'Sin actividad',
  args: { data: data.map((d) => ({ ...d, voice: 0, web: 0, whatsapp: 0, instagram: 0 })) },
};
