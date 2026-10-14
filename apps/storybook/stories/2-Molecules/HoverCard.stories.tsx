import type { Meta, StoryObj } from '@storybook/react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@autonexhub/react';
import { Avatar, AvatarFallback, AvatarImage } from '@autonexhub/react';
import { Button } from '@autonexhub/react';
import { CalendarDots } from '@phosphor-icons/react';

const meta: Meta<typeof HoverCard> = {
  title: '2-Molecules/HoverCard',
  component: HoverCard,
  tags: ['autodocs'],
  argTypes: {
    openDelay: {
      control: 'number',
      description: 'Delay before showing (ms)',
      table: { defaultValue: { summary: '700' } },
    },
    closeDelay: {
      control: 'number',
      description: 'Delay before hiding (ms)',
      table: { defaultValue: { summary: '300' } },
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Card that appears on hover. Use for previews and additional info.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof HoverCard>;

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@autonex</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AU</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@autonex</h4>
            <p className="text-sm text-muted-foreground">
              Plataforma de IA conversacional para automatización de llamadas y mensajería.
            </p>
            <div className="flex items-center pt-2">
              <CalendarDots className="mr-2 h-4 w-4 opacity-70" />
              <span className="text-xs text-muted-foreground">
                Desde enero 2024
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const ContactPreview: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span className="cursor-pointer text-sm underline">María García</span>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex space-x-4">
          <Avatar>
            <AvatarFallback>MG</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">María García</h4>
            <p className="text-sm text-muted-foreground">+34 612 345 678</p>
            <p className="text-sm text-muted-foreground">maria@ejemplo.com</p>
            <div className="flex items-center pt-2">
              <span className="text-xs text-muted-foreground">
                Última conversación: hace 2 días
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const WithLink: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <span className="text-sm text-muted-foreground">Creado por</span>
      <HoverCard>
        <HoverCardTrigger asChild>
          <a href="#" className="text-sm font-medium hover:underline">
            Juan Pérez
          </a>
        </HoverCardTrigger>
        <HoverCardContent className="w-64" align="start">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Juan Pérez</h4>
            <p className="text-xs text-muted-foreground">
              Administrador del sistema
            </p>
            <p className="text-xs text-muted-foreground">
              juan@autonex.es
            </p>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
};
