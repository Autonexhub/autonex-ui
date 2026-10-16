import type { Meta, StoryObj } from '@storybook/react';
import { QuotaCard, type QuotaView } from '@autonexhub/react';

/**
 * Widget de cuota del pie de la sidebar (formato Bruno 02/09): SIN tarjeta —
 * fila hermana del perfil, anillo de progreso a la izquierda (32px, alineado
 * con el avatar) y dos líneas (minutos restantes + "Se renueva en N días").
 * Hover en píldora como los módulos. Sin botón "Upgrade". Clic → Popover con el detalle (y desglose por
 * organización en admin). `QuotaCard` es la parte presentacional de `QuotaBar`
 * (que añade la carga de datos y la caché entre navegaciones).
 */
const meta: Meta<typeof QuotaCard> = {
  title: '3-Organisms/QuotaBar',
  component: QuotaCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Sin tarjeta (la sidebar es plana: nada va en cajas — decisión Bruno 02/09). Fila \`px-2 py-2\`
con hover \`bg-muted\` en píldora, anillo a la IZQUIERDA alineado con el avatar del perfil. Línea 1: \`text-sm font-medium\` (identidad = medium, como el nombre del perfil; semibold solo en títulos de página) **"{restantes} min restantes"** (o
**"+{extra} min sobre el plan"** en \`text-destructive\` si hay exceso). Línea 2:
\`text-xs text-muted-foreground\` "Se renueva en N días" (cliente) o "N organizaciones
con pack" (admin agregado). Anillo SVG 32px, trazo 4px, pista \`stroke-border\`, progreso
\`stroke-success\` / \`stroke-warning\` (≥80%) / \`stroke-destructive\` (exceso), empieza arriba.
Colapsada: solo el anillo (28px).
        `,
      },
    },
  },
  argTypes: {
    collapsed: { control: 'boolean', description: 'Sidebar plegada: solo el anillo' },
    today: { table: { disable: true } },
    view: { table: { disable: true } },
  },
  decorators: [
    (Story, ctx) => (
      <div className={ctx.args.collapsed ? 'w-12 bg-sidebar p-2 border-r border-border' : 'w-60 bg-sidebar p-2 border-r border-border'}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof QuotaCard>;

// "Hoy" fijo para que "Se renueva en N días" no cambie con el calendario.
const TODAY = new Date(2026, 8, 2); // 2 sep 2026

const base: QuotaView = {
  pack_minutes: 1500,
  minutes_used: 620,
  extra_minutes: 0,
  pack_name: 'Pack Pro 1.500',
  period_start: '2026-08-15', // corte el 15 → 13 días
};

export const Normal: Story = {
  args: { view: base, today: TODAY },
};

export const CasiAgotado: Story = {
  name: 'Casi agotado (≥ 80%)',
  args: {
    view: { ...base, minutes_used: 1290 },
    today: TODAY,
  },
};

export const Exceso: Story = {
  args: {
    view: { ...base, minutes_used: 1640, extra_minutes: 140 },
    today: TODAY,
  },
};

export const AdminAgregado: Story = {
  name: 'Admin (agregado)',
  args: {
    view: {
      pack_minutes: 6200,
      minutes_used: 2480,
      extra_minutes: 60,
      pack_name: null,
      per_org: [
        { id: 1, name: 'Joyas y Sangría', minutes_used: 620, pack_minutes: 1500, pack_name: 'Pack Pro' },
        { id: 2, name: 'Eurofitness Can Dragó', minutes_used: 1060, pack_minutes: 1000, pack_name: 'Pack Pro' },
        { id: 3, name: 'Hemomadrid', minutes_used: 410, pack_minutes: 1200, pack_name: 'Pack Base' },
        { id: 4, name: 'Máis que Auga', minutes_used: 390, pack_minutes: 2500, pack_name: 'Pack Plus' },
      ],
    },
    today: TODAY,
  },
};

export const Colapsada: Story = {
  args: { view: { ...base, minutes_used: 1290 }, collapsed: true, today: TODAY },
};
