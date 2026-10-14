import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from '@autonexhub/react';
import { Copy, Scissors, Clipboard, Trash, PencilSimple, Share } from '@phosphor-icons/react';

const meta: Meta<typeof ContextMenu> = {
  title: '2-Molecules/ContextMenu',
  component: ContextMenu,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Context menu triggered by right-click. Use for contextual actions.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ContextMenu>;

export const Default: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
        Haz clic derecho aquí
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem>
          <PencilSimple className="mr-2 h-4 w-4" />
          Editar
          <ContextMenuShortcut>⌘E</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <Copy className="mr-2 h-4 w-4" />
          Copiar
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <Scissors className="mr-2 h-4 w-4" />
          Cortar
          <ContextMenuShortcut>⌘X</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <Clipboard className="mr-2 h-4 w-4" />
          Pegar
          <ContextMenuShortcut>⌘V</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">
          <Trash className="mr-2 h-4 w-4" />
          Eliminar
          <ContextMenuShortcut>⌘⌫</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const WithCheckboxes: Story = {
  render: function Render() {
    const [bookmarked, setBookmarked] = React.useState(true);
    const [pinned, setPinned] = React.useState(false);

    return (
      <ContextMenu>
        <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
          Haz clic derecho aquí
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          <ContextMenuLabel>Opciones</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem checked={bookmarked} onCheckedChange={setBookmarked}>
            Agregar a favoritos
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem checked={pinned} onCheckedChange={setPinned}>
            Fijar elemento
          </ContextMenuCheckboxItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  },
};

export const WithSubmenu: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
        Haz clic derecho aquí
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem>
          <PencilSimple className="mr-2 h-4 w-4" />
          Editar
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Share className="mr-2 h-4 w-4" />
            Compartir
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem>Email</ContextMenuItem>
            <ContextMenuItem>WhatsApp</ContextMenuItem>
            <ContextMenuItem>Copiar enlace</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem disabled>Archivar</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const WithRadioGroup: Story = {
  render: function Render() {
    const [priority, setPriority] = React.useState('medium');

    return (
      <ContextMenu>
        <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
          Haz clic derecho aquí
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          <ContextMenuLabel>Prioridad</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuRadioGroup value={priority} onValueChange={setPriority}>
            <ContextMenuRadioItem value="high">Alta</ContextMenuRadioItem>
            <ContextMenuRadioItem value="medium">Media</ContextMenuRadioItem>
            <ContextMenuRadioItem value="low">Baja</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuContent>
      </ContextMenu>
    );
  },
};
