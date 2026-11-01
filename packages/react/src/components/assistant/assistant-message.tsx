import { ArrowCounterClockwiseIcon, BirdIcon, ChartLineUpIcon, ChatCircleIcon } from "@phosphor-icons/react";
import { cn } from "../../lib/utils";
import { Bubble, BubbleContent } from "../ui/bubble";
import { Button } from "../ui/button";
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "../ui/item";
import type { AssistantThreadBotMessage, AssistantThreadMessage, AssistantThreadResult } from "./types";
import { useWordReveal } from "./use-word-reveal";

const RESULT_ICON = {
  conversation: ChatCircleIcon,
  metrics: ChartLineUpIcon,
} as const;

export interface AssistantMessageLabels {
  /** Nombre del asistente en el encabezado del turno. */
  assistantName: string;
  retry: string;
}

export const DEFAULT_ASSISTANT_MESSAGE_LABELS: AssistantMessageLabels = {
  assistantName: "Rambo IA",
  retry: "Reintentar",
};

export interface AssistantMessageProps {
  message: AssistantThreadMessage;
  /** Etiqueta de rol solo cuando cambia el turno (regla Agrupado). */
  showHeader?: boolean;
  /** Revelado por palabras (solo el último mensaje del asistente aún no revelado). */
  animate?: boolean;
  onRevealed?: (id: string) => void;
  onRetry?: (question: string) => void;
  onOpenResult?: (result: AssistantThreadResult) => void;
  labels?: Partial<AssistantMessageLabels>;
}

/**
 * Mensaje del hilo del asistente:
 * - usuario: a la derecha, `Bubble variant="default"` (negro neutro);
 * - asistente: a la izquierda, SIN burbuja — texto plano con encabezado
 *   pájaro `text-ai` + nombre cuando cambia el turno; debajo, los resultados
 *   como `Item`s clicables cuando termina el revelado.
 */
export function AssistantMessage({
  message,
  showHeader = true,
  animate = false,
  onRevealed,
  onRetry,
  onOpenResult,
  labels,
}: AssistantMessageProps) {
  if (message.role === "user") {
    return (
      <Bubble variant="default" align="end" data-role="user">
        <BubbleContent className="whitespace-pre-wrap">{message.content}</BubbleContent>
      </Bubble>
    );
  }

  return (
    <AssistantAnswer
      message={message}
      showHeader={showHeader}
      animate={animate}
      onRevealed={onRevealed}
      onRetry={onRetry}
      onOpenResult={onOpenResult}
      labels={labels}
    />
  );
}

type AnswerProps = Omit<AssistantMessageProps, "message"> & { message: AssistantThreadBotMessage };

function AssistantAnswer({ message, showHeader, animate, onRevealed, onRetry, onOpenResult, labels }: AnswerProps) {
  const l = { ...DEFAULT_ASSISTANT_MESSAGE_LABELS, ...labels };
  const { tokens, visibleWords, done } = useWordReveal(message.content, {
    enabled: Boolean(animate) && !message.revealed,
    onDone: () => onRevealed?.(message.id),
  });

  return (
    <div data-role="assistant" className="flex max-w-full flex-col gap-3">
      {showHeader && (
        <div className="flex items-center gap-2 text-sm text-ai">
          <BirdIcon className="h-4 w-4 shrink-0" />
          <span>{l.assistantName}</span>
        </div>
      )}

      <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground [overflow-wrap:anywhere]">
        {tokens.map((t, i) =>
          t.space ? (
            <span key={i}>{t.text}</span>
          ) : (
            <span
              key={i}
              className={cn(
                "transition-opacity duration-200 motion-reduce:transition-none",
                t.wordIndex < visibleWords ? "opacity-100" : "opacity-0",
              )}
            >
              {t.text}
            </span>
          ),
        )}
      </p>

      {message.error && done && message.question && onRetry && (
        <div>
          <Button variant="ghost" size="sm" onClick={() => onRetry(message.question!)}>
            <ArrowCounterClockwiseIcon className="h-3.5 w-3.5" />
            {l.retry}
          </Button>
        </div>
      )}

      {done && message.results.length > 0 && (
        <ItemGroup className="gap-2">
          {message.results.map((r, i) => {
            const Icon = RESULT_ICON[r.type] ?? ChatCircleIcon;
            return (
              <Item key={r.id ?? `${r.type}-${i}`} variant="outline" size="sm" asChild>
                <a
                  href={r.url}
                  onClick={(e) => {
                    if (!onOpenResult) return;
                    e.preventDefault();
                    onOpenResult(r);
                  }}
                >
                  <ItemMedia variant="icon">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{r.title}</ItemTitle>
                    {r.subtitle && <ItemDescription className="line-clamp-1">{r.subtitle}</ItemDescription>}
                  </ItemContent>
                </a>
              </Item>
            );
          })}
        </ItemGroup>
      )}
    </div>
  );
}
