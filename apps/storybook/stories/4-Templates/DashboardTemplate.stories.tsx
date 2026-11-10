import type { Meta, StoryObj } from '@storybook/react';
import { SparkleIcon, ArrowUpIcon } from '@phosphor-icons/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@autonexhub/react';
import { Input } from '@autonexhub/react';
import { Button } from '@autonexhub/react';
import { InputGroup, InputGroupTextarea, InputGroupAddon, InputGroupButton } from '@autonexhub/react';
import { Avatar, AvatarFallback } from '@autonexhub/react';
import { Badge } from '@autonexhub/react';
import { ChannelBadge, type ChannelType } from '@autonexhub/react';
import { MagnifyingGlass, Phone, ChatCircle, WhatsappLogo, TrendUp, Clock, Users, CheckCircle } from '@phosphor-icons/react';
import { AppShellFrame } from './AppShellFrame';

const CHANNEL_MAP: Record<string, ChannelType> = {
  'Teléfono': 'voice',
  'WhatsApp': 'whatsapp',
  'Web': 'web',
  'Instagram': 'instagram',
};

const DashboardTemplate = () => (
  <div className="px-10 py-6 space-y-6">
    {/* Saludo + buscador */}
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Buenos días, Marcos</h1>
        <p className="text-sm text-muted-foreground">Esto es lo que está pasando hoy</p>
      </div>
      <div className="relative max-w-md">
        <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar conversaciones, contactos..." className="pl-10" />
      </div>
    </div>

    {/* Quick Actions */}
    <div className="flex gap-2">
      <Button variant="outline" size="sm">
        <Phone className="h-4 w-4" /> Nueva llamada
      </Button>
      <Button variant="outline" size="sm">
        <ChatCircle className="h-4 w-4" /> Nuevo mensaje
      </Button>
      <Button variant="outline" size="sm">
        <WhatsappLogo className="h-4 w-4" /> WhatsApp
      </Button>
    </div>

    {/* Stats Grid */}
    <div className="grid md:grid-cols-4 gap-4">
      {[
        { label: 'Total llamadas', value: '1,234', icon: Phone, change: '+12%' },
        { label: 'Duración media', value: '3:24', icon: Clock, change: '-5%' },
        { label: 'Tasa de éxito', value: '94%', icon: CheckCircle, change: '+3%' },
        { label: 'Contactos activos', value: '456', icon: Users, change: '+8%' },
      ].map((stat) => (
        <Card key={stat.label}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>{stat.label}</CardDescription>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-baseline gap-2">
              <CardTitle className="text-2xl tabular-nums">{stat.value}</CardTitle>
              <span className={`text-xs ${stat.change.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                {stat.change}
              </span>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>

    {/* Charts + Recent */}
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Conversaciones por día</CardTitle>
            <TrendUp className="h-4 w-4 text-success" />
          </div>
        </CardHeader>
        <CardContent>
          {/* Chart placeholder - would use actual Chart component */}
          <div className="h-48 w-full bg-muted/30 rounded-lg flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Gráfico de barras</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Conversaciones recientes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { name: 'María López', time: 'Hace 5 min', channel: 'Teléfono', status: 'Completada' },
            { name: 'Carlos Ruiz', time: 'Hace 15 min', channel: 'WhatsApp', status: 'En curso' },
            { name: 'Ana Martínez', time: 'Hace 1 hora', channel: 'Web', status: 'Completada' },
          ].map((conv) => (
            <div key={conv.name} className="flex items-center gap-3 hover:bg-muted/50 rounded-lg p-2 -mx-2 cursor-pointer">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {conv.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 space-y-0.5">
                <p className="text-sm font-medium truncate">{conv.name}</p>
                <ChannelBadge channel={CHANNEL_MAP[conv.channel]} />
              </div>
              <div className="text-right">
                <Badge variant={conv.status === 'Completada' ? 'success' : 'secondary'}>
                  {conv.status}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">{conv.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
);

const meta: Meta = {
  title: '4-Templates/DashboardTemplate',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Plantilla de la página de inicio.

Se muestra DENTRO del chasis inset (decisión Bruno 03/09, ver 4-Templates/AppShell).

## Claves
- **Saludo**: personalizado según la hora del día.
- **Buscador**: búsqueda global con icono de lupa.
- **Accesos rápidos**: botones para las tareas habituales.
- **Rejilla de KPI**: 4 columnas con icono e indicador de variación.
- **Contenido a dos columnas**: gráficas a la izquierda, elementos recientes a la derecha.

## Patrón de tarjeta de KPI
\`\`\`tsx
<Card>
  <CardHeader className="pb-2">
    <div className="flex items-center justify-between">
      <CardDescription>{label}</CardDescription>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </div>
    <div className="flex items-baseline gap-2">
      <CardTitle className="text-2xl tabular-nums">{value}</CardTitle>
      <span className="text-xs text-success">+12%</span>
    </div>
  </CardHeader>
</Card>
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
  render: () => <DashboardTemplate />,
  // Marco = chasis inset real (4-Templates/AppShell). BuscadorInicio es un
  // fragmento y va sin marco.
  decorators: [
    (Story) => (
      <AppShellFrame page="Rambo IA" onAssistantPage>
        <Story />
      </AppShellFrame>
    ),
  ],
};

export const BuscadorInicio: Story = {
  name: 'Buscador del Inicio (patrón preset)',
  render: () => (
    <div className="mx-auto max-w-2xl space-y-5 p-8">
      <h1 className="text-center text-2xl font-semibold">Buenos días, Autonex</h1>
      {/* Receta oficial del preset (InputGroup) — la misma composición que
          src/components/DashboardSearchInput.tsx usa en producción */}
      <InputGroup className="rounded-xl border-border bg-card has-[textarea]:rounded-xl">
        <InputGroupTextarea
          placeholder="Busca conversaciones, contactos, métricas…"
          aria-label="Buscar"
          className="min-h-16 text-base md:text-base"
          rows={3}
        />
        <InputGroupAddon align="block-end" className="gap-1">
          <SparkleIcon className="h-5 w-5 text-muted-foreground/70" />
          <InputGroupButton size="icon-sm" aria-label="Enviar" className="ml-auto rounded-full bg-muted text-muted-foreground/50">
            <ArrowUpIcon className="h-4 w-4" />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <div className="flex flex-wrap justify-center gap-2">
        <Button variant="chip" size="sm">Conversaciones</Button>
        <Button variant="chip" size="sm">Contactos</Button>
        <Button variant="chip" size="sm">Métricas</Button>
      </div>
    </div>
  ),
  parameters: { docs: { description: { story: 'Patrón oficial del buscador del Inicio: la receta InputGroup del preset (textarea + addon block-end con enviar circular) y chips de acceso rápido (Button variant="chip").' } } },
};
