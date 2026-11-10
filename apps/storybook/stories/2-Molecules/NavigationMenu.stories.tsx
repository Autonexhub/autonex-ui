import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@autonexhub/react';
import { cn } from '@autonexhub/react';

const meta: Meta<typeof NavigationMenu> = {
  title: '2-Molecules/NavigationMenu',
  component: NavigationMenu,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Menú de navegación con paneles desplegables. Para la navegación de un sitio.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof NavigationMenu>;

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'> & { title: string }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn('select-none space-y-1 leading-none no-underline', className)}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';

export const Default: Story = {
  name: 'Por defecto',
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Productos</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-lg bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="#"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Autonex
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Plataforma de IA conversacional para automatización.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="#" title="Agentes de voz">
                Automatiza llamadas telefónicas con IA.
              </ListItem>
              <ListItem href="#" title="Agentes de texto">
                WhatsApp, Instagram y chat web automatizado.
              </ListItem>
              <ListItem href="#" title="Base de conocimientos">
                La información que consultan tus agentes.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Recursos</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
              <ListItem href="#" title="Documentación">
                Aprende a integrar y configurar Autonex.
              </ListItem>
              <ListItem href="#" title="Referencia de la API">
                Referencia completa de nuestra API.
              </ListItem>
              <ListItem href="#" title="Casos de uso">
                Ejemplos de implementaciones exitosas.
              </ListItem>
              <ListItem href="#" title="Blog">
                Últimas novedades y tutoriales.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">
            Precios
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

export const Simple: Story = {
  name: 'Simple',
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">
            Inicio
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">
            Conversaciones
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">
            Contactos
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">
            Configuración
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

export const WithSingleDropdown: Story = {
  name: 'Con un desplegable',
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">
            Panel
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Herramientas</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-3 p-4">
              <ListItem href="#" title="Comportamiento">
                Define cómo responden tus agentes.
              </ListItem>
              <ListItem href="#" title="Simulador">
                Prueba tus agentes en tiempo real.
              </ListItem>
              <ListItem href="#" title="Métricas">
                Métricas y análisis de rendimiento.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">
            Soporte
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};
