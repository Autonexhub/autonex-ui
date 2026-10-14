import type { Meta, StoryObj } from '@storybook/react';
import { useState, useEffect } from 'react';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@autonexhub/react';
import { Button } from '@autonexhub/react';
import { Badge } from '@autonexhub/react';
import { Kbd } from '@autonexhub/react';
import { Avatar, AvatarFallback } from '@autonexhub/react';
import {
  Calculator,
  Calendar,
  CreditCard,
  Gear,
  User,
  Envelope,
  ChatCircle,
  MagnifyingGlass,
  House,
  ChartLine,
  Users,
  Book,
} from '@phosphor-icons/react';

const meta: Meta = {
  title: '2-Molecules/Command',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Command palette / autocomplete component for searching and executing actions.

## Components
- **Command**: Base container with rounded-3xl styling
- **CommandInput**: Search input with icon
- **CommandList**: Scrollable results container
- **CommandGroup**: Grouped items with heading
- **CommandItem**: Individual selectable item with checkmark
- **CommandShortcut**: Keyboard shortcut hint
- **CommandDialog**: Modal version (Cmd+K style)

## Patterns

### Inline search
\`\`\`tsx
<Command className="border">
  <CommandInput placeholder="Buscar..." />
  <CommandList>
    <CommandGroup heading="Sugerencias">
      <CommandItem>Item 1</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
\`\`\`

### Command palette (Cmd+K)
\`\`\`tsx
<CommandDialog open={open} onOpenChange={setOpen}>
  <Command>
    <CommandInput placeholder="Escribe un comando..." />
    <CommandList>...</CommandList>
  </Command>
</CommandDialog>
\`\`\`
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Command className="border max-w-md">
      <CommandInput placeholder="Escribe para buscar..." />
      <CommandList>
        <CommandEmpty>No se encontraron resultados.</CommandEmpty>
        <CommandGroup heading="Sugerencias">
          <CommandItem>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Calendario</span>
          </CommandItem>
          <CommandItem>
            <ChatCircle className="mr-2 h-4 w-4" />
            <span>Buscar conversaciones</span>
          </CommandItem>
          <CommandItem>
            <Calculator className="mr-2 h-4 w-4" />
            <span>Calculadora</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Configuración">
          <CommandItem>
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Facturación</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Gear className="mr-2 h-4 w-4" />
            <span>Ajustes</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

export const WithShortcuts: Story = {
  render: () => (
    <Command className="border max-w-md">
      <CommandInput placeholder="Buscar acciones..." />
      <CommandList>
        <CommandEmpty>No se encontraron acciones.</CommandEmpty>
        <CommandGroup heading="Navegación">
          <CommandItem>
            <House className="mr-2 h-4 w-4" />
            <span>Ir a Inicio</span>
            <CommandShortcut>⌘H</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <ChatCircle className="mr-2 h-4 w-4" />
            <span>Ir a Conversaciones</span>
            <CommandShortcut>⌘C</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Users className="mr-2 h-4 w-4" />
            <span>Ir a Contactos</span>
            <CommandShortcut>⌘U</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <ChartLine className="mr-2 h-4 w-4" />
            <span>Ir a Métricas</span>
            <CommandShortcut>⌘M</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Book className="mr-2 h-4 w-4" />
            <span>Ir a Knowledge Base</span>
            <CommandShortcut>⌘K</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Command menu with keyboard shortcuts displayed.',
      },
    },
  },
};

function CommandDialogExample() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <p className="text-sm text-muted-foreground">
        Presiona <Kbd>⌘K</Kbd> o haz clic en el botón
      </p>
      <Button onClick={() => setOpen(true)} variant="outline" className="gap-2">
        <MagnifyingGlass className="h-4 w-4" />
        <span>Buscar...</span>
        <Kbd className="ml-2">⌘K</Kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Escribe un comando o búsqueda..." />
          <CommandList>
            <CommandEmpty>No se encontraron resultados.</CommandEmpty>
            <CommandGroup heading="Navegación">
              <CommandItem onSelect={() => setOpen(false)}>
                <House className="mr-2 h-4 w-4" />
                <span>Inicio</span>
              </CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>
                <ChatCircle className="mr-2 h-4 w-4" />
                <span>Conversaciones</span>
              </CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>
                <Users className="mr-2 h-4 w-4" />
                <span>Contactos</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Acciones rápidas">
              <CommandItem onSelect={() => setOpen(false)}>
                <Calendar className="mr-2 h-4 w-4" />
                <span>Nueva cita</span>
              </CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>
                <Envelope className="mr-2 h-4 w-4" />
                <span>Enviar mensaje</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Configuración">
              <CommandItem onSelect={() => setOpen(false)}>
                <User className="mr-2 h-4 w-4" />
                <span>Mi perfil</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>
                <Gear className="mr-2 h-4 w-4" />
                <span>Ajustes</span>
                <CommandShortcut>⌘,</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}

export const Dialog: Story = {
  render: () => <CommandDialogExample />,
  parameters: {
    docs: {
      description: {
        story: 'Command palette in a modal dialog, triggered by Cmd+K or button click.',
      },
    },
  },
};

function AutocompleteExample() {
  const [value, setValue] = useState('');
  const contacts = [
    { name: 'María López García', phone: '+34 612 345 678', initials: 'ML' },
    { name: 'Carlos García Ruiz', phone: '+34 623 456 789', initials: 'CG' },
    { name: 'Ana Martínez Pérez', phone: '+34 634 567 890', initials: 'AM' },
    { name: 'Pedro Sánchez López', phone: '+34 645 678 901', initials: 'PS' },
    { name: 'Laura Fernández Gil', phone: '+34 656 789 012', initials: 'LF' },
  ];

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(value.toLowerCase()) ||
      c.phone.includes(value)
  );

  return (
    <div className="max-w-md">
      <p className="text-sm text-muted-foreground mb-2">Autocomplete dropdown para buscar contactos</p>
      <Command className="border">
        <CommandInput
          placeholder="Buscar contacto por nombre o teléfono..."
          value={value}
          onValueChange={setValue}
        />
        <CommandList>
          <CommandEmpty>
            <div className="py-6 text-center">
              <Users className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">No se encontraron contactos</p>
            </div>
          </CommandEmpty>
          <CommandGroup heading="Contactos">
            {filtered.map((contact) => (
              <CommandItem
                key={contact.phone}
                value={contact.name}
                onSelect={(val) => {
                  setValue(val);
                  console.log('Selected:', contact);
                }}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs font-medium">{contact.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{contact.name}</span>
                    <span className="text-xs text-muted-foreground">{contact.phone}</span>
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}

export const Autocomplete: Story = {
  render: () => <AutocompleteExample />,
  parameters: {
    docs: {
      description: {
        story: 'Command used as an autocomplete dropdown for searching contacts. Type to filter results.',
      },
    },
  },
};

function MultiSelectAutocompleteExample() {
  const [selected, setSelected] = useState<string[]>([]);
  const tags = [
    { id: 'vip', label: 'VIP', color: 'bg-chart-1' },
    { id: 'ortodoncia', label: 'Ortodoncia', color: 'bg-chart-2' },
    { id: 'implantes', label: 'Implantes', color: 'bg-chart-3' },
    { id: 'estetica', label: 'Estética', color: 'bg-chart-4' },
    { id: 'pediatria', label: 'Pediatría', color: 'bg-chart-5' },
    { id: 'urgente', label: 'Urgente', color: 'bg-destructive' },
  ];

  const toggleTag = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-md">
      <p className="text-sm text-muted-foreground mb-2">Multi-select para etiquetas</p>
      <Command className="border">
        <CommandInput placeholder="Buscar etiquetas..." />
        <CommandList>
          <CommandEmpty>No se encontraron etiquetas.</CommandEmpty>
          <CommandGroup heading="Etiquetas disponibles">
            {tags.map((tag) => (
              <CommandItem
                key={tag.id}
                value={tag.label}
                onSelect={() => toggleTag(tag.id)}
                data-checked={selected.includes(tag.id)}
              >
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${tag.color}`} />
                  <span>{tag.label}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
      {selected.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {selected.map((id) => {
            const tag = tags.find((t) => t.id === id);
            return (
              <Badge key={id} variant="secondary" className="gap-1">
                <span className={`h-2 w-2 rounded-full ${tag?.color}`} />
                {tag?.label}
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}

export const MultiSelectAutocomplete: Story = {
  render: () => <MultiSelectAutocompleteExample />,
  parameters: {
    docs: {
      description: {
        story: 'Multi-select autocomplete for tags with checkmarks.',
      },
    },
  },
};

export const Empty: Story = {
  render: () => (
    <Command className="border max-w-md">
      <CommandInput placeholder="Buscar..." value="xyz123" />
      <CommandList>
        <CommandEmpty>
          <div className="py-6 text-center">
            <MagnifyingGlass className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">No se encontraron resultados</p>
            <p className="text-xs text-muted-foreground mt-1">Intenta con otros términos de búsqueda</p>
          </div>
        </CommandEmpty>
      </CommandList>
    </Command>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Empty state when no results match the search query.',
      },
    },
  },
};
