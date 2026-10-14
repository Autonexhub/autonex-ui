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
      description: 'Delay in ms before tooltip appears',
      table: {
        defaultValue: { summary: '300' },
      },
    },
    disableHoverableContent: {
      control: 'boolean',
      description: 'If true, tooltip closes when hovering its content',
    },
  },
  // TooltipProvider is now global in .storybook/preview.tsx
  parameters: {
    docs: {
      description: {
        component: `
Tooltip on hover/focus. Shows contextual information on hover.

## Usage
TooltipProvider is included globally. Just use:

\`\`\`tsx
<Tooltip>
  <TooltipTrigger asChild>
    <Button>Hover me</Button>
  </TooltipTrigger>
  <TooltipContent>
    Tooltip text
  </TooltipContent>
</Tooltip>

\`\`\`

## Props
- **side**: top | right | bottom | left (default: top)
- **delayDuration**: ms before showing (default: 300ms)
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
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
  render: () => (
    <Tooltip>
      <TooltipTrigger>
        <Question className="h-4 w-4 text-muted-foreground" />
      </TooltipTrigger>
      <TooltipContent>
        <p>El score RAP mide la calidad de la conversación (0-10)</p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const Positions: Story = {
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
