import type { Meta, StoryObj } from '@storybook/react';
import { AspectRatio } from '@autonexhub/react';

const meta: Meta<typeof AspectRatio> = {
  title: '1-Atoms/AspectRatio',
  component: AspectRatio,
  tags: ['autodocs'],
  argTypes: {
    ratio: {
      control: 'number',
      description: 'Proporción (ancho / alto)',
      table: { defaultValue: { summary: '1' } },
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Mantiene una proporción fija para el contenido. Úsalo para imágenes y vídeos.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AspectRatio>;

export const Square: Story = {
  name: 'Cuadrado',
  render: () => (
    <div className="w-[300px]">
      <AspectRatio ratio={1}>
        <div className="flex h-full w-full items-center justify-center rounded-md bg-muted">
          <span className="text-sm text-muted-foreground">1:1</span>
        </div>
      </AspectRatio>
    </div>
  ),
};

export const Landscape16by9: Story = {
  name: 'Horizontal 16:9',
  render: () => (
    <div className="w-[450px]">
      <AspectRatio ratio={16 / 9}>
        <div className="flex h-full w-full items-center justify-center rounded-md bg-muted">
          <span className="text-sm text-muted-foreground">16:9 (vídeo)</span>
        </div>
      </AspectRatio>
    </div>
  ),
};

export const Portrait4by3: Story = {
  name: 'Clásico 4:3',
  render: () => (
    <div className="w-[300px]">
      <AspectRatio ratio={4 / 3}>
        <div className="flex h-full w-full items-center justify-center rounded-md bg-muted">
          <span className="text-sm text-muted-foreground">4:3</span>
        </div>
      </AspectRatio>
    </div>
  ),
};

export const WithImage: Story = {
  name: 'Con imagen',
  render: () => (
    <div className="w-[450px]">
      <AspectRatio ratio={16 / 9} className="bg-muted">
        <div className="flex h-full w-full items-center justify-center rounded-md bg-gradient-to-br from-muted to-muted-foreground/20">
          <span className="text-lg font-semibold text-muted-foreground">
            Imagen de ejemplo
          </span>
        </div>
      </AspectRatio>
    </div>
  ),
};

export const Cinematic: Story = {
  name: 'Panorámico',
  render: () => (
    <div className="w-[500px]">
      <AspectRatio ratio={21 / 9}>
        <div className="flex h-full w-full items-center justify-center rounded-md bg-muted">
          <span className="text-sm text-muted-foreground">21:9 (cinemascope)</span>
        </div>
      </AspectRatio>
    </div>
  ),
};

export const PortraitPhone: Story = {
  name: 'Vertical (móvil)',
  render: () => (
    <div className="w-[200px]">
      <AspectRatio ratio={9 / 16}>
        <div className="flex h-full w-full items-center justify-center rounded-md bg-muted">
          <span className="text-sm text-muted-foreground">9:16 (historias)</span>
        </div>
      </AspectRatio>
    </div>
  ),
};

export const AllRatios: Story = {
  name: 'Todas las proporciones',
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <AspectRatio ratio={1}>
          <div className="flex h-full w-full items-center justify-center rounded-md bg-muted">
            <span className="text-xs text-muted-foreground">1:1</span>
          </div>
        </AspectRatio>
        <p className="mt-1 text-center text-xs text-muted-foreground">Cuadrado</p>
      </div>
      <div>
        <AspectRatio ratio={4 / 3}>
          <div className="flex h-full w-full items-center justify-center rounded-md bg-muted">
            <span className="text-xs text-muted-foreground">4:3</span>
          </div>
        </AspectRatio>
        <p className="mt-1 text-center text-xs text-muted-foreground">Clásico</p>
      </div>
      <div>
        <AspectRatio ratio={16 / 9}>
          <div className="flex h-full w-full items-center justify-center rounded-md bg-muted">
            <span className="text-xs text-muted-foreground">16:9</span>
          </div>
        </AspectRatio>
        <p className="mt-1 text-center text-xs text-muted-foreground">Vídeo</p>
      </div>
    </div>
  ),
};
