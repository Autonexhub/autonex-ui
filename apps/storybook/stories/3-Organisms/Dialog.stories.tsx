import type { Meta, StoryObj } from '@storybook/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
  Input,
  Field,
  FieldGroup,
  FieldLabel,
} from '@autonexhub/react';

const meta: Meta<typeof Dialog> = {
  title: '3-Organisms/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  argTypes: {
    defaultOpen: {
      control: 'boolean',
      description: 'Estado abierto inicial (no controlado)',
    },
    open: {
      control: 'boolean',
      description: 'Estado abierto (controlado)',
    },
    modal: {
      control: 'boolean',
      description: 'Si es true (por defecto), se bloquea la interacción fuera del diálogo',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    onOpenChange: {
      action: 'openChange',
      description: 'Se llama cuando cambia el estado abierto',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
Diálogo modal centrado. Es el sitio de **los formularios** (el panel lateral es para el detalle de un elemento de listado).

## Características
- **Animación**: fundido + zoom en el sitio, sin deslizar desde una esquina.
- **Forma**: \`rounded-4xl\`, \`shadow-xl\`, ancho \`max-w-2xl\` (confirmaciones: \`sm:max-w-md\`).
- **Espaciado horneado**: \`p-6\` + \`gap-6\` en \`DialogContent\`. No se anula (nada de \`p-0 gap-0\` ni rellenos en el header).
- **Título**: \`text-lg font-semibold\`; no se re-estila por página.
- **showCloseButton**: prop opcional para ocultar la X (por defecto: true).

## Uso
\`\`\`tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Abrir</Button>
  </DialogTrigger>
  <DialogContent showCloseButton={false}>
    <DialogHeader>
      <DialogTitle>Título</DialogTitle>
      <DialogDescription>Descripción</DialogDescription>
    </DialogHeader>
    {/* contenido */}
    <DialogFooter>
      <Button>Acción</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
\`\`\`
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  name: 'Por defecto',
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Editar perfil</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
          <DialogDescription>
            Cambia tus datos y pulsa Guardar cuando termines.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup className="gap-4">
          <Field>
            <FieldLabel htmlFor="name">Nombre</FieldLabel>
            <Input id="name" defaultValue="Lucía Martín" placeholder="Ej: Lucía Martín" />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
            <Input id="email" type="email" defaultValue="lucia@clinica-ejemplo.es" placeholder="Ej: nombre@empresa.es" />
          </Field>
        </FieldGroup>
        <DialogFooter>
          <Button variant="ghost">Cancelar</Button>
          <Button>Guardar cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const Confirmation: Story = {
  name: 'Confirmación',
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Archivar conversación</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>¿Archivar esta conversación?</DialogTitle>
          <DialogDescription>
            Dejará de aparecer en la bandeja. Podrás restaurarla desde Archivadas.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost">Cancelar</Button>
          <Button>Archivar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Confirmación simple: se estrecha por caso con `sm:max-w-md`, nombra la cosa y la consecuencia, y el botón de confirmar repite el verbo. Para acciones destructivas irreversibles usar `AlertDialog` (ver 2-Molecules/AlertDialog), nunca Dialog ni solo un toast.',
      },
    },
  },
};

export const WithoutCloseButton: Story = {
  name: 'Sin botón de cerrar',
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Abrir (sin botón X)</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Cierre desde el pie</DialogTitle>
          <DialogDescription>
            Este diálogo no tiene X: se cierra con los botones del pie.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost">Cancelar</Button>
          <Button>Continuar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Usa `showCloseButton={false}` cuando el cierre lo deban gestionar los botones del pie.',
      },
    },
  },
};
