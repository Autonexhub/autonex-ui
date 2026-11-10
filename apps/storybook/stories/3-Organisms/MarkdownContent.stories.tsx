import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { MarkdownContent, MarkdownView } from '@autonexhub/react';

const meta: Meta<typeof MarkdownContent> = {
  title: '3-Organisms/Linear/MarkdownContent',
  component: MarkdownContent,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Visor/editor de markdown con edición en el sitio (WYSIWYG): se ve renderizado, al pulsar se edita (contentEditable) y al guardar se vuelve a markdown. ' +
          '`autoSave` guarda al perder el foco; sin él aparece una barra con Cancelar/Guardar. ⌘/Ctrl+Intro guarda y Esc cancela. `MarkdownView` es la versión de solo lectura para comentarios.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof MarkdownContent>;

const SAMPLE = `## Objetivo

Dejar **todas** las tareas del trimestre cerradas.

- Revisar los precios por centro
- Confirmar las tarifas
- Avisar al cliente

| Centro | Precio |
| --- | --- |
| Serrano | 34,80 € |
| Retiro | 34,80 € |
`;

function Demo({ inicial, ...rest }: { inicial: string } & Partial<React.ComponentProps<typeof MarkdownContent>>) {
  const [value, setValue] = useState(inicial);
  return <MarkdownContent value={value} onChange={setValue} {...rest} />;
}

export const Default: Story = { name: 'Por defecto', render: () => <Demo inicial={SAMPLE} /> };

export const ConBotonesGuardar: Story = {
  name: 'Con botones Guardar / Cancelar',
  render: () => <Demo inicial={SAMPLE} autoSave={false} />,
};

export const Vacio: Story = { name: 'Vacío (marcador)', render: () => <Demo inicial="" /> };

export const SoloLectura: Story = { name: 'Solo lectura', render: () => <Demo inicial={SAMPLE} editable={false} /> };

export const Compacto: Story = { name: 'Compacto', render: () => <Demo inicial={SAMPLE} compact /> };

export const Vista: Story = {
  name: 'MarkdownView (comentarios)',
  render: () => <MarkdownView content={'Gracias, **ya está** corregido. Ver [la ficha](https://example.com).'} />,
};
