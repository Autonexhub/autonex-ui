import type { Meta, StoryObj } from '@storybook/react';
import { PersonAvatar } from '@autonexhub/react';

/**
 * PersonAvatar — avatar pequeño de una persona (responsable, creador): su foto (`avatarUrl` o `avatar_url`) y, si
 * no la tiene o no carga, sus iniciales. Sin persona, el hueco "sin asignar". Tamaños `xs` (20px) y `sm` (24px).
 */
const meta: Meta<typeof PersonAvatar> = {
  title: '2-Molecules/PersonAvatar',
  component: PersonAvatar,
  tags: ['autodocs'],
  argTypes: { size: { control: 'select', options: ['xs', 'sm'] } },
  args: { person: { name: 'Ana López' }, size: 'sm' },
};
export default meta;
type Story = StoryObj<typeof PersonAvatar>;

const photo = 'https://i.pravatar.cc/96?img=47';

export const Initials: Story = {};
export const WithPhoto: Story = { args: { person: { name: 'Marta Ruiz', avatar_url: photo } } };
export const Unassigned: Story = { args: { person: null } };
/** La foto no carga: vuelve a las iniciales. */
export const BrokenPhoto: Story = { args: { person: { name: 'Luis Gil', avatarUrl: 'https://invalid.example/none.png' } } };

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {(['xs', 'sm'] as const).map((size) => (
        <div key={size} className="flex items-center gap-2">
          <PersonAvatar person={{ name: 'Ana López' }} size={size} />
          <PersonAvatar person={{ name: 'Marta Ruiz', avatarUrl: photo }} size={size} />
          <PersonAvatar person={null} size={size} />
          <span className="text-xs text-muted-foreground">{size}</span>
        </div>
      ))}
    </div>
  ),
};

/** En línea con el nombre, como en "Creada por". */
export const WithName: Story = {
  render: () => (
    <span className="inline-flex items-center gap-1.5 text-sm">
      <PersonAvatar person={{ name: 'Ana López' }} size="xs" />
      Ana López
    </span>
  ),
};
