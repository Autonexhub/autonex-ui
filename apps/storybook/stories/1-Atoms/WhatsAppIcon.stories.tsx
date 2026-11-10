import type { Meta, StoryObj } from '@storybook/react';
import { WhatsAppIcon } from '@autonexhub/react';

const meta: Meta<typeof WhatsAppIcon> = {
  title: '1-Atoms/WhatsAppIcon',
  component: WhatsAppIcon,
  tags: ['autodocs'],
  argTypes: { size: { control: { type: 'range', min: 12, max: 64 } } },
  parameters: {
    docs: {
      description: {
        component: 'Logotipo de WhatsApp (Phosphor, peso regular). Hereda el color del texto; `size` por defecto 22 px.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof WhatsAppIcon>;

export const Default: Story = { name: 'Por defecto' };

export const Tamanos: Story = {
  name: 'Tamaños y color',
  render: () => (
    <div className="flex items-end gap-4 text-success">
      <WhatsAppIcon size={16} />
      <WhatsAppIcon />
      <WhatsAppIcon size={32} />
      <WhatsAppIcon size={48} className="text-muted-foreground" />
    </div>
  ),
};
