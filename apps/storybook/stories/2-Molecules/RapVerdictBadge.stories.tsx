import type { Meta, StoryObj } from '@storybook/react';
import { RapVerdictBadge } from '@autonexhub/react';

/** Veredicto RAP de una conversación: `pass` (todas las puertas abiertas), `fail`, `indeterminate` (alguna sin medir), `no_basis`. */
const meta: Meta<typeof RapVerdictBadge> = {
  title: '2-Molecules/Quality/RapVerdictBadge',
  component: RapVerdictBadge,
  tags: ['autodocs'],
  args: { verdict: 'pass' },
  argTypes: { verdict: { control: 'select', options: ['pass', 'fail', 'indeterminate', 'no_basis', null] } },
};
export default meta;
export const Default: StoryObj<typeof RapVerdictBadge> = {};
