import { useRef, useEffect, useCallback, useState } from "react";
import { marked } from "marked";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import {
  TextB,
  TextItalic,
  ListBullets,
  ListNumbers,
  TextHTwo,
  TextHThree,
  LinkSimple,
  Quotes,
  Code,
  ArrowUUpLeft,
  ArrowUUpRight,
} from "@phosphor-icons/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

// Convert markdown to HTML for display/editing
const renderMarkdown = (md: string): string => (md ? (marked.parse(md) as string) : "");

// Convert HTML back to markdown for storage
const turndown = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced" });
turndown.use(gfm);
const htmlToMarkdown = (html: string): string => turndown.turndown(html);

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  disabled?: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Escribe aquí...",
  className,
  minHeight = "150px",
  disabled = false,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const isInternalChange = useRef(false);

  // Initialize editor content from markdown value
  useEffect(() => {
    if (editorRef.current && !isInternalChange.current) {
      const html = renderMarkdown(value);
      if (editorRef.current.innerHTML !== html) {
        editorRef.current.innerHTML = html || "";
      }
    }
    isInternalChange.current = false;
  }, [value]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      isInternalChange.current = true;
      const html = editorRef.current.innerHTML;
      const markdown = htmlToMarkdown(html);
      onChange(markdown);
    }
  }, [onChange]);

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  }, [handleInput]);

  const insertHeading = useCallback((level: 2 | 3) => {
    const tag = level === 2 ? "h2" : "h3";
    document.execCommand("formatBlock", false, tag);
    editorRef.current?.focus();
    handleInput();
  }, [handleInput]);

  const insertLink = useCallback(() => {
    const url = prompt("URL del enlace:");
    if (url) {
      execCommand("createLink", url);
    }
  }, [execCommand]);

  const ToolbarButton = ({
    icon: Icon,
    onClick,
    tooltip,
    disabled: btnDisabled = false
  }: {
    icon: React.ElementType;
    onClick: () => void;
    tooltip: string;
    disabled?: boolean;
  }) => (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onClick}
            disabled={disabled || btnDisabled}
          >
            <Icon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div
      className={cn(
        "rounded-md border border-input bg-background transition-[color,box-shadow]",
        // Foco canónico del DS (mismo patrón que Input): border-ring + halo ring-ring/30
        isFocused && "border-ring ring-2 ring-ring/30",
        className,
      )}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border p-1 bg-muted/30">
        <ToolbarButton icon={TextB} onClick={() => execCommand("bold")} tooltip="Negrita (Ctrl+B)" />
        <ToolbarButton icon={TextItalic} onClick={() => execCommand("italic")} tooltip="Cursiva (Ctrl+I)" />
        <div className="w-px h-5 bg-border mx-1" />
        <ToolbarButton icon={TextHTwo} onClick={() => insertHeading(2)} tooltip="Encabezado 2" />
        <ToolbarButton icon={TextHThree} onClick={() => insertHeading(3)} tooltip="Encabezado 3" />
        <div className="w-px h-5 bg-border mx-1" />
        <ToolbarButton icon={ListBullets} onClick={() => execCommand("insertUnorderedList")} tooltip="Lista" />
        <ToolbarButton icon={ListNumbers} onClick={() => execCommand("insertOrderedList")} tooltip="Lista numerada" />
        <div className="w-px h-5 bg-border mx-1" />
        <ToolbarButton icon={Quotes} onClick={() => execCommand("formatBlock", "blockquote")} tooltip="Cita" />
        <ToolbarButton icon={Code} onClick={() => execCommand("formatBlock", "pre")} tooltip="Código" />
        <ToolbarButton icon={LinkSimple} onClick={insertLink} tooltip="Enlace" />
        <div className="w-px h-5 bg-border mx-1" />
        <ToolbarButton icon={ArrowUUpLeft} onClick={() => execCommand("undo")} tooltip="Deshacer (Ctrl+Z)" />
        <ToolbarButton icon={ArrowUUpRight} onClick={() => execCommand("redo")} tooltip="Rehacer (Ctrl+Y)" />
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        data-placeholder={placeholder}
        className={cn(
          "p-3 outline-none overflow-auto",
          "prose prose-sm max-w-none dark:prose-invert",
          "prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-foreground",
          "prose-h2:text-lg prose-h2:mt-4 prose-h2:mb-2",
          "prose-h3:text-base prose-h3:mt-3 prose-h3:mb-1",
          "prose-p:text-foreground prose-p:leading-relaxed prose-p:my-2",
          "prose-strong:text-foreground prose-strong:font-semibold",
          "prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5",
          "prose-a:text-primary prose-a:underline",
          "prose-blockquote:border-l-4 prose-blockquote:border-muted-foreground prose-blockquote:pl-4 prose-blockquote:italic",
          "prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm",
          "prose-pre:bg-muted prose-pre:p-3 prose-pre:rounded-md",
          "[&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-muted-foreground [&:empty]:before:pointer-events-none",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        style={{ minHeight }}
      />
    </div>
  );
}
