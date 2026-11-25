import {
  FacebookLogo,
  Globe,
  InstagramLogo,
  PencilSimple,
  Phone,
  WhatsappLogo,
  type Icon,
} from "@phosphor-icons/react";
import { cn } from "../../lib/utils";

export type ChannelType = 'voice' | 'web' | 'whatsapp' | 'instagram' | 'facebook' | 'manual';

interface ChannelBadgeProps {
  channel: ChannelType;
  size?: 'sm' | 'md';
  /** With label: colored dot + name. Without label: the channel's monochrome icon (a dot alone means nothing to users). */
  showLabel?: boolean;
  className?: string;
}

// DS style: gray background with colored dot + label.
// Colors use Tailwind chart-* classes from tailwind.config.ts.
// Icon-only uses the channel glyph (Phosphor, monochrome) — never colored logos.
const CHANNEL_CONFIG: Record<ChannelType, { label: string; dotColor: string; icon: Icon }> = {
  voice: {
    label: 'Teléfono',
    dotColor: 'bg-chart-1', // Blue
    icon: Phone,
  },
  web: {
    label: 'Web',
    dotColor: 'bg-chart-5', // Coral
    icon: Globe,
  },
  whatsapp: {
    label: 'WhatsApp',
    dotColor: 'bg-success', // Green
    icon: WhatsappLogo,
  },
  instagram: {
    label: 'Instagram',
    dotColor: 'bg-chart-3', // Lilac
    icon: InstagramLogo,
  },
  facebook: {
    label: 'Facebook',
    dotColor: 'bg-chart-4', // Light blue
    icon: FacebookLogo,
  },
  manual: {
    label: 'Manual',
    dotColor: 'bg-muted-foreground', // Neutral gray
    icon: PencilSimple,
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
  const iconSize = size === 'sm' ? 12 : 14;
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  const padding = size === 'sm' ? 'px-2 py-0.5' : 'px-2.5 py-1';
  const ChannelIcon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        'bg-muted text-muted-foreground',
        padding,
        textSize,
        className
      )}
      {...(!showLabel && { role: 'img', 'aria-label': config.label, title: config.label })}
    >
      {showLabel ? (
        <>
          <span className={cn('rounded-full shrink-0', dotSize, config.dotColor)} />
          <span>{config.label}</span>
        </>
      ) : (
        <ChannelIcon size={iconSize} weight="regular" className="shrink-0" aria-hidden />
      )}
    </span>
  );
};
