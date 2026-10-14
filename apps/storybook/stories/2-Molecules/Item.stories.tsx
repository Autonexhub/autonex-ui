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
  Avatar,
  AvatarFallback,
  Badge,
  Button,
} from '@autonexhub/react';
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
      description: 'default: no border. outline: visible border (lists in card). muted: soft background.',
      table: { defaultValue: { summary: 'default' } },
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'xs'],
      description: 'Row density',
      table: { defaultValue: { summary: 'default' } },
    },
    asChild: {
      control: 'boolean',
      description: 'Render direct child (e.g. <a> or <button>) with Item styles',
    },
    className: { control: 'text', description: 'Additional classes' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Generic list row: ItemMedia (icon/avatar/image) + ItemContent (ItemTitle + ItemDescription) + ItemActions. Use for contact lists, conversations, settings, or search results instead of hand-rolling divs. ItemGroup groups rows (role="list") and ItemSeparator divides them. With asChild the whole row is clickable (<a> or <button>) with hover bg-muted and ring focus.',
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
        <ItemTitle>Incoming call</ItemTitle>
        <ItemDescription>Query about opening hours.</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="ghost" size="icon-sm" aria-label="More options">
          <DotsThreeVertical />
        </Button>
      </ItemActions>
    </Item>
  ),
  args: { variant: 'outline', size: 'default' },
};

export const Variants: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-3">
      {(['default', 'outline', 'muted'] as const).map((variant) => (
        <Item key={variant} variant={variant}>
          <ItemContent>
            <ItemTitle>variant="{variant}"</ItemTitle>
            <ItemDescription>Example of the {variant} variant.</ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </div>
  ),
};

export const ContactList: Story = {
  name: 'Contact list',
  render: () => (
    <ItemGroup className="w-[26rem] rounded-lg border border-border bg-card p-2">
      <Item size="sm">
        <ItemMedia>
          <Avatar className="size-8">
            <AvatarFallback>MG</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Maria Garcia</ItemTitle>
          <ItemDescription>+34 612 345 678 · Member since 2023</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Badge variant="success">Active</Badge>
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
          <ItemTitle>John Peters</ItemTitle>
          <ItemDescription>+34 698 765 432 · Interested in membership</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Badge variant="warning">Pending</Badge>
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
          <ItemTitle>Laura Smith</ItemTitle>
          <ItemDescription>+34 655 111 222 · Cancellation requested</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Badge variant="destructive">Cancelled</Badge>
        </ItemActions>
      </Item>
    </ItemGroup>
  ),
};

export const Sizes: Story = {
  name: 'Sizes',
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
            <Button variant="ghost" size="icon-xs" aria-label="Options">
              <DotsThreeVertical />
            </Button>
          </ItemActions>
        </Item>
      ))}
    </div>
  ),
};
