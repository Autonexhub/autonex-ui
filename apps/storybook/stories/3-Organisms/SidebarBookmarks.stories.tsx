import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  SidebarBookmarksItem,
  SidebarNavItem,
  SidebarSectionLabel,
  TooltipProvider,
  type SidebarBookmarkEntry,
  type SidebarIcon,
} from '@autonexhub/react';
import { AddressBook, Books, ChartLineUp, ChatsCircle, Envelope, Tray } from '@phosphor-icons/react';

/**
 * Marcadores (decisión Bruno 03/09, patrón HubSpot): fila fija "Marcadores"
 * arriba de la tarjeta de módulos, con Popover a la derecha + chincheta al
 * hover en cada ítem. El módulo marcado NO se mueve de su sección.
 */
const meta: Meta = {
  title: '3-Organisms/SidebarBookmarks',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
**Qué es:** atajos a los módulos que el usuario usa más, de cualquier reino. Es la **primera fila
de la tarjeta de módulos** (encima del título del reino), con \`BookmarkSimple\` y \`CaretRight\`;
abre un **Popover** oficial a la derecha (\`side="right" align="start" w-64\`) con los módulos
marcados (mismo estilo que los ítems de la sidebar, hover \`bg-sidebar-accent\`). En cada fila, al
hover, el botón \`PushPinSlash\` (ghost 24px, "Quitar marcador") desancla al momento.
Al pie, tras \`Separator\`, la fila **Administrar** (\`PencilSimple\`) abre un **Dialog**
oficial SOLO para ordenar (arrastre o teclado).
La fila solo se pinta cuando hay algún módulo marcado; la chincheta de los ítems
ilumina solo su propio fondo al pasar por ella, no el módulo entero.

**Apertura por hover condicionada** (\`SidebarArmedContext\` / prop \`armed\`): si el último clic fue dentro
de la sidebar, pasar el ratón por "Marcadores" abre el Popover sin clic (120 ms) y se
cierra al salir de fila+popover; si el último clic fue fuera, hace falta clic.
\`SidebarShell\` provee ese estado. (En esta story no hay shell: siempre hace falta clic.)

En cada ítem de la sidebar aparece al hover la chincheta \`PushPin\` (24px, ghost,
\`opacity-0 group-hover:opacity-100\`, aria-label "Marcar"); si ya está marcado,
\`PushPinSlash\` + "Quitar marcador".

**Presentacional:** \`SidebarBookmarksItem\` recibe \`bookmarks\` ya resueltos (\`{ id, href, label, icon, active }\`),
\`onRemove(id)\` y \`onReorder(ids)\`; el enlace se pinta con \`renderLink\`. La persistencia por usuario
(\`localStorage\`), el mapa nombre→icono y la traducción de etiquetas viven en la app
(\`useSidebarBookmarks\`). \`SidebarNavItem\` recibe \`bookmarkable\`, \`bookmarked\` y \`onToggleBookmark\`.
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <TooltipProvider>
        {/* Chasis de escritorio: lienzo gris + tarjeta de módulos (SidebarShell). */}
        <div className="flex h-[600px] gap-2 bg-sidebar p-2 pl-[56px]">
          <aside className="flex h-full w-[240px] shrink-0 flex-col overflow-hidden rounded-xl border border-border bg-background shadow-elev tracking-normal">
            <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2">
              <div className="flex w-full min-w-0 flex-col gap-0.5 p-2">
                <Story />
              </div>
            </nav>
          </aside>
          <main className="flex-1 rounded-xl border border-border bg-background p-8 shadow-elev">
            <h1 className="text-2xl font-semibold">Métricas</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Pasa el ratón por un ítem para ver la chincheta; pulsa "Marcadores" para abrir el Popover.
            </p>
          </main>
        </div>
      </TooltipProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj;

const BASE = '/org/demo/ops';

interface Mod { href: string; label: string; icon: SidebarIcon }
const MODS: Record<string, Mod> = {
  metrics: { href: `${BASE}/metrics`, label: 'Métricas', icon: ChartLineUp },
  conversations: { href: `${BASE}/conversations`, label: 'Todas', icon: ChatsCircle },
  pending: { href: `${BASE}/pending-cases`, label: 'Casos Pendientes', icon: Tray },
  emails: { href: `${BASE}/emails`, label: 'Correos', icon: Envelope },
  kb: { href: `${BASE}/kb`, label: 'Base de conocimientos', icon: Books },
  contacts: { href: `${BASE}/contacts`, label: 'Contactos', icon: AddressBook },
};

const entry = (m: Mod): SidebarBookmarkEntry => ({ id: m.href, ...m });

function Demo({ initial }: { initial: Mod[] }) {
  const [bookmarks, setBookmarks] = useState<SidebarBookmarkEntry[]>(initial.map(entry));
  const isBookmarked = (href: string) => bookmarks.some((b) => b.id === href);
  const toggle = (m: Mod) =>
    setBookmarks((list) => (list.some((b) => b.id === m.href) ? list.filter((b) => b.id !== m.href) : [...list, entry(m)]));
  const reorder = (ids: string[]) =>
    setBookmarks((list) => ids.map((id) => list.find((b) => b.id === id)).filter((b): b is SidebarBookmarkEntry => !!b));

  const item = (key: keyof typeof MODS, active = false) => (
    <SidebarNavItem
      {...MODS[key]}
      active={active}
      bookmarkable
      bookmarked={isBookmarked(MODS[key].href)}
      onToggleBookmark={() => toggle(MODS[key])}
    />
  );

  return (
    <>
      <SidebarBookmarksItem
        bookmarks={bookmarks}
        onRemove={(id) => setBookmarks((list) => list.filter((b) => b.id !== id))}
        onReorder={reorder}
      />
      <div className="mb-1 flex h-[36px] shrink-0 items-center px-2.5 text-[17px] font-semibold tracking-tight text-foreground">
        Agentes IA
      </div>
      {item('metrics', true)}
      <SidebarSectionLabel label="Conversaciones" />
      {item('conversations')}
      {item('pending')}
      <SidebarSectionLabel label="Notificaciones" />
      {item('emails')}
      <SidebarSectionLabel label="Configuración" />
      {item('kb')}
    </>
  );
}

/** Tres módulos marcados (uno de CRM: los marcadores cruzan reinos). El Popover
 *  los lista en orden; Administrar los reordena. */
export const TresMarcados: Story = {
  render: () => <Demo initial={[MODS.contacts, MODS.pending, MODS.kb]} />,
};

/** Sin marcadores: la fila "Marcadores" no se pinta y la tarjeta empieza por el título del reino. */
export const SinMarcadores: Story = {
  render: () => <Demo initial={[]} />,
};
