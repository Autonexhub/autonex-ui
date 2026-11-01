import { BirdIcon, XIcon } from "@phosphor-icons/react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import {
  AssistantChat,
  AssistantChatActions,
  DEFAULT_ASSISTANT_CHAT_LABELS,
  type AssistantChatLabels,
} from "./assistant-chat";
import { AssistantComposer } from "./assistant-composer";
import type { AssistantThreadMessage, AssistantThreadResult } from "./types";

export type AssistantSidePanelLabels = AssistantChatLabels & {
  close: string;
  /** Saludo en reposo con el nombre de la organización. */
  greeting: (name: string) => string;
  /** Subtítulo en reposo. */
  subtitle: string;
};

export const DEFAULT_ASSISTANT_SIDE_PANEL_LABELS: AssistantSidePanelLabels = {
  ...DEFAULT_ASSISTANT_CHAT_LABELS,
  close: "Cerrar",
  greeting: (name) => `¿Qué necesitas de ${name}?`,
  subtitle: "Pregunta por conversaciones o métricas de tu organización",
};

export interface AssistantSidePanelProps {
  /** Nombre de la organización (saludo en reposo). Sin él no se puede escribir. */
  orgName?: string | null;
  messages: AssistantThreadMessage[];
  pending?: boolean;
  /** Hay hilo en curso: se pinta el chat en vez del reposo. */
  active: boolean;
  onSend: (question: string) => void;
  onRetry?: (question: string) => void;
  onReset: () => void;
  onRevealed?: (id: string) => void;
  onOpenResult?: (result: AssistantThreadResult) => void;
  /** Abre el historial de chats. Sin él, el botón no se pinta. */
  onOpenChats?: () => void;
  onClose: () => void;
  labels?: Partial<AssistantSidePanelLabels>;
  className?: string;
}

/**
 * Panel lateral de Rambo IA (presentacional, sin hooks de datos ni router).
 * Cabecera h-12 con el pájaro en la tinta del texto; en reposo, el pájaro
 * grande en lila (`text-ai`), saludo con la organización y la caja abajo.
 */
export function AssistantSidePanel({
  orgName,
  messages,
  pending = false,
  active,
  onSend,
  onRetry,
  onReset,
  onRevealed,
  onOpenResult,
  onOpenChats,
  onClose,
  labels,
  className,
}: AssistantSidePanelProps) {
  const l = { ...DEFAULT_ASSISTANT_SIDE_PANEL_LABELS, ...labels };

  return (
    <aside
      aria-label={l.assistantName}
      className={cn(
        "flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-background shadow-elev",
        className,
      )}
    >
      {/* Misma altura que la cabecera de la tarjeta de contenido (h-12). */}
      <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-3">
        <BirdIcon weight="light" className="size-[18px] shrink-0 text-foreground" />
        <span className="flex-1 truncate text-sm font-medium text-foreground">{l.assistantName}</span>
        {orgName && (
          <AssistantChatActions onOpenChats={onOpenChats} onNewChat={onReset} showNewChat={active} labels={l} />
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground"
              onClick={onClose}
              aria-label={l.close}
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">{l.close}</TooltipContent>
        </Tooltip>
      </header>

      {active ? (
        <AssistantChat
          compact
          className="flex-1"
          messages={messages}
          pending={pending}
          onSend={onSend}
          onRetry={onRetry}
          onReset={onReset}
          onRevealed={onRevealed}
          onOpenResult={onOpenResult}
          labels={l}
        />
      ) : (
        // Reposo: saludo centrado y la caja de escribir abajo.
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <BirdIcon weight="light" className="mb-4 size-8 text-ai" />
            <p className="text-base font-medium text-foreground">
              {orgName ? l.greeting(orgName) : l.assistantName}
            </p>
            <p className="mt-1 max-w-[280px] text-balance text-sm text-muted-foreground">{l.subtitle}</p>
          </div>
          <div className="shrink-0 px-3 pb-3">
            <AssistantComposer onSend={onSend} disabled={!orgName} labels={l} />
            <p className="mt-2 text-center text-xs text-muted-foreground">{l.disclaimer}</p>
          </div>
        </div>
      )}
    </aside>
  );
}
