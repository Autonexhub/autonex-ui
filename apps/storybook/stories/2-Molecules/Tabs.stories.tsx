import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@autonexhub/react';

const meta: Meta<typeof Tabs> = {
  title: '2-Molecules/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: {
    defaultValue: {
      control: 'text',
      description: 'Initial active tab value (uncontrolled)',
    },
    value: {
      control: 'text',
      description: 'Active tab value (controlled)',
    },
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'Tab orientation',
      table: {
        defaultValue: { summary: 'horizontal' },
      },
    },
    onValueChange: {
      action: 'valueChange',
      description: 'Callback when active tab changes',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Tab navigation. Default variant is "line" (underline). Use "default" (segmented) for short filters.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const LineVariant: Story = {
  name: 'Line Variant (default)',
  render: () => (
    <Tabs defaultValue="comportamiento" className="w-96">
      <TabsList>
        <TabsTrigger value="comportamiento">Comportamiento</TabsTrigger>
        <TabsTrigger value="idioma">Idioma</TabsTrigger>
        <TabsTrigger value="reglas">Reglas</TabsTrigger>
      </TabsList>
      <TabsContent value="comportamiento" className="p-4">Ajustes de comportamiento del agente</TabsContent>
      <TabsContent value="idioma" className="p-4">Ajustes de idioma del agente</TabsContent>
      <TabsContent value="reglas" className="p-4">Reglas y límites del agente</TabsContent>
    </Tabs>
  ),
};

export const ChannelTabs: Story = {
  name: 'Channel Tabs (canonical order)',
  render: () => (
    <Tabs defaultValue="all" className="w-full">
      <TabsList>
        <TabsTrigger value="all">Todas</TabsTrigger>
        <TabsTrigger value="voice">Teléfono</TabsTrigger>
        <TabsTrigger value="web">Web</TabsTrigger>
        <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
        <TabsTrigger value="instagram">Instagram</TabsTrigger>
        <TabsTrigger value="manual">Manual</TabsTrigger>
      </TabsList>
    </Tabs>
  ),
};

export const TwoTabs: Story = {
  name: 'Two Tabs',
  render: () => (
    <Tabs defaultValue="list" className="w-64">
      <TabsList>
        <TabsTrigger value="list">Lista</TabsTrigger>
        <TabsTrigger value="board">Tablero</TabsTrigger>
      </TabsList>
    </Tabs>
  ),
};

export const Segmented: Story = {
  name: 'Segmented (filters)',
  render: () => (
    <Tabs defaultValue="all" className="w-96">
      <TabsList variant="default">
        <TabsTrigger value="all">Todas</TabsTrigger>
        <TabsTrigger value="open">Abiertas</TabsTrigger>
        <TabsTrigger value="closed">Cerradas</TabsTrigger>
      </TabsList>
    </Tabs>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Variante "default" (segmentada, píldora sobre bg-muted). Reservada para filtros cortos; para navegación de contenido usar la variante "line" (por defecto).',
      },
    },
  },
};
