import { useState, type ReactNode } from 'react';
import {
  AppShell,
  QuotaCard,
  RealmRail,
  SidebarBookmarksItem,
  SidebarNavItem,
  SidebarSectionLabel,
  SidebarShell,
  TooltipProvider,
  UserMenu,
  WorkspaceSwitcher,
  cn,
  type QuotaView,
  type RailEntry,
  type SidebarBookmarkEntry,
  type WorkspaceOrganization,
} from '@autonexhub/react';
import {
  AddressBook,
  Bird,
  Buildings,
  CalendarCheck,
  CaretDown,
  ChartLineUp,
  ChatCenteredText,
  ChatCircleDots,
  ChatText,
  ChatsCircle,
  CheckSquare,
  Envelope,
  Gear,
  Handshake,
  Kanban,
  ListBullets,
  MagnifyingGlass,
  Megaphone,
  Package,
  Phone,
  PhoneOutgoing,
  PlugsConnected,
  Pulse,
  Receipt,
  Robot,
  Storefront,
  TestTube,
  Tray,
  UsersThree,
  Users,
  WhatsappLogo,
  Books,
} from '@phosphor-icons/react';

export type IconType = React.ComponentType<{ className?: string; weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone' }>;
export type RealmId = 'agents' | 'operations' | 'crm';

const noop = () => undefined;

export const REALM_LABELS: Record<RealmId, string> = {
  agents: 'Agentes IA',
  operations: 'Operaciones',
  crm: 'CRM',
};

/** Módulos de cada reino tal y como los pinta `OperationsSidebar` (secciones incluidas). */
export const REALM_MODULES: Record<RealmId, Array<[string, IconType, boolean?] | string>> = {
  agents: [
    ['Métricas', ChartLineUp],
    'Conversaciones',
    ['Todas', ChatsCircle],
    ['Teléfono', Phone, true],
    ['Web', ChatCircleDots, true],
    ['WhatsApp', WhatsappLogo, true],
    ['Casos Pendientes', Tray],
    'Marketing',
    ['Campañas', Megaphone],
    ['Llamadas Salientes', PhoneOutgoing],
    ['Plantillas', ChatText],
    'Notificaciones',
    ['Correos', Envelope],
    'Configuración',
    ['Base de conocimientos', Books],
    ['Comportamiento', ChatCenteredText],
    ['Conexiones', PlugsConnected],
    ['Pruebas', TestTube],
  ],
  operations: [
    ['Centros', Buildings],
    ['Servicios', Package],
    ['Equipo', UsersThree],
    ['Reservas', CalendarCheck],
  ],
  crm: [
    ['Contactos', AddressBook],
    ['Listas', ListBullets],
    ['Negocios', Handshake],
    ['Tareas', CheckSquare],
  ],
};

const REALM_ICONS: Record<RealmId, IconType> = {
  agents: Robot,
  operations: Storefront,
  crm: Users,
};

/** Entradas del rail de ejemplo (admin: con los cuatro contextos). */
export function demoRailEntries(realm: RealmId | null, { withContexts = true } = {}) {
  const realms: RailEntry[] = (['agents', 'operations', 'crm'] as RealmId[]).map((id) => ({
    id,
    label: REALM_LABELS[id],
    icon: REALM_ICONS[id],
    active: id === realm,
    onSelect: noop,
  }));
  const contexts: RailEntry[] = withContexts
    ? [
        { id: 'linear', label: 'Linear', icon: Kanban, onSelect: noop },
        { id: 'admin', label: 'Admin', icon: Gear, onSelect: noop },
        { id: 'finance', label: 'Finanzas', icon: Receipt, onSelect: noop },
        { id: 'devops', label: 'DevOps', icon: Pulse, onSelect: noop },
      ]
    : [];
  const footer: RailEntry[] = [
    { id: 'search', label: 'Buscar', icon: MagnifyingGlass, onSelect: noop },
    { id: 'rambo', label: 'Rambo IA', icon: Bird, onSelect: noop },
  ];
  return { realms, contexts, footer };
}

export const DEMO_ORGS: WorkspaceOrganization[] = [
  { id: '1', name: 'Joyas y Sangría' },
  { id: '2', name: 'Eurofitness' },
  { id: '3', name: 'Clínica Dental Sol' },
];

/** Selector de organización (WorkspaceSwitcher real) con datos de ejemplo. */
export function DemoOrgSwitcher({ expanded }: { expanded: boolean }) {
  const [current, setCurrent] = useState(DEMO_ORGS[0]);
  return <WorkspaceSwitcher organizations={DEMO_ORGS} current={current} onSelect={setCurrent} collapsed={!expanded} />;
}

/** Avatar del pie del rail (UserMenu real `variant="rail"`) con un usuario de ejemplo. */
export function DemoRailAccount({ expanded }: { expanded: boolean }) {
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('es');
  return (
    <UserMenu
      variant="rail"
      showName={expanded}
      user={{ name: 'Bruno Ramon Ros', email: 'bruno@autonex.es' }}
      theme={theme}
      onThemeChange={setTheme}
      language={language}
      onLanguageChange={setLanguage}
    />
  );
}

/** Datos de ejemplo del pie (QuotaCard): 30.500 min, renovación fija. */
export const DEMO_QUOTA: QuotaView = {
  pack_minutes: 45000,
  minutes_used: 14500,
  extra_minutes: 0,
  pack_name: 'Pack Pro 45.000',
  period_start: '2026-10-15',
};
export const DEMO_TODAY = new Date(2026, 9, 29); // 29 oct 2026

type ModuleRow = [string, IconType, boolean?];

/** Lista de módulos del reino (el contenido de `SidebarShell` en OperationsSidebar):
 *  Marcadores · título del reino · módulos. "Todas" lleva su caret y los canales
 *  cuelgan en UNA sub-lista con línea a la izquierda, como el Collapsible real. */
export function DemoModulesBody({ realm, active, bookmarks = true }: { realm: RealmId; active?: string; bookmarks?: boolean }) {
  const items = REALM_MODULES[realm];

  // Agrupa los sub-ítems consecutivos bajo su padre (el ítem anterior).
  const blocks: Array<{ kind: 'label'; label: string } | { kind: 'item'; row: ModuleRow; subs: ModuleRow[] }> = [];
  for (const it of items) {
    if (typeof it === 'string') blocks.push({ kind: 'label', label: it });
    else if (it[2] && blocks.length && blocks[blocks.length - 1].kind === 'item') {
      (blocks[blocks.length - 1] as { subs: ModuleRow[] }).subs.push(it);
    } else blocks.push({ kind: 'item', row: it, subs: [] });
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-0.5 p-2">
      {bookmarks && <SidebarBookmarksItem bookmarks={DEMO_BOOKMARKS} onRemove={noop} onReorder={noop} />}
      <div className="mb-1 flex h-[36px] shrink-0 items-center px-2.5 text-[17px] font-semibold tracking-tight text-foreground">
        {REALM_LABELS[realm]}
      </div>
      {blocks.map((b, i) => {
        if (b.kind === 'label') return <SidebarSectionLabel key={i} label={b.label} />;
        const [label, icon] = b.row;
        if (b.subs.length === 0) return <SidebarNavItem key={i} href="#" icon={icon} label={label} active={label === active} />;
        return (
          <div key={i}>
            {/* Enlace + caret separado (Collapsible.Trigger de OperationsSidebar). */}
            <div className="flex items-center">
              <div className="min-w-0 flex-1">
                <SidebarNavItem href="#" icon={icon} label={label} active={label === active} />
              </div>
              <span className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                <CaretDown className="size-4" />
              </span>
            </div>
            <div className="mx-3.5 flex min-w-0 translate-x-px flex-col gap-0.5 border-l border-border px-2.5 py-0.5">
              {b.subs.map(([subLabel, subIcon]) => (
                <SidebarNavItem key={subLabel} href="#" icon={subIcon} label={subLabel} size="sub" active={subLabel === active} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const DEMO_BOOKMARKS: SidebarBookmarkEntry[] = [
  { id: 'contacts', href: '#', label: 'Contactos', icon: AddressBook },
  { id: 'pending', href: '#', label: 'Casos Pendientes', icon: Tray },
];

/** Tarjeta de módulos del reino (`SidebarShell` real), `static` para ocupar su sitio en un flex. */
export function DemoModulesCard({
  realm,
  active,
  className,
  bookmarks = true,
  footer,
}: {
  realm: RealmId;
  active?: string;
  className?: string;
  /** Pinta la fila "Marcadores" (en la app solo sale con algún marcador). */
  bookmarks?: boolean;
  /** Pie de la tarjeta; por defecto la QuotaCard con datos de ejemplo. */
  footer?: ReactNode;
}) {
  return (
    <SidebarShell className={cn('static h-full shrink-0', className)} footer={footer ?? <QuotaCard view={DEMO_QUOTA} today={DEMO_TODAY} />}>
      <DemoModulesBody realm={realm} active={active} bookmarks={bookmarks} />
    </SidebarShell>
  );
}

/**
 * Marco del CHASIS para Storybook: monta el `AppShell` real (rail, tarjeta de
 * módulos y tarjeta de contenido) dentro de un contenedor con `transform`,
 * que hace de bloque contenedor de los elementos `fixed`.
 */
export interface AppShellFrameProps {
  children: ReactNode;
  /** Reino activo (rail + tarjeta de módulos + primer segmento de la miga). */
  realm?: RealmId;
  /** Etiqueta de la página en la miga (`Reino › {page}`). */
  page?: string;
  /** Tercer segmento (fichas: `… › Contactos › Nombre`). */
  entity?: string;
  /** Módulo activo en la tarjeta de módulos. */
  active?: string;
  /** Rail desplegado (como al pasar el ratón). */
  railExpanded?: boolean;
  /** Rail fijado con la chincheta. */
  railPinned?: boolean;
  /** Tarjeta de módulos plegada (oculta). */
  modulesCollapsed?: boolean;
  /** Página de Rambo IA a pantalla completa: la miga es solo "Rambo IA", el rail
   *  marca Rambo y la cabecera no lleva el botón lila. */
  onAssistantPage?: boolean;
  /** Panel del asistente abierto (400px) con este contenido. */
  assistantOpen?: boolean;
  assistantPanel?: ReactNode;
  /** Alto del marco (por defecto 720px). */
  height?: number;
  className?: string;
}

export function AppShellFrame({
  children,
  realm = 'agents',
  page = 'Conversaciones',
  entity,
  active,
  railExpanded = false,
  railPinned = false,
  modulesCollapsed = false,
  onAssistantPage = false,
  assistantOpen = false,
  assistantPanel,
  height = 720,
  className,
}: AppShellFrameProps) {
  const rail = demoRailEntries(onAssistantPage ? null : realm);
  if (onAssistantPage) rail.footer = rail.footer.map((e) => (e.id === 'rambo' ? { ...e, active: true } : e));
  const activeModule = onAssistantPage ? undefined : active ?? (page === 'Conversaciones' ? 'Todas' : page);

  return (
    <TooltipProvider>
      <div className={cn('relative w-full overflow-hidden', className)} style={{ height, transform: 'translateZ(0)' }}>
        <AppShell
          className="h-full"
          isMobile={false}
          collapsed={modulesCollapsed}
          railPinned={railPinned}
          sectionLabel={onAssistantPage ? undefined : REALM_LABELS[realm]}
          pageLabel={page}
          entityLabel={entity}
          pageHref="#"
          onToggleSidebar={noop}
          onFeedback={noop}
          showAssistantButton={!onAssistantPage}
          assistantPanelOpen={assistantOpen}
          assistantPanel={assistantPanel}
          onAssistantClick={noop}
          rail={
            <RealmRail
              {...rail}
              className="absolute left-0 top-0 z-50 h-full"
              ariaLabel="Navegación principal"
              pinned={railPinned}
              onTogglePin={noop}
              pinLabel={railPinned ? 'Soltar menú' : 'Fijar menú'}
              forceExpanded={railExpanded}
              brand={(expanded) => <DemoOrgSwitcher expanded={expanded} />}
              account={(expanded) => <DemoRailAccount expanded={expanded} />}
            />
          }
          sidebar={
            <SidebarShell
              className="absolute h-[calc(100%-1rem)]"
              collapsed={modulesCollapsed}
              railPinned={railPinned}
              footer={<QuotaCard view={DEMO_QUOTA} today={DEMO_TODAY} />}
            >
              <DemoModulesBody realm={realm} active={activeModule} />
            </SidebarShell>
          }
        >
          {children}
        </AppShell>
      </div>
    </TooltipProvider>
  );
}
