import { forwardRef, useCallback, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import { ArrowUpIcon } from "@phosphor-icons/react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

const MAX_LINES = 4;

export interface AssistantComposerHandle {
  focus: () => void;
}

export interface AssistantComposerLabels {
  placeholder: string;
  send: string;
}

export const DEFAULT_ASSISTANT_COMPOSER_LABELS: AssistantComposerLabels = {
  placeholder: "¿En qué te puedo ayudar hoy?",
  send: "Enviar pregunta",
};

export interface AssistantComposerProps {
  onSend: (question: string) => void;
  /** Deshabilita el envío mientras el asistente responde. */
  disabled?: boolean;
  /** Atajo para `labels.placeholder`. */
  placeholder?: string;
  autoFocus?: boolean;
  labels?: Partial<AssistantComposerLabels>;
  className?: string;
}

/**
 * Caja de chat del asistente: `Textarea` auto-crecible de 1 a 4 líneas dentro de
 * un contenedor `rounded-2xl border bg-card shadow-elev`, con el botón de enviar
 * redondo `bg-primary` (ArrowUp) abajo a la derecha, activo solo con texto.
 * Enter envía; Shift+Enter salta línea.
 */
export const AssistantComposer = forwardRef<AssistantComposerHandle, AssistantComposerProps>(
  ({ onSend, disabled = false, placeholder, autoFocus = false, labels, className }, ref) => {
    const l = { ...DEFAULT_ASSISTANT_COMPOSER_LABELS, ...labels };
    const placeholderText = placeholder ?? l.placeholder;
    const [value, setValue] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => ({ focus: () => textareaRef.current?.focus() }), []);

    // Auto-crecimiento explícito (field-sizing:content no llega a todos los
    // navegadores): alto = contenido, con tope de 4 líneas y scroll interno.
    useLayoutEffect(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.style.height = "auto";
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 24;
      const max = Math.round(lineHeight * MAX_LINES);
      el.style.height = `${Math.min(el.scrollHeight, max)}px`;
      el.style.overflowY = el.scrollHeight > max ? "auto" : "hidden";
    }, [value]);

    const canSend = value.trim().length > 0 && !disabled;

    const submit = useCallback(() => {
      const q = value.trim();
      if (!q || disabled) return;
      onSend(q);
      setValue("");
      textareaRef.current?.focus();
    }, [value, disabled, onSend]);

    return (
      <div
        data-slot="assistant-composer"
        className={cn(
          "flex w-full flex-col gap-2 rounded-2xl border border-border bg-card px-4 pt-3 pb-3 shadow-elev transition-[border-color,box-shadow]",
          "has-[textarea:focus-visible]:border-ring has-[textarea:focus-visible]:ring-2 has-[textarea:focus-visible]:ring-ring/30",
          className,
        )}
      >
        <Textarea
          ref={textareaRef}
          value={value}
          rows={1}
          autoFocus={autoFocus}
          placeholder={placeholderText}
          aria-label={placeholderText}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              submit();
            }
          }}
          className="min-h-6 rounded-none border-0 bg-transparent p-0 leading-6 shadow-none ring-0 focus-visible:border-transparent focus-visible:ring-0"
        />
        <div className="flex items-center justify-end">
          <Button
            type="button"
            size="icon-sm"
            aria-label={l.send}
            disabled={!canSend}
            onClick={submit}
            className="rounded-full"
          >
            <ArrowUpIcon className="h-4 w-4" weight="bold" />
          </Button>
        </div>
      </div>
    );
  },
);
AssistantComposer.displayName = "AssistantComposer";
