import type { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertDescription, AlertTitle } from '@autonexhub/react';
import { CheckCircle, Info, Warning, WarningCircle } from '@phosphor-icons/react';

const meta: Meta<typeof Alert> = {
  title: '2-Molecules/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'warning', 'success'],
      description: 'Visual style: semantic variants use a soft tinted background (DS pairs), icon+title in the semantic color, description in ink',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes (width, margins)',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Alert banner for messages. Use with AlertTitle and AlertDescription. Add icon as first child.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  render: () => (
    <Alert className="w-96">
      <Info className="h-4 w-4" />
      <AlertTitle>Información</AlertTitle>
      <AlertDescription>
        La sincronización con ElevenLabs se ejecuta cada 10 minutos.
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" className="w-96">
      <WarningCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        No se pudieron cargar las conversaciones. Inténtalo de nuevo.
      </AlertDescription>
    </Alert>
  ),
};

export const Warning_: Story = {
  name: 'Warning',
  render: () => (
    <Alert variant="warning" className="w-96">
      <Warning className="h-4 w-4" />
      <AlertTitle>Atención</AlertTitle>
      <AlertDescription>
        Esta acción no se puede deshacer.
      </AlertDescription>
    </Alert>
  ),
};

export const Success: Story = {
  render: () => (
    <Alert variant="success" className="w-96">
      <CheckCircle className="h-4 w-4" />
      <AlertTitle>Guardado</AlertTitle>
      <AlertDescription>
        Los cambios se han guardado correctamente.
      </AlertDescription>
    </Alert>
  ),
};

export const AdminOnly: Story = {
  name: 'Admin Only Warning',
  render: () => (
    <Alert className="w-96">
      <WarningCircle className="h-4 w-4" />
      <AlertTitle>Acceso restringido</AlertTitle>
      <AlertDescription>
        Esta sección solo está disponible para administradores.
      </AlertDescription>
    </Alert>
  ),
};
