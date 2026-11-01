import { FileText } from "@phosphor-icons/react";

interface DocumentAttachmentCardProps {
  url: string;
  /** Nombre visible del archivo (caption > content > fallback) */
  filename?: string | null;
}

/**
 * Tarjeta de documento: icono grande + pie con nombre del archivo y enlace
 * para abrirlo. Diseño fijo a propósito (decisión 2026-07-02): simple,
 * estable al scrollear e idéntico en todos los navegadores — sin visor
 * embebido ni miniatura renderizada.
 */
export function DocumentAttachmentCard({ url, filename }: DocumentAttachmentCardProps) {
  // Mensajes antiguos llevan "📄 " delante del nombre — fuera emojis/espacios
  const cleanName = (filename || "").replace(/^[^\p{L}\p{N}]+/u, "").trim() || "Documento";

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-64 overflow-hidden rounded-lg border border-border/50 bg-background/50 hover:bg-background"
    >
      <div className="flex h-36 w-full items-center justify-center bg-muted/40">
        <FileText className="h-10 w-10 text-muted-foreground/60" strokeWidth={1.2} />
      </div>
      <div className="flex items-center gap-2 border-t border-border/50 px-2.5 py-2">
        <FileText className="h-4 w-4 flex-shrink-0 text-muted-foreground" strokeWidth={1.8} />
        <span className="truncate text-xs font-medium">{cleanName}</span>
        <span className="ml-auto flex-shrink-0 text-[10px] uppercase text-muted-foreground">pdf</span>
      </div>
    </a>
  );
}
