import type { Meta, StoryObj } from '@storybook/react';
import { CardGridSkeleton } from '@autonexhub/react';

const meta: Meta<typeof CardGridSkeleton> = {
  title: '3-Organisms/Skeletons/CardGridSkeleton',
  component: CardGridSkeleton,
  tags: ['autodocs'],
  argTypes: {
    count: {
      control: { type: 'number', min: 1, max: 12 },
      description: 'Number of skeleton cards to display',
      table: {
        defaultValue: { summary: '4' },
      },
    },
    gridClass: {
      control: 'select',
      options: ['md:grid-cols-2', 'md:grid-cols-3', 'md:grid-cols-4'],
      description: 'Grid column configuration',
      table: {
        defaultValue: { summary: 'md:grid-cols-2' },
      },
    },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Grid of card skeletons. Use when loading card-based content.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CardGridSkeleton>;

export const Default: Story = {
  args: {
    count: 4,
    gridClass: 'md:grid-cols-2',
  },
};

export const ThreeColumns: Story = {
  args: {
    count: 6,
    gridClass: 'md:grid-cols-3',
  },
};
