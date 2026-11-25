import type { Meta, StoryObj } from '@storybook/react';
import { InfoTip, TooltipProvider } from '@autonexhub/react';

/**
 * InfoTip — la «i» del sistema con un tooltip. Explica qué significa algo (una cifra, una fase) sin ponerlo como
 * etiqueta. Va pegada al nombre; sin contenido no pinta nada. Necesita un `TooltipProvider` por encima.
 */
const meta: Meta<typeof InfoTip> = {
  title: '2-Molecules/InfoTip',
  component: InfoTip,
  tags: ['autodocs'],
  decorators: [(Story) => <TooltipProvider delayDuration={100}><Story /></TooltipProvider>],
  args: { label: 'Qué es Pendiente', children: 'Nadie la ha empezado todavía. Pasa a En progreso cuando alguien la coge.' },
};
export default meta;
type Story = StoryObj<typeof InfoTip>;

export const Default: Story = {};

/** Pegada al nombre de una fase y con SU color (`text-current`). */
export const NextToPhase: Story = {
  render: () => (
    <div className="flex flex-col gap-3 text-sm">
      {[
        { name: 'Pendiente', color: 'text-warning', text: 'Nadie la ha empezado todavía.' },
        { name: 'En progreso', color: 'text-brand', text: 'Alguien la está atendiendo.' },
        { name: 'Resuelta', color: 'text-success', text: 'Se ha resuelto; se puede reabrir.' },
      ].map((p) => (
        <span key={p.name} className={`inline-flex items-center gap-0.5 font-medium ${p.color}`}>
          {p.name}
          <InfoTip label={`Qué es ${p.name}`} className="size-4 text-current opacity-70 hover:text-current hover:opacity-100">{p.text}</InfoTip>
        </span>
      ))}
    </div>
  ),
};

export const MultiLine: Story = {
  args: { label: 'Definición', children: 'Fuente: facturas emitidas.\nFórmula: cobrado / facturado.\nNombre técnico: collection_rate.' },
};

/** Sin contenido no se pinta. */
export const Empty: Story = { render: () => <span className="text-sm">Antes<InfoTip label="Nada" />después</span> };
