import type { Meta, StoryObj } from '@storybook/react';
import { Bubble, BubbleContent, BubbleGroup } from '@autonexhub/react';
import { Avatar, AvatarFallback } from '@autonexhub/react';

const meta: Meta = {
  title: '2-Molecules/Bubble',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Chat bubble component for conversation messages.

## Variants
- **agent**: Canonical for agent messages — soft brand tint (bg-brand-soft), ink text, right-aligned
- **muted**: Gray background, canonical for user messages (left-aligned)
- **default**: Primary color (dark ink)
- **secondary**: Secondary background
- **tinted**: Light tint of primary color
- **outline**: Border only, transparent background
- **ghost**: No styling, raw text
- **brand**: Brand color (tokens bg-brand / text-brand-foreground)
- **destructive**: Error/warning styling

## Alignment
- \`align="start"\`: Left-aligned (default; user messages)
- \`align="end"\`: Right-aligned (agent messages)

## Pattern (canonical, Design Rules)
User = left, \`variant="muted"\`. Agent = right, \`variant="agent"\`.

\`\`\`tsx
<BubbleGroup>
  <Bubble variant="muted">
    <BubbleContent>Mensaje del usuario</BubbleContent>
  </Bubble>
  <Bubble variant="agent" align="end">
    <BubbleContent>Respuesta del agente</BubbleContent>
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
        <p className="text-xs text-muted-foreground">tinted</p>
        <Bubble variant="tinted">
          <BubbleContent>Mensaje con estilo tinted</BubbleContent>
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
          <AvatarFallback className="text-xs">AI</AvatarFallback>
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
          1. <strong>Opción conservadora:</strong> Seguimiento periódico cada 3 meses con radiografías de control.
          <br /><br />
          2. <strong>Tratamiento activo:</strong> Comenzar con fisioterapia 2 veces por semana durante 6 semanas.
          <br /><br />
          3. <strong>Intervención:</strong> En casos más severos, podríamos considerar una intervención menor.
          <br /><br />
          ¿Te gustaría que te explique alguna de estas opciones con más detalle?
        </BubbleContent>
      </Bubble>
    </BubbleGroup>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Long message with formatted content.',
      },
    },
  },
};
