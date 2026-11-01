import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ImageViewerModal, Button } from '@autonexhub/react';

const meta: Meta<typeof ImageViewerModal> = {
  title: '3-Organisms/ImageViewerModal',
  component: ImageViewerModal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Visor de imagen a pantalla completa con descarga. Los textos se pasan con `labels` (por defecto en español).',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ImageViewerModal>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Abrir imagen</Button>
        <ImageViewerModal
          isOpen={open}
          onClose={() => setOpen(false)}
          imageUrl="https://placehold.co/800x500/png"
          imageAlt="Imagen de ejemplo"
        />
      </>
    );
  },
};

export const LoadError: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return <ImageViewerModal isOpen={open} onClose={() => setOpen(false)} imageUrl="https://invalid.invalid/x.png" />;
  },
};
