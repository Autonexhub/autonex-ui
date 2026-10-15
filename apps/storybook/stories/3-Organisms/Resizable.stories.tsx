import type { Meta, StoryObj } from '@storybook/react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@autonexhub/react';

const meta: Meta = {
  title: '3-Organisms/Resizable',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Paneles con anchura ajustable (react-resizable-panels v4). Usa `orientation` (no `direction`) y tamaños numéricos o en porcentaje ("30%"). `onLayoutChanged` sustituye a `onLayout`.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const Box = ({ label }: { label: string }) => (
  <div className="flex h-full items-center justify-center p-6 text-sm text-muted-foreground">{label}</div>
);

export const Horizontal: Story = {
  render: () => (
    <ResizablePanelGroup orientation="horizontal" className="min-h-[200px] max-w-xl rounded-lg border">
      <ResizablePanel defaultSize="30%" minSize="15%">
        <Box label="Panel A" />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="70%">
        <Box label="Panel B" />
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

export const Vertical: Story = {
  render: () => (
    <ResizablePanelGroup orientation="vertical" className="min-h-[300px] max-w-xl rounded-lg border">
      <ResizablePanel defaultSize="40%">
        <Box label="Arriba" />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="60%">
        <Box label="Abajo" />
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

export const ThreeColumns: Story = {
  render: () => (
    <ResizablePanelGroup orientation="horizontal" className="min-h-[200px] max-w-2xl rounded-lg border">
      <ResizablePanel id="left" defaultSize="25%" minSize="15%" maxSize="45%"><Box label="Izquierda" /></ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel id="center" defaultSize="50%" minSize="30%"><Box label="Centro" /></ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel id="right" defaultSize="25%" minSize="15%" maxSize="45%"><Box label="Derecha" /></ResizablePanel>
    </ResizablePanelGroup>
  ),
};
