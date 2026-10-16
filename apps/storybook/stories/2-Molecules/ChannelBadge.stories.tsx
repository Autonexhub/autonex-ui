import type { Meta, StoryObj } from '@storybook/react';
import { ChannelBadge, ChannelType } from '@autonexhub/react';

const meta: Meta<typeof ChannelBadge> = {
  title: '2-Molecules/ChannelBadge',
  component: ChannelBadge,
  tags: ['autodocs'],
  argTypes: {
    channel: {
      control: 'select',
      options: ['voice', 'web', 'whatsapp', 'instagram', 'manual'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    showLabel: {
      control: 'boolean',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Channel indicator with colored dot. Gray badge + colored dot + label. Use for channel columns and filters.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ChannelBadge>;

export const Voice: Story = {
  args: {
    channel: 'voice',
  },
};

export const AllChannels: Story = {
  name: 'All Channels',
  render: () => (
    <div className="flex flex-wrap gap-2">
      <ChannelBadge channel="voice" />
      <ChannelBadge channel="web" />
      <ChannelBadge channel="whatsapp" />
      <ChannelBadge channel="instagram" />
      <ChannelBadge channel="manual" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <ChannelBadge channel="voice" size="sm" />
      <ChannelBadge channel="voice" size="md" />
    </div>
  ),
};

export const IconOnly: Story = {
  render: () => (
    <div className="flex gap-2">
      <ChannelBadge channel="voice" showLabel={false} />
      <ChannelBadge channel="web" showLabel={false} />
      <ChannelBadge channel="whatsapp" showLabel={false} />
      <ChannelBadge channel="instagram" showLabel={false} />
    </div>
  ),
};

export const InTableRow: Story = {
  name: 'In Table Row',
  render: () => (
    <div className="flex items-center gap-4 p-3 border rounded-lg bg-card">
      <span className="text-sm font-medium">+34 612 345 678</span>
      <ChannelBadge channel="whatsapp" />
      <span className="text-xs text-muted-foreground">hace 2 min</span>
    </div>
  ),
};
