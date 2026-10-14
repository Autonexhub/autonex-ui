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
      description: 'Markdown content',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when empty',
    },
    minHeight: {
      control: 'text',
      description: 'Minimum height of editor',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable editing',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
WYSIWYG rich text editor with markdown support.

## Features
- Converts markdown ↔ HTML seamlessly
- Toolbar with formatting options
- Tooltips on toolbar buttons
- Supports: Bold, Italic, Headings, Lists, Quotes, Code, Links

## Usage
\`\`\`tsx
const [content, setContent] = useState('');

<RichTextEditor
  value={content}
  onChange={setContent}
  placeholder="Escribe aquí..."
/>
\`\`\`

## Where it's used
- Knowledge Base content editing
- Position descriptions (Careers module)
- System Prompt editing
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof RichTextEditor>;

// Interactive wrapper for controlled state
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
        <p className="font-medium mb-1">Markdown output:</p>
        <pre className="bg-muted p-2 rounded text-xs overflow-auto max-h-32">
          {value || '(empty)'}
        </pre>
      </div>
    </div>
  );
}

export const Default: Story = {
  render: () => <RichTextEditorDemo placeholder="Escribe aquí..." />,
};

export const WithInitialContent: Story = {
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
        story: 'Editor with pre-populated markdown content showing various formatting options.',
      },
    },
  },
};

export const Disabled: Story = {
  render: () => (
    <RichTextEditorDemo
      initialValue="Este contenido no se puede editar."
      disabled
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Disabled state - content is visible but not editable.',
      },
    },
  },
};

export const CustomHeight: Story = {
  render: () => (
    <RichTextEditorDemo
      placeholder="Editor con altura personalizada..."
      minHeight="300px"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Editor with custom minimum height (300px).',
      },
    },
  },
};

export const KnowledgeBaseExample: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="text-sm font-medium">Contenido del bloque KB</div>
      <RichTextEditorDemo
        initialValue={`## Horarios de atención

**Lunes a Viernes:** 9:00 - 18:00
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
        story: 'Example of how the editor is used in Knowledge Base content editing.',
      },
    },
  },
};

export const AllToolbarFeatures: Story = {
  render: () => (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Prueba todas las funciones del toolbar: Negrita, Cursiva, Encabezados, Listas, Citas, Código, Enlaces
      </p>
      <RichTextEditorDemo
        placeholder="Prueba los botones del toolbar..."
        minHeight="250px"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to test all toolbar formatting options.',
      },
    },
  },
};
