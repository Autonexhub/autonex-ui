// Tremor chartColors [v0.0.0] — mapeado al sistema de diseño (Bruno 03/09).
//
// Las claves siguen siendo las de Tremor (blue, emerald, violet…) para no romper a
// quien las usa, pero el color YA NO sale de la paleta cruda de Tailwind: sale de los
// tokens de gráfica del sistema (--chart-1 … --chart-6, definidos en src/index.css y
// documentados en stories/0-Foundations/Colors.mdx). Así el mismo dato se pinta con el
// mismo azul en la barra, en el tooltip y en el resto del panel.
//
// Tokens: chart-1 Blue · chart-2 Mint · chart-3 Lilac · chart-4 Sky · chart-5 Coral ·
// chart-6 Periwinkle. Los neutros (gray/lightGray/darkGray) no son datos: van a los
// tokens neutros del sistema (muted-foreground / foreground).
//
// Equivalencias sin token propio entre los 6 (se eligió el más cercano):
//   red, yellow → chart-5 (coral, el más cálido) · lime → chart-2 (mint) ·
//   purple, fuchsia, pink → chart-3 (lilac) · indigo → chart-6 (periwinkle).

export type ColorUtility = 'bg' | 'stroke' | 'fill' | 'text';

// Las clases se escriben LITERALES a propósito: el JIT de Tailwind escanea el texto
// del fichero, así que una plantilla `bg-${token}` no generaría ningún CSS.
export const chartColors = {
  blue: {
    bg: 'bg-chart-1',
    stroke: 'stroke-chart-1',
    fill: 'fill-chart-1',
    text: 'text-chart-1',
  },
  emerald: {
    bg: 'bg-chart-2',
    stroke: 'stroke-chart-2',
    fill: 'fill-chart-2',
    text: 'text-chart-2',
  },
  violet: {
    bg: 'bg-chart-6',
    stroke: 'stroke-chart-6',
    fill: 'fill-chart-6',
    text: 'text-chart-6',
  },
  amber: {
    bg: 'bg-chart-5',
    stroke: 'stroke-chart-5',
    fill: 'fill-chart-5',
    text: 'text-chart-5',
  },
  gray: {
    bg: 'bg-muted-foreground',
    stroke: 'stroke-muted-foreground',
    fill: 'fill-muted-foreground',
    text: 'text-muted-foreground',
  },
  cyan: {
    bg: 'bg-chart-4',
    stroke: 'stroke-chart-4',
    fill: 'fill-chart-4',
    text: 'text-chart-4',
  },
  red: {
    bg: 'bg-chart-5',
    stroke: 'stroke-chart-5',
    fill: 'fill-chart-5',
    text: 'text-chart-5',
  },
  indigo: {
    bg: 'bg-chart-6',
    stroke: 'stroke-chart-6',
    fill: 'fill-chart-6',
    text: 'text-chart-6',
  },
  yellow: {
    bg: 'bg-chart-5',
    stroke: 'stroke-chart-5',
    fill: 'fill-chart-5',
    text: 'text-chart-5',
  },
  pink: {
    bg: 'bg-chart-3',
    stroke: 'stroke-chart-3',
    fill: 'fill-chart-3',
    text: 'text-chart-3',
  },
  purple: {
    bg: 'bg-chart-3',
    stroke: 'stroke-chart-3',
    fill: 'fill-chart-3',
    text: 'text-chart-3',
  },
  lightGray: {
    bg: 'bg-muted-foreground/30',
    stroke: 'stroke-muted-foreground/30',
    fill: 'fill-muted-foreground/30',
    text: 'text-muted-foreground/30',
  },
  darkGray: {
    bg: 'bg-foreground',
    stroke: 'stroke-foreground',
    fill: 'fill-foreground',
    text: 'text-foreground',
  },
  lime: {
    bg: 'bg-chart-2',
    stroke: 'stroke-chart-2',
    fill: 'fill-chart-2',
    text: 'text-chart-2',
  },
  fuchsia: {
    bg: 'bg-chart-3',
    stroke: 'stroke-chart-3',
    fill: 'fill-chart-3',
    text: 'text-chart-3',
  },
  lightEmerald: {
    bg: 'bg-chart-2/50',
    stroke: 'stroke-chart-2/50',
    fill: 'fill-chart-2/50',
    text: 'text-chart-2/50',
  },
} as const satisfies {
  [color: string]: {
    [key in ColorUtility]: string;
  };
};

export type AvailableChartColorsKeys = keyof typeof chartColors;

export const AvailableChartColors: AvailableChartColorsKeys[] = Object.keys(
  chartColors,
) as Array<AvailableChartColorsKeys>;

export const constructCategoryColors = (
  categories: string[],
  colors: AvailableChartColorsKeys[],
): Map<string, AvailableChartColorsKeys> => {
  const categoryColors = new Map<string, AvailableChartColorsKeys>();
  categories.forEach((category, index) => {
    categoryColors.set(category, colors[index % colors.length]);
  });
  return categoryColors;
};

export const getColorClassName = (
  color: AvailableChartColorsKeys,
  type: ColorUtility,
): string => {
  const fallbackColor = {
    bg: 'bg-muted-foreground',
    stroke: 'stroke-muted-foreground',
    fill: 'fill-muted-foreground',
    text: 'text-muted-foreground',
  };
  return chartColors[color]?.[type] ?? fallbackColor[type];
};

// Tremor getYAxisDomain [v0.0.0]

export const getYAxisDomain = (
  autoMinValue: boolean,
  minValue: number | undefined,
  maxValue: number | undefined,
) => {
  const minDomain = autoMinValue ? 'auto' : (minValue ?? 0);
  const maxDomain = maxValue ?? 'auto';
  return [minDomain, maxDomain];
};

// Tremor hasOnlyOneValueForKey [v0.1.0]

export function hasOnlyOneValueForKey(
  array: any[],
  keyToCheck: string,
): boolean {
  const val: any[] = [];

  for (const obj of array) {
    if (Object.prototype.hasOwnProperty.call(obj, keyToCheck)) {
      val.push(obj[keyToCheck]);
      if (val.length > 1) {
        return false;
      }
    }
  }

  return true;
}
