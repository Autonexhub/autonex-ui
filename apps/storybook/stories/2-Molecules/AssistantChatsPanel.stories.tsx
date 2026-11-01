import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { AssistantChatsPanel, Button, TooltipProvider } from '@autonexhub/react';
import { MOCK_CHATS } from '../assistant-mocks';

const meta: Meta<typeof AssistantChatsPanel> = {
  title: '2-Molecules/AssistantChatsPanel',
  component: AssistantChatsPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Historial de chats: panel derecho en la variante flotante `inline` del `Sheet`, con buscador, fila "Nueva conversación", lista (título + autor · fecha), renombrar en línea y borrar con `AlertDialog`. Presentacional: la lista, `loading`, `error` y `query` los aporta la app.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof AssistantChatsPanel>;

const Demo = ({ initial, loading, error }: { initial: typeof MOCK_CHATS; loading?: boolean; error?: boolean }) => {
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState('');
  const [chats, setChats] = useState(initial);
  const [activeId, setActiveId] = useState<string | number | null>('chat_1');
  return (
    <TooltipProvider>
      <div className="relative h-[640px] bg-background p-6">
        <Button variant="outline" onClick={() => setOpen(true)}>Abrir historial</Button>
        <AssistantChatsPanel
          open={open}
          onOpenChange={setOpen}
          chats={chats.filter((c) => c.title.toLowerCase().includes(query.trim().toLowerCase()))}
          loading={loading}
          error={error}
          query={query}
          onQueryChange={setQuery}
          onRename={(id, title) => setChats((prev) => prev.map((c) => (c.id === id ? { ...c, title } : c)))}
          onDelete={(id) => setChats((prev) => prev.filter((c) => c.id !== id))}
          activeChatId={activeId}
          onSelect={(id) => setActiveId(id)}
          onNewChat={() => setActiveId(null)}
        />
      </div>
    </TooltipProvider>
  );
};

export const Default: Story = { render: () => <Demo initial={MOCK_CHATS} /> };
export const Cargando: Story = { render: () => <Demo initial={[]} loading /> };
export const Vacio: Story = { render: () => <Demo initial={[]} /> };
export const ConError: Story = { render: () => <Demo initial={[]} error /> };
