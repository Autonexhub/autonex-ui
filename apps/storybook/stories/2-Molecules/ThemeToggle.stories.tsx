import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ThemeToggle, TooltipProvider } from '@autonexhub/react';

const meta: Meta<typeof ThemeToggle> = {
  title: '2-Molecules/ThemeToggle',
  component: ThemeToggle,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Botón sol/luna presentacional: no conoce el proveedor de tema, recibe `isDark` y `onToggle`. Con `collapsed` añade un tooltip a la derecha (barra lateral colapsada).',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ThemeToggle>;

export const Default: Story = {
  render: () => {
    const [isDark, setIsDark] = useState(false);
    return <ThemeToggle isDark={isDark} onToggle={() => setIsDark((v) => !v)} />;
  },
};

export const Collapsed: Story = {
  render: () => {
    const [isDark, setIsDark] = useState(true);
    return (
      <TooltipProvider>
        <ThemeToggle collapsed isDark={isDark} onToggle={() => setIsDark((v) => !v)} />
      </TooltipProvider>
    );
  },
};
