import type { Meta, StoryObj } from '@storybook/react';
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from '@autonexhub/react';
import { Button } from '@autonexhub/react';
import { Input } from '@autonexhub/react';
import {
  ArrowClockwise,
  CaretDown,
  Copy,
  Funnel,
  MagnifyingGlass,
  PencilSimple,
  Trash,
} from '@phosphor-icons/react';

const meta: Meta<typeof ButtonGroup> = {
  title: '2-Molecules/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Dirección del grupo',
      table: { defaultValue: { summary: 'horizontal' } },
    },
    className: {
      control: 'text',
      description: 'Clases adicionales (ancho, márgenes)',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Grupo de botones adosados (segmented control): los hijos pierden el radio en las esquinas interiores y comparten borde. Usar para acciones relacionadas que forman una unidad (paginación, botón + caret de opciones, input + botón). Con variant="outline" en los botones se ve el borde compartido. ButtonGroupText añade un tramo no interactivo (prefijos, etiquetas) y ButtonGroupSeparator divide dentro de un mismo grupo.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ButtonGroup>;

export const Segmentado: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline">Día</Button>
      <Button variant="secondary">Semana</Button>
      <Button variant="outline">Mes</Button>
    </ButtonGroup>
  ),
  args: { orientation: 'horizontal' },
};

export const ConIconos: Story = {
  name: 'Con iconos',
  render: () => (
    <ButtonGroup>
      <Button variant="outline" size="icon" aria-label="Editar">
        <PencilSimple />
      </Button>
      <Button variant="outline" size="icon" aria-label="Duplicar">
        <Copy />
      </Button>
      <Button variant="outline" size="icon" aria-label="Eliminar">
        <Trash />
      </Button>
    </ButtonGroup>
  ),
};

export const BotonConOpciones: Story = {
  name: 'Botón + caret de opciones',
  render: () => (
    <ButtonGroup>
      <Button variant="outline">
        <ArrowClockwise />
        Reprocesar
      </Button>
      <Button variant="outline" size="icon" aria-label="Más opciones">
        <CaretDown />
      </Button>
    </ButtonGroup>
  ),
};

export const Mixto: Story = {
  name: 'Mixto (texto + input + botón)',
  render: () => (
    <ButtonGroup className="w-96">
      <ButtonGroupText>+34</ButtonGroupText>
      <Input type="tel" placeholder="612 345 678" className="rounded-l-none rounded-r-none" />
      <Button variant="outline">Llamar</Button>
    </ButtonGroup>
  ),
};

export const ConSeparador: Story = {
  name: 'Con separador',
  render: () => (
    <ButtonGroup>
      <Button variant="secondary">
        <Funnel />
        Filtrar
      </Button>
      <ButtonGroupSeparator />
      <Button variant="secondary" size="icon" aria-label="Buscar">
        <MagnifyingGlass />
      </Button>
    </ButtonGroup>
  ),
};

export const Vertical: Story = {
  render: () => (
    <ButtonGroup orientation="vertical">
      <Button variant="outline">Hoy</Button>
      <Button variant="outline">Últimos 7 días</Button>
      <Button variant="outline">Últimos 30 días</Button>
    </ButtonGroup>
  ),
};

export const GruposAnidados: Story = {
  name: 'Grupos anidados (gap automático)',
  render: () => (
    <ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="sm">
          Anterior
        </Button>
        <Button variant="outline" size="sm">
          Siguiente
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="sm">
          Exportar
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  ),
};
