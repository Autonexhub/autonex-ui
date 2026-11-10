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
      description: 'Estilo visual del botón',
    },
    size: {
      control: 'select',
      options: ['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'],
      description: 'Tamaño del botón',
    },
    disabled: {
      control: 'boolean',
    },
    asChild: {
      control: 'boolean',
      description: 'Se renderiza como el elemento hijo (para enlaces)',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Elemento de acción. Forma de píldora (`rounded-4xl`) que se hunde 1px al pulsar. Máximo un botón `default` por bloque y un `brand` por pantalla.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  name: 'Por defecto',
  args: {
    children: 'Botón',
    variant: 'default',
  },
};

export const AllVariants: Story = {
  name: 'Todas las variantes',
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
      <Button variant="secondary">Secondary (evitar)</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  name: 'Todos los tamaños',
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <Button size="xs">Muy pequeño</Button>
      <Button size="sm">Pequeño</Button>
      <Button size="default">Por defecto</Button>
      <Button size="lg">Grande</Button>
      <Button size="icon-xs" aria-label="Añadir"><Plus /></Button>
      <Button size="icon-sm" aria-label="Añadir"><Plus /></Button>
      <Button size="icon" aria-label="Añadir"><Plus /></Button>
      <Button size="icon-lg" aria-label="Añadir"><Plus /></Button>
    </div>
  ),
};

export const WithIcons: Story = {
  name: 'Con iconos',
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
  name: 'Deshabilitado',
  args: {
    children: 'Guardar',
    disabled: true,
  },
};

export const ButtonHierarchy: Story = {
  name: 'Jerarquía (máx. 1 default por bloque)',
  render: () => (
    <div className="flex gap-2 p-4 border rounded-lg bg-card">
      <Button variant="default">Guardar</Button>
      <Button variant="outline">Vista previa</Button>
      <Button variant="ghost">Cancelar</Button>
    </div>
  ),
};
