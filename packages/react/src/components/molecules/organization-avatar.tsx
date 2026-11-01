import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "../../lib/utils";

/**
 * Marca cuadrada de una organización (decisión Bruno 03/09): logo si lo tiene,
 * y si no las iniciales de su nombre.
 *
 * El reserva no es un caso raro sino el normal: de 28 organizaciones solo una
 * tiene logo subido, así que las iniciales son lo que se ve casi siempre — y
 * ya personalizan más que el icono de edificio genérico que había antes.
 */
export function initialsFromName(name?: string | null): string {
  const words = (name || "").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  // Una sola palabra → una sola letra: "Eurofitness" como "EU" se lee como una
  // sigla que no es suya. Con dos palabras sí, igual que el avatar de usuario.
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

interface OrganizationAvatarProps {
  name?: string | null;
  logoUrl?: string | null;
  /** Tamaño por className, igual que el átomo Avatar (h-8 w-8, h-9 w-9…). */
  className?: string;
}

export function OrganizationAvatar({ name, logoUrl, className }: OrganizationAvatarProps) {
  return (
    <Avatar shape="square" className={cn("h-9 w-9", className)}>
      {logoUrl ? (
        // `object-contain`: el átomo recorta por defecto (object-cover, pensado
        // para caras). Una marca ancha se quedaría sin los lados, así que aquí
        // se muestra entera aunque no sea cuadrada.
        <AvatarImage src={logoUrl} alt={name || ""} className="object-contain" />
      ) : null}
      <AvatarFallback className="text-xs font-medium">{initialsFromName(name)}</AvatarFallback>
    </Avatar>
  );
}
