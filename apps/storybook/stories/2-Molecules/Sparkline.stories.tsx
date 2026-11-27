import type { Meta, StoryObj } from '@storybook/react';
import { Sparkline } from '@autonexhub/react';

/** Línea mínima para tendencias en un KPI o una celda. Los `null` cortan la línea. */
const meta: Meta<typeof Sparkline> = {
  title: '2-Molecules/Quality/Sparkline',
  component: Sparkline,
  tags: ['autodocs'],
  args: { values: [62, 64, 61, 70, 72, 68, 75, 78], ariaLabel: '% RAP de los últimos 8 días' },
};
export default meta;
type Story = StoryObj<typeof Sparkline>;
export const Default: Story = {};
export const Filled: Story = { args: { fill: true, width: 160, height: 40 } };
export const WithGaps: Story = { args: { values: [40, 45, null, 50, 58, null, 61], stroke: 'var(--success)' } };
export const InKpi: Story = {
  render: () => (
    <div className="flex w-56 items-end justify-between rounded-lg border border-border bg-card p-3">
      <div>
        <div className="text-xs text-muted-foreground">% RAP</div>
        <div className="text-2xl font-semibold tabular-nums">71,4 %</div>
      </div>
      <Sparkline values={[62, 64, 61, 70, 72, 68, 75, 71]} fill />
    </div>
  ),
};
