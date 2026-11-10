import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardContent, CardHeader, CardTitle } from '@autonexhub/react';
import { Button } from '@autonexhub/react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@autonexhub/react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { TrendUp, TrendDown, Download } from '@phosphor-icons/react';
import { cn } from '@autonexhub/react';

// Patrón ChartCard (copia local: no hay componente compartido en src/components)
interface ChartCardProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

function ChartCard({ title, action, children, className }: ChartCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">{title}</CardTitle>
        {action}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

// Datos de ejemplo
const areaData = [
  { date: 'Lun', llamadas: 45, web: 20, whatsapp: 15 },
  { date: 'Mar', llamadas: 52, web: 25, whatsapp: 18 },
  { date: 'Mié', llamadas: 48, web: 22, whatsapp: 20 },
  { date: 'Jue', llamadas: 60, web: 30, whatsapp: 25 },
  { date: 'Vie', llamadas: 55, web: 28, whatsapp: 22 },
  { date: 'Sáb', llamadas: 30, web: 15, whatsapp: 12 },
  { date: 'Dom', llamadas: 20, web: 10, whatsapp: 8 },
];

const barData = [
  { name: 'Cita programada', value: 120 },
  { name: 'Información', value: 95 },
  { name: 'Problema resuelto', value: 80 },
  { name: 'Derivado', value: 45 },
  { name: 'Sin resolución', value: 20 },
];

const hourlyData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, '0')}:00`,
  value: Math.floor(Math.random() * 50) + 10,
}));

const chartConfig: ChartConfig = {
  llamadas: { label: 'Teléfono', color: 'var(--chart-1)' },
  web: { label: 'Web', color: 'var(--chart-5)' },
  whatsapp: { label: 'WhatsApp', color: 'var(--chart-2)' },
  value: { label: 'Conversaciones', color: 'var(--chart-1)' },
};

const meta: Meta = {
  title: '3-Organisms/ChartCard',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Tarjeta contenedora de gráficas: título y acción opcional sobre un \`ChartContainer\`.

> **Patrón documentado, no componente compartido.** No existe un \`ChartCard\` exportado en
> \`src/components\`: el de esta story es una copia local del patrón (hay otra equivalente dentro
> de \`components/margins/MarginCharts.tsx\`). Lo que sí es oficial y se importa es
> \`ChartContainer\` / \`ChartTooltip\` / \`ChartLegend\` de \`@autonexhub/react\` y \`Card\`.

## Patrón
\`\`\`tsx
<ChartCard title="Conversaciones por día" action={<Button variant="ghost" size="sm">Exportar</Button>}>
  <ChartContainer config={chartConfig} className="h-[300px]">
    <AreaChart data={data}>...</AreaChart>
  </ChartContainer>
</ChartCard>
\`\`\`

## Reglas (Design Rules → Charts)
- Líneas \`type="linear"\` con \`dot r=3\`, \`strokeWidth={2}\`, degradado vertical 0,30 → 0.
- Colores siempre \`var(--chart-1..6)\` (nunca \`hsl()\`, nunca el azul de marca ni los semánticos).

## Tipos
- **AreaChart**: series temporales con relleno degradado (uso por hora o por día).
- **LineChart**: tendencias y evolución (puntuación RAP, tasa de resolución).
- **BarChart**: categorías y comparativas (temas, resultados).
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const AreaChartExample: Story = {
  name: 'Gráfica de área',
  render: () => (
    <ChartCard
      title="Conversaciones por día"
      action={
        <Button variant="ghost" size="sm">
          <Download className="h-4 w-4" />
        </Button>
      }
    >
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <AreaChart data={areaData}>
          <defs>
            <linearGradient id="fillLlamadas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-llamadas)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--color-llamadas)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            type="linear"
            dataKey="llamadas"
            stroke="var(--color-llamadas)"
            strokeWidth={2}
            fill="url(#fillLlamadas)"
            dot={{ r: 3, fill: 'var(--color-llamadas)' }}
          />
        </AreaChart>
      </ChartContainer>
    </ChartCard>
  ),
};

export const StackedAreaChart: Story = {
  name: 'Área apilada',
  render: () => (
    <ChartCard title="Conversaciones por canal">
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <AreaChart data={areaData}>
          <defs>
            <linearGradient id="fillLlamadas2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-llamadas)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--color-llamadas)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="fillWeb" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-web)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--color-web)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="fillWhatsapp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-whatsapp)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--color-whatsapp)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Area type="linear" dataKey="llamadas" stackId="1" stroke="var(--color-llamadas)" strokeWidth={2} fill="url(#fillLlamadas2)" />
          <Area type="linear" dataKey="web" stackId="1" stroke="var(--color-web)" strokeWidth={2} fill="url(#fillWeb)" />
          <Area type="linear" dataKey="whatsapp" stackId="1" stroke="var(--color-whatsapp)" strokeWidth={2} fill="url(#fillWhatsapp)" />
        </AreaChart>
      </ChartContainer>
    </ChartCard>
  ),
};

export const HorizontalBarChart: Story = {
  name: 'Barras horizontales',
  render: () => (
    <ChartCard title="Resultados de conversaciones">
      <ChartContainer config={chartConfig} className="h-[250px] w-full">
        <BarChart data={barData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" tickLine={false} axisLine={false} />
          <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={120} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="value" fill="var(--color-value)" radius={4} />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  ),
};

export const HourlyUsageChart: Story = {
  name: 'Uso por hora',
  render: () => (
    <ChartCard title="Uso por hora">
      <ChartContainer config={chartConfig} className="h-[200px] w-full">
        <AreaChart data={hourlyData}>
          <defs>
            <linearGradient id="fillHourly" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="hour" tickLine={false} axisLine={false} interval={3} />
          <YAxis tickLine={false} axisLine={false} hide />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area type="linear" dataKey="value" stroke="var(--color-value)" strokeWidth={2} fill="url(#fillHourly)" dot={{ r: 3, fill: 'var(--color-value)' }} />
        </AreaChart>
      </ChartContainer>
    </ChartCard>
  ),
};

// Patrón de tarjeta RAP (Resolución Autónoma Plena)
interface RapCardProps {
  score: number;
  delta?: { value: string; direction: 'up' | 'down' };
}

function RapCard({ score, delta }: RapCardProps) {
  const isUp = delta?.direction === 'up';
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Puntuación RAP</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-medium tabular-nums">{score}%</span>
          {delta && (
            <div className={cn('flex items-center gap-1 text-sm', isUp ? 'text-success' : 'text-destructive')}>
              {isUp ? <TrendUp className="h-4 w-4" /> : <TrendDown className="h-4 w-4" />}
              <span className="font-medium">{delta.value}</span>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">Resolución Autónoma Plena</p>
      </CardContent>
    </Card>
  );
}

export const RapScoreCard: Story = {
  name: 'Tarjeta de puntuación RAP',
  render: () => (
    <div className="max-w-xs">
      <RapCard score={87} delta={{ value: "+5%", direction: "up" }} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Tarjeta de puntuación RAP (Resolución Autónoma Plena) con indicador de tendencia.',
      },
    },
  },
};

export const MetricsDashboard: Story = {
  name: 'Panel de métricas',
  render: () => (
    <div className="space-y-6">
      {/* Fila de KPI */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm text-muted-foreground">Total conversaciones</p>
            <p className="text-2xl font-medium tabular-nums">1.234</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm text-muted-foreground">Puntuación RAP</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-medium tabular-nums">87%</p>
              <span className="text-xs text-success">+5%</span>
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm text-muted-foreground">Tiempo medio</p>
            <p className="text-2xl font-medium tabular-nums">2:45</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm text-muted-foreground">Satisfacción</p>
            <p className="text-2xl font-medium tabular-nums">94%</p>
          </CardHeader>
        </Card>
      </div>

      {/* Fila de gráficas */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Conversaciones por día">
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="fillDemo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-llamadas)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-llamadas)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area type="linear" dataKey="llamadas" stroke="var(--color-llamadas)" strokeWidth={2} fill="url(#fillDemo)" dot={{ r: 3, fill: 'var(--color-llamadas)' }} />
            </AreaChart>
          </ChartContainer>
        </ChartCard>

        <ChartCard title="Resultados principales">
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <BarChart data={barData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={120} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="var(--color-value)" radius={4} />
            </BarChart>
          </ChartContainer>
        </ChartCard>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Panel de métricas completo: rejilla de KPI y gráficas.',
      },
    },
  },
};
