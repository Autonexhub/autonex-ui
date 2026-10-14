import type { Meta, StoryObj } from '@storybook/react';
import { ScrollArea, ScrollBar } from '@autonexhub/react';
import { Separator } from '@autonexhub/react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@autonexhub/react';

const meta: Meta<typeof ScrollArea> = {
  title: '2-Molecules/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Custom scrollable area with styled scrollbars. Use for overflow content.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ScrollArea>;

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `Etiqueta ${a.length - i}`
);

export const Vertical: Story = {
  render: () => (
    <ScrollArea className="h-72 w-48 rounded-lg border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Etiquetas</h4>
        {tags.map((tag) => (
          <div key={tag}>
            <div className="text-sm">{tag}</div>
            <Separator className="my-2" />
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

const works = [
  {
    artist: 'Pablo Picasso',
    art: 'Guernica',
  },
  {
    artist: 'Vincent van Gogh',
    art: 'La noche estrellada',
  },
  {
    artist: 'Salvador Dalí',
    art: 'La persistencia de la memoria',
  },
  {
    artist: 'Claude Monet',
    art: 'Nenúfares',
  },
  {
    artist: 'Edvard Munch',
    art: 'El grito',
  },
  {
    artist: 'Johannes Vermeer',
    art: 'La joven de la perla',
  },
  {
    artist: 'Leonardo da Vinci',
    art: 'La Mona Lisa',
  },
];

export const Horizontal: Story = {
  render: () => (
    <ScrollArea className="w-96 whitespace-nowrap rounded-lg border">
      <div className="flex w-max space-x-4 p-4">
        {works.map((work) => (
          <figure key={work.artist} className="shrink-0">
            <div className="overflow-hidden rounded-md">
              <div className="h-32 w-48 bg-muted flex items-center justify-center">
                <span className="text-sm text-muted-foreground">{work.art}</span>
              </div>
            </div>
            <figcaption className="pt-2 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">{work.artist}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
};

export const WithContent: Story = {
  render: () => (
    <ScrollArea className="h-[200px] w-[350px] rounded-lg border p-4">
      <h4 className="mb-4 text-sm font-semibold">Conversación reciente</h4>
      <div className="space-y-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-muted flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Usuario {i + 1}</p>
              <p className="text-sm text-muted-foreground">
                Este es un mensaje de ejemplo para mostrar el scroll.
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const BothDirections: Story = {
  render: () => (
    <ScrollArea className="h-[300px] w-[400px] rounded-lg border">
      <div className="p-4" style={{ width: '600px' }}>
        <h4 className="mb-4 text-sm font-semibold">Tabla grande</h4>
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: 8 }).map((_, i) => (
                <TableHead key={i}>Columna {i + 1}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 20 }).map((_, row) => (
              <TableRow key={row}>
                {Array.from({ length: 8 }).map((_, col) => (
                  <TableCell key={col}>
                    Celda {row + 1}-{col + 1}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
};
