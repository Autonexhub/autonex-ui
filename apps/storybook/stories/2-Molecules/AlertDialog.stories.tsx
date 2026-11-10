import type { Meta, StoryObj } from '@storybook/react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@autonexhub/react';
import { Button } from '@autonexhub/react';

const meta: Meta<typeof AlertDialog> = {
  title: '2-Molecules/AlertDialog',
  component: AlertDialog,
  tags: ['autodocs'],
  argTypes: {
    defaultOpen: {
      control: 'boolean',
      description: 'Estado abierto inicial',
    },
    open: {
      control: 'boolean',
      description: 'Estado abierto (controlado)',
    },
    onOpenChange: {
      action: 'openChange',
      description: 'Se llama cuando cambia el estado abierto',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Diálogo modal para acciones destructivas o importantes que requieren confirmación. El usuario tiene que responder.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AlertDialog>;

export const DeleteConfirmation: Story = {
  name: 'Confirmar eliminación',
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Eliminar contacto</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar este contacto?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente el contacto
            y todos sus datos asociados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction>Eliminar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const DiscardChanges: Story = {
  name: 'Descartar cambios',
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Descartar cambios</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Descartar cambios?</AlertDialogTitle>
          <AlertDialogDescription>
            Tienes cambios sin guardar. Si continúas, perderás todos los cambios realizados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Seguir editando</AlertDialogCancel>
          <AlertDialogAction>Descartar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};
