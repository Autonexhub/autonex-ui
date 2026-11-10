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
Paleta de comandos / autocompletado para buscar y ejecutar acciones.

## Piezas
- **Command**: contenedor base (\`rounded-3xl\`).
- **CommandInput**: campo de búsqueda con icono.
- **CommandList**: contenedor de resultados con scroll.
- **CommandGroup**: grupo de elementos con encabezado.
- **CommandItem**: elemento seleccionable con check.
- **CommandShortcut**: pista del atajo de teclado.
- **CommandDialog**: versión modal (estilo Cmd+K).

## Patrones

### Búsqueda en línea
\`\`\`tsx
<Command className="border">
  <CommandInput placeholder="Buscar..." />
  <CommandList>
    <CommandGroup heading="Sugerencias">
      <CommandItem>Elemento 1</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
\`\`\`

### Paleta de comandos (Cmd+K)
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
  name: 'Por defecto',
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
  name: 'Con atajos',
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
            <span>Ir a Base de conocimientos</span>
            <CommandShortcut>⌘K</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Menú de comandos con los atajos de teclado visibles.',
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
        Pulsa <Kbd>⌘K</Kbd> o haz clic en el botón
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
  name: 'Diálogo (Cmd+K)',
  render: () => <CommandDialogExample />,
  parameters: {
    docs: {
      description: {
        story: 'Paleta de comandos en un diálogo modal; se abre con Cmd+K o con el botón.',
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
      <p className="text-sm text-muted-foreground mb-2">Autocompletado para buscar contactos</p>
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
  name: 'Autocompletado',
  render: () => <AutocompleteExample />,
  parameters: {
    docs: {
      description: {
        story: 'Command usado como autocompletado para buscar contactos. Escribe para filtrar los resultados.',
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
      <p className="text-sm text-muted-foreground mb-2">Selección múltiple de etiquetas</p>
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
  name: 'Autocompletado múltiple',
  render: () => <MultiSelectAutocompleteExample />,
  parameters: {
    docs: {
      description: {
        story: 'Autocompletado de selección múltiple para etiquetas, con check.',
      },
    },
  },
};

export const Empty: Story = {
  name: 'Sin resultados',
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
        story: 'Estado vacío cuando ningún resultado coincide con la búsqueda.',
      },
    },
  },
};
