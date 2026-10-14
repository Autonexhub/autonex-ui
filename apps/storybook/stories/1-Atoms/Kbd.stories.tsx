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
Keyboard shortcut display component for showing hotkeys consistently.

## Usage
\`\`\`tsx
import { Kbd, KbdGroup } from '@autonexhub/react';

// Single key
<Kbd>K</Kbd>

// Modifier + key
<KbdGroup>
  <Kbd>⌘</Kbd>
  <Kbd>K</Kbd>
</KbdGroup>

// In context
<p>Press <Kbd>⌘K</Kbd> to open search</p>
\`\`\`

## Common Symbols
- **⌘** Command (Mac)
- **⌃** Control
- **⌥** Option/Alt
- **⇧** Shift
- **↵** Enter/Return
- **⎋** Escape
- **⌫** Delete/Backspace

## Where to use
- Command palette hints
- Dropdown menu shortcuts
- Tooltip shortcut hints
- Documentation
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Kbd>;

export const Default: Story = {
  render: () => <Kbd>K</Kbd>,
};

export const WithModifier: Story = {
  render: () => (
    <KbdGroup>
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </KbdGroup>
  ),
};

export const CommonShortcuts: Story = {
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
        <span className="text-sm w-32">Nueva issue</span>
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
        story: 'Common keyboard shortcuts used throughout the dashboard.',
      },
    },
  },
};

export const SingleKeys: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Kbd>↵</Kbd>
      <Kbd>⎋</Kbd>
      <Kbd>⌫</Kbd>
      <Kbd>⇥</Kbd>
      <Kbd>Space</Kbd>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Single key indicators: Enter, Escape, Backspace, Tab, Space.',
      },
    },
  },
};

export const ArrowKeys: Story = {
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
        story: 'Keyboard shortcut displayed inside a button.',
      },
    },
  },
};

export const InText: Story = {
  render: () => (
    <p className="text-sm text-muted-foreground">
      Presiona{' '}
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>{' '}
      para abrir la paleta de comandos, o{' '}
      <Kbd>C</Kbd>{' '}
      para crear una nueva issue.
    </p>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Keyboard shortcuts inline with text.',
      },
    },
  },
};

export const MenuItemStyle: Story = {
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
        story: 'Keyboard shortcuts inside the official DropdownMenu (open the menu to see them).',
      },
    },
  },
};

export const AllModifiers: Story = {
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
        <Kbd>Shift</Kbd>
        <Kbd>Win</Kbd>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All modifier key symbols for Mac and Windows.',
      },
    },
  },
};
