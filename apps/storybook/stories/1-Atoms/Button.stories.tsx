import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@autonexhub/react';
import { Plus, Trash, DownloadSimple, PaperPlaneTilt } from '@phosphor-icons/react';

const meta: Meta<typeof Button> = {
  title: '1-Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'ghost', 'destructive', 'success', 'brand', 'chip', 'link', 'secondary'],
      description: 'Visual style of the button',
    },
    size: {
      control: 'select',
      options: ['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'],
      description: 'Size of the button',
    },
    disabled: {
      control: 'boolean',
    },
    asChild: {
      control: 'boolean',
      description: 'Render as child element (for links)',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Primary action element. Pill-shaped with 1px down translation on press.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'default',
  },
};

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <Button variant="default">Default</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="success">Success</Button>
      <Button variant="brand">Brand</Button>
      <Button variant="chip">Chip</Button>
      <Button variant="link">Link</Button>
      <Button variant="secondary">Secondary (avoid)</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  name: 'All Sizes',
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon-xs"><Plus /></Button>
      <Button size="icon-sm"><Plus /></Button>
      <Button size="icon"><Plus /></Button>
      <Button size="icon-lg"><Plus /></Button>
    </div>
  ),
};

export const WithIcons: Story = {
  name: 'With Icons',
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <Button><Plus /> Crear</Button>
      <Button variant="outline"><DownloadSimple /> Exportar</Button>
      <Button variant="destructive"><Trash /> Eliminar</Button>
      <Button variant="brand"><PaperPlaneTilt /> Enviar</Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    children: 'Guardar',
    disabled: true,
  },
};

export const ButtonHierarchy: Story = {
  name: 'Button Hierarchy (max 1 default per block)',
  render: () => (
    <div className="flex gap-2 p-4 border rounded-lg bg-card">
      <Button variant="default">Guardar</Button>
      <Button variant="outline">Vista previa</Button>
      <Button variant="ghost">Cancelar</Button>
    </div>
  ),
};
