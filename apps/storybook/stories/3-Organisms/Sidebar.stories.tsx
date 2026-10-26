import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  SidebarSeparator,
} from '@autonexhub/react';
import { Avatar, AvatarFallback } from '@autonexhub/react';
import { Button } from '@autonexhub/react';
import {
  House,
  ChatCircle,
  Users,
  Gear,
  SignOut,
  ChartLine,
  Book,
  CaretDown,
  Phone,
  Envelope,
  Calendar,
} from '@phosphor-icons/react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@autonexhub/react';

const meta: Meta = {
  title: '3-Organisms/Sidebar',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Collapsible sidebar navigation component.

## Structure
- **SidebarProvider**: Context wrapper with state management
- **Sidebar**: Main container (supports left/right sides, variants)
- **SidebarHeader**: Top section (logo, org selector)
- **SidebarContent**: Scrollable menu area
- **SidebarFooter**: Bottom section (user menu, settings)

## Variants
- \`variant="sidebar"\`: Default, fixed sidebar
- \`variant="floating"\`: Rounded with shadow
- \`variant="inset"\`: Inset with background

## Collapsible Modes
- \`collapsible="offcanvas"\`: Slides off screen (default)
- \`collapsible="icon"\`: Collapses to icons only
- \`collapsible="none"\`: Always expanded

## Patterns
\`\`\`tsx
<SidebarProvider>
  <Sidebar>
    <SidebarHeader>...</SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Menu</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>Item</SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>...</SidebarFooter>
  </Sidebar>
  <SidebarInset>Main content</SidebarInset>
</SidebarProvider>
\`\`\`
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// Example menu items
const mainMenu = [
  { icon: House, label: 'Inicio', href: '/' },
  { icon: ChatCircle, label: 'Conversaciones', href: '/conversations' },
  { icon: Users, label: 'Contactos', href: '/contacts' },
  { icon: ChartLine, label: 'Métricas', href: '/metrics' },
  { icon: Book, label: 'Knowledge Base', href: '/kb' },
];

const settingsMenu = [
  { icon: Gear, label: 'Configuración', href: '/settings' },
];

function BasicSidebarExample() {
  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-brand flex items-center justify-center">
              <span className="text-brand-foreground font-bold text-sm">M</span>
            </div>
            <span className="font-semibold">Marta</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menú principal</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainMenu.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton isActive={item.href === '/conversations'}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarSeparator />
          <SidebarGroup>
            <SidebarGroupLabel>Sistema</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {settingsMenu.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-muted text-xs">MR</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Marcos Riganti</p>
              <p className="text-xs text-muted-foreground truncate">admin</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <SignOut className="h-4 w-4" />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex-1">
        <header className="flex items-center gap-2 p-4 border-b">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold">Conversaciones</h1>
        </header>
        <main className="p-6">
          <p className="text-muted-foreground">Contenido principal aquí</p>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export const Default: Story = {
  render: () => <BasicSidebarExample />,
};

function CollapsibleMenuExample() {
  const [openSubmenu, setOpenSubmenu] = useState(true);

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-brand flex items-center justify-center">
              <span className="text-brand-foreground font-bold text-sm">M</span>
            </div>
            <span className="font-semibold">Marta</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Operaciones</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive>
                    <House className="h-4 w-4" />
                    <span>Inicio</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <Collapsible open={openSubmenu} onOpenChange={setOpenSubmenu}>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        <ChatCircle className="h-4 w-4" />
                        <span>Comunicación</span>
                        <CaretDown className={`ml-auto h-4 w-4 transition-transform ${openSubmenu ? '' : '-rotate-90'}`} />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                  </SidebarMenuItem>
                  <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton>
                          <Phone className="h-4 w-4" />
                          <span>Llamadas</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton>
                          <Envelope className="h-4 w-4" />
                          <span>Mensajes</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton>
                          <Calendar className="h-4 w-4" />
                          <span>Citas</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Users className="h-4 w-4" />
                    <span>Contactos</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="flex-1">
        <header className="flex items-center gap-2 p-4 border-b">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </header>
        <main className="p-6">
          <p className="text-muted-foreground">Sidebar con submenú colapsable</p>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export const WithCollapsibleSubmenu: Story = {
  render: () => <CollapsibleMenuExample />,
  parameters: {
    docs: {
      description: {
        story: 'Sidebar with collapsible submenu using Collapsible component.',
      },
    },
  },
};

function IconOnlyExample() {
  return (
    <SidebarProvider defaultOpen={false}>
      <Sidebar collapsible="icon">
        <SidebarHeader className="p-2">
          <div className="h-8 w-8 rounded-lg bg-brand flex items-center justify-center mx-auto">
            <span className="text-brand-foreground font-bold text-sm">M</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainMenu.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={item.href === '/conversations'}
                      tooltip={item.label}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-2">
          <Avatar className="h-8 w-8 mx-auto">
            <AvatarFallback className="bg-muted text-xs">MR</AvatarFallback>
          </Avatar>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex-1">
        <header className="flex items-center gap-2 p-4 border-b">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold">Conversaciones</h1>
        </header>
        <main className="p-6">
          <p className="text-muted-foreground">Sidebar colapsado a iconos. Hover para ver tooltips.</p>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export const IconOnly: Story = {
  render: () => <IconOnlyExample />,
  parameters: {
    docs: {
      description: {
        story: 'Sidebar collapsed to icon-only mode with tooltips on hover.',
      },
    },
  },
};

function FloatingExample() {
  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar variant="floating">
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-brand flex items-center justify-center">
              <span className="text-brand-foreground font-bold text-sm">M</span>
            </div>
            <span className="font-semibold">Marta</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainMenu.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton isActive={item.href === '/'}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="flex-1">
        <header className="flex items-center gap-2 p-4 border-b">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold">Inicio</h1>
        </header>
        <main className="p-6">
          <p className="text-muted-foreground">Sidebar flotante con bordes redondeados y sombra.</p>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export const Floating: Story = {
  render: () => <FloatingExample />,
  parameters: {
    docs: {
      description: {
        story: 'Floating sidebar variant with rounded corners and shadow.',
      },
    },
  },
};
