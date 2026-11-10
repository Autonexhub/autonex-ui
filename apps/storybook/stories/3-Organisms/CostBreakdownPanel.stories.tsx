import type { Meta, StoryObj } from '@storybook/react';
import { CostBreakdownPanel } from '@autonexhub/react';
import { mockOrganizations } from './marginsFixtures';

const meta: Meta<typeof CostBreakdownPanel> = {
  title: '3-Organisms/Margins/CostBreakdownPanel',
  component: CostBreakdownPanel,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Panel desplegable con el desglose de costes por proveedor y canal.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CostBreakdownPanel>;

export const Default: Story = {
  name: 'Por defecto',
  args: {
    orgName: mockOrganizations[0].name,
    breakdown: mockOrganizations[0].costBreakdown,
  },
};

export const HighCostOrg: Story = {
  name: 'Organización con coste alto',
  args: {
    orgName: mockOrganizations[4].name,
    breakdown: mockOrganizations[4].costBreakdown,
  },
};

export const AllOrgs: Story = {
  name: 'Varias organizaciones',
  render: () => (
    <div className="space-y-4">
      {mockOrganizations.slice(0, 3).map((org) => (
        <div key={org.id} className="rounded-lg border">
          <CostBreakdownPanel orgName={org.name} breakdown={org.costBreakdown} />
        </div>
      ))}
    </div>
  ),
};
