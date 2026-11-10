import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@autonexhub/react';

const meta: Meta<typeof Tabs> = {
  title: '2-Molecules/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: {
    defaultValue: {
      control: 'text',
      description: 'Pestaña activa inicial (no controlado)',
    },
    value: {
      control: 'text',
      description: 'Pestaña activa (controlado)',
    },
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'Orientación de las pestañas',
      table: {
        defaultValue: { summary: 'horizontal' },
      },
    },
    onValueChange: {
      action: 'valueChange',
      description: 'Se llama cuando cambia la pestaña activa',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Navegación por pestañas. La variante por defecto es "line" (subrayado); "default" (segmentada) se reserva para filtros cortos.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const LineVariant: Story = {
  name: 'Variante line (por defecto)',
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
  name: 'Pestañas de canal (orden canónico)',
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
  name: 'Dos pestañas',
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
  name: 'Segmentada (filtros)',
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
