import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

/** El título de la ficha de un servicio con sus etiquetas (familia, tipo y estado). */
export const ServiceDetailHeaderSkeleton = () => (
  <div className="flex flex-wrap items-center gap-2" aria-hidden="true">
    <Skeleton className="h-8 w-56" />
    <Skeleton className="h-5 w-40 rounded-full" />
    <Skeleton className="h-5 w-16 rounded-full" />
    <Skeleton className="h-5 w-14 rounded-full" />
  </div>
);

/**
 * Las tres tarjetas de la ficha de un servicio (Datos, Precios por centro y tarifa,
 * Quién lo presta): cada una con su título y unas barras, a todo el ancho como las reales.
 */
export const ServiceDetailSkeleton = () => (
  <div className="space-y-6" aria-busy="true">
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-16" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-3/4" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="space-y-2">
        <Skeleton className="h-6 w-56" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Precio base */}
        <div className="w-36 space-y-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-9 w-full rounded-full" />
        </div>
        {/* Tabla de centros */}
        <div className="max-w-3xl space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-36" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-md" />
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);
