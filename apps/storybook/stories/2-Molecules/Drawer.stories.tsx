import type { Meta, StoryObj } from '@storybook/react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@autonexhub/react';
import { Button } from '@autonexhub/react';
import { Input } from '@autonexhub/react';
import { Field, FieldLabel } from '@autonexhub/react';

const meta: Meta<typeof Drawer> = {
  title: '2-Molecules/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Bottom drawer/sheet. Use for mobile-friendly actions and forms.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const Default: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Abrir Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Editar perfil</DrawerTitle>
          <DrawerDescription>
            Realiza cambios en tu perfil. Haz clic en guardar cuando termines.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 pb-0">
          <div className="space-y-4">
            <Field>
              <FieldLabel htmlFor="name">Nombre</FieldLabel>
              <Input id="name" placeholder="Tu nombre" />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" type="email" placeholder="tu@email.com" />
            </Field>
          </div>
        </div>
        <DrawerFooter>
          <Button>Guardar cambios</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const WithConfirmation: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="destructive">Eliminar cuenta</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>¿Eliminar tu cuenta?</DrawerTitle>
          <DrawerDescription>
            Esta acción no se puede deshacer. Tu cuenta será eliminada permanentemente
            junto con todos tus datos.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button variant="destructive">Sí, eliminar mi cuenta</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const WithScrollContent: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Ver términos</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Términos y condiciones</DrawerTitle>
            <DrawerDescription>
              Por favor, lee los siguientes términos.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 max-h-[300px] overflow-y-auto">
            {Array.from({ length: 10 }).map((_, i) => (
              <p key={i} className="text-sm text-muted-foreground mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
              </p>
            ))}
          </div>
          <DrawerFooter>
            <Button>Aceptar términos</Button>
            <DrawerClose asChild>
              <Button variant="outline">Rechazar</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  ),
};

export const SimpleAction: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Compartir</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Compartir</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 grid gap-2">
            <Button variant="outline" className="justify-start">
              Copiar enlace
            </Button>
            <Button variant="outline" className="justify-start">
              Compartir por WhatsApp
            </Button>
            <Button variant="outline" className="justify-start">
              Compartir por Email
            </Button>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cerrar</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  ),
};
