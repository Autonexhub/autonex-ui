import type { Meta, StoryObj } from '@storybook/react';
import { AssistantSidePanel, TooltipProvider } from '@autonexhub/react';
import { ANSWER_WITH_RESULTS, USER_Q } from '../assistant-mocks';

const noop = () => undefined;

/**
 * Panel lateral de Rambo IA (estilo Hostinger, Bruno 29/10). Componente
 * presentacional: la app aporta mensajes, estado `pending` y callbacks.
 */
const meta: Meta<typeof AssistantSidePanel> = {
  title: '3-Organisms/AssistantSidePanel',
  component: AssistantSidePanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
**Rambo IA a la derecha de todas las páginas con organización.** Tarjeta de **400px** (mismo radio,
borde y \`shadow-elev\` que las demás) que **estrecha** la tarjeta de contenido; 8px de aire.

- **Se abre** con el botón lila **Rambo IA** de la cabecera (\`bg-ai-soft text-ai\`, igual abierto
  que cerrado) o con Rambo IA del rail; se cierra con la X. El estado se recuerda por navegador.
- **Cabecera h-12**: pájaro en la tinta del texto (no lila) + "Rambo IA" + historial + chat nuevo
  (solo con hilo) + cerrar.
- **Reposo**: pájaro grande en **lila** (\`text-ai\`), "¿Qué necesitas de {organización}?" y la
  caja de escribir abajo con el aviso.
- **Con hilo**: \`AssistantChat\` en modo \`compact\` (menos aire, sin su fila de botones).
- **Mismo asistente** que la página Rambo IA. Al navegar recupera el chat abierto de la organización.
  Los resultados de conversación navegan a su ficha.
- **No sale** en la propia página Rambo IA (\`/ops/dashboard\`), sin organización ni en móvil
  (allí el botón lleva a la página).
- Textos configurables con \`labels\` (por defecto en español).
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <div className="flex h-[720px] justify-end bg-sidebar p-2">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
  args: {
    className: 'h-full w-[400px]',
    orgName: 'Joyas y Sangría',
    messages: [],
    active: false,
    onSend: noop,
    onReset: noop,
    onOpenChats: noop,
    onClose: noop,
  },
};

export default meta;
type Story = StoryObj<typeof AssistantSidePanel>;

export const Reposo: Story = {};

export const ConRespuesta: Story = {
  name: 'Con respuesta y resultados',
  args: {
    active: true,
    messages: ANSWER_WITH_RESULTS.map((m) => (m.role === 'assistant' ? { ...m, revealed: true } : m)),
  },
};

export const Pensando: Story = {
  args: { active: true, pending: true, messages: [USER_Q] },
};

export const SinOrganizacion: Story = {
  name: 'Sin organización (no se puede escribir)',
  args: { orgName: null },
};
