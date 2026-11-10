import type { Meta, StoryObj } from '@storybook/react';
import { Kbd, KbdGroup } from '@autonexhub/react';
import { Button } from '@autonexhub/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@autonexhub/react';
import { MagnifyingGlass } from '@phosphor-icons/react';

const meta: Meta<typeof Kbd> = {
  title: '1-Atoms/Kbd',
  component: Kbd,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Muestra atajos de teclado con un estilo coherente.

## Uso
\`\`\`tsx
import { Kbd, KbdGroup } from '@autonexhub/react';

// Una tecla
<Kbd>K</Kbd>

// Modificador + tecla
<KbdGroup>
  <Kbd>⌘</Kbd>
  <Kbd>K</Kbd>
</KbdGroup>

// En contexto
<p>Pulsa <Kbd>⌘K</Kbd> para abrir la búsqueda</p>
\`\`\`

## Símbolos habituales
- **⌘** Comando (Mac)
- **⌃** Control
- **⌥** Opción/Alt
- **⇧** Mayúsculas
- **↵** Intro
- **⎋** Escape
- **⌫** Borrar

## Dónde usarlo
- Pistas de la paleta de comandos
- Atajos en menús desplegables
- Atajos en tooltips
- Documentación
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Kbd>;

export const Default: Story = {
  name: 'Por defecto',
  render: () => <Kbd>K</Kbd>,
};

export const WithModifier: Story = {
  name: 'Con modificador',
  render: () => (
    <KbdGroup>
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </KbdGroup>
  ),
};

export const CommonShortcuts: Story = {
  name: 'Atajos habituales',
  render: () => (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <span className="text-sm w-32">Buscar</span>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm w-32">Nueva tarea</span>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>I</Kbd>
        </KbdGroup>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm w-32">Guardar</span>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>S</Kbd>
        </KbdGroup>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm w-32">Deshacer</span>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>Z</Kbd>
        </KbdGroup>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm w-32">Rehacer</span>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>⇧</Kbd>
          <Kbd>Z</Kbd>
        </KbdGroup>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Atajos de teclado habituales en todo el panel.',
      },
    },
  },
};

export const SingleKeys: Story = {
  name: 'Teclas sueltas',
  render: () => (
    <div className="flex items-center gap-2">
      <Kbd>↵</Kbd>
      <Kbd>⎋</Kbd>
      <Kbd>⌫</Kbd>
      <Kbd>⇥</Kbd>
      <Kbd>Espacio</Kbd>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Teclas sueltas: Intro, Escape, Borrar, Tabulador y Espacio.',
      },
    },
  },
};

export const ArrowKeys: Story = {
  name: 'Flechas',
  render: () => (
    <div className="flex items-center gap-1">
      <Kbd>↑</Kbd>
      <Kbd>↓</Kbd>
      <Kbd>←</Kbd>
      <Kbd>→</Kbd>
    </div>
  ),
};

export const InButton: Story = {
  name: 'En un botón',
  render: () => (
    <Button variant="outline" className="gap-2">
      <MagnifyingGlass />
      <span>Buscar</span>
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    </Button>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Atajo de teclado dentro de un botón.',
      },
    },
  },
};

export const InText: Story = {
  name: 'En un texto',
  render: () => (
    <p className="text-sm text-muted-foreground">
      Pulsa{' '}
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>{' '}
      para abrir la paleta de comandos, o{' '}
      <Kbd>C</Kbd>{' '}
      para crear una nueva tarea.
    </p>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Atajos de teclado dentro de un texto.',
      },
    },
  },
};

export const MenuItemStyle: Story = {
  name: 'En un menú',
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Acciones</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem>
          Copiar
          <KbdGroup className="ml-auto">
            <Kbd>⌘</Kbd>
            <Kbd>C</Kbd>
          </KbdGroup>
        </DropdownMenuItem>
        <DropdownMenuItem>
          Pegar
          <KbdGroup className="ml-auto">
            <Kbd>⌘</Kbd>
            <Kbd>V</Kbd>
          </KbdGroup>
        </DropdownMenuItem>
        <DropdownMenuItem>
          Deshacer
          <KbdGroup className="ml-auto">
            <Kbd>⌘</Kbd>
            <Kbd>Z</Kbd>
          </KbdGroup>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Eliminar
          <Kbd className="ml-auto">⌫</Kbd>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Atajos de teclado dentro del DropdownMenu oficial (abre el menú para verlos).',
      },
    },
  },
};

export const AllModifiers: Story = {
  name: 'Todos los modificadores',
  render: () => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm w-20 text-muted-foreground">Mac:</span>
        <Kbd>⌘</Kbd>
        <Kbd>⌃</Kbd>
        <Kbd>⌥</Kbd>
        <Kbd>⇧</Kbd>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm w-20 text-muted-foreground">Windows:</span>
        <Kbd>Ctrl</Kbd>
        <Kbd>Alt</Kbd>
        <Kbd>Mayús</Kbd>
        <Kbd>Win</Kbd>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Todas las teclas modificadoras en Mac y Windows.',
      },
    },
  },
};
