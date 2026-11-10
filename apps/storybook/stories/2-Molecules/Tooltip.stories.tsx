import type { Meta, StoryObj } from '@storybook/react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@autonexhub/react';
import { Button } from '@autonexhub/react';
import { Question } from '@phosphor-icons/react';

const meta: Meta<typeof Tooltip> = {
  title: '2-Molecules/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    delayDuration: {
      control: { type: 'number', min: 0, max: 1000, step: 50 },
      description: 'Retardo en ms antes de que aparezca el tooltip',
      table: {
        defaultValue: { summary: '300' },
      },
    },
    disableHoverableContent: {
      control: 'boolean',
      description: 'Si es true, el tooltip se cierra al pasar el ratón por su contenido',
    },
  },
  // TooltipProvider is now global in .storybook/preview.tsx
  parameters: {
    docs: {
      description: {
        component: `
Tooltip al pasar el ratón o al enfocar. Muestra información de contexto.

## Uso
TooltipProvider ya está incluido de forma global. Basta con:

\`\`\`tsx
<Tooltip>
  <TooltipTrigger asChild>
    <Button>Pasa el ratón</Button>
  </TooltipTrigger>
  <TooltipContent>
    Texto del tooltip
  </TooltipContent>
</Tooltip>

\`\`\`

## Props
- **side**: top | right | bottom | left (por defecto: top)
- **delayDuration**: ms antes de mostrarse (por defecto: 300 ms)
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  name: 'Por defecto',
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Exportar</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Descarga las conversaciones en CSV</p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const WithIcon: Story = {
  name: 'Con icono',
  render: () => (
    <Tooltip>
      <TooltipTrigger>
        <Question className="h-4 w-4 text-muted-foreground" />
      </TooltipTrigger>
      <TooltipContent>
        <p>La puntuación RAP mide la calidad de la conversación (0-10)</p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const Positions: Story = {
  name: 'Posiciones',
  render: () => (
    <div className="flex gap-8">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">Arriba</Button>
        </TooltipTrigger>
        <TooltipContent side="top">Tooltip arriba</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">Derecha</Button>
        </TooltipTrigger>
        <TooltipContent side="right">Tooltip a la derecha</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">Abajo</Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Tooltip abajo</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">Izquierda</Button>
        </TooltipTrigger>
        <TooltipContent side="left">Tooltip a la izquierda</TooltipContent>
      </Tooltip>
    </div>
  ),
};
