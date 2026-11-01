import type { Meta, StoryObj } from '@storybook/react';
import { ErrorBoundary } from '@autonexhub/react';

const Boom = () => {
  throw new Error('Fallo de render de ejemplo');
};

const meta: Meta<typeof ErrorBoundary> = {
  title: '3-Organisms/ErrorBoundary',
  component: ErrorBoundary,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Captura errores de render y muestra una pantalla amable en vez de una página en blanco. Los textos se pasan con `labels` (por defecto en español); `fallback` permite sustituir toda la UI.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ErrorBoundary>;

export const Default: Story = {
  render: () => (
    <ErrorBoundary>
      <Boom />
    </ErrorBoundary>
  ),
};

export const CustomLabels: Story = {
  render: () => (
    <ErrorBoundary labels={{ title: 'Something broke', reload: 'Reload', home: 'Home' }}>
      <Boom />
    </ErrorBoundary>
  ),
};
