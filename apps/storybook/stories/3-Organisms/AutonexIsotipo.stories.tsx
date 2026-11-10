import type { Meta, StoryObj } from '@storybook/react';
import { AutonexIsotipo } from '@autonexhub/react';

/**
 * Isotipo de Autonex en trazo plano (`currentColor`): las dos formas del logotipo sin su degradado.
 * Es el hueco por defecto de `RealmRail` cuando no hay selector de organización.
 */
const meta: Meta<typeof AutonexIsotipo> = {
  title: '3-Organisms/AutonexIsotipo',
  component: AutonexIsotipo,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'SVG sin tamaño propio: se dimensiona con clases (`size-8`, `h-6 w-auto`) y hereda el color del texto (`currentColor`). ' +
          'Lleva `role="img"` y `aria-label="Autonex"`. Acepta cualquier prop de `<svg>`. La app puede sustituirlo por el logo oficial mediante el slot `logo` del rail.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof AutonexIsotipo>;

export const Default: Story = {
  name: 'Por defecto',
  render: () => <AutonexIsotipo className="size-16 text-foreground" />,
};

export const Tamanos: Story = {
  name: 'Tamaños',
  render: () => (
    <div className="flex items-end gap-6 text-foreground">
      {['size-4', 'size-6', 'size-8', 'size-12', 'size-16'].map((c) => (
        <div key={c} className="flex flex-col items-center gap-2">
          <AutonexIsotipo className={c} />
          <code className="text-xs text-muted-foreground">{c}</code>
        </div>
      ))}
    </div>
  ),
};

export const Colores: Story = {
  name: 'Hereda el color',
  render: () => (
    <div className="flex items-center gap-4">
      <AutonexIsotipo className="size-10 text-foreground" />
      <AutonexIsotipo className="size-10 text-muted-foreground" />
      <AutonexIsotipo className="size-10 text-brand" />
      <div className="flex size-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <AutonexIsotipo className="size-8" />
      </div>
    </div>
  ),
};
