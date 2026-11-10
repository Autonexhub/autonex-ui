import { useCallback, useEffect, useRef, useState, type FocusEvent, type KeyboardEvent } from "react"
import { marked } from "marked"
import TurndownService from "turndown"
import { gfm } from "turndown-plugin-gfm"
import { CircleNotch, FloppyDisk, Pencil, X } from "@phosphor-icons/react"
import { Button } from "../ui/button"
import { cn } from "../../lib/utils"

// Convert markdown → HTML for display/editing
const renderMarkdown = (md: string): string => (md ? (marked.parse(md) as string) : "")

// Convert HTML → markdown for saving
const turndown = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced" })
turndown.use(gfm)

export interface MarkdownContentLabels {
  placeholder: string
  unsavedChanges: string
  editingHint: string
  cancel: string
  save: string
}

export const DEFAULT_MARKDOWN_CONTENT_LABELS: MarkdownContentLabels = {
  placeholder: "Añade contenido...",
  unsavedChanges: "Cambios sin guardar",
  editingHint: "Editando (⌘⏎ guardar, Esc cancelar)",
  cancel: "Cancelar",
  save: "Guardar",
}

export interface MarkdownContentProps {
  value: string
  onChange: (markdown: string) => void
  onSave?: () => Promise<void>
  /** Sustituye a `labels.placeholder`. */
  placeholder?: string
  editable?: boolean
  className?: string
  compact?: boolean
  /** Save on blur instead of explicit save button */
  autoSave?: boolean
  labels?: Partial<MarkdownContentLabels>
}

/**
 * Markdown content viewer/editor with WYSIWYG editing.
 * - Displays rendered markdown with prose styling
 * - Click to edit in place (contentEditable)
 * - Converts back to markdown on save
 */
export function MarkdownContent({
  value,
  onChange,
  onSave,
  placeholder,
  editable = true,
  className,
  compact = false,
  autoSave = true,
  labels,
}: MarkdownContentProps) {
  const l = { ...DEFAULT_MARKDOWN_CONTENT_LABELS, ...labels }
  const displayPlaceholder = placeholder ?? l.placeholder
  const [isEditing, setIsEditing] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const originalRef = useRef(value)

  // Update original when value prop changes (e.g., from server)
  useEffect(() => {
    if (!isEditing) {
      originalRef.current = value
    }
  }, [value, isEditing])

  const handleEdit = useCallback(() => {
    if (!editable) return
    setIsEditing(true)
    setHasChanges(false)
    setTimeout(() => contentRef.current?.focus(), 50)
  }, [editable])

  const handleInput = useCallback(() => {
    if (contentRef.current) {
      const html = contentRef.current.innerHTML
      const md = turndown.turndown(html)
      setHasChanges(md !== originalRef.current)
    }
  }, [])

  const handleSave = useCallback(async () => {
    if (!contentRef.current) return

    const html = contentRef.current.innerHTML
    const md = turndown.turndown(html)

    if (md === originalRef.current) {
      setIsEditing(false)
      setHasChanges(false)
      return
    }

    setIsSaving(true)
    try {
      onChange(md)
      originalRef.current = md
      if (onSave) {
        await onSave()
      }
      setHasChanges(false)
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to save:", error)
    } finally {
      setIsSaving(false)
    }
  }, [onChange, onSave])

  const handleCancel = useCallback(() => {
    if (contentRef.current) {
      contentRef.current.innerHTML = renderMarkdown(originalRef.current)
    }
    setHasChanges(false)
    setIsEditing(false)
  }, [])

  const handleBlur = useCallback(
    (e: FocusEvent) => {
      // Don't save if clicking on a button inside the container
      const relatedTarget = e.relatedTarget as HTMLElement
      if (relatedTarget?.closest("[data-markdown-action]")) {
        return
      }

      if (autoSave && hasChanges) {
        handleSave()
      }
    },
    [autoSave, hasChanges, handleSave],
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Cmd/Ctrl + Enter to save
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        handleSave()
      }
      // Escape to cancel
      if (e.key === "Escape") {
        e.preventDefault()
        handleCancel()
      }
    },
    [handleSave, handleCancel],
  )

  const isEmpty = !value || value.trim() === ""

  // Clases prose compartidas para contenido markdown renderizado (mismas que la KB)
  const proseClasses = cn(
    "prose prose-sm max-w-none dark:prose-invert",
    "prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-foreground",
    "prose-h1:text-xl prose-h1:mb-3",
    "prose-h2:text-lg prose-h2:mt-6 prose-h2:mb-2",
    "prose-h3:text-base prose-h3:mt-4 prose-h3:mb-1",
    "prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:my-2",
    "prose-strong:text-foreground prose-strong:font-semibold",
    "prose-li:text-muted-foreground prose-li:my-0.5",
    "prose-ul:my-2 prose-ol:my-2",
    "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
    "prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:before:content-none prose-code:after:content-none",
    "prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:text-xs",
    "prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground",
    "[&_table]:w-full [&_table]:border-collapse [&_table]:text-xs [&_table]:my-3",
    "[&_table]:border [&_table]:border-border [&_table]:rounded-md [&_table]:overflow-hidden",
    "[&_thead]:bg-muted/50",
    "[&_th]:px-2 [&_th]:py-1.5 [&_th]:text-left [&_th]:font-semibold [&_th]:text-foreground [&_th]:border-b [&_th]:border-border",
    "[&_td]:px-2 [&_td]:py-1.5 [&_td]:border-b [&_td]:border-border [&_td]:text-muted-foreground",
    "[&_tr:last-child_td]:border-b-0",
    "[&_tbody_tr:hover]:bg-muted/30",
    "[&_hr]:border-border [&_hr]:my-4",
    compact && "prose-p:my-1 prose-ul:my-1 prose-ol:my-1",
    className,
  )

  return (
    <div className="relative group">
      {/* Edit indicator bar */}
      {isEditing && !autoSave && (
        <div className="mb-2 flex items-center justify-between bg-muted/40 border border-border rounded-md px-3 py-1.5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Pencil className="h-3 w-3" />
            <span>{hasChanges ? l.unsavedChanges : l.editingHint}</span>
          </div>
          <div className="flex gap-1.5">
            <Button
              data-markdown-action
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              disabled={isSaving}
              className="h-6 px-2 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              {l.cancel}
            </Button>
            <Button
              data-markdown-action
              size="sm"
              onClick={handleSave}
              disabled={isSaving || !hasChanges}
              className="h-6 px-2 text-xs"
            >
              {isSaving ? <CircleNotch className="h-3 w-3 mr-1 animate-spin" /> : <FloppyDisk className="h-3 w-3 mr-1" />}
              {l.save}
            </Button>
          </div>
        </div>
      )}

      {/* Content area */}
      <div
        ref={contentRef}
        contentEditable={isEditing}
        suppressContentEditableWarning
        onClick={!isEditing && editable ? handleEdit : undefined}
        onInput={handleInput}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          proseClasses,
          "min-h-[1.5em]",
          editable && !isEditing && "cursor-pointer hover:bg-muted/30 rounded-md transition-colors",
          isEditing && "outline-none ring-2 ring-primary/20 rounded-md p-2 -m-2 bg-background",
          isEmpty && !isEditing && "text-muted-foreground italic",
        )}
        dangerouslySetInnerHTML={{
          __html: isEmpty && !isEditing ? displayPlaceholder : renderMarkdown(value),
        }}
      />

      {/* Edit hint on hover */}
      {editable && !isEditing && !isEmpty && (
        <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="sm" onClick={handleEdit} className="h-6 px-2 text-xs text-muted-foreground">
            <Pencil className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  )
}

/**
 * Read-only markdown renderer for comments, etc.
 */
export function MarkdownView({ content, className }: { content: string; className?: string }) {
  const proseClasses = cn(
    "prose prose-sm max-w-none dark:prose-invert",
    "prose-p:text-foreground prose-p:leading-relaxed prose-p:my-1",
    "prose-strong:text-foreground prose-strong:font-semibold",
    "prose-li:text-foreground prose-li:my-0.5",
    "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
    "prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:before:content-none prose-code:after:content-none",
    "prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-blockquote:my-2",
    className,
  )

  return <div className={proseClasses} dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
}
