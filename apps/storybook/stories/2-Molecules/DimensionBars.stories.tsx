import type { Meta, StoryObj } from '@storybook/react';
import { DimensionBars } from '@autonexhub/react';

/** Subnotas RAP 0-100: VE Veracidad, PR Proceso, CO Conducción, TE Técnica. `null` = sin evaluar (nunca 0). */
const meta: Meta<typeof DimensionBars> = {
  title: '2-Molecules/Quality/DimensionBars',
  component: DimensionBars,
  tags: ['autodocs'],
  args: { values: { ve: 86, pr: 64, co: 42, te: null }, showWeights: true },
  decorators: [(S) => <div className="max-w-md"><S /></div>],
};
export default meta;
export const Default: StoryObj<typeof DimensionBars> = {};
export const AllEvaluated: StoryObj<typeof DimensionBars> = { args: { values: { ve: 92, pr: 88, co: 75, te: 71 }, showWeights: false } };
