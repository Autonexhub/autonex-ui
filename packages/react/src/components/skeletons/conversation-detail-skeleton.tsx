import { Skeleton } from "../ui/skeleton";
import { AudioPlayerSkeleton } from "../molecules/skeletons";

interface ConversationDetailSkeletonProps {
  /** Con `voice` se reserva además el sitio del reproductor. */
  channel?: string;
  /**
   * Panel de una prueba (módulo Pruebas): solo fecha, reproductor y mensajes.
   * Debe calcar esa vista, no la de una conversación de cliente.
   */
  modoPrueba?: boolean;
}

/**
 * Skeleton de la pestaña Resumen del detalle de conversación: calca lo que
 * aparece después (cabecera, Resumen, Notas internas y Detalles). El
 * reproductor solo se dibuja en voz, y con la receta oficial
 * (`AudioPlayerSkeleton`), no con una onda hecha a mano.
 */
export const ConversationDetailSkeleton = ({ channel, modoPrueba = false }: ConversationDetailSkeletonProps) => {
  if (modoPrueba) {
    // Mismo esqueleto que el panel real de una prueba: cabecera con borde inferior
    // (fecha + reproductor) y debajo los mensajes, agente a la derecha y quien
    // prueba a la izquierda, con la etiqueta solo al cambiar de turno.
    const turnos: Array<{ agente: boolean; etiqueta: boolean; anchos: string[] }> = [
      { agente: true, etiqueta: true, anchos: ["w-64", "w-40"] },
      { agente: false, etiqueta: true, anchos: ["w-48"] },
      { agente: true, etiqueta: true, anchos: ["w-36"] },
      { agente: true, etiqueta: false, anchos: ["w-72", "w-56"] },
      { agente: false, etiqueta: true, anchos: ["w-44"] },
    ];
    return (
      <div className="flex h-full flex-col" aria-hidden="true">
        <div className="flex-shrink-0 border-b border-border p-6">
          <Skeleton className="h-6 w-44" />
          {channel === "voice" && <AudioPlayerSkeleton className="mt-4 w-full" />}
        </div>
        <div className="flex flex-col gap-6 p-6">
          {turnos.map((turno, i) => (
            <div
              key={i}
              className={`flex max-w-[80%] flex-col gap-1.5 ${turno.agente ? "items-end self-end" : "items-start self-start"}`}
            >
              {turno.etiqueta && (
                <div className="flex items-center gap-2">
                  {!turno.agente && <Skeleton className="size-6 rounded-full" />}
                  <Skeleton className="h-3.5 w-16" />
                  {turno.agente && <Skeleton className="size-6 rounded-full" />}
                </div>
              )}
              <div className={`flex flex-col gap-2 rounded-3xl px-3.5 py-3 ${turno.agente ? "items-end bg-muted/60" : "items-start bg-muted/60"}`}>
                {turno.anchos.map((ancho, j) => (
                  <Skeleton key={j} className={`h-3 ${ancho} max-w-full`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6" aria-hidden="true">
      {/* Cabecera: nombre + teléfono, etiquetas de canal y estado */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="size-9 shrink-0 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
      </div>

      {channel === "voice" && <AudioPlayerSkeleton className="w-full" />}

      {/* Resumen */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>

      {/* Notas internas */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-16 w-full rounded-2xl" />
      </div>

      {/* Detalles: etiqueta a la izquierda, valor a la derecha */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-20" />
        {["w-16", "w-20", "w-24", "w-28", "w-14"].map((ancho, i) => (
          <div key={i} className="flex items-center justify-between">
            <Skeleton className={`h-3 ${ancho}`} />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>
    </div>
  );
};
