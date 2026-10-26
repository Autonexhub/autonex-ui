import type { Meta, StoryObj } from '@storybook/react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@autonexhub/react';
import { Card, CardContent } from '@autonexhub/react';

const meta: Meta<typeof Carousel> = {
  title: '3-Organisms/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'Carousel orientation',
      table: { defaultValue: { summary: 'horizontal' } },
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Carousel/slider component. Use for image galleries and content carousels.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Carousel>;

export const Default: Story = {
  render: () => (
    <div className="w-full max-w-xs mx-auto">
      <Carousel>
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-4xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
};

export const MultipleItems: Story = {
  render: () => (
    <div className="w-full max-w-sm mx-auto">
      <Carousel
        opts={{
          align: 'start',
        }}
        className="w-full"
      >
        <CarouselContent>
          {Array.from({ length: 8 }).map((_, index) => (
            <CarouselItem key={index} className="basis-1/3">
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-2xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
};

export const TwoPerView: Story = {
  render: () => (
    <div className="w-full max-w-lg mx-auto">
      <Carousel
        opts={{
          align: 'start',
        }}
        className="w-full"
      >
        <CarouselContent>
          {Array.from({ length: 6 }).map((_, index) => (
            <CarouselItem key={index} className="md:basis-1/2">
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-video items-center justify-center p-6">
                    <span className="text-3xl font-semibold">Slide {index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="w-full max-w-xs mx-auto">
      <Carousel
        opts={{
          align: 'start',
        }}
        orientation="vertical"
        className="w-full"
      >
        <CarouselContent className="-mt-1 h-[200px]">
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="pt-1 md:basis-1/2">
              <div className="p-1">
                <Card>
                  <CardContent className="flex items-center justify-center p-6">
                    <span className="text-2xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
};

export const WithImages: Story = {
  render: () => (
    <div className="w-full max-w-md mx-auto">
      <Carousel className="w-full">
        <CarouselContent>
          {['Conversaciones', 'Contactos', 'Métricas', 'Configuración'].map((title, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex flex-col aspect-video items-center justify-center p-6 bg-muted">
                    <span className="text-2xl font-semibold mb-2">{title}</span>
                    <span className="text-sm text-muted-foreground">
                      Vista previa de la sección
                    </span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
};
