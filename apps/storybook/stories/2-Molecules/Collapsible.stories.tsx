import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@autonexhub/react';
import { Button } from '@autonexhub/react';
import { CaretDown } from '@phosphor-icons/react';

const meta: Meta<typeof Collapsible> = {
  title: '2-Molecules/Collapsible',
  component: Collapsible,
  tags: ['autodocs'],
  argTypes: {
    defaultOpen: {
      control: 'boolean',
      description: 'Initial open state',
    },
    open: {
      control: 'boolean',
      description: 'Controlled open state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the collapsible',
    },
    onOpenChange: {
      action: 'openChange',
      description: 'Callback when open state changes',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Expandable/collapsible section. Use for progressive disclosure.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Collapsible>;

export const Default: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-80 space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold">Filtros avanzados</h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              <CaretDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="space-y-2 overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
          <div className="rounded-lg border px-4 py-2 text-sm">
            Filtro por fecha
          </div>
          <div className="rounded-lg border px-4 py-2 text-sm">
            Filtro por canal
          </div>
          <div className="rounded-lg border px-4 py-2 text-sm">
            Filtro por estado
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  },
};

export const DefaultOpen: Story = {
  render: () => (
    <Collapsible defaultOpen className="w-80 space-y-2">
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          Ver detalles
          <CaretDown className="h-4 w-4" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden rounded-lg border p-4 data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
        <p className="text-sm text-muted-foreground">
          Contenido expandido con más información sobre el elemento.
        </p>
      </CollapsibleContent>
    </Collapsible>
  ),
};
