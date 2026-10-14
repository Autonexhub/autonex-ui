import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarLabel,
} from '@autonexhub/react';

const meta: Meta<typeof Menubar> = {
  title: '2-Molecules/Menubar',
  component: Menubar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Desktop-style menubar. Use for application-level menus.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Menubar>;

export const Default: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Archivo</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Nueva pestaña <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Nueva ventana <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Compartir</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Imprimir <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Editar</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Deshacer <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Rehacer <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Cortar <MenubarShortcut>⌘X</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Copiar <MenubarShortcut>⌘C</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Pegar <MenubarShortcut>⌘V</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Ver</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Recargar</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Pantalla completa <MenubarShortcut>F11</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>Ocultar barra lateral</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

function MenubarWithCheckboxesExample() {
  const [showToolbar, setShowToolbar] = React.useState(true);
  const [showSidebar, setShowSidebar] = React.useState(true);
  const [showStatusBar, setShowStatusBar] = React.useState(false);

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Ver</MenubarTrigger>
        <MenubarContent>
          <MenubarLabel>Paneles</MenubarLabel>
          <MenubarSeparator />
          <MenubarCheckboxItem checked={showToolbar} onCheckedChange={setShowToolbar}>
            Barra de herramientas
          </MenubarCheckboxItem>
          <MenubarCheckboxItem checked={showSidebar} onCheckedChange={setShowSidebar}>
            Barra lateral
          </MenubarCheckboxItem>
          <MenubarCheckboxItem checked={showStatusBar} onCheckedChange={setShowStatusBar}>
            Barra de estado
          </MenubarCheckboxItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

export const WithCheckboxes: Story = {
  render: () => <MenubarWithCheckboxesExample />,
};

function MenubarWithRadioGroupExample() {
  const [theme, setTheme] = React.useState('system');

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Preferencias</MenubarTrigger>
        <MenubarContent>
          <MenubarLabel>Tema</MenubarLabel>
          <MenubarSeparator />
          <MenubarRadioGroup value={theme} onValueChange={setTheme}>
            <MenubarRadioItem value="light">Claro</MenubarRadioItem>
            <MenubarRadioItem value="dark">Oscuro</MenubarRadioItem>
            <MenubarRadioItem value="system">Sistema</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

export const WithRadioGroup: Story = {
  render: () => <MenubarWithRadioGroupExample />,
};

export const WithSubmenu: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Archivo</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Nuevo</MenubarItem>
          <MenubarItem>Abrir</MenubarItem>
          <MenubarSub>
            <MenubarSubTrigger>Abrir reciente</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Documento 1.pdf</MenubarItem>
              <MenubarItem>Documento 2.pdf</MenubarItem>
              <MenubarItem>Documento 3.pdf</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Limpiar recientes</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>Guardar</MenubarItem>
          <MenubarItem>Guardar como...</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};
