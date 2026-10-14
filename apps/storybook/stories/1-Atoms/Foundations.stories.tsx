import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from '@autonexhub/react';

// Section wrapper
function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-medium tracking-tight">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

// Color swatch
function Swatch({
  name,
  varName,
  className,
  border,
}: {
  name: string;
  varName: string;
  className: string;
  border?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <div
        className={`h-16 w-full rounded-lg ${className} ${
          border ? 'border border-border' : ''
        }`}
      />
      <div>
        <p className="text-sm font-medium">{name}</p>
        <p className="font-mono text-xs text-muted-foreground">{varName}</p>
      </div>
    </div>
  );
}

const semantic = [
  { name: 'Background', varName: '--background', className: 'bg-background', border: true },
  { name: 'Foreground', varName: '--foreground', className: 'bg-foreground' },
  { name: 'Card', varName: '--card', className: 'bg-card', border: true },
  { name: 'Primary', varName: '--primary', className: 'bg-primary' },
  { name: 'Secondary', varName: '--secondary', className: 'bg-secondary', border: true },
  { name: 'Muted', varName: '--muted', className: 'bg-muted', border: true },
  { name: 'Accent', varName: '--accent', className: 'bg-accent', border: true },
  { name: 'Border', varName: '--border', className: 'bg-border' },
  { name: 'Destructive', varName: '--destructive', className: 'bg-destructive' },
  { name: 'Success', varName: '--success', className: 'bg-success' },
  { name: 'Ring', varName: '--ring', className: 'bg-ring' },
];

const charts = [
  { name: 'Blue', varName: '--chart-1', className: 'bg-chart-1' },
  { name: 'Mint', varName: '--chart-2', className: 'bg-chart-2' },
  { name: 'Lilac', varName: '--chart-3', className: 'bg-chart-3' },
  { name: 'Sky', varName: '--chart-4', className: 'bg-chart-4' },
  { name: 'Coral', varName: '--chart-5', className: 'bg-chart-5' },
  { name: 'Periwinkle', varName: '--chart-6', className: 'bg-chart-6' },
];

const radii = [
  { name: 'sm', className: 'rounded-sm' },
  { name: 'md', className: 'rounded-md' },
  { name: 'lg', className: 'rounded-lg' },
  { name: 'xl', className: 'rounded-xl' },
  { name: '2xl', className: 'rounded-2xl' },
  { name: '3xl', className: 'rounded-3xl' },
];

const meta: Meta = {
  title: '1-Atoms/Foundations',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Design system foundations: colors, typography, and radii.

## Colors
All colors are CSS custom properties that automatically adapt to light/dark mode.

### Semantic Colors
Base colors for UI elements: backgrounds, text, borders, and states.

### Chart Colors
6-color palette for data visualization: blue, mint, lilac, sky, coral, periwinkle.

## Typography
Inter Variable font with consistent scale:
- Display: 36px medium
- Heading: 24px medium
- Subtitle: 18px medium
- Body: 14px regular
- Muted: 14px muted-foreground

## Radii
Consistent border-radius scale from sm to 3xl.
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const SemanticColors: Story = {
  render: () => (
    <Section
      title="Colores semánticos"
      description="Base neutra estilo Linear/Vercel. Primary negro para botones principales."
    >
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {semantic.map((s) => (
          <Swatch key={s.varName} {...s} />
        ))}
      </div>
    </Section>
  ),
};

export const ChartColors: Story = {
  render: () => (
    <Section
      title="Colores de gráficas"
      description="Paleta de 6 colores reutilizables en cualquier visualización de datos."
    >
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
        {charts.map((s) => (
          <Swatch key={s.varName} {...s} />
        ))}
      </div>
    </Section>
  ),
};

export const Typography: Story = {
  render: () => (
    <Section title="Tipografía" description="Inter Variable para toda la interfaz.">
      <div className="space-y-3">
        <p className="text-4xl font-medium tracking-tight">
          Display · 36px medium
        </p>
        <p className="text-2xl font-medium tracking-tight">
          Heading · 24px medium
        </p>
        <p className="text-lg font-medium">Subtitle · 18px medium</p>
        <p className="text-sm">
          Body · 14px regular — el tamaño base de la interfaz para la mayoría de
          texto en tablas, tarjetas y formularios.
        </p>
        <p className="text-sm text-muted-foreground">
          Muted · 14px — texto secundario y descripciones.
        </p>
        <p className="font-mono text-sm">Mono · métricas, IDs, timestamps</p>
      </div>
    </Section>
  ),
};

export const BorderRadii: Story = {
  render: () => (
    <Section title="Radios de borde" description="Escala consistente de border-radius.">
      <div className="flex flex-wrap gap-6">
        {radii.map((r) => (
          <div key={r.name} className="space-y-2 text-center">
            <div
              className={`size-20 border border-border bg-muted ${r.className}`}
            />
            <p className="font-mono text-xs text-muted-foreground">{r.name}</p>
          </div>
        ))}
      </div>
    </Section>
  ),
};

export const AllFoundations: Story = {
  render: () => (
    <div className="space-y-10">
      <Section
        title="Colores semánticos"
        description="Base neutra estilo Linear/Vercel. Primary negro para botones principales."
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {semantic.map((s) => (
            <Swatch key={s.varName} {...s} />
          ))}
        </div>
      </Section>

      <Separator />

      <Section
        title="Colores de gráficas"
        description="Paleta de 6 colores reutilizables en cualquier visualización de datos."
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {charts.map((s) => (
            <Swatch key={s.varName} {...s} />
          ))}
        </div>
      </Section>

      <Separator />

      <Section title="Tipografía" description="Inter Variable para toda la interfaz.">
        <div className="space-y-3">
          <p className="text-4xl font-medium tracking-tight">
            Display · 36px medium
          </p>
          <p className="text-2xl font-medium tracking-tight">
            Heading · 24px medium
          </p>
          <p className="text-lg font-medium">Subtitle · 18px medium</p>
          <p className="text-sm">
            Body · 14px regular — el tamaño base de la interfaz.
          </p>
          <p className="text-sm text-muted-foreground">
            Muted · 14px — texto secundario.
          </p>
          <p className="font-mono text-sm">Mono · métricas, IDs</p>
        </div>
      </Section>

      <Separator />

      <Section title="Radios de borde" description="Escala de border-radius.">
        <div className="flex flex-wrap gap-6">
          {radii.map((r) => (
            <div key={r.name} className="space-y-2 text-center">
              <div
                className={`size-20 border border-border bg-muted ${r.className}`}
              />
              <p className="font-mono text-xs text-muted-foreground">{r.name}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All design foundations in one view.',
      },
    },
  },
};
