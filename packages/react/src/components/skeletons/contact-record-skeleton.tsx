import { Skeleton } from '../ui/skeleton';

/**
 * Skeleton de la ficha de contacto — calca las TRES columnas reales de
 * `ContactoDetalle` (340px · 1fr · 340px, mismo grid y mismo `xl:flex-1`)
 * con alturas mínimas estables para que nada salte al llegar los datos:
 * identidad (fila "‹ Contactos" + avatar + nombre + teléfono/email + propiedades),
 * centro (Resumen de conversaciones + Actividad), derecha (Resumen para agente
 * IA + Negocios + Tareas + Listas). Revisión "lagazo" Bruno 03/09.
 */
export const ContactRecordSkeleton = () => (
  <div
    className="grid grid-cols-1 xl:grid-cols-[340px_minmax(0,1fr)_340px] gap-6 items-start xl:items-stretch xl:flex-1 xl:min-h-[420px]"
    data-skeleton="contact-record"
  >
    {/* Izquierda: UNA tarjeta — volver, identidad, propiedades */}
    <div className="space-y-6 xl:h-full xl:overflow-hidden" data-skeleton-col="identity">
      <div className="rounded-xl border bg-card shadow-elev">
        <div className="flex h-[41px] items-center border-b border-border px-4">
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </div>
          <div className="mt-3 space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-6 w-52" />
          </div>
          <div className="mt-4 border-t border-border pt-4 space-y-3">
            <Skeleton className="h-4 w-28" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="grid grid-cols-[110px_1fr] items-center gap-2">
                <Skeleton className="h-3.5 w-20" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Centro: Resumen de conversaciones + Actividad */}
    <div className="min-w-0 space-y-6 xl:h-full xl:overflow-hidden" data-skeleton-col="activity">
      <ConversationInsightsCardSkeleton />
      <div className="rounded-xl border bg-card p-4 shadow-elev">
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg border border-border p-3">
              <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Derecha: Resumen para agente IA + Negocios + Tareas + Listas */}
    <div className="space-y-6 xl:h-full xl:overflow-hidden" data-skeleton-col="side">
      <div className="rounded-xl border bg-card p-4 shadow-elev">
        <div className="mb-2 flex items-center justify-between">
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-7 w-14 rounded-md" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
      {[3, 2].map((rows, c) => (
        <div key={c} className="rounded-xl border bg-card p-4 shadow-elev">
          <div className="mb-3 flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-7 w-16 rounded-md" />
          </div>
          <div className="space-y-1.5">
            {Array.from({ length: rows }).map((_, i) => (
              <Skeleton key={i} className="h-11 w-full rounded-md" />
            ))}
          </div>
        </div>
      ))}
      <div className="rounded-xl border bg-card p-4 shadow-elev">
        <Skeleton className="mb-3 h-4 w-16" />
        <Skeleton className="h-9 w-full rounded-md" />
      </div>
    </div>
  </div>
);

/**
 * Cuerpo en carga de la tarjeta "Resumen de conversaciones": calca su anatomía
 * (párrafo de resumen, fila de sentimiento, chips de temas) con un alto mínimo
 * estable, para que la tarjeta reserve su sitio en vez de crecer de golpe.
 */
export const ConversationInsightsBodySkeleton = () => (
  <div className="min-h-[132px] space-y-3" data-skeleton="conversation-insights-body">
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-11/12" />
      <Skeleton className="h-4 w-3/4" />
    </div>
    <div className="flex items-center gap-2">
      <Skeleton className="h-4 w-4 rounded-full" />
      <Skeleton className="h-3 w-28" />
    </div>
    <div>
      <Skeleton className="mb-1.5 h-3 w-24" />
      <div className="flex flex-wrap gap-1">
        {['w-16', 'w-24', 'w-20'].map((w) => (
          <Skeleton key={w} className={`h-5 rounded-full ${w}`} />
        ))}
      </div>
    </div>
  </div>
);

/** Tarjeta completa "Resumen de conversaciones" en carga (título real + cuerpo skeleton). */
export const ConversationInsightsCardSkeleton = () => (
  <div className="rounded-xl border bg-card p-4 shadow-elev">
    <div className="mb-3 flex items-center justify-between">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-7 w-7 rounded-md" />
    </div>
    <ConversationInsightsBodySkeleton />
  </div>
);
