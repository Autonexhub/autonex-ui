import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import 'react-image-crop/dist/ReactCrop.css';
import { Button, ImageCropModal } from '@autonexhub/react';

// Imagen de ejemplo embebida (sin red): degradado con un círculo.
const sample =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#22c55e"/></linearGradient></defs><rect width="640" height="480" fill="url(#g)"/><circle cx="320" cy="240" r="120" fill="#fff" fill-opacity=".85"/></svg>',
  );

const meta: Meta<typeof ImageCropModal> = {
  title: '3-Organisms/ImageCropModal',
  component: ImageCropModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Diálogo para recortar una imagen cuadrada (salida 400x400 JPEG) con `react-image-crop`. Devuelve el `Blob` recortado en `onCropComplete`. El CSS `react-image-crop/dist/ReactCrop.css` lo importa el consumidor.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ImageCropModal>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    const [result, setResult] = useState<string | null>(null);
    return (
      <div className="space-y-3">
        <Button onClick={() => setOpen(true)}>Abrir recorte</Button>
        {result && <img src={result} alt="Resultado" className="h-24 w-24 rounded-lg border" />}
        <ImageCropModal
          isOpen={open}
          onClose={() => setOpen(false)}
          imageSrc={sample}
          onCropComplete={(blob) => {
            setResult(URL.createObjectURL(blob));
            setOpen(false);
          }}
        />
      </div>
    );
  },
};
