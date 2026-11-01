import { useEffect, useRef, useState } from "react";
import { InfoIcon, MagnifyingGlassIcon, PencilSimpleIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { cn } from "../../lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Skeleton } from "../ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import type { AssistantChatListItem } from "./types";

export interface AssistantChatsPanelLabels {
  title: string;
  privacy: string;
  searchPlaceholder: string;
  newChat: string;
  error: string;
  emptySearch: string;
  empty: string;
  rename: string;
  delete: string;
  unknownAuthor: string;
  deleteTitle: string;
  deleteDescription: (title: string) => string;
  cancel: string;
}

export const DEFAULT_ASSISTANT_CHATS_PANEL_LABELS: AssistantChatsPanelLabels = {
  title: "Chats",
  privacy: "Los chats se guardan 30 días y luego se borran automáticamente. Son visibles para todo tu equipo.",
  searchPlaceholder: "Buscar en los chats…",
  newChat: "Nueva conversación",
  error: "No se han podido cargar los chats.",
  emptySearch: "Ningún chat coincide con la búsqueda.",
  empty: "Todavía no hay chats guardados.",
  rename: "Renombrar",
  delete: "Borrar",
  unknownAuthor: "Alguien del equipo",
  deleteTitle: "¿Borrar este chat?",
  deleteDescription: (title) => `Se borrará «${title}» para todo el equipo. No se puede deshacer.`,
  cancel: "Cancelar",
};

export interface AssistantChatsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Chats a mostrar (ya filtrados por `query` por quien los provee). */
  chats: AssistantChatListItem[];
  loading?: boolean;
  error?: boolean;
  query: string;
  onQueryChange: (query: string) => void;
  onRename: (id: string | number, title: string) => void | Promise<void>;
  onDelete: (id: string | number) => void | Promise<void>;
  /** Chat cargado ahora mismo en el hilo (fila marcada). */
  activeChatId?: string | number | null;
  onSelect: (id: string | number) => void;
  /**
   * Empieza un chat nuevo desde DENTRO del panel: con el panel abierto, el
   * botón "+" de la cabecera queda tapado, así que la entrada vive también aquí.
   */
  onNewChat?: () => void;
  /** Contenedor del portal (Storybook); por defecto, la tarjeta del chasis. */
  container?: HTMLElement | null;
  labels?: Partial<AssistantChatsPanelLabels>;
}

/**
 * Historial de chats del asistente: panel lateral DERECHO en la variante
 * flotante `inline` del `Sheet`, con buscador arriba y la lista de chats. Cada
 * fila muestra el título y, debajo, quién lo creó y cuándo; al hover aparecen
 * renombrar (edición en línea) y borrar (con `AlertDialog` que nombra el chat).
 * Cierra al clicar fuera y con Esc. Requiere un `TooltipProvider` ascendente.
 */
export function AssistantChatsPanel({
  open,
  onOpenChange,
  chats,
  loading = false,
  error = false,
  query,
  onQueryChange,
  onRename,
  onDelete,
  activeChatId,
  onSelect,
  onNewChat,
  container,
  labels,
}: AssistantChatsPanelProps) {
  const l = { ...DEFAULT_ASSISTANT_CHATS_PANEL_LABELS, ...labels };
  const [deleteTarget, setDeleteTarget] = useState<AssistantChatListItem | null>(null);
  const [renamingId, setRenamingId] = useState<string | number | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Con el diálogo de borrado abierto, el clic/Esc que lo cierra NO debe cerrar
  // también el panel (el diálogo se porta al body y cuenta como "fuera").
  const blockDismiss = deleteTarget !== null;

  useEffect(() => {
    if (!open) {
      setRenamingId(null);
      setDeleteTarget(null);
    }
  }, [open]);

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
        <SheetContent
          ref={panelRef}
          tabIndex={-1}
          side="right"
          inline
          container={container}
          className="w-[360px] min-w-0 max-w-[360px] gap-0 p-0 outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0"
          onPointerDownOutside={(e) => {
            if (blockDismiss) e.preventDefault();
          }}
          onEscapeKeyDown={(e) => {
            if (blockDismiss) e.preventDefault();
          }}
          onOpenAutoFocus={(e) => {
            // Al abrir, el foco va al PANEL, no al buscador: un campo de texto
            // enfocado siempre pinta su anillo y el panel parecía "a medio
            // escribir". Enfocar el panel deja el Esc operativo sin marcar ningún
            // campo. `preventScroll`: durante la animación el panel entra
            // desplazado; sin esta opción el navegador salta ~13px.
            e.preventDefault();
            panelRef.current?.focus({ preventScroll: true });
          }}
        >
          <SheetHeader className="shrink-0 gap-0 px-4 pb-3 pt-4">
            <div className="flex items-center gap-1.5">
              <SheetTitle>{l.title}</SheetTitle>
              {/* Aviso de privacidad: icono discreto con tooltip. */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                    aria-label={l.privacy}
                  >
                    <InfoIcon className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">{l.privacy}</TooltipContent>
              </Tooltip>
            </div>
          </SheetHeader>

          <div className="shrink-0 px-4 pb-3">
            <InputGroup className="h-10">
              <InputGroupAddon>
                <MagnifyingGlassIcon className="h-4 w-4" />
              </InputGroupAddon>
              <InputGroupInput
                ref={searchRef}
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder={l.searchPlaceholder}
                aria-label={l.searchPlaceholder}
                data-testid="assistant-chats-search"
              />
            </InputGroup>
          </div>

          {onNewChat && (
            <div className="shrink-0 px-2 pb-2">
              <button
                type="button"
                onClick={onNewChat}
                data-testid="assistant-chats-new"
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
              >
                <PlusIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                {l.newChat}
              </button>
            </div>
          )}

          <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-4">
            {loading && chats.length === 0 ? (
              <div className="flex flex-col gap-1 px-1">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col gap-1.5 rounded-lg px-2 py-2">
                    <Skeleton className="h-4 w-3/4 rounded-md" />
                    <Skeleton className="h-3 w-1/2 rounded-md" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">{l.error}</p>
            ) : chats.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                {query ? l.emptySearch : l.empty}
              </p>
            ) : (
              <ul className="flex flex-col gap-0.5">
                {chats.map((chat) => (
                  <li key={String(chat.id)}>
                    {String(renamingId) === String(chat.id) ? (
                      <RenameRow
                        chat={chat}
                        onCancel={() => setRenamingId(null)}
                        onSave={(title) => {
                          setRenamingId(null);
                          if (title && title !== chat.title) void onRename(chat.id, title);
                        }}
                      />
                    ) : (
                      <ChatRow
                        chat={chat}
                        active={String(activeChatId ?? "") === String(chat.id)}
                        onSelect={() => onSelect(chat.id)}
                        onRename={() => setRenamingId(chat.id)}
                        onDelete={() => setDeleteTarget(chat)}
                        renameLabel={l.rename}
                        deleteLabel={l.delete}
                        unknownAuthor={l.unknownAuthor}
                      />
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Destructivo ⇒ AlertDialog que NOMBRA el chat. */}
      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(o) => {
          if (!o) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{l.deleteTitle}</AlertDialogTitle>
            <AlertDialogDescription>{l.deleteDescription(deleteTarget?.title ?? "")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{l.cancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteTarget) void onDelete(deleteTarget.id);
                setDeleteTarget(null);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {l.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

interface ChatRowProps {
  chat: AssistantChatListItem;
  active: boolean;
  onSelect: () => void;
  onRename: () => void;
  onDelete: () => void;
  renameLabel: string;
  deleteLabel: string;
  unknownAuthor: string;
}

function ChatRow({ chat, active, onSelect, onRename, onDelete, renameLabel, deleteLabel, unknownAuthor }: ChatRowProps) {
  const meta = [chat.author || unknownAuthor, chat.date].filter(Boolean).join(" · ");

  // Las acciones son botones HERMANOS del botón de la fila (nunca anidados):
  // `pr-16` reserva su hueco y solo aparecen al hover o con el foco dentro.
  return (
    <div className="group/chat relative" data-testid="assistant-chat-row">
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "flex w-full flex-col items-start gap-0.5 rounded-lg px-3 py-2 pr-16 text-left transition-colors hover:bg-muted",
          active && "bg-muted",
        )}
      >
        <span className="w-full truncate text-sm text-foreground">{chat.title}</span>
        <span className="w-full truncate text-xs text-muted-foreground">{meta}</span>
      </button>
      <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-0.5 opacity-0 transition-opacity focus-within:opacity-100 group-hover/chat:opacity-100">
        <Button variant="ghost" size="icon-xs" aria-label={renameLabel} title={renameLabel} onClick={onRename}>
          <PencilSimpleIcon className="size-3.5" />
        </Button>
        <Button variant="ghost" size="icon-xs" aria-label={deleteLabel} title={deleteLabel} onClick={onDelete}>
          <TrashIcon className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

/** Edición en línea del título: Enter guarda, Esc cancela, blur guarda. */
function RenameRow({
  chat,
  onSave,
  onCancel,
}: {
  chat: AssistantChatListItem;
  onSave: (title: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(chat.title);
  const cancelled = useRef(false);

  return (
    <div className="px-2 py-1">
      <Input
        autoFocus
        value={value}
        aria-label={chat.title}
        className="h-9"
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onSave(value.trim());
          } else if (e.key === "Escape") {
            e.preventDefault();
            e.stopPropagation();
            cancelled.current = true;
            onCancel();
          }
        }}
        onBlur={() => {
          if (!cancelled.current) onSave(value.trim());
        }}
      />
    </div>
  );
}
