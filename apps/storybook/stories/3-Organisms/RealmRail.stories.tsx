import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { RealmRail, TooltipProvider } from '@autonexhub/react';
import { DemoOrgSwitcher, DemoRailAccount, demoRailEntries } from '../4-Templates/AppShellFrame';

/**
 * Rail de reinos (`RealmRail`, componente presentacional del paquete): la barra de iconos
 * de 48px de la izquierda, patrón Intercom (Bruno 29/10). Presentacional: cada entrada
 * trae su `onSelect` (la app resuelve rutas, permisos y módulos); sin `brand` pinta el isotipo.
 */
const meta: Meta<typeof RealmRail> = {
  title: '3-Organisms/RealmRail',
  component: RealmRail,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
**Qué es:** la navegación principal. Arriba la **organización** (selector), después los **reinos**
— Agentes IA · Operaciones · CRM —, un separador y los **contextos** que el usuario puede ver
(Linear · Admin · Finanzas · DevOps). Abajo **Buscar** (⌘K), **Rambo IA** (abre el panel derecho)
y el **avatar** con el menú de usuario.

**Estados:**
- **Reposo (48px)** sobre el lienzo gris \`bg-sidebar\`. Activo = **píldora blanca** con sombra
  mínima; hover = blanco suave. Solo iconos (Phosphor *light* 18px), nombre en \`title\`.
- **Desplegado** (hover con retardo de 150ms, o foco de teclado): **tarjeta blanca de alto completo**,
  208px, esquinas derechas redondeadas y \`shadow-elev\`, **por encima** de la página. Ahí el activo
  pasa a la píldora gris de la sidebar (\`sidebarItemActive\`). Aparece la **chincheta**.
- **Fijado** (chincheta): 208px **sobre el lienzo**, sin tarjeta ni sombra, con nombres; empuja la
  tarjeta de módulos y el contenido. La app recuerda el estado por navegador (\`pinned\` / \`onTogglePin\`).

**Integración:** \`renderLink\` no aplica (son botones con \`onSelect\`); \`brand\`, \`account\` y \`logo\` son slots (el selector de organización y el menú de usuario se montan desde la app).

**Reglas:** un reino sin módulos visibles para la organización no sale. El reino activo se deduce
de la URL (la app lo calcula y marca \`active\`). Rambo IA solo se marca en su propia página, no con el panel abierto.
Anchos en **px** (la base tipográfica es 15px). En móvil no hay rail: queda el drawer.
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <div className="relative flex h-[640px] w-full bg-sidebar">
          <Story />
          <div className="flex-1 py-2 pr-2">
            <div className="h-full rounded-xl border border-border bg-background shadow-elev" />
          </div>
        </div>
      </TooltipProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof RealmRail>;

const base = (realm: Parameters<typeof demoRailEntries>[0] = 'agents', withContexts = true) => ({
  ...demoRailEntries(realm, { withContexts }),
  ariaLabel: 'Navegación principal',
  brand: (expanded: boolean) => <DemoOrgSwitcher expanded={expanded} />,
  account: (expanded: boolean) => <DemoRailAccount expanded={expanded} />,
  pinLabel: 'Fijar menú',
  onTogglePin: () => undefined,
});

export const Reposo: Story = {
  args: base('agents'),
  parameters: { docs: { description: { story: 'Pasa el ratón por encima para verlo desplegarse.' } } },
};

export const Desplegado: Story = {
  args: { ...base('crm'), forceExpanded: true },
};

export const Fijado: Story = {
  args: { ...base('crm'), pinned: true, pinLabel: 'Soltar menú' },
};

export const ClienteSinContextos: Story = {
  name: 'Cliente (sin contextos de Autonex)',
  args: { ...base('operations', false), forceExpanded: true },
  parameters: { docs: { description: { story: 'Un cliente solo ve los reinos (y Finanzas si tiene consumo o facturación).' } } },
};

export const SinOrganizacion: Story = {
  name: 'Sin organización (isotipo)',
  args: { ...base(null), brand: undefined },
  parameters: { docs: { description: { story: 'Sin acceso a Operaciones el hueco de arriba muestra el isotipo de Autonex.' } } },
};

function RailInteractivo() {
  const [pinned, setPinned] = useState(false);
  const [realm, setRealm] = useState<'agents' | 'operations' | 'crm'>('agents');
  const entries = demoRailEntries(realm);
  return (
    <RealmRail
      {...entries}
      realms={entries.realms.map((r) => ({ ...r, onSelect: () => setRealm(r.id as typeof realm) }))}
      ariaLabel="Navegación principal"
      brand={(expanded) => <DemoOrgSwitcher expanded={expanded} />}
      account={(expanded) => <DemoRailAccount expanded={expanded} />}
      pinned={pinned}
      onTogglePin={() => setPinned((p) => !p)}
      pinLabel={pinned ? 'Soltar menú' : 'Fijar menú'}
    />
  );
}

export const Interactivo: Story = {
  render: () => <RailInteractivo />,
};
