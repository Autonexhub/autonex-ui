import type { Meta, StoryObj } from '@storybook/react';
import { StatCard, StatCardGrid, type StatCardProps } from "@autonexhub/react";
import { TrendUp, TrendDown, Phone, Clock, CheckCircle, Users } from '@phosphor-icons/react';
import { cn } from "@autonexhub/react";

const meta: Meta = {
  title: '3-Organisms/StatCard',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Tarjeta de KPI para paneles de métricas: etiqueta, valor, unidad opcional y variación opcional.

> **Patrón documentado, no componente compartido.** No existe un \`StatCard\` exportado en
> \`src/components\`: el \`StatCard\` de esta story es una copia local del patrón. En la app hay
> copias equivalentes dentro de \`components/margins/MarginsSummaryCards.tsx\` y
> \`pages/AdminQuality.tsx\`, y en Métricas de voz se usa \`KPICell\` (\`pages/VoiceMetrics.tsx\`, ver
> *Design Rules → KPIs de métricas*). Si se reutiliza en una página nueva, extraerlo a
> \`src/components\` en vez de copiarlo otra vez.

## Estructura
Se monta con \`Card\` + \`CardHeader\` + \`CardContent\`:
- Etiqueta como \`CardDescription\`.
- Valor como \`CardTitle\` (\`text-2xl tabular-nums\`, peso 500 del propio \`CardTitle\`).
- Variación con \`TrendUp\` / \`TrendDown\` (Phosphor, peso regular) en \`text-success\` / \`text-destructive\`.

## Rejilla
Responsive: 1 columna en móvil → 2 en \`sm\` → 4 en \`lg\`.

\`\`\`tsx
<StatCardGrid>
  <StatCard label="Llamadas totales" value="1.234" delta={{ value: "+12%", direction: "up" }} />
  <StatCard label="Duración media" value="3:24" unit="min" />
</StatCardGrid>
\`\`\`
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  name: 'Por defecto',
  render: () => (
    <StatCard
      label="Llamadas totales"
      value="1.234"
    />
  ),
};

export const WithDeltaUp: Story = {
  name: 'Con subida',
  render: () => (
    <StatCard
      label="Tasa de éxito"
      value="94%"
      delta={{ value: "+3%", direction: "up" }}
    />
  ),
};

export const WithDeltaDown: Story = {
  name: 'Con bajada',
  render: () => (
    <StatCard
      label="Duración media"
      value="3:24"
      unit="min"
      delta={{ value: "-5%", direction: "down" }}
    />
  ),
};

export const WithIcon: Story = {
  name: 'Con icono',
  render: () => (
    <StatCard
      label="Llamadas totales"
      value="1.234"
      icon={<Phone className="h-4 w-4 text-muted-foreground" />}
      delta={{ value: "+12%", direction: "up" }}
    />
  ),
};

export const Grid: Story = {
  name: 'Rejilla',
  render: () => (
    <StatCardGrid>
      <StatCard
        label="Llamadas totales"
        value="1.234"
        icon={<Phone className="h-4 w-4 text-muted-foreground" />}
        delta={{ value: "+12%", direction: "up" }}
      />
      <StatCard
        label="Duración media"
        value="3:24"
        unit="min"
        icon={<Clock className="h-4 w-4 text-muted-foreground" />}
        delta={{ value: "-5%", direction: "down" }}
      />
      <StatCard
        label="Tasa de éxito"
        value="94%"
        icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
        delta={{ value: "+3%", direction: "up" }}
      />
      <StatCard
        label="Contactos activos"
        value="456"
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
        delta={{ value: "+8%", direction: "up" }}
      />
    </StatCardGrid>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Rejilla responsive de tarjetas de KPI: 1 columna en móvil, 2 en tableta y 4 en escritorio.',
      },
    },
  },
};

export const CompactGrid: Story = {
  name: 'Rejilla compacta',
  render: () => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <StatCard label="Llamadas" value="1.234" />
      <StatCard label="Web" value="567" />
      <StatCard label="WhatsApp" value="890" />
      <StatCard label="Instagram" value="123" />
      <StatCard label="Total" value="2.814" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Rejilla de 5 columnas para el desglose por canal.',
      },
    },
  },
};

// Variante mínima sin Card
function MinimalStat({ label, value, delta }: StatCardProps) {
  const isUp = delta?.direction === 'up';
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-medium tabular-nums">{value}</span>
        {delta && (
          <span className={cn('text-xs font-medium', isUp ? 'text-success' : 'text-destructive')}>
            {delta.value}
          </span>
        )}
      </div>
    </div>
  );
}

export const MinimalStyle: Story = {
  name: 'Estilo mínimo',
  render: () => (
    <div className="flex gap-8">
      <MinimalStat label="Puntuación RAP" value="87%" delta={{ value: "+5%", direction: "up" }} />
      <MinimalStat label="Resolución" value="94%" delta={{ value: "+2%", direction: "up" }} />
      <MinimalStat label="Tiempo medio" value="2:45" delta={{ value: "-12%", direction: "down" }} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Cifra mínima sin tarjeta, para usar en línea dentro de otro bloque.',
      },
    },
  },
};
