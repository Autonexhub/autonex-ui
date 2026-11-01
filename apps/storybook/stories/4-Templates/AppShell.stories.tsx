import type { Meta, StoryObj } from '@storybook/react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@autonexhub/react';
import { AppShellFrame } from './AppShellFrame';

/**
 * El chasis del panel con navegación por reinos (Bruno 29/10, sobre el chasis
 * inset del 03/09). Es el componente `AppShell` del paquete (con `RealmRail` y
 * `SidebarShell` en sus slots); `MainLayout` de la app lo monta aportando router,
 * contextos y datos. El marco `AppShellFrame.tsx` lo contiene en un bloque con `transform`
 * para que los elementos `fixed` queden dentro del canvas de Storybook.
 */
const meta: Meta = {
  title: '4-Templates/AppShell',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
**Chasis con reinos — decisión Bruno 29/10** (patrón Intercom + agente a la derecha estilo Hostinger).
De izquierda a derecha, todo sobre el **lienzo** gris \`bg-sidebar\` (#F5F5F5, \`h-screen overflow-hidden\`):

1. **Rail de reinos (48px)** sobre el lienzo, sin tarjeta: organización arriba, los **reinos**
   (Agentes IA · Operaciones · CRM), separador, los **contextos** a los que tienes acceso
   (Linear · Admin · Finanzas · DevOps) y abajo Buscar (⌘K), Rambo IA y el avatar.
   - Activo sobre el lienzo = **píldora blanca** con sombra mínima.
   - **Al pasar el ratón** (retardo 150ms) se despliega como **tarjeta blanca de alto completo**
     (208px, esquinas derechas redondeadas, \`shadow-elev\`) **por encima** de todo, sin mover la página.
     Ahí el activo pasa a la píldora gris de la sidebar.
   - **Chincheta** (arriba a la derecha, desplegado): fija el rail abierto a 208px **sobre el lienzo**
     (sin tarjeta) y empuja el resto. Se recuerda por navegador.
2. **Tarjeta de módulos (240px)**: blanca, flotante, mismo radio/borde/sombra que la del contenido.
   Título del reino (17px, Inter 600) y **solo** los módulos de ese reino. Activo = píldora gris
   \`bg-sidebar-accent\`, hover \`bg-sidebar-accent/60\`. Pie: cuota de minutos.
   **Plegar** (botón de la cabecera) la **oculta entera**: se desliza por debajo del rail
   mientras el contenido se abre (300ms ease-out a la vez).
3. **Tarjeta de contenido** \`bg-background rounded-xl border border-border shadow-elev\` con la
   **cabecera dentro** (\`h-12 border-b\`): [plegar] **Reino › Página** (› Entidad en fichas) ·
   Comentarios · botón **Rambo IA** en lila (\`bg-ai-soft text-ai\`, igual abierto que cerrado).
4. **Panel de Rambo IA (400px, opcional)**: tarjeta a la derecha que **estrecha** el contenido.
   Es un slot (\`assistantPanel\`): ver 3-Organisms/AssistantSidePanel.

**8px de aire** entre tarjetas y con los bordes. Medidas en **px**, nunca rem: la base tipográfica
es 15px y \`w-60\`/\`left-12\` encogen (daba un hueco de 26px).

**Scroll ÚNICO** dentro de la tarjeta de contenido (\`flex-1 min-h-0 overflow-y-auto\`): el
documento nunca scrollea. **Páginas de altura completa** (Inbox, kanbans, fichas con columnas):
\`h-full\` / \`flex flex-col h-full\` + \`flex-1 min-h-0 overflow-auto\`. **Nunca**
\`calc(100vh-Npx)\` ni \`h-screen\` dentro del chasis.

**El reino sale de la URL** (\`src/lib/realms.ts\`): las rutas no cambian.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const rows = [
  { nombre: 'María López', canal: 'Teléfono', estado: 'Completada', hora: '14:32' },
  { nombre: 'Carlos Ruiz', canal: 'WhatsApp', estado: 'En curso', hora: '13:45' },
  { nombre: 'Ana Martínez', canal: 'Web', estado: 'Pendiente', hora: '12:15' },
  { nombre: 'Pedro García', canal: 'Instagram', estado: 'Completada', hora: '11:30' },
];

export const Chasis: Story = {
  name: 'Chasis con reinos (definitivo)',
  render: () => (
    <AppShellFrame page="Conversaciones">
      <div className="px-10 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Conversaciones</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Contenido de ejemplo dentro de la tarjeta: el scroll vive aquí, no en el documento.
          </p>
        </div>
        <div className="rounded-xl border bg-card shadow-elev overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Conversación</TableHead>
                <TableHead>Canal</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Hora</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.nombre}>
                  <TableCell className="font-medium">{r.nombre}</TableCell>
                  <TableCell className="text-muted-foreground">{r.canal}</TableCell>
                  <TableCell>
                    <Badge variant={r.estado === 'Completada' ? 'success' : r.estado === 'En curso' ? 'info' : 'warning'}>
                      {r.estado}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{r.hora}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppShellFrame>
  ),
};

export const ScrollLargo: Story = {
  name: 'Scroll único dentro de la tarjeta',
  render: () => (
    <AppShellFrame page="Métricas">
      <div className="px-10 py-6 space-y-4">
        <h1 className="text-2xl font-semibold">Contenido más alto que la tarjeta</h1>
        {Array.from({ length: 12 }, (_, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="text-base">Bloque {i + 1}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              La cabecera (breadcrumb) se queda fija arriba de la tarjeta; solo scrollea esta zona.
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShellFrame>
  ),
  parameters: {
    docs: { description: { story: 'Con contenido largo, la cabecera de la tarjeta no se mueve y el lienzo gris tampoco: un solo scroll.' } },
  },
};

export const AlturaCompleta: Story = {
  name: 'Página de altura completa (patrón flex)',
  render: () => (
    <AppShellFrame page="Casos Pendientes">
      {/* Patrón: h-full + flex; cada panel scrollea por dentro. Nunca calc(100vh). */}
      <div className="flex h-full overflow-hidden">
        <div className="flex w-80 shrink-0 flex-col border-r border-border">
          <div className="flex h-12 shrink-0 items-center border-b border-border px-4 text-sm font-semibold">Conversaciones</div>
          <div className="flex-1 min-h-0 overflow-y-auto">
            {Array.from({ length: 30 }, (_, i) => (
              <div key={i} className={`border-b border-border px-4 py-3 text-sm ${i === 0 ? 'bg-muted' : ''}`}>
                Contacto {i + 1}
                <div className="text-xs text-muted-foreground">Último mensaje…</div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-12 shrink-0 items-center border-b border-border px-5 text-sm font-semibold">Contacto 1</div>
          <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 text-sm text-muted-foreground">
            {Array.from({ length: 24 }, (_, i) => (
              <p key={i} className="mb-3">Mensaje {i + 1} del hilo.</p>
            ))}
          </div>
          <div className="flex shrink-0 gap-2 border-t border-border p-3">
            <div className="h-10 flex-1 rounded-lg border border-border" />
            <Button>Enviar</Button>
          </div>
        </div>
      </div>
    </AppShellFrame>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Inbox / kanbans / fichas: el contenedor de página hace `h-full` (o `flex flex-col h-full`) y las zonas que scrollean `flex-1 min-h-0 overflow-auto`. La altura la da la tarjeta, no el viewport.',
      },
    },
  },
};

const Placeholder = ({ title, text }: { title: string; text: string }) => (
  <div className="px-10 py-6">
    <h1 className="text-xl font-semibold">{title}</h1>
    <p className="mt-1 text-sm text-muted-foreground">{text}</p>
  </div>
);

export const ReinoOperaciones: Story = {
  name: 'Reino: Operaciones',
  render: () => (
    <AppShellFrame realm="operations" page="Centros">
      <Placeholder title="Centros" text="La tarjeta de módulos solo enseña los módulos de Operaciones." />
    </AppShellFrame>
  ),
};

export const ReinoCRM: Story = {
  name: 'Reino: CRM',
  render: () => (
    <AppShellFrame realm="crm" page="Contactos">
      <Placeholder title="Contactos" text="La miga de pan empieza por el reino: CRM › Contactos." />
    </AppShellFrame>
  ),
};

export const RailDesplegado: Story = {
  name: 'Rail desplegado (al pasar el ratón)',
  render: () => (
    <AppShellFrame realm="agents" page="Conversaciones" railExpanded>
      <Placeholder title="Conversaciones" text="El rail flota por encima como tarjeta blanca de alto completo; la página no se mueve." />
    </AppShellFrame>
  ),
};

export const RailFijado: Story = {
  name: 'Rail fijado (chincheta)',
  render: () => (
    <AppShellFrame realm="crm" page="Contactos" railPinned>
      <Placeholder title="Contactos" text="Fijado: 208px sobre el lienzo gris, sin tarjeta; empuja la tarjeta de módulos y el contenido." />
    </AppShellFrame>
  ),
};

export const ModulosPlegados: Story = {
  name: 'Tarjeta de módulos plegada',
  render: () => (
    <AppShellFrame realm="agents" page="Conversaciones" modulesCollapsed>
      <Placeholder title="Conversaciones" text="Plegada desaparece entera; solo queda el rail." />
    </AppShellFrame>
  ),
};

/** Marcador de posición del panel del asistente (el componente real es de otra pieza). */
const AsistentePlaceholder = ({ children }: { children?: React.ReactNode }) => (
  <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-border bg-background shadow-elev">
    <div className="flex h-12 shrink-0 items-center border-b border-border px-4 text-sm font-semibold">Rambo IA</div>
    <div className="flex-1 space-y-3 p-4 text-sm text-muted-foreground">{children ?? 'Panel del asistente (slot `assistantPanel`).'}</div>
  </div>
);

export const ConRambo: Story = {
  name: 'Con Rambo IA abierto',
  render: () => (
    <AppShellFrame realm="crm" page="Contactos" assistantOpen assistantPanel={<AsistentePlaceholder />}>
      <Placeholder title="Contactos" text="El panel de Rambo (400px) estrecha el contenido; se abre con el botón lila o desde el rail." />
    </AppShellFrame>
  ),
};

export const ConRamboConversacion: Story = {
  name: 'Con Rambo IA respondiendo',
  render: () => (
    <AppShellFrame
      realm="agents"
      page="Métricas"
      assistantOpen
      assistantPanel={
        <AsistentePlaceholder>
          <p className="rounded-lg bg-muted p-2 text-foreground">¿Qué conversaciones de esta semana hablan de horarios?</p>
          <p>Encontré 12 conversaciones que mencionan horarios…</p>
        </AsistentePlaceholder>
      }
    >
      <Placeholder title="Métricas" text="El hilo sigue al navegar: el chat abierto se guarda por organización." />
    </AppShellFrame>
  ),
};
