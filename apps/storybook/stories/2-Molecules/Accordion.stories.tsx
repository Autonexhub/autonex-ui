import type { Meta, StoryObj } from '@storybook/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@autonexhub/react';

const meta: Meta<typeof Accordion> = {
  title: '2-Molecules/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'radio',
      options: ['single', 'multiple'],
      description: 'Single or multiple items can be open',
      table: { defaultValue: { summary: 'single' } },
    },
    collapsible: {
      control: 'boolean',
      description: 'Allow closing all items (only for type="single")',
    },
    defaultValue: {
      control: 'text',
      description: 'Initially open item(s)',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Paneles apilados que se abren y cierran. Para FAQs y secciones de ajustes. El ANCHO lo pone el contenedor (diálogo, tarjeta o columna): el acordeón no cambia de ancho al abrirse.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Single: Story = {
  render: () => (
    // Ancho fijo del contenedor: el acordeón NUNCA cambia de ancho al abrir o
    // cerrar (en la app lo fija el diálogo, la tarjeta o la columna que lo aloja).
    <div className="w-[28rem] max-w-full">
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>¿Qué es Autonex?</AccordionTrigger>
        <AccordionContent>
          Autonex es una plataforma de IA conversacional para gestionar llamadas, chats y mensajería.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>¿Cómo funciona?</AccordionTrigger>
        <AccordionContent>
          Conectamos agentes de voz y texto con tu CRM para automatizar conversaciones.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>¿Cuánto cuesta?</AccordionTrigger>
        <AccordionContent>
          Ofrecemos planes basados en consumo. Contacta con ventas para más info.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
    </div>
  ),
};

export const Multiple: Story = {
  render: () => (
    <div className="w-[28rem] max-w-full">
    <Accordion type="multiple" defaultValue={['item-1']} className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Configuración general</AccordionTrigger>
        <AccordionContent>
          Ajustes básicos de la organización.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Agentes de voz</AccordionTrigger>
        <AccordionContent>
          Configura tus agentes de llamadas telefónicas.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Integraciones</AccordionTrigger>
        <AccordionContent>
          Conecta con WhatsApp, Instagram y otros canales.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
    </div>
  ),
};
