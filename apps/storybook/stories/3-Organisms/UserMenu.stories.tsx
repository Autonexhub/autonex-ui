import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { QuotaCard, RealmRail, TooltipProvider, UserMenu } from '@autonexhub/react';
import { DemoOrgSwitcher, demoRailEntries } from '../4-Templates/AppShellFrame';

/**
 * Menú de usuario (`UserMenu`, componente presentacional del paquete): avatar → menú con
 * Configuración · TEMA · IDIOMA · Cerrar sesión. Desde el 29/10 vive al pie del
 * rail de reinos (`variant="rail"`); en móvil, al pie del drawer.
 */
const meta: Meta<typeof UserMenu> = {
  title: '3-Organisms/UserMenu',
  component: UserMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
**Qué es:** el acceso a la cuenta del usuario. Pulsar el avatar abre el menú: cabecera con nombre y
email · **Configuración** · **TEMA** (sol / luna / monitor) · **IDIOMA** (Español · English · Català)
· **Cerrar sesión**. TEMA e IDIOMA comparten patrón: eyebrow
\`text-[11px] uppercase tracking-wider text-muted-foreground\` + fila segmentada con la opción activa
en \`bg-muted text-foreground\`.

**Presentacional:** recibe \`user\` (\`{ name, email, initials?, avatarUrl? }\`), \`theme\` / \`onThemeChange\`,
\`language\` / \`languages\` / \`onLanguageChange\`, \`onLogout\` y \`labels\` (Partial sobre los textos en español).
El enlace de Configuración se pinta con \`renderLink\` + \`settingsHref\` (por defecto \`<a>\`; la app pasa su
\`Link\`). El proveedor de tema, i18next, la sesión y la navegación viven en la app.

**Dónde vive:**
- **Escritorio → pie del rail de reinos** (\`variant="rail"\`): avatar suelto de 32px con hover gris
  suave; con el rail desplegado o fijado, el nombre al lado (\`showName\`). El menú se abre a la derecha.
- **Móvil → pie del drawer** (\`variant="default"\`), debajo de la cuota: avatar de 32px + nombre y
  email. Es también el que usa la cabecera de ajustes de Linear.

**Reglas:** la tarjeta de módulos de escritorio ya no lleva usuario (ni selector de organización):
los dos están en el rail. No hay variante plegada: en escritorio el rail ya es la versión compacta.
        `,
      },
    },
  },
  argTypes: {
    collapsed: { table: { disable: true } },
  },
  decorators: [(Story) => <TooltipProvider><Story /></TooltipProvider>],
};

export default meta;
type Story = StoryObj<typeof UserMenu>;

const USER = { name: 'Bruno Ramon Ros', email: 'bruno@autonex.es' };

/** UserMenu con tema e idioma en estado local (en la app los gestionan next-themes e i18next). */
function StatefulUserMenu(props: Partial<React.ComponentProps<typeof UserMenu>>) {
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('es');
  return (
    <UserMenu
      user={USER}
      theme={theme}
      onThemeChange={setTheme}
      language={language}
      onLanguageChange={setLanguage}
      {...props}
    />
  );
}

/** Rail con el UserMenu en su pie. */
function RailCanvas({ expanded }: { expanded: boolean }) {
  return (
    <div className="relative flex h-[560px] w-full bg-sidebar">
      <RealmRail
        {...demoRailEntries('agents')}
        className="shrink-0"
        ariaLabel="Navegación principal"
        pinLabel="Fijar menú"
        onTogglePin={() => undefined}
        forceExpanded={expanded}
        brand={(e) => <DemoOrgSwitcher expanded={e} />}
        account={(e) => <StatefulUserMenu variant="rail" showName={e} />}
      />
      <div className="flex-1 py-2 pr-2">
        <div className="h-full rounded-xl border border-border bg-background shadow-elev" />
      </div>
    </div>
  );
}

/** Escritorio: avatar al pie del rail en reposo (48px). Pulsa el avatar. */
export const Rail: Story = {
  render: () => <RailCanvas expanded={false} />,
};

/** Rail desplegado (hover) o fijado: el nombre aparece junto al avatar. */
export const RailDesplegado: Story = {
  name: 'Rail desplegado',
  render: () => <RailCanvas expanded />,
};

/** Móvil: pie del drawer (w-72, gris), con la cuota encima del usuario. */
export const DrawerMovil: Story = {
  name: 'Drawer móvil',
  render: () => (
    <div className="flex h-[560px] w-72 flex-col bg-sidebar tracking-normal">
      <div className="flex-1" />
      <div className="mt-auto space-y-2 border-t border-border p-2">
        <QuotaCard
          view={{ pack_minutes: 1500, minutes_used: 620, extra_minutes: 0, pack_name: 'Pack Pro 1.500', period_start: '2026-10-15' }}
          today={new Date(2026, 9, 29)}
        />
        <StatefulUserMenu />
      </div>
    </div>
  ),
};
