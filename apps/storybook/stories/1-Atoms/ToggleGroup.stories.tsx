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
      description: 'Selección única o múltiple',
      table: { defaultValue: { summary: 'single' } },
    },
    variant: {
      control: 'select',
      options: ['default', 'outline'],
      description: 'Estilo visual de todos los elementos',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
      description: 'Tamaño de todos los elementos',
    },
    disabled: {
      control: 'boolean',
      description: 'Deshabilita todos los elementos',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Grupo de toggles en el que puede haber uno activo (single) o varios (multiple). Para grupos de la barra de herramientas.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ToggleGroup>;

export const Single: Story = {
  name: 'Selección única',
  render: () => (
    <ToggleGroup type="single" defaultValue="center">
      <ToggleGroupItem value="left"><TextAlignLeft /></ToggleGroupItem>
      <ToggleGroupItem value="center"><TextAlignCenter /></ToggleGroupItem>
      <ToggleGroupItem value="right"><TextAlignRight /></ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Multiple: Story = {
  name: 'Selección múltiple',
  render: () => (
    <ToggleGroup type="multiple" defaultValue={['bold']}>
      <ToggleGroupItem value="bold"><TextB /></ToggleGroupItem>
      <ToggleGroupItem value="italic"><TextItalic /></ToggleGroupItem>
      <ToggleGroupItem value="underline"><TextUnderline /></ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Outline: Story = {
  name: 'Outline',
  render: () => (
    <ToggleGroup type="single" variant="outline" defaultValue="left">
      <ToggleGroupItem value="left"><TextAlignLeft /></ToggleGroupItem>
      <ToggleGroupItem value="center"><TextAlignCenter /></ToggleGroupItem>
      <ToggleGroupItem value="right"><TextAlignRight /></ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Disabled: Story = {
  name: 'Deshabilitado',
  render: () => (
    <ToggleGroup type="single" disabled>
      <ToggleGroupItem value="left"><TextAlignLeft /></ToggleGroupItem>
      <ToggleGroupItem value="center"><TextAlignCenter /></ToggleGroupItem>
      <ToggleGroupItem value="right"><TextAlignRight /></ToggleGroupItem>
    </ToggleGroup>
  ),
};
