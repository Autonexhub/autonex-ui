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
      description: 'Estilo visual: las variantes semánticas usan fondo suave (pares del DS), icono y título en el color semántico y descripción en tinta',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    className: {
      control: 'text',
      description: 'Clases CSS adicionales (ancho, márgenes)',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Aviso en banda para mensajes. Se compone con AlertTitle y AlertDescription; el icono va como primer hijo.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  name: 'Por defecto',
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
  name: 'Error',
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
  name: 'Aviso',
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
  name: 'Éxito',
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
  name: 'Aviso solo para administradores',
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
