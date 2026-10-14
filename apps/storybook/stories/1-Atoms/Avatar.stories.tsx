import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarFallback, AvatarImage } from '@autonexhub/react';

const meta: Meta<typeof Avatar> = {
  title: '1-Atoms/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    shape: {
      control: 'inline-radio',
      options: ['circle', 'square'],
      description: 'circle para personas; square (esquina redondeada) para logos de organización',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes. Use to set size (h-6 w-6, h-8 w-8, h-10 w-10, h-12 w-12)',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Avatar with image and fallback. Compose with AvatarImage and AvatarFallback. Usa shape="square" para entidades (logos de organización): una marca cuadrada se recorta dentro de un círculo.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const WithImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

export const Fallback: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>MR</AvatarFallback>
    </Avatar>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar className="h-6 w-6">
        <AvatarFallback className="text-xs">S</AvatarFallback>
      </Avatar>
      <Avatar className="h-8 w-8">
        <AvatarFallback className="text-sm">M</AvatarFallback>
      </Avatar>
      <Avatar className="h-10 w-10">
        <AvatarFallback>L</AvatarFallback>
      </Avatar>
      <Avatar className="h-12 w-12">
        <AvatarFallback>XL</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const AvatarGroup: Story = {
  render: () => (
    <div className="flex -space-x-2">
      <Avatar className="border-2 border-background">
        <AvatarFallback>A</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background">
        <AvatarFallback>B</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background">
        <AvatarFallback>C</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background">
        <AvatarFallback className="text-xs">+3</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const Shapes: Story = {
  render: () => (
    <div className="flex items-end gap-6">
      <div className="flex flex-col items-center gap-2">
        <Avatar className="h-9 w-9">
          <AvatarFallback>BP</AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground">circle · personas</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar shape="square" className="h-9 w-9">
          <AvatarFallback>E</AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground">square · organización</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Las personas van en círculo y las entidades (organizaciones) en cuadrado con esquina redondeada, para que un logo no se recorte.',
      },
    },
  },
};
