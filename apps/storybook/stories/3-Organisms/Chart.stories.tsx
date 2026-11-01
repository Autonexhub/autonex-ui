import type { Meta, StoryObj } from '@storybook/react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@autonexhub/react";
import { Bar, BarChart, Line, LineChart, Pie, PieChart, XAxis, YAxis, CartesianGrid, Cell } from 'recharts';

const meta: Meta = {
  title: '3-Organisms/Chart',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Componentes de gráficas sobre Recharts. Úsalos para visualizar datos; colores siempre `var(--chart-1..6)`.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const barChartData = [
  { month: 'Ene', llamadas: 186, mensajes: 80 },
  { month: 'Feb', llamadas: 305, mensajes: 200 },
  { month: 'Mar', llamadas: 237, mensajes: 120 },
  { month: 'Abr', llamadas: 73, mensajes: 190 },
  { month: 'May', llamadas: 209, mensajes: 130 },
  { month: 'Jun', llamadas: 214, mensajes: 140 },
];

const barChartConfig: ChartConfig = {
  llamadas: {
    label: 'Llamadas',
    color: 'var(--chart-1)',
  },
  mensajes: {
    label: 'Mensajes',
    color: 'var(--chart-2)',
  },
};

export const BarChartExample: Story = {
  name: 'Barras',
  render: () => (
    <ChartContainer config={barChartConfig} className="h-[300px] w-full">
      <BarChart data={barChartData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="llamadas" fill="var(--color-llamadas)" radius={4} />
        <Bar dataKey="mensajes" fill="var(--color-mensajes)" radius={4} />
      </BarChart>
    </ChartContainer>
  ),
};

const lineChartData = [
  { date: '01/06', conversiones: 12 },
  { date: '02/06', conversiones: 18 },
  { date: '03/06', conversiones: 15 },
  { date: '04/06', conversiones: 25 },
  { date: '05/06', conversiones: 22 },
  { date: '06/06', conversiones: 30 },
  { date: '07/06', conversiones: 28 },
];

const lineChartConfig: ChartConfig = {
  conversiones: {
    label: 'Conversiones',
    color: 'var(--chart-1)',
  },
};

export const LineChartExample: Story = {
  name: 'Líneas',
  render: () => (
    <ChartContainer config={lineChartConfig} className="h-[300px] w-full">
      <LineChart data={lineChartData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          type="linear"
          dataKey="conversiones"
          stroke="var(--color-conversiones)"
          strokeWidth={2}
          dot={{ r: 3, fill: 'var(--color-conversiones)' }}
        />
      </LineChart>
    </ChartContainer>
  ),
};

const pieChartData = [
  { channel: 'voz', value: 45, fill: 'var(--chart-1)' },
  { channel: 'whatsapp', value: 30, fill: 'var(--chart-2)' },
  { channel: 'instagram', value: 15, fill: 'var(--chart-3)' },
  { channel: 'web', value: 10, fill: 'var(--chart-4)' },
];

const pieChartConfig: ChartConfig = {
  voz: { label: 'Voz', color: 'var(--chart-1)' },
  whatsapp: { label: 'WhatsApp', color: 'var(--chart-2)' },
  instagram: { label: 'Instagram', color: 'var(--chart-3)' },
  web: { label: 'Web', color: 'var(--chart-4)' },
};

export const PieChartExample: Story = {
  name: 'Circular',
  render: () => (
    <ChartContainer config={pieChartConfig} className="h-[300px] w-full">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent nameKey="channel" />} />
        <ChartLegend content={<ChartLegendContent nameKey="channel" />} />
        <Pie
          data={pieChartData}
          dataKey="value"
          nameKey="channel"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
        >
          {pieChartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  ),
};

const multiLineData = [
  { date: 'Lun', entrantes: 45, salientes: 30 },
  { date: 'Mar', entrantes: 52, salientes: 35 },
  { date: 'Mié', entrantes: 48, salientes: 28 },
  { date: 'Jue', entrantes: 60, salientes: 42 },
  { date: 'Vie', entrantes: 55, salientes: 38 },
  { date: 'Sáb', entrantes: 30, salientes: 15 },
  { date: 'Dom', entrantes: 20, salientes: 10 },
];

const multiLineConfig: ChartConfig = {
  entrantes: {
    label: 'Entrantes',
    color: 'var(--chart-1)',
  },
  salientes: {
    label: 'Salientes',
    color: 'var(--chart-2)',
  },
};

export const MultiLineChart: Story = {
  name: 'Varias líneas',
  render: () => (
    <ChartContainer config={multiLineConfig} className="h-[300px] w-full">
      <LineChart data={multiLineData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          type="linear"
          dataKey="entrantes"
          stroke="var(--color-entrantes)"
          strokeWidth={2}
          dot={{ r: 3, fill: 'var(--color-entrantes)' }}
        />
        <Line
          type="linear"
          dataKey="salientes"
          stroke="var(--color-salientes)"
          strokeWidth={2}
          dot={{ r: 3, fill: 'var(--color-salientes)' }}
        />
      </LineChart>
    </ChartContainer>
  ),
};

const horizontalBarData = [
  { name: 'Cita programada', value: 120 },
  { name: 'Información solicitada', value: 95 },
  { name: 'Problema resuelto', value: 80 },
  { name: 'Derivado a humano', value: 45 },
  { name: 'Sin resolución', value: 20 },
];

const horizontalBarConfig: ChartConfig = {
  value: {
    label: 'Conversaciones',
    color: 'var(--chart-1)',
  },
};

export const HorizontalBarChart: Story = {
  name: 'Barras horizontales',
  render: () => (
    <ChartContainer config={horizontalBarConfig} className="h-[300px] w-full">
      <BarChart data={horizontalBarData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" tickLine={false} axisLine={false} />
        <YAxis
          type="category"
          dataKey="name"
          tickLine={false}
          axisLine={false}
          width={120}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="value" fill="var(--color-value)" radius={4} />
      </BarChart>
    </ChartContainer>
  ),
};
