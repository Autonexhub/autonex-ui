import type { Meta, StoryObj } from '@storybook/react';
import { Bubble, BubbleContent, BubbleGroup, BubbleReactions } from '@autonexhub/react';
import { Avatar, AvatarFallback } from '@autonexhub/react';

const meta: Meta = {
  title: '2-Molecules/Bubble',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Burbuja de chat para los mensajes de una conversación. Forma horneada en \`ui/bubble.tsx\`:
\`rounded-3xl\` con la esquina superior del lado de la etiqueta recortada a \`md\`.

## Variantes canónicas (las que usa la app)
- **muted**: cliente / usuario — gris \`bg-muted\`, a la izquierda.
- **agent**: agente IA — tinte suave de marca \`bg-brand-soft\`, texto en tinta, a la derecha.
- **tinted**: operador humano — tinte neutro de la tinta, a la derecha (Inbox, conversaciones de
  WhatsApp, detalle de conversación, casos pendientes). El tinte lo pone el componente
  (\`bg-primary/10\`, no es un token del DS); en páginas y stories nunca se re-declara a mano.

## Variantes auxiliares
- **default**: tinta sólida (\`bg-primary\`).
- **secondary**: fondo \`bg-secondary\`.
- **outline**: solo borde, fondo blanco.
- **ghost**: texto plano sin burbuja.
- **brand**: azul de marca sólido (\`bg-brand\`) — cuenta como el único azul de la pantalla.
- **destructive**: error o aviso (\`bg-destructive/10 text-destructive\`).

## Alineación
- \`align="start"\`: izquierda (por defecto; cliente).
- \`align="end"\`: derecha (agente IA y operador).

## Patrón canónico (Design Rules)
Cliente = izquierda, \`variant="muted"\`. Agente IA = derecha, \`variant="agent"\`. Operador humano = derecha, \`variant="tinted"\`.

\`\`\`tsx
<BubbleGroup>
  <Bubble variant="muted">
    <BubbleContent>Mensaje del cliente</BubbleContent>
  </Bubble>
  <Bubble variant="agent" align="end">
    <BubbleContent>Respuesta del agente IA</BubbleContent>
  </Bubble>
  <Bubble variant="tinted" align="end">
    <BubbleContent>Respuesta del operador</BubbleContent>
  </Bubble>
</BubbleGroup>
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
    <Bubble>
      <BubbleContent>
        Hola, ¿en qué puedo ayudarte hoy?
      </BubbleContent>
    </Bubble>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">agent (agente, derecha)</p>
        <Bubble variant="agent" align="end">
          <BubbleContent>Mensaje del agente con estilo agent</BubbleContent>
        </Bubble>
      </div>
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">muted (usuario, izquierda)</p>
        <Bubble variant="muted">
          <BubbleContent>Mensaje del usuario con estilo muted</BubbleContent>
        </Bubble>
      </div>
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">default</p>
        <Bubble variant="default">
          <BubbleContent>Mensaje con estilo default</BubbleContent>
        </Bubble>
      </div>
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">secondary</p>
        <Bubble variant="secondary">
          <BubbleContent>Mensaje con estilo secondary</BubbleContent>
        </Bubble>
      </div>
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">tinted (operador humano, derecha)</p>
        <Bubble variant="tinted" align="end">
          <BubbleContent>Mensaje del operador con estilo tinted</BubbleContent>
        </Bubble>
      </div>
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">outline</p>
        <Bubble variant="outline">
          <BubbleContent>Mensaje con estilo outline</BubbleContent>
        </Bubble>
      </div>
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">brand</p>
        <Bubble variant="brand">
          <BubbleContent>Mensaje con estilo brand</BubbleContent>
        </Bubble>
      </div>
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">destructive</p>
        <Bubble variant="destructive">
          <BubbleContent>Mensaje de error o advertencia</BubbleContent>
        </Bubble>
      </div>
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">ghost</p>
        <Bubble variant="ghost">
          <BubbleContent>Texto plano sin estilo de burbuja</BubbleContent>
        </Bubble>
      </div>
    </div>
  ),
};

export const Conversation: Story = {
  render: () => (
    <BubbleGroup className="max-w-md">
      <Bubble variant="muted">
        <BubbleContent>Hola, quiero pedir cita para mañana</BubbleContent>
      </Bubble>
      <Bubble variant="agent" align="end">
        <BubbleContent>
          ¡Hola! Claro, puedo ayudarte con eso. ¿A qué hora te vendría bien?
        </BubbleContent>
      </Bubble>
      <Bubble variant="muted">
        <BubbleContent>Por la mañana si es posible, sobre las 10</BubbleContent>
      </Bubble>
      <Bubble variant="agent" align="end">
        <BubbleContent>
          Perfecto, tengo disponible mañana a las 10:00. ¿Te confirmo la cita?
        </BubbleContent>
      </Bubble>
      <Bubble variant="muted">
        <BubbleContent>Sí, por favor</BubbleContent>
      </Bubble>
      <Bubble variant="agent" align="end">
        <BubbleContent>
          ¡Listo! Tu cita ha sido confirmada para mañana a las 10:00. Te enviaré un recordatorio por WhatsApp.
        </BubbleContent>
      </Bubble>
    </BubbleGroup>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Conversación completa canónica: usuario (muted, izquierda) y agente (agent, derecha).',
      },
    },
  },
};

export const WithAvatar: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <div className="flex gap-2 items-end">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-muted text-xs">ML</AvatarFallback>
        </Avatar>
        <Bubble variant="muted">
          <BubbleContent>
            Hola, tengo una duda sobre mi tratamiento.
          </BubbleContent>
        </Bubble>
      </div>
      <div className="flex gap-2 items-end justify-end">
        <Bubble variant="agent" align="end">
          <BubbleContent>
            Buenos días, soy el asistente virtual de la clínica.
          </BubbleContent>
        </Bubble>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs">IA</AvatarFallback>
        </Avatar>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Burbujas con avatar del remitente: usuario a la izquierda, agente a la derecha.',
      },
    },
  },
};


export const LongMessage: Story = {
  render: () => (
    <BubbleGroup className="max-w-lg">
      <Bubble variant="agent" align="end">
        <BubbleContent>
          Entiendo tu situación. Voy a explicarte las opciones disponibles para tu tratamiento:
          <br /><br />
          1. <span className="font-medium">Opción conservadora:</span> Seguimiento periódico cada 3 meses con radiografías de control.
          <br /><br />
          2. <span className="font-medium">Tratamiento activo:</span> Comenzar con fisioterapia 2 veces por semana durante 6 semanas.
          <br /><br />
          3. <span className="font-medium">Intervención:</span> En casos más severos, podríamos considerar una intervención menor.
          <br /><br />
          ¿Te gustaría que te explique alguna de estas opciones con más detalle?
        </BubbleContent>
      </Bubble>
    </BubbleGroup>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Mensaje largo con contenido formateado.',
      },
    },
  },
};

/** `BubbleReactions`: pastilla de reacciones anclada al borde de la burbuja (`side` arriba/abajo, `align` inicio/fin).
 *  La burbuja necesita `relative` y margen inferior/superior para que la pastilla no pise el mensaje siguiente. */
export const WithReactions: Story = {
  name: 'Con reacciones',
  render: () => (
    <BubbleGroup>
      <Bubble variant="muted" className="relative mb-4">
        <BubbleContent>¿Podéis confirmarme la cita del jueves a las 10:30?</BubbleContent>
        <BubbleReactions align="start">
          <span>👍</span>
          <span className="text-xs tabular-nums text-muted-foreground">2</span>
        </BubbleReactions>
      </Bubble>
      <Bubble variant="agent" align="end" className="relative mt-4">
        <BubbleReactions side="top" align="end">
          <span>✅</span>
        </BubbleReactions>
        <BubbleContent>Confirmada: jueves 12 a las 10:30 en el centro de Serrano.</BubbleContent>
      </Bubble>
    </BubbleGroup>
  ),
};
