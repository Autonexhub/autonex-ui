import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  AssistantChat,
  AssistantChatActions,
  AssistantChatsPanel,
  AssistantComposer,
  DEFAULT_ASSISTANT_CHAT_LABELS,
  TooltipProvider,
  type AssistantThreadMessage,
} from '@autonexhub/react';
import {
  ANSWER_WITH_RESULTS,
  ASSISTANT_ERROR_TEXT,
  MOCK_CHATS,
  UNSUPPORTED_AND_ERROR,
  USER_Q,
  mockAssistantQuery,
} from '../assistant-mocks';

const noop = () => undefined;

/** Estado HOME de la página Rambo IA: saludo + subtítulo arriba, la caja de
 *  escribir en el centro exacto y el aviso debajo. */
const HomeState = ({ onSend = noop, onOpenChats }: { onSend?: (q: string) => void; onOpenChats?: () => void }) => (
  <div className="relative flex min-h-full flex-col px-10 py-6">
    {/* Mismos dos botones de icono que en el estado CHAT. */}
    <AssistantChatActions className="absolute right-10 top-4 z-10" onOpenChats={onOpenChats} onNewChat={noop} showNewChat={false} />
    <div className="grid min-h-[560px] flex-1 grid-rows-[1fr_auto_1fr] items-center justify-items-center">
      <div className="flex flex-col items-center justify-end self-end pb-10">
        <h1 className="mb-4 text-center text-2xl font-normal tracking-tight text-foreground sm:text-4xl">
          Buenas tardes, <span className="font-medium">Joyas y Sangría</span>
        </h1>
        <p className="max-w-lg text-balance text-center text-sm text-muted-foreground">
          Versión beta: consulta conversaciones y métricas de tu organización.
        </p>
      </div>
      <div className="w-full max-w-[640px]">
        <AssistantComposer onSend={onSend} />
      </div>
      <p className="self-start pt-4 text-center text-xs text-muted-foreground">{DEFAULT_ASSISTANT_CHAT_LABELS.disclaimer}</p>
    </div>
  </div>
);

const meta: Meta = {
  title: '4-Templates/AssistantChat',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Buscador con IA v1 del Inicio (UX aprobada por Bruno 03/09, "como Claude, lo más simple posible").
Se muestra DENTRO de una tarjeta de contenido (aquí, un marco con alto fijo).

- **HOME**: saludo + subtítulo + caja de chat (\`AssistantComposer\`: Textarea 1-4 líneas, botón
  redondo \`bg-primary\` con ArrowUp activo solo con texto; Enter envía, Shift+Enter salta línea).
- **CHAT** (misma página): hilo \`max-w-3xl mx-auto\` con scroll interno y la caja fija abajo.
  Usuario a la derecha en \`Bubble variant="default"\`; asistente a la izquierda SIN burbuja, texto
  plano con encabezado pájaro \`text-ai\` + "Rambo IA" solo cuando cambia el turno.
- **Cargando**: fila pájaro \`text-ai\` + palabra que rota (Pensando, Reflexionando, Consultando,
  Buscando, Repasando, Ordenando ideas) + tres puntos \`animate-pulse\` escalonados. Sin skeleton.
- **Respuesta**: revelado por palabras (~25 ms/palabra; instantáneo con
  \`prefers-reduced-motion\`); los resultados (\`Item\` clicables) aparecen al terminar.
- **Unsupported / error**: la respuesta se pinta igual sin resultados; el error añade "Reintentar" (ghost sm). Sin toasts.
- **Acciones (arriba a la derecha)**: dos botones de SOLO ICONO \`ghost icon-sm text-muted-foreground\` (32px),
  sin texto visible — \`SidebarSimple\` (aria-label + Tooltip "Chats", abre el historial) y \`Plus\`
  (aria-label + Tooltip "Nueva conversación"). Iguales en HOME y en CHAT (\`AssistantChatActions\`).
- **Textos**: todos configurables con \`labels\` (Partial sobre los valores en español por defecto).

Regla corta en DesignRules › "Asistente (chat)".
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <TooltipProvider>
        {/* Marco de la tarjeta de contenido; `relative` es el ancla del panel de Chats. */}
        <div className="relative h-[720px] overflow-y-auto bg-background">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
};
export default meta;

type Story = StoryObj;

export const Home: Story = {
  name: '1 · Inicio',
  render: () => <HomeState />,
};

export const Cargando: Story = {
  name: '2 · Cargando (Pensando…)',
  render: () => (
    <AssistantChat messages={[USER_Q]} pending thinkingWord="Pensando" onSend={noop} onReset={noop} />
  ),
};

export const RespuestaConResultados: Story = {
  name: '3 · Respuesta con resultados',
  render: () => (
    <AssistantChat
      messages={ANSWER_WITH_RESULTS}
      onSend={noop}
      onReset={noop}
      onOpenResult={(r) => alert(`Navegaría a ${r.url}`)}
    />
  ),
};

export const UnsupportedYError: Story = {
  name: '4 · No soportado + error (Reintentar)',
  render: () => (
    <AssistantChat
      messages={UNSUPPORTED_AND_ERROR}
      onSend={noop}
      onReset={noop}
      onRetry={(q) => alert(`Reenviaría: ${q}`)}
    />
  ),
};

/** Flujo completo contra un mock (1-2 s de espera, luego revelado por palabras). */
const InteractiveDemo = () => {
  const [messages, setMessages] = useState<AssistantThreadMessage[]>([]);
  const [pending, setPending] = useState(false);

  const send = async (question: string, history: AssistantThreadMessage[] = messages) => {
    const base: AssistantThreadMessage[] = [...history, { id: `u-${Date.now()}`, role: 'user', content: question }];
    setMessages(base);
    setPending(true);
    try {
      const res = await mockAssistantQuery(question);
      setMessages([
        ...base,
        { id: `a-${Date.now()}`, role: 'assistant', content: res.answer, results: res.results, scope: res.scope, question },
      ]);
    } catch {
      setMessages([
        ...base,
        { id: `e-${Date.now()}`, role: 'assistant', content: ASSISTANT_ERROR_TEXT, results: [], scope: 'ok', error: true, question },
      ]);
    } finally {
      setPending(false);
    }
  };

  if (messages.length === 0) return <HomeState onSend={(q) => void send(q)} />;
  return (
    <AssistantChat
      messages={messages}
      pending={pending}
      onSend={(q) => void send(q)}
      onRetry={(q) => void send(q, messages.slice(0, -2))}
      onReset={() => setMessages([])}
      onRevealed={(id) => setMessages((prev) => prev.map((m) => (m.id === id && m.role === 'assistant' ? { ...m, revealed: true } : m)))}
      onOpenResult={(r) => alert(`Navegaría a ${r.url}`)}
    />
  );
};

export const Interactivo: Story = {
  name: '5 · Interactivo (mock)',
  parameters: {
    docs: {
      description: {
        story:
          'Escribe "llamadas" (métricas), "conversaciones" (resultados), "error" (fallo con Reintentar) o cualquier otra cosa (unsupported).',
      },
    },
  },
  render: () => <InteractiveDemo />,
};

/** Estado CHAT con el panel de Chats abierto (buscador + lista + acciones). */
const ChatsPanelDemo = () => {
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState('');
  const [chats, setChats] = useState(MOCK_CHATS);
  const [activeId, setActiveId] = useState<string | number | null>('chat_1');

  return (
    <>
      <AssistantChat messages={ANSWER_WITH_RESULTS} onSend={noop} onReset={noop} onOpenChats={() => setOpen(true)} />
      <AssistantChatsPanel
        open={open}
        onOpenChange={setOpen}
        chats={chats.filter((c) => c.title.toLowerCase().includes(query.trim().toLowerCase()))}
        query={query}
        onQueryChange={setQuery}
        onRename={(id, title) => setChats((prev) => prev.map((c) => (c.id === id ? { ...c, title } : c)))}
        onDelete={(id) => setChats((prev) => prev.filter((c) => c.id !== id))}
        activeChatId={activeId}
        onSelect={(id) => {
          setActiveId(id);
          setOpen(false);
        }}
        onNewChat={() => {
          setActiveId(null);
          setOpen(false);
        }}
      />
    </>
  );
};

export const PanelDeChats: Story = {
  name: '6 · Panel de Chats (historial)',
  parameters: {
    docs: {
      description: {
        story:
          'Historial a la derecha en la variante flotante `inline` del Sheet: buscador (`InputGroup h-10`), fila destacada "Nueva conversación" (`Plus`) arriba de la lista —con el panel abierto el botón "+" de la cabecera queda tapado—, y la lista con título + quién lo creó y cuándo; al hover, renombrar (edición en línea) y borrar (AlertDialog que nombra el chat). El icono `Info` junto al título lleva el aviso de privacidad (30 días, visible para todo el equipo).',
      },
    },
  },
  render: () => <ChatsPanelDemo />,
};
