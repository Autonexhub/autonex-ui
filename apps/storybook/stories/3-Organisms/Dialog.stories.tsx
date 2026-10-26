import type { Meta, StoryObj } from '@storybook/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@autonexhub/react';
import { Button } from '@autonexhub/react';
import { Input } from '@autonexhub/react';
import { Field, FieldGroup, FieldLabel } from '@autonexhub/react';

const meta: Meta<typeof Dialog> = {
  title: '3-Organisms/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  argTypes: {
    defaultOpen: {
      control: 'boolean',
      description: 'Initial open state (uncontrolled)',
    },
    open: {
      control: 'boolean',
      description: 'Open state (controlled)',
    },
    modal: {
      control: 'boolean',
      description: 'If true (default), interaction outside is blocked',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    onOpenChange: {
      action: 'openChange',
      description: 'Callback when open state changes',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
Modal dialog with fade+zoom animation (no sliding).

## Features
- **Animation**: Pure fade + zoom in place (no slide from corner)
- **Border radius**: \`rounded-4xl\` (very rounded corners)
- **showCloseButton**: Optional prop to hide the X button (default: true)

## Usage
\`\`\`tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent showCloseButton={false}>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* content */}
    <DialogFooter>
      <Button>Action</Button>
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
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup className="py-4 gap-4">
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input id="name" defaultValue="John Doe" />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" defaultValue="john@example.com" />
          </Field>
        </FieldGroup>
        <DialogFooter>
          <Button variant="ghost">Cancel</Button>
          <Button>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const Confirmation: Story = {
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
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open (no X button)</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Custom Close Handling</DialogTitle>
          <DialogDescription>
            This dialog has no X button. Use the footer buttons to close.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost">Cancel</Button>
          <Button>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Use `showCloseButton={false}` when you want custom close handling via footer buttons.',
      },
    },
  },
};
