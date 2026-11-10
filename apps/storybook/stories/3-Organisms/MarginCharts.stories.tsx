import type { Meta, StoryObj } from '@storybook/react';
import { MarginCharts } from '@autonexhub/react';
import { mockOrganizations, mockTimeSeries, mockProviderTimeSeries } from './marginsFixtures';

const meta: Meta<typeof MarginCharts> = {
  title: '3-Organisms/Margins/MarginCharts',
  component: MarginCharts,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Sección de gráficas con pestañas: evolución, desglose por proveedor y comparativa entre organizaciones.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MarginCharts>;

export const Default: Story = {
  name: 'Por defecto',
  args: {
    timeSeries: mockTimeSeries,
    providerTimeSeries: mockProviderTimeSeries,
    organizations: mockOrganizations,
  },
};
