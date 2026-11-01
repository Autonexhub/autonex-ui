import type { ReactNode } from 'react';
import { ArrowSquareOut as ExternalLink } from "@phosphor-icons/react";

export interface WhatsAppPreviewButton {
  type: 'QUICK_REPLY' | 'URL';
  text: string;
  url?: string;
}


/**
 * Vista previa de un mensaje de WhatsApp tal y como lo verá el cliente final.
 *
 * Excepción documentada en DesignRules ("Colores fuera de los tokens"): usa los
 * colores reales de WhatsApp (fondo beige, burbuja blanca/verde, enlaces azules)
 * porque simula la app del destinatario. No reutilizar estos hex fuera de aquí.
 */
export interface WhatsAppPreviewProps {
  /** Cabecera opcional (texto en negrita sobre el cuerpo). */
  header?: string;
  /** Cuerpo del mensaje: string plano o nodos ya renderizados (tokens resaltados). */
  body?: ReactNode;
  /** Texto que se pinta cuando el cuerpo está vacío. */
  emptyLabel?: string;
  /** Pie opcional (gris, pequeño). */
  footer?: string;
  /** Botones de la plantilla; los de texto vacío se omiten. */
  buttons?: WhatsAppPreviewButton[];
  /** Hora simulada en la burbuja. */
  time?: string;
  /** Altura mínima del "chat" en px. */
  minHeight?: number;
  className?: string;
}

/** Token `{{x}}` resaltado dentro del cuerpo (verde de WhatsApp). */
export const WhatsAppToken = ({ children }: { children: ReactNode }) => (
  <span className="rounded bg-[#d9fdd3] px-0.5 text-[#0b6e4f] dark:bg-[#005c4b]/60 dark:text-[#7fd8be]">
    {children}
  </span>
);

export function WhatsAppPreview({
  header,
  body,
  emptyLabel = 'Escribe el mensaje…',
  footer,
  buttons = [],
  time = '12:30',
  minHeight = 220,
  className,
}: WhatsAppPreviewProps) {
  const visibleButtons = buttons.filter((b) => b.text.trim());
  const hasBody = body !== undefined && body !== null && body !== '';
  return (
    <div className={`rounded-lg bg-[#e5ddd5] p-3 dark:bg-[#0b141a] ${className ?? ''}`} style={{ minHeight }}>
      <div className="max-w-full rounded-lg rounded-tl-none bg-white p-2 shadow-sm dark:bg-[#202c33]">
        {header && (
          <p className="text-[13px] font-semibold text-[#111b21] dark:text-[#e9edef]">{header}</p>
        )}
        <p className="whitespace-pre-wrap text-[13px] leading-[1.4] text-[#111b21] dark:text-[#e9edef]">
          {hasBody ? body : emptyLabel}
        </p>
        {footer && (
          <p className="mt-1 text-[11px] text-[#667781] dark:text-[#8696a0]">{footer}</p>
        )}
        <p className="mt-1 text-right text-[10px] text-[#667781] dark:text-[#8696a0]">{time}</p>
      </div>
      {visibleButtons.map((b, i) => (
        <div
          key={i}
          className="mt-1 flex items-center justify-center gap-1.5 rounded-lg bg-white py-1.5 text-[13px] font-medium text-[#00a5f4] shadow-sm dark:bg-[#202c33]"
        >
          {b.type === 'URL' && <ExternalLink className="h-3.5 w-3.5" />}
          {b.text}
        </div>
      ))}
    </div>
  );
}
