import { cn } from "../../lib/utils";

export type ChannelType = 'voice' | 'web' | 'whatsapp' | 'instagram' | 'manual';

interface ChannelBadgeProps {
  channel: ChannelType;
  size?: 'sm' | 'md';
  showLabel?: boolean;
  className?: string;
}

// DS style: gray background with colored dot
// Colors use Tailwind chart-* classes from tailwind.config.ts
const CHANNEL_CONFIG: Record<ChannelType, { label: string; dotColor: string }> = {
  voice: {
    label: 'Teléfono',
    dotColor: 'bg-chart-1', // Blue
  },
  web: {
    label: 'Web',
    dotColor: 'bg-chart-5', // Coral
  },
  whatsapp: {
    label: 'WhatsApp',
    dotColor: 'bg-success', // Green
  },
  instagram: {
    label: 'Instagram',
    dotColor: 'bg-chart-3', // Lilac
  },
  manual: {
    label: 'Manual',
    dotColor: 'bg-muted-foreground', // Neutral gray
  },
};

export const ChannelBadge = ({
  channel,
  size = 'sm',
  showLabel = true,
  className,
}: ChannelBadgeProps) => {
  const config = CHANNEL_CONFIG[channel];
  if (!config) return null;

  const dotSize = size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  const padding = size === 'sm' ? 'px-2 py-0.5' : 'px-2.5 py-1';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        'bg-muted text-muted-foreground',
        padding,
        textSize,
        className
      )}
    >
      <span className={cn('rounded-full shrink-0', dotSize, config.dotColor)} />
      {showLabel && <span>{config.label}</span>}
    </span>
  );
};
