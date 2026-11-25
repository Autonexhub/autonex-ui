import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "../../lib/utils";
import { initialsFromName } from "./organization-avatar";

/** Lo mínimo para pintar a una persona. Acepta `avatarUrl` o `avatar_url` (lo que devuelva la API). */
export interface PersonAvatarPerson {
  name: string;
  avatarUrl?: string | null;
  avatar_url?: string | null;
}

export type PersonAvatarSize = "xs" | "sm";

export interface PersonAvatarProps {
  /** `null` = sin asignar: círculo de línea discontinua. */
  person: PersonAvatarPerson | null | undefined;
  /** `xs` 20px (menús, etiquetas en línea) · `sm` 24px (filas, tarjetas). Por defecto `sm`. */
  size?: PersonAvatarSize;
  /** Texto del hueco vacío (title + aria-label). Por defecto, "Sin asignar". */
  emptyLabel?: string;
  className?: string;
}

const SIZES: Record<PersonAvatarSize, string> = {
  xs: "size-5 text-[10px]",
  sm: "size-6 text-[11px]",
};

/**
 * Avatar pequeño de una persona (responsable, creador, participante): su foto si la tiene y, si no, sus
 * iniciales. Sin persona pinta el hueco "sin asignar". Para tamaños mayores, el átomo `Avatar`.
 */
export function PersonAvatar({ person, size = "sm", emptyLabel = "Sin asignar", className }: PersonAvatarProps) {
  const box = SIZES[size];
  if (!person) {
    return (
      <span
        role="img"
        className={cn(box, "inline-flex shrink-0 rounded-full border border-dashed border-muted-foreground/50", className)}
        aria-label={emptyLabel}
        title={emptyLabel}
      />
    );
  }
  const src = person.avatarUrl ?? person.avatar_url ?? undefined;
  return (
    <Avatar className={cn(box, className)} title={person.name}>
      {src && <AvatarImage src={src} alt="" className="object-cover" />}
      <AvatarFallback className={cn(box, "font-medium")}>{initialsFromName(person.name)}</AvatarFallback>
    </Avatar>
  );
}
