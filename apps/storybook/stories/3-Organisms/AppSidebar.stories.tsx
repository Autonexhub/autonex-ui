import type { Meta, StoryObj } from '@storybook/react';
import {
  SidebarNavItem,
  SidebarSectionLabel,
  TooltipProvider,
} from '@autonexhub/react';
import { ChatsCircle, ListChecks, Phone, WhatsappLogo } from '@phosphor-icons/react';
import { AppShellFrame, DemoModulesCard } from '../4-Templates/AppShellFrame';

/**
 * La tarjeta de módulos (`SidebarShell` + `SidebarNavItem` + `SidebarSectionLabel`) con la
 * receta única `sidebar-styles` del paquete. Los sidebars de cada sección de la app
 * (Operaciones, Admin, Finanzas…) son solo configuración (qué ítems, qué permisos)
 * montada sobre estos componentes.
 */
const meta: Meta = {
  title: '3-Organisms/AppSidebar',
  decorators: [(Story) => <TooltipProvider><Story /></TooltipProvider>],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
La **tarjeta de módulos** del reino tal y como se ve en producción (navegación por reinos,
Bruno 29/10), montada con la **receta única** de \`sidebar-styles\` (exportada por el paquete:
\`sidebarItemBase\`, \`sidebarItemActive\`…). Cambiar allí cambia todos los sidebars.

**Presentacional:** \`SidebarShell\` recibe su estado por props (\`collapsed\`, \`isMobile\`, \`mobileOpen\`,
\`railPinned\`, \`impersonating\`, \`scrollKey\`) y slots \`header\` (móvil) y \`footer\` (cuota…).
\`SidebarNavItem\` recibe \`href\`, \`active\`, \`collapsed\` y \`renderLink\` (por defecto \`<a href>\`; la app pasa el
\`Link\` de su router). \`SidebarSectionLabel\` es el título de sección.

**Superficie:** tarjeta **blanca flotante** de 240px (\`bg-background rounded-xl border shadow-elev\`),
hermana de la del contenido, a la derecha del rail de reinos (3-Organisms/RealmRail) y con 8px de aire.
Sin cabecera de organización: el selector vive arriba del rail. Empieza por el **título del reino**
(17px, Inter 600, \`tracking-tight\`) y solo lista los módulos de ese reino. Pie: cuota de minutos
(el usuario está en el rail). **Plegada desaparece** (se desliza bajo el rail).

**Ítems** (01/09 y 03/09): 32px (en px, no rem: con la base a 15px \`h-8\` daba 30px) · texto 13px
peso 380 · iconos Phosphor *light* 18px · gap 16px · títulos de sección 11px medium con aire 8/4px ·
activo = **píldora gris** (\`bg-sidebar-accent\`, #E9E9EB) con tinta sin bold ·
hover = **gris suave** (\`bg-sidebar-accent/60\`; el blanco de antes no se veía sobre la tarjeta blanca).

Decisión 29/10: se probó la píldora blanca con filo y sombra estilo Intercom (exigía teñir la tarjeta
de blanco roto) y se descartó: la selección del panel es gris (\`bg-muted\` / \`bg-sidebar-accent\`).
Solo el rail, que vive sobre el lienzo gris, marca el activo en blanco.

**Sin contadores** junto a "Todas" ni a los canales (03/09).
Marcadores (fila fija + chincheta al hover): ver 3-Organisms/SidebarBookmarks.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Operaciones: Story = {
  name: 'Agentes IA (tarjeta de módulos)',
  // Marco = chasis real (4-Templates/AppShell): rail de reinos, tarjeta de
  // módulos y tarjeta de contenido.
  render: () => (
    <AppShellFrame realm="agents" page="Conversaciones">
      <div className="px-10 py-6">
        <h1 className="text-xl font-semibold">Conversaciones</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          La tarjeta de módulos solo enseña el reino activo; el rail cambia de reino.
        </p>
      </div>
    </AppShellFrame>
  ),
};

export const Reinos: Story = {
  name: 'Los tres reinos',
  render: () => (
    <div className="flex gap-2 bg-sidebar p-2" style={{ height: 640 }}>
      <DemoModulesCard realm="agents" active="Todas" />
      <DemoModulesCard realm="operations" active="Centros" />
      <DemoModulesCard realm="crm" active="Contactos" />
    </div>
  ),
};

export const ItemsSueltos: Story = {
  name: 'Ítems (receta)',
  render: () => (
    <div className="w-[240px] rounded-xl border border-border bg-background p-2 shadow-elev">
      <SidebarSectionLabel label="Conversaciones" />
      <SidebarNavItem href="#" icon={ChatsCircle} label="Todas (activo)" active />
      <div className="mx-3.5 border-l border-border pl-2.5">
        <SidebarNavItem href="#" icon={Phone} label="Teléfono" size="sub" active={false} />
        <SidebarNavItem href="#" icon={WhatsappLogo} label="WhatsApp" size="sub" active={false} />
      </div>
      <SidebarNavItem href="#" icon={ListChecks} label="Casos Pendientes" badge="3" active={false} />
    </div>
  ),
};

export const ItemsPlegados: Story = {
  name: 'Ítems plegados (solo icono + tooltip)',
  render: () => (
    <div className="w-[48px] rounded-xl border border-border bg-background p-2 shadow-elev">
      <SidebarNavItem href="#" icon={ChatsCircle} label="Todas" active collapsed />
      <SidebarNavItem href="#" icon={Phone} label="Teléfono" active={false} collapsed />
      <SidebarNavItem href="#" icon={ListChecks} label="Casos Pendientes" active={false} collapsed />
    </div>
  ),
};
