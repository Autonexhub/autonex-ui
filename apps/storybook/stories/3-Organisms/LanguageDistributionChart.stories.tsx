import type { Meta, StoryObj } from '@storybook/react';
import { LanguageDistributionChart } from '@autonexhub/react';

const meta: Meta<typeof LanguageDistributionChart> = {
  title: '3-Organisms/LanguageDistributionChart',
  component: LanguageDistributionChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Idiomas usados en las conversaciones: código ISO en un Badge, nombre del idioma y barra con el porcentaje. Sin banderas. El nombre del idioma se resuelve con `labels.languageName`.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md rounded-xl border bg-card p-4">
        <Story />
      </div>
    ),
  ],
  args: {
    data: [
      { lang: 'es', cnt: 320 },
      { lang: 'en', cnt: 80 },
      { lang: 'ca', cnt: 45 },
      { lang: 'fr', cnt: 12 },
    ],
    total: 457,
  },
};

export default meta;
type Story = StoryObj<typeof LanguageDistributionChart>;

export const Default: Story = {};

export const SoloEspanol: Story = {
  name: 'Solo español',
  args: { data: [{ lang: 'es', cnt: 200 }], total: 200 },
};

export const SinDatos: Story = { name: 'Sin datos', args: { data: [], total: 0 } };
