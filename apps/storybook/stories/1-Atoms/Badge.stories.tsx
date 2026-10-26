import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '@autonexhub/react';
import { ScoreBadge } from '@autonexhub/react';
import { CheckCircle, WarningCircle, XCircle } from '@phosphor-icons/react';

const meta: Meta<typeof Badge> = {
  title: '1-Atoms/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'secondary',
        'destructive',
        'success',
        'warning',
        'info',
        'destructive-solid',
        'success-solid',
        'warning-solid',
        'outline',
        'ghost',
        'link',
      ],
      description: 'Visual style of the badge',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Status indicators and tags. Color = meaning (green OK, red error, gray neutral).',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: 'Badge',
    variant: 'default',
  },
};

export const SoftVariants: Story = {
  name: 'Soft Variants (default)',
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="success">Completada</Badge>
      <Badge variant="destructive">Fallida</Badge>
      <Badge variant="warning">Esperando Agente</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="secondary">En curso</Badge>
      <Badge variant="outline">Pendiente</Badge>
    </div>
  ),
};

export const SolidVariants: Story = {
  name: 'Solid Variants (emphasis)',
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="success-solid">Activa</Badge>
      <Badge variant="warning-solid">Caduca pronto</Badge>
      <Badge variant="destructive-solid">Impago</Badge>
      <Badge variant="default">Nuevo</Badge>
    </div>
  ),
};

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="success-solid">Success solid</Badge>
      <Badge variant="warning-solid">Warning solid</Badge>
      <Badge variant="destructive-solid">Destructive solid</Badge>
      <Badge variant="ghost">Ghost</Badge>
      <Badge variant="link">Link</Badge>
    </div>
  ),
};

export const WithIcons: Story = {
  name: 'With Icons',
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="success"><CheckCircle /> Activa</Badge>
      <Badge variant="warning"><WarningCircle /> Pendiente</Badge>
      <Badge variant="destructive"><XCircle /> Error</Badge>
    </div>
  ),
};

export const UsageExamples: Story = {
  name: 'Usage Examples',
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm">Estado:</span>
        <Badge variant="success">Completada</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">Temas:</span>
        <Badge variant="secondary">horarios</Badge>
        <Badge variant="secondary">reservas</Badge>
        <Badge variant="secondary">tarifas</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">Score:</span>
        <ScoreBadge score={8.5} scale={10} />
      </div>
    </div>
  ),
};
