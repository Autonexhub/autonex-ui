import type { Meta, StoryObj } from '@storybook/react';
import { SeverityBadge } from '@autonexhub/react';

/** Gravedad de un hallazgo o una conversación: Crítica, Alta, Media, Baja, Limpia. */
const meta: Meta<typeof SeverityBadge> = {
  title: '2-Molecules/Quality/SeverityBadge',
  component: SeverityBadge,
  tags: ['autodocs'],
  args: { severity: 'high' },
  argTypes: { severity: { control: 'select', options: ['critical', 'high', 'medium', 'low', 'clean'] } },
};
export default meta;
export const Default: StoryObj<typeof SeverityBadge> = {};
