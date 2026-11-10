import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@autonexhub/react';
import { Tabs, TabsList, TabsTrigger } from '@autonexhub/react';
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
import { TrendUp, TrendDown, Phone, Clock, CheckCircle, ChartLine } from '@phosphor-icons/react';
import { cn } from '@autonexhub/react';

// Datos de ejemplo
const dailyData = [
  { date: 'Lun', voice: 45, web: 20, whatsapp: 15, instagram: 5 },
  { date: 'Mar', voice: 52, web: 25, whatsapp: 18, instagram: 8 },
  { date: 'Mié', voice: 48, web: 22, whatsapp: 20, instagram: 6 },
  { date: 'Jue', voice: 60, web: 30, whatsapp: 25, instagram: 10 },
  { date: 'Vie', voice: 55, web: 28, whatsapp: 22, instagram: 7 },
  { date: 'Sáb', voice: 30, web: 15, whatsapp: 12, instagram: 4 },
  { date: 'Dom', voice: 20, web: 10, whatsapp: 8, instagram: 3 },
];

const hourlyData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, '0')}:00`,
  value: Math.floor(Math.random() * 40 + (i >= 9 && i <= 18 ? 30 : 5)),
}));

const topicsData = [
  { name: 'Citas', value: 156 },
  { name: 'Precios', value: 120 },
  { name: 'Horarios', value: 95 },
  { name: 'Ubicación', value: 78 },
  { name: 'Servicios', value: 65 },
  { name: 'Cancelaciones', value: 45 },
  { name: 'Otros', value: 32 },
];

const rapEvolution = [
  { date: 'Ene', rap: 72 },
  { date: 'Feb', rap: 75 },
  { date: 'Mar', rap: 78 },
  { date: 'Abr', rap: 82 },
  { date: 'May', rap: 80 },
  { date: 'Jun', rap: 85 },
  { date: 'Jul', rap: 87 },
];

const chartConfig: ChartConfig = {
  voice: { label: 'Teléfono', color: 'var(--chart-1)' },
  web: { label: 'Web', color: 'var(--chart-5)' },
  whatsapp: { label: 'WhatsApp', color: 'var(--chart-2)' },
  instagram: { label: 'Instagram', color: 'var(--chart-3)' },
  value: { label: 'Conversaciones', color: 'var(--chart-1)' },
  rap: { label: 'Puntuación RAP', color: 'var(--chart-1)' },
};

// Patrón StatCard (copia local)
interface StatCardProps {
  label: string;
  value: string;
  delta?: { value: string; direction: 'up' | 'down' };
  icon?: React.ReactNode;
}

function StatCard({ label, value, delta, icon }: StatCardProps) {
  const isUp = delta?.direction === 'up';
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{label}</p>
          {icon}
        </div>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-medium tabular-nums">{value}</p>
          {delta && (
            <div className={cn('flex items-center gap-0.5 text-xs', isUp ? 'text-success' : 'text-destructive')}>
              {isUp ? <TrendUp className="h-3 w-3" /> : <TrendDown className="h-3 w-3" />}
              <span>{delta.value}</span>
            </div>
          )}
        </div>
      </CardHeader>
    </Card>
  );
}

// Patrón ChartCard (copia local)
function ChartCard({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        {action}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

// Tarjeta de puntuación RAP (copia local)
function RapCard({ score, delta }: { score: number; delta?: { value: string; direction: 'up' | 'down' } }) {
  const isUp = delta?.direction === 'up';
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Puntuación RAP</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-medium tabular-nums">{score}%</span>
          {delta && (
            <div className={cn('flex items-center gap-1', isUp ? 'text-success' : 'text-destructive')}>
              {isUp ? <TrendUp className="h-5 w-5" /> : <TrendDown className="h-5 w-5" />}
              <span className="text-lg font-medium">{delta.value}</span>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">Resolución Autónoma Plena</p>
        <div className="mt-4">
          <ChartContainer config={chartConfig} className="h-[100px] w-full">
            <AreaChart data={rapEvolution}>
              <defs>
                <linearGradient id="fillRap" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-rap)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-rap)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="linear" dataKey="rap" stroke="var(--color-rap)" strokeWidth={2} fill="url(#fillRap)" dot={{ r: 3, fill: 'var(--color-rap)' }} />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// Página de métricas completa
function MetricsPageTemplate() {
  const [channel, setChannel] = useState('todos');

  return (
    <div className="px-10 py-6 space-y-6">
      {/* Cabecera */}
      <div>
        <h1 className="text-2xl font-semibold">Métricas</h1>
        <p className="text-sm text-muted-foreground">Analiza el rendimiento de tus conversaciones</p>
      </div>

      {/* Pestañas de canal */}
      <Tabs value={channel} onValueChange={setChannel}>
        <TabsList variant="line">
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="voice">Teléfono</TabsTrigger>
          <TabsTrigger value="web">Web</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          <TabsTrigger value="instagram">Instagram</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Rejilla de KPI */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total conversaciones"
          value="1.234"
          delta={{ value: "+12%", direction: "up" }}
          icon={<Phone className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          label="Duración media"
          value="3:24"
          delta={{ value: "-8%", direction: "down" }}
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          label="Tasa de resolución"
          value="94%"
          delta={{ value: "+3%", direction: "up" }}
          icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          label="Satisfacción"
          value="4,8"
          delta={{ value: "+0,2", direction: "up" }}
          icon={<ChartLine className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      {/* Fila de gráficas 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Conversaciones por día">
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <AreaChart data={dailyData}>
              <defs>
                <linearGradient id="fillVoice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-voice)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-voice)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fillWeb2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-web)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-web)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fillWa" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-whatsapp)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-whatsapp)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Area type="linear" dataKey="voice" stackId="1" stroke="var(--color-voice)" strokeWidth={2} fill="url(#fillVoice)" />
              <Area type="linear" dataKey="web" stackId="1" stroke="var(--color-web)" strokeWidth={2} fill="url(#fillWeb2)" />
              <Area type="linear" dataKey="whatsapp" stackId="1" stroke="var(--color-whatsapp)" strokeWidth={2} fill="url(#fillWa)" />
            </AreaChart>
          </ChartContainer>
        </ChartCard>

        <RapCard score={87} delta={{ value: "+5%", direction: "up" }} />
      </div>

      {/* Fila de gráficas 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Uso por hora">
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <AreaChart data={hourlyData}>
              <defs>
                <linearGradient id="fillHourly2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="hour" tickLine={false} axisLine={false} interval={3} />
              <YAxis tickLine={false} axisLine={false} hide />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area type="linear" dataKey="value" stroke="var(--color-value)" strokeWidth={2} fill="url(#fillHourly2)" dot={{ r: 3, fill: 'var(--color-value)' }} />
            </AreaChart>
          </ChartContainer>
        </ChartCard>

        <ChartCard title="Temas principales">
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <BarChart data={topicsData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={80} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="var(--color-value)" radius={4} />
            </BarChart>
          </ChartContainer>
        </ChartCard>
      </div>
    </div>
  );
}

const meta: Meta = {
  title: '4-Templates/MetricsPage',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Página completa de métricas: KPI, gráficas y filtro por canal.

> \`StatCard\`, \`ChartCard\` y \`RapCard\` son **copias locales del patrón** (ver 3-Organisms/StatCard y
> 3-Organisms/ChartCard): no hay componentes compartidos con esos nombres en \`src/components\`. La
> página real de métricas de voz usa \`KPICell\` (\`pages/VoiceMetrics.tsx\`).

## Estructura
1. **Cabecera**: título (\`text-2xl font-semibold\`) + descripción.
2. **Pestañas de canal**: Todos | Teléfono | Web | WhatsApp | Instagram.
3. **Rejilla de KPI**: 4 columnas con indicador de tendencia.
4. **Fila de gráficas 1**: área apilada + tarjeta de puntuación RAP.
5. **Fila de gráficas 2**: uso por hora + barras de temas principales.

## Patrones clave
- **StatCard**: etiqueta + valor + variación opcional (sube/baja).
- **ChartCard**: tarjeta con título + gráfica.
- **RapCard**: cifra grande con mini gráfica de evolución.
- **Tabs variant="line"**: subrayado para filtrar por canal.

## Gráficas
- Recharts mediante los componentes de \`@autonexhub/react\`.
- Relleno degradado en las de área; barras horizontales para temas.
- Colores siempre \`var(--chart-1..6)\`.
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  name: 'Por defecto',
  render: () => <MetricsPageTemplate />,
};

export const FilteredByChannel: Story = {
  name: 'Filtrada por canal',
  render: function Render() {
    const [channel, setChannel] = useState('voice');
    return (
      <div className="px-10 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Métricas · Teléfono</h1>
          <p className="text-sm text-muted-foreground">Análisis de llamadas de voz</p>
        </div>

        <Tabs value={channel} onValueChange={setChannel}>
          <TabsList variant="line">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="voice">Teléfono</TabsTrigger>
            <TabsTrigger value="web">Web</TabsTrigger>
            <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Llamadas" value="456" delta={{ value: "+15%", direction: "up" }} />
          <StatCard label="Duración media" value="4:12" delta={{ value: "-5%", direction: "down" }} />
          <StatCard label="Tasa de éxito" value="92%" delta={{ value: "+2%", direction: "up" }} />
          <StatCard label="Puntuación RAP" value="85" delta={{ value: "+8%", direction: "up" }} />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Página de métricas filtrada para mostrar solo los datos del canal de voz.',
      },
    },
  },
};
