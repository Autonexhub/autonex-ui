import { Skeleton } from "../ui/skeleton";

/**
 * Skeleton de Rambo IA — calca la estructura REAL de la página (regla 01/09:
 * el skeleton es la promesa de lo que aparece). Desde el 03/09 la página es
 * solo el asistente y la CAJA DE ESCRIBIR es el centro exacto de la pantalla,
 * así que aquí se usa la misma rejilla de tres filas (1fr · auto · 1fr): el
 * saludo se apoya arriba, la caja ocupa el centro y el aviso cuelga abajo.
 * Medidas calcadas del hero real: caja 640px de ancho y 85px de alto.
 */
export function DashboardHomeSkeleton() {
  return (
    <div className="grid min-h-full flex-1 grid-rows-[1fr_auto_1fr] items-center justify-items-center">
      {/* Fila 1: saludo + subtítulo, apoyados en la parte baja */}
      <div className="flex flex-col items-center justify-end self-end pb-10">
        <Skeleton className="mb-4 h-9 w-80 sm:h-10" />
        <Skeleton className="h-5 w-[26rem] max-w-full" />
      </div>

      {/* Fila 2: la caja de escribir, centro exacto de la pantalla */}
      <div className="w-full max-w-[640px]">
        <Skeleton className="h-[85px] w-full rounded-2xl" />
      </div>

      {/* Fila 3: aviso bajo la caja */}
      <Skeleton className="mt-4 h-4 w-96 max-w-full self-start" />
    </div>
  );
}
