import { Skeleton } from "../ui/skeleton";

/**
 * Esqueleto de un hilo de mensajes: burbujas alternas, de anchos distintos,
 * alineadas como en la conversacion real.
 *
 * El de la ficha de llamada (ConversationDetailSkeleton) no vale aqui: lleva
 * reproductor de audio y pestañas, que en un chat no existen.
 */
export const ChatMessagesSkeleton = () => {
  // Anchos fijos, no aleatorios: si cambian en cada render, el esqueleto
  // "baila" mientras carga.
  const burbujas = [
    { propia: false, ancho: "w-52" },
    { propia: true, ancho: "w-64" },
    { propia: false, ancho: "w-40" },
    { propia: true, ancho: "w-56" },
    { propia: false, ancho: "w-60" },
  ];

  return (
    <div className="flex flex-col gap-4 p-1" aria-hidden="true">
      {burbujas.map((b, i) => (
        <div key={i} className={`flex flex-col gap-1.5 ${b.propia ? "items-end" : "items-start"}`}>
          <div className="flex items-center gap-2">
            {!b.propia && <Skeleton className="size-6 rounded-full" />}
            <Skeleton className="h-3 w-16" />
            {b.propia && <Skeleton className="size-6 rounded-full" />}
          </div>
          <Skeleton className={`h-10 rounded-2xl ${b.ancho}`} />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  );
};
