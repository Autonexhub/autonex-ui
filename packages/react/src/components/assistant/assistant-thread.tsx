import { useEffect, useRef } from "react";
import { cn } from "../../lib/utils";
import { AssistantMessage, type AssistantMessageLabels } from "./assistant-message";
import { AssistantThinking, type AssistantThinkingLabels } from "./assistant-thinking";
import type { AssistantThreadMessage, AssistantThreadResult } from "./types";

export type AssistantThreadLabels = AssistantMessageLabels & AssistantThinkingLabels;

export interface AssistantThreadProps {
  messages: AssistantThreadMessage[];
  /** `true` mientras se espera la respuesta: fila "Pensando…" al final. */
  pending?: boolean;
  /** Palabra fija de la espera (Storybook). */
  thinkingWord?: string;
  onRevealed?: (id: string) => void;
  onRetry?: (question: string) => void;
  onOpenResult?: (result: AssistantThreadResult) => void;
  labels?: Partial<AssistantThreadLabels>;
  className?: string;
}

/**
 * Lista de mensajes del asistente: `max-w-3xl mx-auto`, `aria-live="polite"`,
 * auto-scroll al final cuando llega algo nuevo. La etiqueta de rol solo se pinta
 * cuando cambia el turno. Se anima únicamente el último mensaje del asistente
 * que aún no se ha revelado.
 */
export function AssistantThread({
  messages,
  pending = false,
  thinkingWord,
  onRevealed,
  onRetry,
  onOpenResult,
  labels,
  className,
}: AssistantThreadProps) {
  const endRef = useRef<HTMLDivElement>(null);
  const lastId = messages[messages.length - 1]?.id;

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [lastId, pending]);

  return (
    <div
      data-slot="assistant-thread"
      aria-live="polite"
      aria-busy={pending || undefined}
      className={cn("mx-auto flex w-full max-w-3xl flex-col gap-6", className)}
    >
      {messages.map((m, i) => {
        const prev = messages[i - 1];
        const isLast = i === messages.length - 1;
        return (
          <AssistantMessage
            key={m.id}
            message={m}
            showHeader={!prev || prev.role !== m.role}
            animate={isLast && m.role === "assistant" && !m.revealed}
            onRevealed={onRevealed}
            onRetry={onRetry}
            onOpenResult={onOpenResult}
            labels={labels}
          />
        );
      })}
      {pending && <AssistantThinking word={thinkingWord} labels={labels} />}
      <div ref={endRef} aria-hidden="true" />
    </div>
  );
}
