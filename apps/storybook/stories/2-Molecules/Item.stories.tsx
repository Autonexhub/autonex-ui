import type { Meta, StoryObj } from '@storybook/react';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@autonexhub/react';
import { Avatar, AvatarFallback } from '@autonexhub/react';
import { Badge } from '@autonexhub/react';
import { Button } from '@autonexhub/react';
import {
  CaretRight,
  ChatCircle,
  DotsThreeVertical,
  InstagramLogo,
  Phone,
  WhatsappLogo,
} from '@phosphor-icons/react';

const meta: Meta<typeof Item> = {
  title: '2-Molecules/Item',
  component: Item,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'muted'],
      description: 'default: sin borde. outline: borde visible (listas en card). muted: fondo suave.',
      table: { defaultValue: { summary: 'default' } },
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'xs'],
      description: 'Densidad de la fila',
      table: { defaultValue: { summary: 'default' } },
    },
    asChild: {
      control: 'boolean',
      description: 'Renderiza el hijo directo (ej. <a> o <button>) con los estilos del Item',
    },
    className: { control: 'text', description: 'Clases adicionales' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Fila de lista genérica: ItemMedia (icono/avatar/imagen) + ItemContent (ItemTitle + ItemDescription) + ItemActions. Usar para listas de contactos, conversaciones, ajustes o resultados en lugar de maquetar divs a mano. ItemGroup agrupa filas (role="list") e ItemSeparator las divide. Con asChild la fila entera es clicable (<a> o <button>) con hover bg-muted y foco de anillo.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Item>;

export const Default: Story = {
  render: (args) => (
    <Item {...args} className="w-96">
      <ItemMedia variant="icon">
        <Phone />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Llamada entrante</ItemTitle>
        <ItemDescription>Consulta sobre horarios de apertura del centro.</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="ghost" size="icon-sm" aria-label="Más opciones">
          <DotsThreeVertical />
        </Button>
      </ItemActions>
    </Item>
  ),
  args: { variant: 'outline', size: 'default' },
};

export const Variantes: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-3">
      {(['default', 'outline', 'muted'] as const).map((variant) => (
        <Item key={variant} variant={variant}>
          <ItemContent>
            <ItemTitle>variant="{variant}"</ItemTitle>
            <ItemDescription>Ejemplo de la variante {variant}.</ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </div>
  ),
};

export const ListaDeContactos: Story = {
  name: 'Lista de contactos',
  render: () => (
    <ItemGroup className="w-[26rem] rounded-lg border border-border bg-card p-2">
      <Item size="sm">
        <ItemMedia>
          <Avatar className="size-8">
            <AvatarFallback>MG</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>María García</ItemTitle>
          <ItemDescription>+34 612 345 678 · Socia desde 2023</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Badge variant="success">Activa</Badge>
        </ItemActions>
      </Item>
      <ItemSeparator />
      <Item size="sm">
        <ItemMedia>
          <Avatar className="size-8">
            <AvatarFallback>JP</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Jordi Puig</ItemTitle>
          <ItemDescription>+34 698 765 432 · Interesado en matrícula</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Badge variant="warning">Pendiente</Badge>
        </ItemActions>
      </Item>
      <ItemSeparator />
      <Item size="sm">
        <ItemMedia>
          <Avatar className="size-8">
            <AvatarFallback>LS</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Laura Sanz</ItemTitle>
          <ItemDescription>+34 655 111 222 · Baja solicitada</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Badge variant="destructive">Baja</Badge>
        </ItemActions>
      </Item>
    </ItemGroup>
  ),
};

export const ListaDeConversaciones: Story = {
  name: 'Lista de conversaciones (clicable)',
  render: () => (
    <ItemGroup className="w-[28rem] gap-1">
      <Item asChild variant="default">
        <a href="#conversacion-1" onClick={(e) => e.preventDefault()}>
          <ItemMedia variant="icon">
            <WhatsappLogo className="size-5 text-muted-foreground" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Reserva de pista de pádel</ItemTitle>
            <ItemDescription>
              La clienta pregunta por disponibilidad el sábado por la mañana y confirma reserva a
              las 10:00.
            </ItemDescription>
          </ItemContent>
          <ItemContent className="items-end">
            <span className="text-xs text-muted-foreground">hace 5 min</span>
            <CaretRight className="size-4 text-muted-foreground" />
          </ItemContent>
        </a>
      </Item>
      <Item asChild variant="default">
        <a href="#conversacion-2" onClick={(e) => e.preventDefault()}>
          <ItemMedia variant="icon">
            <Phone className="size-5 text-muted-foreground" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Horarios de la piscina en agosto</ItemTitle>
            <ItemDescription>
              Llamada atendida por Marta: horario reducido de agosto y normas de acceso con
              invitados.
            </ItemDescription>
          </ItemContent>
          <ItemContent className="items-end">
            <span className="text-xs text-muted-foreground">hace 1 h</span>
            <CaretRight className="size-4 text-muted-foreground" />
          </ItemContent>
        </a>
      </Item>
      <Item asChild variant="default">
        <a href="#conversacion-3" onClick={(e) => e.preventDefault()}>
          <ItemMedia variant="icon">
            <InstagramLogo className="size-5 text-muted-foreground" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Precio del bono de 10 sesiones</ItemTitle>
            <ItemDescription>
              DM de Instagram: tarifas de bonos y condiciones de caducidad; se envía enlace de
              compra.
            </ItemDescription>
          </ItemContent>
          <ItemContent className="items-end">
            <span className="text-xs text-muted-foreground">ayer</span>
            <CaretRight className="size-4 text-muted-foreground" />
          </ItemContent>
        </a>
      </Item>
    </ItemGroup>
  ),
};

export const Tamanos: Story = {
  name: 'Tamaños',
  render: () => (
    <div className="flex w-96 flex-col gap-3">
      {(['default', 'sm', 'xs'] as const).map((size) => (
        <Item key={size} size={size} variant="outline">
          <ItemMedia variant="icon">
            <ChatCircle />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>size="{size}"</ItemTitle>
          </ItemContent>
          <ItemActions>
            <Button variant="ghost" size="icon-xs" aria-label="Opciones">
              <DotsThreeVertical />
            </Button>
          </ItemActions>
        </Item>
      ))}
    </div>
  ),
};
