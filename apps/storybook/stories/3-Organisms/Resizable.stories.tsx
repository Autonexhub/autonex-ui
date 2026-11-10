import type { Meta, StoryObj } from '@storybook/react';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@autonexhub/react';

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

export const WithHandle: Story = {
  name: 'Con asa',
  render: () => (
    <ResizablePanelGroup orientation="horizontal" className="min-h-[200px] max-w-md rounded-lg border">
      <ResizablePanel defaultSize="50%">
        <Box label="Panel uno" />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="50%">
        <Box label="Panel dos" />
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

export const ThreePanels: Story = {
  name: 'Tres paneles',
  render: () => (
    <ResizablePanelGroup orientation="horizontal" className="min-h-[200px] rounded-lg border">
      <ResizablePanel defaultSize="25%" minSize="15%">
        <div className="flex h-full items-center justify-center bg-muted/50 p-6">
          <span className="text-sm font-semibold">Barra lateral</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="50%">
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Contenido principal</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="25%" minSize="15%">
        <div className="flex h-full items-center justify-center bg-muted/50 p-6">
          <span className="text-sm font-semibold">Panel</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

export const Nested: Story = {
  name: 'Anidados',
  render: () => (
    <ResizablePanelGroup orientation="horizontal" className="min-h-[300px] rounded-lg border">
      <ResizablePanel defaultSize="25%">
        <div className="flex h-full items-center justify-center bg-muted/50 p-6">
          <span className="text-sm font-semibold">Barra lateral</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize="75%">
        <ResizablePanelGroup orientation="vertical">
          <ResizablePanel defaultSize="70%">
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Área principal</span>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize="30%">
            <div className="flex h-full items-center justify-center bg-muted/30 p-6">
              <span className="text-sm font-semibold">Panel inferior</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

export const EmailLayout: Story = {
  name: 'Diseño de correo',
  render: () => (
    <ResizablePanelGroup orientation="horizontal" className="min-h-[400px] rounded-lg border">
      <ResizablePanel defaultSize="20%" minSize="15%">
        <div className="flex h-full flex-col bg-muted/30 p-4">
          <h3 className="mb-4 font-semibold">Carpetas</h3>
          <ItemGroup className="gap-1">
            {['Bandeja de entrada', 'Enviados', 'Borradores', 'Spam'].map((folder) => (
              <Item key={folder} size="xs" asChild>
                <button type="button">
                  <ItemContent>
                    <ItemTitle>{folder}</ItemTitle>
                  </ItemContent>
                </button>
              </Item>
            ))}
          </ItemGroup>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="30%" minSize="20%">
        <div className="flex h-full flex-col p-4">
          <h3 className="mb-4 font-semibold">Mensajes</h3>
          <ItemGroup className="gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Item key={i} variant="outline" size="sm" asChild>
                <button type="button">
                  <ItemContent>
                    <ItemTitle>Mensaje {i}</ItemTitle>
                    <ItemDescription>Vista previa del contenido...</ItemDescription>
                  </ItemContent>
                </button>
              </Item>
            ))}
          </ItemGroup>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="50%">
        <div className="flex h-full flex-col p-4">
          <h3 className="mb-4 font-semibold">Detalle</h3>
          <p className="text-sm text-muted-foreground">
            Selecciona un mensaje para ver su contenido completo.
          </p>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};
