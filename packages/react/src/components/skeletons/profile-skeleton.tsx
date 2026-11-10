import { ReactNode } from "react";

import { Skeleton } from "../ui/skeleton";
import { cn } from "../../lib/utils";

/**
 * Skeleton de /settings/profile. Calca la anatomía real de la página
 * (seis tarjetas) para que nada salte al llegar los datos:
 *
 *   1. Foto de perfil — avatar de 96px + botón de subida
 *   2. Información personal — dos campos en fila, email, teléfono y guardar
 *   3. Logotipo de la organización — logo de 64px, campo de texto y switch
 *   4. Preferencias — un Select
 *   5. Contraseña — tres campos + el medidor de fuerza con sus 5 requisitos
 *   6. Sesión — un botón
 */
const CardShell = ({ children }: { children: ReactNode }) => (
  <div className="rounded-2xl border border-border bg-card shadow-elev">
    <div className="space-y-2 p-4">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-3 w-64" />
    </div>
    <div className="space-y-4 p-4 pt-0">{children}</div>
  </div>
);

const FieldRow = ({ labelWidth = "w-24" }: { labelWidth?: string }) => (
  <div className="space-y-2">
    <Skeleton className={`h-3 ${labelWidth}`} />
    <Skeleton className="h-9 w-full rounded-3xl" />
  </div>
);

export const ProfileSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn("space-y-6", className)}>
      {/* 1 · Foto de perfil */}
      <CardShell>
        <div className="flex items-center gap-6">
          <Skeleton className="h-24 w-24 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-10 w-44 rounded-4xl" />
            <Skeleton className="h-3 w-56" />
          </div>
        </div>
      </CardShell>

      {/* 2 · Información personal */}
      <CardShell>
        <div className="grid grid-cols-2 gap-4">
          <FieldRow labelWidth="w-20" />
          <FieldRow labelWidth="w-20" />
        </div>
        <FieldRow labelWidth="w-16" />
        <FieldRow labelWidth="w-20" />
        <div className="flex justify-end">
          <Skeleton className="h-10 w-28 rounded-4xl" />
        </div>
      </CardShell>

      {/* 3 · Logotipo de la organización */}
      <CardShell>
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 shrink-0 rounded-lg" />
          <Skeleton className="h-10 w-40 rounded-4xl" />
        </div>
        <FieldRow labelWidth="w-32" />
        <div className="flex items-center justify-between rounded-md border border-border p-3">
          <div className="space-y-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-56" />
          </div>
          <Skeleton className="h-5 w-9 rounded-full" />
        </div>
        <div className="flex justify-end">
          <Skeleton className="h-10 w-28 rounded-4xl" />
        </div>
      </CardShell>

      {/* 4 · Preferencias de organización (un Select) */}
      <CardShell>
        <div className="space-y-2">
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-9 w-full rounded-3xl" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </CardShell>

      {/* 5 · Contraseña, con el medidor de fuerza */}
      <CardShell>
        <FieldRow labelWidth="w-32" />
        <FieldRow labelWidth="w-32" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-2 flex-1 rounded-full" />
          <Skeleton className="h-3 w-[70px]" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-32" />
          ))}
          <Skeleton className="col-span-2 h-3 w-48" />
        </div>
        <FieldRow labelWidth="w-40" />
        <div className="flex justify-end">
          <Skeleton className="h-10 w-44 rounded-4xl" />
        </div>
      </CardShell>

      {/* 6 · Sesión */}
      <CardShell>
        <Skeleton className="h-10 w-36 rounded-4xl" />
      </CardShell>
    </div>
  );
};
