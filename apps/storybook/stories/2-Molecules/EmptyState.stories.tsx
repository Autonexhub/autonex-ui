import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState, ChartEmptyState } from '@autonexhub/react';
import { Button } from '@autonexhub/react';
import {
  ChatText,
  Users,
  FileText,
  MagnifyingGlass,
  Tray,
  Calendar,
  Plus,
  ChartLine,
} from "@phosphor-icons/react";

const meta: Meta<typeof EmptyState> = {
  title: '2-Molecules/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Centered empty state for when there's no data to display.

## Usage
\`\`\`tsx
<EmptyState
  icon={<Tray className="h-12 w-12" />}
  title="No hay conversaciones"
  description="Cuando haya nuevas conversaciones, aparecerán aquí."
  action={<Button>Nueva conversación</Button>}
/>
\`\`\`

## Props
- **icon**: Optional React node for the icon (Phosphor, weight regular)
- **title**: Required title text
- **description**: Optional description below title
- **action**: Optional action button or link
- **className**: Optional additional classes

## Where it's used
- Conversations list (no conversations)
- Contacts list (no contacts)
- Knowledge Base (no blocks)
- MagnifyingGlass results (no results)
`,
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'The main title text',
    },
    description: {
      control: 'text',
      description: 'Optional description text below the title',
    },
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    title: 'No hay datos',
    description: 'Aún no hay información para mostrar.',
  },
};

export const WithIcon: Story = {
  args: {
    icon: <Tray className="h-12 w-12" />,
    title: 'Bandeja vacía',
    description: 'No tienes mensajes en tu bandeja de entrada.',
  },
};

export const WithAction: Story = {
  args: {
    icon: <Users className="h-12 w-12" />,
    title: 'No hay contactos',
    description: 'Añade tu primer contacto para empezar.',
    action: (
      <Button>
        <Plus className="h-4 w-4 mr-2" />
        Añadir contacto
      </Button>
    ),
  },
};

export const NoConversations: Story = {
  args: {
    icon: <ChatText className="h-12 w-12" />,
    title: 'No hay conversaciones',
    description: 'Cuando haya nuevas conversaciones, aparecerán aquí.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state for the conversations list.',
      },
    },
  },
};

export const NoSearchResults: Story = {
  args: {
    icon: <MagnifyingGlass className="h-12 w-12" />,
    title: 'Sin resultados',
    description: 'No encontramos nada que coincida con tu búsqueda. Prueba con otros términos.',
    action: (
      <Button variant="outline">Limpiar filtros</Button>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state when search returns no results.',
      },
    },
  },
};

export const NoKnowledgeBase: Story = {
  args: {
    icon: <FileText className="h-12 w-12" />,
    title: 'Knowledge Base vacía',
    description: 'Añade bloques de conocimiento para que el asistente tenga información.',
    action: (
      <Button>
        <Plus className="h-4 w-4 mr-2" />
        Añadir bloque
      </Button>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state for Knowledge Base page.',
      },
    },
  },
};

export const NoEvents: Story = {
  args: {
    icon: <Calendar className="h-12 w-12" />,
    title: 'No hay eventos',
    description: 'No se han registrado eventos en el período seleccionado.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state for events/calendar views.',
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-8">
      <div className="border rounded-lg p-4">
        <EmptyState
          title="Mínimo"
        />
      </div>
      <div className="border rounded-lg p-4">
        <EmptyState
          icon={<Tray className="h-12 w-12" />}
          title="Con icono"
        />
      </div>
      <div className="border rounded-lg p-4">
        <EmptyState
          icon={<Users className="h-12 w-12" />}
          title="Con descripción"
          description="Esta es una descripción opcional."
        />
      </div>
      <div className="border rounded-lg p-4">
        <EmptyState
          icon={<FileText className="h-12 w-12" />}
          title="Completo"
          description="Incluye icono, descripción y acción."
          action={<Button size="sm">Acción</Button>}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All empty state variants side by side.',
      },
    },
  },
};

/**
 * Módulo de métricas sin datos (decisión Bruno 01/09, estilo "With Icon"):
 * nunca un texto suelto — `ChartEmptyState` (BookOpen 48px + título + descripción), SIEMPRE
 * centrado en un alto estándar de gráfica. La tira de KPIs es la excepción:
 * ahí un dato ausente se muestra como guión "–", sin empty state.
 */
export const GraficaSinDatos: Story = {
  name: 'Gráfica sin datos',
  render: () => (
    <div className="rounded-2xl border bg-card p-6 shadow-elev max-w-md">
      <h3 className="text-base font-medium text-foreground mb-4">Temas principales</h3>
      <ChartEmptyState title="Sin datos disponibles" description="No hay actividad en el rango seleccionado." />
    </div>
  ),
};
