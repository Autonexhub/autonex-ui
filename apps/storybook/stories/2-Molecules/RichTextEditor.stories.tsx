import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { RichTextEditor } from '@autonexhub/react';

const meta: Meta<typeof RichTextEditor> = {
  title: '2-Molecules/RichTextEditor',
  component: RichTextEditor,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'Contenido en Markdown',
    },
    placeholder: {
      control: 'text',
      description: 'Texto de ejemplo cuando está vacío',
    },
    minHeight: {
      control: 'text',
      description: 'Altura mínima del editor',
    },
    disabled: {
      control: 'boolean',
      description: 'Desactiva la edición',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
Editor de texto enriquecido (WYSIWYG) que guarda Markdown.

## Características
- Convierte Markdown ↔ HTML de forma transparente.
- Barra de herramientas con opciones de formato y tooltips en cada botón.
- Admite: negrita, cursiva, encabezados, listas, citas, código y enlaces.

## Uso
\`\`\`tsx
const [content, setContent] = useState('');

<RichTextEditor
  value={content}
  onChange={setContent}
  placeholder="Escribe aquí..."
/>
\`\`\`

## Dónde se usa
- Edición de la Base de conocimientos.
- Descripción de puestos (Posiciones, en Administración).
- Edición del Comportamiento del agente.
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof RichTextEditor>;

// Envoltorio interactivo con estado controlado
function RichTextEditorDemo({
  initialValue = '',
  ...props
}: {
  initialValue?: string;
  placeholder?: string;
  minHeight?: string;
  disabled?: boolean;
}) {
  const [value, setValue] = useState(initialValue);

  return (
    <div className="space-y-4">
      <RichTextEditor value={value} onChange={setValue} {...props} />
      <div className="text-xs text-muted-foreground">
        <p className="font-medium mb-1">Markdown resultante:</p>
        <pre className="bg-muted p-2 rounded text-xs overflow-auto max-h-32">
          {value || '(vacío)'}
        </pre>
      </div>
    </div>
  );
}

export const Default: Story = {
  name: 'Por defecto',
  render: () => <RichTextEditorDemo placeholder="Escribe aquí..." />,
};

export const WithInitialContent: Story = {
  name: 'Con contenido inicial',
  render: () => (
    <RichTextEditorDemo
      initialValue={`## Título de ejemplo

Este es un párrafo con **texto en negrita** y *cursiva*.

### Lista de características

- Elemento uno
- Elemento dos
- Elemento tres

> Esta es una cita importante.

\`código inline\` y también:

\`\`\`
bloque de código
\`\`\`
`}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Editor con contenido Markdown precargado que muestra varias opciones de formato.',
      },
    },
  },
};

export const Disabled: Story = {
  name: 'Desactivado',
  render: () => (
    <RichTextEditorDemo
      initialValue="Este contenido no se puede editar."
      disabled
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Estado desactivado: el contenido se ve pero no se puede editar.',
      },
    },
  },
};

export const CustomHeight: Story = {
  name: 'Altura personalizada',
  render: () => (
    <RichTextEditorDemo
      placeholder="Editor con altura personalizada..."
      minHeight="300px"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Editor con altura mínima personalizada (300px).',
      },
    },
  },
};

export const KnowledgeBaseExample: Story = {
  name: 'Ejemplo: Base de conocimientos',
  render: () => (
    <div className="space-y-4">
      <div className="text-sm font-medium">Contenido del bloque de la Base de conocimientos</div>
      <RichTextEditorDemo
        initialValue={`## Horarios de atención

**Lunes a viernes:** 9:00 - 18:00
**Sábados:** 10:00 - 14:00

### Servicios disponibles

1. Consulta general
2. Revisión técnica
3. Reparación express

> Para urgencias fuera de horario, contacte al teléfono de emergencias.
`}
        minHeight="200px"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Ejemplo de uso del editor al editar un bloque de la Base de conocimientos.',
      },
    },
  },
};

export const AllToolbarFeatures: Story = {
  name: 'Todas las opciones de la barra',
  render: () => (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Prueba todas las funciones de la barra de herramientas: Negrita, Cursiva, Encabezados, Listas, Citas, Código, Enlaces
      </p>
      <RichTextEditorDemo
        placeholder="Prueba los botones de la barra de herramientas..."
        minHeight="250px"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Zona de pruebas interactiva para todas las opciones de formato de la barra.',
      },
    },
  },
};
