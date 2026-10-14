import type { Meta, StoryObj } from '@storybook/react';
import { ToggleGroup, ToggleGroupItem } from '@autonexhub/react';
import {
  TextB,
  TextItalic,
  TextUnderline,
  TextAlignLeft,
  TextAlignCenter,
  TextAlignRight,
} from '@phosphor-icons/react';

const meta: Meta<typeof ToggleGroup> = {
  title: '1-Atoms/ToggleGroup',
  component: ToggleGroup,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'radio',
      options: ['single', 'multiple'],
      description: 'Single or multiple selection',
      table: { defaultValue: { summary: 'single' } },
    },
    variant: {
      control: 'select',
      options: ['default', 'outline'],
      description: 'Visual style for all items',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
      description: 'Size for all items',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable all items',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Group of toggles where only one (single) or multiple can be active. Use for toolbar groups.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ToggleGroup>;

export const Single: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue="center">
      <ToggleGroupItem value="left"><TextAlignLeft /></ToggleGroupItem>
      <ToggleGroupItem value="center"><TextAlignCenter /></ToggleGroupItem>
      <ToggleGroupItem value="right"><TextAlignRight /></ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Multiple: Story = {
  render: () => (
    <ToggleGroup type="multiple" defaultValue={['bold']}>
      <ToggleGroupItem value="bold"><TextB /></ToggleGroupItem>
      <ToggleGroupItem value="italic"><TextItalic /></ToggleGroupItem>
      <ToggleGroupItem value="underline"><TextUnderline /></ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Outline: Story = {
  render: () => (
    <ToggleGroup type="single" variant="outline" defaultValue="left">
      <ToggleGroupItem value="left"><TextAlignLeft /></ToggleGroupItem>
      <ToggleGroupItem value="center"><TextAlignCenter /></ToggleGroupItem>
      <ToggleGroupItem value="right"><TextAlignRight /></ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <ToggleGroup type="single" disabled>
      <ToggleGroupItem value="left"><TextAlignLeft /></ToggleGroupItem>
      <ToggleGroupItem value="center"><TextAlignCenter /></ToggleGroupItem>
      <ToggleGroupItem value="right"><TextAlignRight /></ToggleGroupItem>
    </ToggleGroup>
  ),
};
