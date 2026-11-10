import { type MouseEvent, type ReactNode } from "react"
import {
  Archive,
  DotsThreeVertical,
  DownloadSimple,
  Eye,
  FileCode,
  FileText,
  Folder,
  FolderOpen,
  Image as ImageIcon,
  LinkSimple,
  MusicNote,
  Trash,
  VideoCamera,
} from "@phosphor-icons/react"
import { Card } from "../ui/card"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "../ui/context-menu"
import { EmptyState } from "../molecules/empty-state"
import { cn } from "../../lib/utils"
import { DEFAULT_EXTRAS_LOCALE } from "./format"

/** Archivo del Drive. */
export interface DriveFile {
  id: number
  original_name: string
  storage_key: string
  mime_type: string
  file_size: number
  updated_at: string
}

/** Carpeta del Drive. */
export interface DriveFolder {
  id: number
  name: string
  path: string
  updated_at: string
  file_count?: number
}

export interface FileContextMenuLabels {
  open: string
  preview: string
  rename: string
  download: string
  share: string
  delete: string
}

export const DEFAULT_FILE_CONTEXT_MENU_LABELS: FileContextMenuLabels = {
  open: "Abrir",
  preview: "Vista previa",
  rename: "Renombrar",
  download: "Descargar",
  share: "Compartir",
  delete: "Eliminar",
}

export interface FileContextMenuProps {
  children: ReactNode
  type: "file" | "folder"
  onOpen: () => void
  onRename?: () => void
  onDownload?: () => void
  onShare?: () => void
  onDelete?: () => void
  onPreview?: () => void
  labels?: Partial<FileContextMenuLabels>
}

export function FileContextMenu({
  children,
  type,
  onOpen,
  onRename,
  onDownload,
  onShare,
  onDelete,
  onPreview,
  labels,
}: FileContextMenuProps) {
  const l = { ...DEFAULT_FILE_CONTEXT_MENU_LABELS, ...labels }
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuItem onClick={onOpen}>
          <FolderOpen className="mr-2 h-4 w-4" />
          {l.open}
        </ContextMenuItem>

        {onPreview && type === "file" && (
          <ContextMenuItem onClick={onPreview}>
            <Eye className="mr-2 h-4 w-4" />
            {l.preview}
          </ContextMenuItem>
        )}

        {onRename && (
          <ContextMenuItem onClick={onRename}>
            <FileText className="mr-2 h-4 w-4" />
            {l.rename}
          </ContextMenuItem>
        )}

        {onDownload && type === "file" && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={onDownload}>
              <DownloadSimple className="mr-2 h-4 w-4" />
              {l.download}
            </ContextMenuItem>
          </>
        )}

        {onShare && type === "file" && (
          <ContextMenuItem onClick={onShare}>
            <LinkSimple className="mr-2 h-4 w-4" />
            {l.share}
          </ContextMenuItem>
        )}

        {onDelete && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
              <Trash className="mr-2 h-4 w-4" />
              {l.delete}
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
}

export interface FileCardLabels extends FileContextMenuLabels {
  today: string
  yesterday: string
  /** "Hace 3 días" */
  daysAgo: (days: number) => string
  /** "12 archivos" */
  filesCount: (count: number) => string
}

export const DEFAULT_FILE_CARD_LABELS: FileCardLabels = {
  ...DEFAULT_FILE_CONTEXT_MENU_LABELS,
  today: "Hoy",
  yesterday: "Ayer",
  daysAgo: (days) => `Hace ${days} días`,
  filesCount: (count) => `${count} archivos`,
}

export interface FileCardProps {
  item: DriveFile | DriveFolder
  type: "file" | "folder"
  onOpen: (item: DriveFile | DriveFolder) => void
  onDownload?: (item: DriveFile) => void
  onShare?: (item: DriveFile) => void
  onDelete?: (item: DriveFile | DriveFolder) => void
  onRename?: (item: DriveFile | DriveFolder) => void
  labels?: Partial<FileCardLabels>
  /** Etiqueta BCP-47 para las fechas (por defecto es-ES). */
  locale?: string
}

const getFileIcon = (item: DriveFile | DriveFolder, type: "file" | "folder") => {
  if (type === "folder") {
    return <Folder className="w-8 h-8 text-muted-foreground" />
  }

  const file = item as DriveFile
  const mime = file.mime_type || ""

  if (mime.startsWith("image/")) return <ImageIcon className="w-8 h-8 text-muted-foreground" />
  if (mime.startsWith("audio/")) return <MusicNote className="w-8 h-8 text-muted-foreground" />
  if (mime.startsWith("video/")) return <VideoCamera className="w-8 h-8 text-muted-foreground" />
  if (mime.includes("pdf")) return <FileText className="w-8 h-8 text-muted-foreground" />
  if (mime.includes("zip") || mime.includes("rar") || mime.includes("tar")) {
    return <Archive className="w-8 h-8 text-muted-foreground" />
  }
  if (mime.includes("javascript") || mime.includes("json") || mime.includes("xml")) {
    return <FileCode className="w-8 h-8 text-muted-foreground" />
  }
  return <FileText className="w-8 h-8 text-muted-foreground" />
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}

const formatDate = (dateString: string, l: FileCardLabels, locale: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return l.today
  if (diffDays === 1) return l.yesterday
  if (diffDays < 7) return l.daysAgo(diffDays)

  return date.toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  })
}

export function FileCard({
  item,
  type,
  onOpen,
  onDownload,
  onShare,
  onDelete,
  onRename,
  labels,
  locale = DEFAULT_EXTRAS_LOCALE,
}: FileCardProps) {
  const l = { ...DEFAULT_FILE_CARD_LABELS, ...labels }

  const handleCardClick = (e: MouseEvent) => {
    // Don't trigger if clicking on menu
    if ((e.target as HTMLElement).closest("[data-dropdown-trigger]")) {
      return
    }
    onOpen(item)
  }

  const displayName = type === "folder" ? (item as DriveFolder).name : (item as DriveFile).original_name
  const fileSize = type === "file" ? (item as DriveFile).file_size : 0
  const fileCount = type === "folder" ? (item as DriveFolder).file_count : undefined

  return (
    <FileContextMenu
      type={type}
      labels={l}
      onOpen={() => onOpen(item)}
      onRename={onRename ? () => onRename(item) : undefined}
      onDownload={onDownload && type === "file" ? () => onDownload(item as DriveFile) : undefined}
      onShare={onShare && type === "file" ? () => onShare(item as DriveFile) : undefined}
      onDelete={onDelete ? () => onDelete(item) : undefined}
      onPreview={type === "file" ? () => onOpen(item) : undefined}
    >
      <Card
        className={cn("group relative cursor-pointer transition-all hover:border-primary/50", "flex flex-col overflow-hidden")}
        onClick={handleCardClick}
      >
        {/* Thumbnail area */}
        <div className="aspect-square bg-muted/30 flex items-center justify-center relative overflow-hidden">
          {/* Menu button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild data-dropdown-trigger>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm z-10 h-8 w-8"
                onClick={(e) => e.stopPropagation()}
              >
                <DotsThreeVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onOpen(item)
                }}
              >
                {l.open}
              </DropdownMenuItem>
              {onRename && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onRename(item)
                  }}
                >
                  {l.rename}
                </DropdownMenuItem>
              )}
              {onShare && type === "file" && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onShare(item as DriveFile)
                  }}
                >
                  {l.share}
                </DropdownMenuItem>
              )}
              {onDownload && type === "file" && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onDownload(item as DriveFile)
                  }}
                >
                  {l.download}
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(item)
                  }}
                  className="text-destructive focus:text-destructive"
                >
                  {l.delete}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Icon (will be replaced with thumbnails in Phase 2) */}
          <div className="transition-transform group-hover:scale-110">{getFileIcon(item, type)}</div>
        </div>

        {/* File info */}
        <div className="p-3 space-y-1">
          <p className="text-sm font-medium truncate" title={displayName}>
            {displayName}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatDate(item.updated_at, l, locale)}</span>
            {type === "file" ? (
              <span>{formatFileSize(fileSize)}</span>
            ) : (
              fileCount !== undefined && <span>{l.filesCount(fileCount)}</span>
            )}
          </div>
        </div>
      </Card>
    </FileContextMenu>
  )
}

export interface GridViewLabels {
  emptyTitle: string
}

export const DEFAULT_GRID_VIEW_LABELS: GridViewLabels = {
  emptyTitle: "No hay archivos en esta carpeta",
}

export interface GridViewProps {
  folders: DriveFolder[]
  files: DriveFile[]
  onOpenFolder: (folderId: number) => void
  onOpenFile: (file: DriveFile) => void
  onDownload?: (file: DriveFile) => void
  onShare?: (file: DriveFile) => void
  onDeleteFile?: (file: DriveFile) => void
  onDeleteFolder?: (folder: DriveFolder) => void
  onRenameFile?: (file: DriveFile) => void
  onRenameFolder?: (folder: DriveFolder) => void
  /** Textos del grid y de las tarjetas. */
  labels?: Partial<GridViewLabels & FileCardLabels>
  locale?: string
}

export function GridView({
  folders,
  files,
  onOpenFolder,
  onOpenFile,
  onDownload,
  onShare,
  onDeleteFile,
  onDeleteFolder,
  onRenameFile,
  onRenameFolder,
  labels,
  locale,
}: GridViewProps) {
  const emptyTitle = labels?.emptyTitle ?? DEFAULT_GRID_VIEW_LABELS.emptyTitle

  if (folders.length === 0 && files.length === 0) {
    return <EmptyState icon={<FolderOpen className="h-8 w-8" />} title={emptyTitle} />
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {/* Folders first */}
      {folders.map((folder) => (
        <FileCard
          key={`folder-${folder.id}`}
          item={folder}
          type="folder"
          labels={labels}
          locale={locale}
          onOpen={() => onOpenFolder(folder.id)}
          onDelete={onDeleteFolder ? () => onDeleteFolder(folder) : undefined}
          onRename={onRenameFolder ? () => onRenameFolder(folder) : undefined}
        />
      ))}

      {/* Then files */}
      {files.map((file) => (
        <FileCard
          key={`file-${file.id}`}
          item={file}
          type="file"
          labels={labels}
          locale={locale}
          onOpen={() => onOpenFile(file)}
          onDownload={onDownload ? () => onDownload(file) : undefined}
          onShare={onShare ? () => onShare(file) : undefined}
          onDelete={onDeleteFile ? () => onDeleteFile(file) : undefined}
          onRename={onRenameFile ? () => onRenameFile(file) : undefined}
        />
      ))}
    </div>
  )
}
