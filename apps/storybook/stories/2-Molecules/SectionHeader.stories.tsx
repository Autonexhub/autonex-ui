import type { Meta, StoryObj } from '@storybook/react';
import { SectionHeader, Button } from '@autonexhub/react';

const meta: Meta<typeof SectionHeader> = {
  title: '2-Molecules/SectionHeader',
  component: SectionHeader,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof SectionHeader>;

export const Default: Story = { args: { title: 'Conversaciones' } };

export const WithActions: Story = {
  args: { title: 'Contactos', actions: <Button size="sm">Nuevo contacto</Button> },
};

export const WithPrefixAction: Story = {
  args: {
    title: 'Detalle',
    prefixAction: <Button variant="ghost" size="sm">Volver</Button>,
    actions: <Button size="sm">Guardar</Button>,
  },
};
