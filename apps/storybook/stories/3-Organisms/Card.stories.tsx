import type { Meta, StoryObj } from '@storybook/react';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
  Badge,
} from '@autonexhub/react';

const meta: Meta<typeof Card> = {
  title: '3-Organisms/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Clases CSS adicionales (ancho, relleno)',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Contenedor de tarjeta: `rounded-2xl`, borde hairline y sombra susurro `shadow-elev`, horneados en `ui/card.tsx`. Se compone con CardHeader, CardTitle, CardDescription, CardAction, CardContent y CardFooter (todos con `p-4`).',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  name: 'Por defecto',
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Horario de atención</CardTitle>
        <CardDescription>Lo que el agente responde cuando preguntan por el horario.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          De lunes a viernes, de 9:00 a 20:00. Sábados, de 10:00 a 14:00.
        </p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="ghost">Cancelar</Button>
        <Button>Guardar</Button>
      </CardFooter>
    </Card>
  ),
};

export const StatCard: Story = {
  name: 'Tarjeta de KPI',
  render: () => (
    <Card className="w-64">
      <CardHeader className="pb-2">
        <CardDescription>Conversaciones totales</CardDescription>
        <CardTitle className="text-3xl tabular-nums">1.234</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">
          <span className="text-success">+12%</span> respecto al mes anterior
        </p>
      </CardContent>
    </Card>
  ),
};

export const FeatureCard: Story = {
  name: 'Tarjeta de función',
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Agente de voz</CardTitle>
        <CardDescription>Atiende las llamadas entrantes automáticamente</CardDescription>
        <CardAction>
          <Badge variant="success">Activo</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Llamadas hoy</span>
            <span className="font-medium tabular-nums">47</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Duración media</span>
            <span className="font-medium tabular-nums">3:24</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">Ver detalle</Button>
      </CardFooter>
    </Card>
  ),
};
