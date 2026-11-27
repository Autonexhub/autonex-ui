import type { Meta, StoryObj } from '@storybook/react';
import { GateBadge, RapVerdictBadge, SeverityBadge } from '@autonexhub/react';

/**
 * Badges de calidad RAP. `GateBadge`: puerta abierta (verde), cerrada (roja) o sin medir (gris; `null` nunca es
 * «cerrada»), con aviso de baja confianza. `RapVerdictBadge`: aprobada / no aprobada / indeterminada / sin base.
 * `SeverityBadge`: gravedad con punto de color.
 */
const meta: Meta<typeof GateBadge> = {
  title: '2-Molecules/Quality/GateBadge',
  component: GateBadge,
  tags: ['autodocs'],
  args: { state: true },
};
export default meta;
type Story = StoryObj<typeof GateBadge>;

export const Default: Story = {};

export const States: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <GateBadge state={true} />
      <GateBadge state={false} />
      <GateBadge state={null} />
      <GateBadge state={true} label="Score ≥ 70" />
      <GateBadge state={false} label="Sin recontacto" lowConfidence />
      <GateBadge state={null} label="Sin humano" size="md" />
    </div>
  ),
};

export const RapVerdicts: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <RapVerdictBadge verdict="pass" />
      <RapVerdictBadge verdict="fail" />
      <RapVerdictBadge verdict="indeterminate" />
      <RapVerdictBadge verdict="no_basis" />
      <RapVerdictBadge verdict={null} />
    </div>
  ),
};

export const Severities: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(['critical', 'high', 'medium', 'low', 'clean'] as const).map((s) => <SeverityBadge key={s} severity={s} />)}
    </div>
  ),
};
