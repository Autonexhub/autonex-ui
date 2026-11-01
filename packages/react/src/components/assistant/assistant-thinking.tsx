import { useEffect, useState } from "react";
import { BirdIcon } from "@phosphor-icons/react";
import { cn } from "../../lib/utils";

const ROTATE_MS = 1500;

export interface AssistantThinkingLabels {
  /** Palabras de espera que rotan cada ~1,5 s. */
  thinkingWords: string[];
}

export const DEFAULT_ASSISTANT_THINKING_LABELS: AssistantThinkingLabels = {
  thinkingWords: ["Pensando", "Reflexionando", "Consultando", "Buscando", "Repasando", "Ordenando ideas"],
};

export interface AssistantThinkingProps {
  /** Palabra fija (para Storybook / capturas); si no, rota cada 1,5 s. */
  word?: string;
  labels?: Partial<AssistantThinkingLabels>;
  className?: string;
}

// Balanceo del pájaro (micro-feedback). Se incluye aquí para que el componente
// no dependa de CSS global de la app.
const BOB_KEYFRAMES = `@keyframes assistant-bird-bob{0%,100%{transform:translateY(0) rotate(0deg)}30%{transform:translateY(-2px) rotate(-7deg)}60%{transform:translateY(1px) rotate(4deg)}}`;

/**
 * Espera del asistente: sin skeleton. Una fila en el lado del asistente con el
 * pájaro `text-ai` que se mece, una palabra que rota y tres puntos `animate-pulse`
 * escalonados (quietos con `prefers-reduced-motion`).
 */
export function AssistantThinking({ word, labels, className }: AssistantThinkingProps) {
  const words = labels?.thinkingWords ?? DEFAULT_ASSISTANT_THINKING_LABELS.thinkingWords;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (word || words.length === 0) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % words.length), ROTATE_MS);
    return () => window.clearInterval(id);
  }, [word, words.length]);

  const label = word ?? words[index % Math.max(words.length, 1)] ?? "";

  return (
    <div
      data-slot="assistant-thinking"
      role="status"
      aria-label={`${label}…`}
      className={cn("flex items-center gap-2 text-sm text-ai", className)}
    >
      <style>{BOB_KEYFRAMES}</style>
      <BirdIcon
        className="h-4 w-4 shrink-0 origin-[60%_70%] [animation:assistant-bird-bob_1.1s_ease-in-out_infinite] motion-reduce:animate-none motion-reduce:[animation:none]"
      />
      <span>{label}</span>
      <span aria-hidden="true" className="inline-flex items-center gap-0.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-1 rounded-full bg-ai animate-pulse motion-reduce:animate-none"
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </span>
    </div>
  );
}
