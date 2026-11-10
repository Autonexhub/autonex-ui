import { WhatsappLogo } from "@phosphor-icons/react"

export interface WhatsAppIconProps {
  className?: string
  size?: number
}

export const WhatsAppIcon = ({ className, size = 22 }: WhatsAppIconProps) => (
  <WhatsappLogo className={className} size={size} weight="regular" />
)
