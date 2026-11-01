import { useState } from "react";
import { PlusIcon, SidebarSimpleIcon } from "@phosphor-icons/react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { AssistantComposer, DEFAULT_ASSISTANT_COMPOSER_LABELS, type AssistantComposerLabels } from "./assistant-composer";
import { DEFAULT_ASSISTANT_MESSAGE_LABELS, type AssistantMessageLabels } from "./assistant-message";
import { AssistantThread } from "./assistant-thread";
import { DEFAULT_ASSISTANT_THINKING_LABELS, type AssistantThinkingLabels } from "./assistant-thinking";
import type { AssistantThreadMessage, AssistantThreadResult } from "./types";

export interface AssistantChatActionsLabels {
  /** Botón/tooltip del historial. */
  chats: string;
  /** Botón/tooltip de chat nuevo. */
  newChat: string;
}

export const DEFAULT_ASSISTANT_CHAT_ACTIONS_LABELS: AssistantChatActionsLabels = {
  chats: "Chats",
  newChat: "Nueva conversación",
};

export interface AssistantChatActionsProps {
  /** Abre el panel de Chats (historial). Sin él, el botón no se pinta. */
  onOpenChats?: () => void;
  /** Vacía el hilo y empieza un chat nuevo. */
  onNewChat: () => void;
  /** Oculta el botón "+" donde no aporta (en HOME ya estás en un chat nuevo). */
  showNewChat?: boolean;
  labels?: Partial<AssistantChatActionsLabels>;
  className?: string;
}

/**
 * Par de botones de SOLO ICONO arriba a la derecha del área del asistente:
 * panel de historial (`SidebarSimple`) y chat nuevo (`Plus`). Sin texto visible:
 * `aria-label` + Tooltip. Requiere un `TooltipProvider` ascendente.
 */
export function AssistantChatActions({
  onOpenChats,
  onNewChat,
  showNewChat = true,
  labels,
  className,
}: AssistantChatActionsProps) {
  const l = { ...DEFAULT_ASSISTANT_CHAT_ACTIONS_LABELS, ...labels };

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {onOpenChats && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground"
              onClick={onOpenChats}
              aria-label={l.chats}
              data-testid="assistant-chats-trigger"
            >
              <SidebarSimpleIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">{l.chats}</TooltipContent>
        </Tooltip>
      )}
      {showNewChat && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground"
              onClick={onNewChat}
              aria-label={l.newChat}
              data-testid="assistant-new-chat"
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">{l.newChat}</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}

export type AssistantChatLabels = AssistantChatActionsLabels &
  AssistantComposerLabels &
  AssistantMessageLabels &
  AssistantThinkingLabels & {
    /** Aviso bajo la caja de escritura. */
    disclaimer: string;
  };

export const DEFAULT_ASSISTANT_CHAT_LABELS: AssistantChatLabels = {
  ...DEFAULT_ASSISTANT_CHAT_ACTIONS_LABELS,
  ...DEFAULT_ASSISTANT_COMPOSER_LABELS,
  ...DEFAULT_ASSISTANT_MESSAGE_LABELS,
  ...DEFAULT_ASSISTANT_THINKING_LABELS,
  disclaimer: "Rambo IA puede cometer errores. Comprueba la información importante.",
};

export interface AssistantChatProps {
  messages: AssistantThreadMessage[];
  pending?: boolean;
  thinkingWord?: string;
  onSend: (question: string) => void;
  onRetry?: (question: string) => void;
  onReset: () => void;
  onRevealed?: (id: string) => void;
  onOpenResult?: (result: AssistantThreadResult) => void;
  /** Abre el panel de Chats (historial). Sin él, el botón no se pinta. */
  onOpenChats?: () => void;
  /** Panel lateral derecho: menos aire y sin la fila de botones. */
  compact?: boolean;
  labels?: Partial<AssistantChatLabels>;
  className?: string;
}

/**
 * Estado CHAT: los dos botones de icono (historial + chat nuevo) arriba a la
 * derecha, hilo con scroll interno y la caja de entrada fija abajo con el aviso
 * de errores debajo. Ocupa el alto del contenedor (`h-full`, nunca 100vh).
 */
export function AssistantChat({
  messages,
  pending = false,
  thinkingWord,
  onSend,
  onRetry,
  onReset,
  onRevealed,
  onOpenResult,
  onOpenChats,
  compact = false,
  labels,
  className,
}: AssistantChatProps) {
  const l = { ...DEFAULT_ASSISTANT_CHAT_LABELS, ...labels };
  // El degradado del borde superior solo se aplica cuando hay scroll: arriba
  // del todo la primera línea se ve entera.
  const [scrolled, setScrolled] = useState(false);

  return (
    <div data-slot="assistant-chat" className={cn("flex h-full min-h-0 flex-col", className)}>
      {!compact && (
        <div className="flex shrink-0 items-center justify-end px-10 pt-4">
          <AssistantChatActions onOpenChats={onOpenChats} onNewChat={onReset} labels={l} />
        </div>
      )}

      <div
        onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 4)}
        className={cn(
          "min-h-0 flex-1 overflow-y-auto",
          compact ? "px-4 py-4" : "px-10 py-6",
          scrolled &&
            "[-webkit-mask-image:linear-gradient(to_bottom,transparent_0,black_24px)] [mask-image:linear-gradient(to_bottom,transparent_0,black_24px)]",
        )}
      >
        <AssistantThread
          messages={messages}
          pending={pending}
          thinkingWord={thinkingWord}
          onRevealed={onRevealed}
          onRetry={onRetry}
          onOpenResult={onOpenResult}
          labels={l}
        />
      </div>

      <div className={cn("shrink-0 pt-2", compact ? "px-3 pb-3" : "px-10 pb-6")}>
        <div className="mx-auto w-full max-w-3xl">
          <AssistantComposer onSend={onSend} disabled={pending} autoFocus labels={l} />
          <p className="mt-2 text-center text-xs text-muted-foreground">{l.disclaimer}</p>
        </div>
      </div>
    </div>
  );
}
