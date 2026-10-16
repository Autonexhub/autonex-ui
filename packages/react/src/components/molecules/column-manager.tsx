import { useState, useEffect, useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { SquaresFour as LayoutGrid, DotsSix as GripHorizontal } from "@phosphor-icons/react";

export interface ColumnDefinition {
  id: string;
  label: string;
  width?: string;
  required?: boolean; // Cannot be hidden
  /** Oculta la columna la primera vez. El usuario puede activarla desde Columnas.
   *  Para columnas que casi siempre vienen vacías y solo roban ancho. */
  hiddenByDefault?: boolean;
}

interface ColumnManagerProps {
  columns: ColumnDefinition[];
  visibleColumns: string[];
  columnOrder: string[];
  onVisibilityChange: (columnId: string, visible: boolean) => void;
  onOrderChange: (newOrder: string[]) => void;
  /** Etiqueta del botón (default: "Columnas"). Ej. "Tarjetas" en tableros. */
  label?: string;
  /** Descripción del popover (default: "Arrastra para reordenar"). */
  description?: string;
  /** Acción secundaria opcional, ej. "Gestionar parámetros…". */
  footer?: React.ReactNode;
}

interface SortableItemProps {
  column: ColumnDefinition;
  isVisible: boolean;
  onToggle: (visible: boolean) => void;
}

function SortableItem({ column, isVisible, onToggle }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 py-1.5 px-1 rounded-sm hover:bg-muted/50"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-0.5"
      >
        <GripHorizontal className="h-4 w-4" />
      </button>
      <Checkbox
        id={`col-${column.id}`}
        checked={isVisible}
        onCheckedChange={(checked) => onToggle(!!checked)}
        disabled={column.required}
      />
      <label
        htmlFor={`col-${column.id}`}
        className={`text-sm flex-1 cursor-pointer ${column.required ? 'text-muted-foreground' : ''}`}
      >
        {column.label}
      </label>
    </div>
  );
}

export function ColumnManager({
  columns,
  visibleColumns,
  columnOrder,
  onVisibilityChange,
  onOrderChange,
  label,
  description,
  footer,
}: ColumnManagerProps) {
  const [open, setOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Sort columns by the current order
  const orderedColumns = [...columns].sort((a, b) => {
    const aIndex = columnOrder.indexOf(a.id);
    const bIndex = columnOrder.indexOf(b.id);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = columnOrder.indexOf(active.id as string);
      const newIndex = columnOrder.indexOf(over.id as string);
      const newOrder = arrayMove(columnOrder, oldIndex, newIndex);
      onOrderChange(newOrder);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="default" className="gap-2">
          <LayoutGrid className="h-4 w-4" />
          {label ?? 'Columnas'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="end">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1 pb-2">
          {description ?? 'Arrastra para reordenar'}
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={orderedColumns.map(c => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {orderedColumns.map((column) => (
              <SortableItem
                key={column.id}
                column={column}
                isVisible={visibleColumns.includes(column.id)}
                onToggle={(visible) => onVisibilityChange(column.id, visible)}
              />
            ))}
          </SortableContext>
        </DndContext>
        {footer && <div className="border-t border-border mt-2 pt-2 px-1">{footer}</div>}
      </PopoverContent>
    </Popover>
  );
}

/**
 * Mezcla un orden guardado con el orden por defecto: las columnas NUEVAS
 * (no presentes en lo guardado) se insertan en su posición por defecto
 * (tras la columna que las precede en defaultOrder), no al final.
 */
export function mergeColumnOrder(stored: string[], defaultOrder: string[]): string[] {
  const merged = stored.filter((id) => defaultOrder.includes(id));
  defaultOrder.forEach((id, idx) => {
    if (merged.includes(id)) return;
    const prevId = defaultOrder[idx - 1];
    const pos = prevId && merged.includes(prevId) ? merged.indexOf(prevId) + 1 : idx === 0 ? 0 : merged.length;
    merged.splice(pos, 0, id);
  });
  return merged;
}

/**
 * Orden de columnas persistido para tablas cuyo catálogo de columnas es
 * DINÁMICO (parámetros custom que llegan async): guarda el último orden
 * explícito y lo mezcla con el orden por defecto vigente, de modo que las
 * columnas nuevas aparecen en su posición por defecto.
 */
export function useColumnOrder(storageKey: string, defaultOrder: string[]) {
  const [raw, setRaw] = useState<string[]>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) ?? 'null');
      return Array.isArray(stored) ? stored : [];
    } catch { return []; }
  });
  const defaultKey = defaultOrder.join('\u0000');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const order = useMemo(() => mergeColumnOrder(raw, defaultOrder), [raw, defaultKey]);
  const setOrder = (next: string[]) => {
    setRaw(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* no persistido */ }
  };
  return { order, setOrder };
}

// Hook for managing column state with localStorage persistence
export function useColumnManager(
  storageKey: string,
  defaultColumns: ColumnDefinition[]
) {
  const defaultVisibleIds = defaultColumns.filter(c => !c.hiddenByDefault).map(c => c.id);
  const defaultOrder = defaultColumns.map(c => c.id);

  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(`${storageKey}-visible`);
      if (stored) {
        const parsed = JSON.parse(stored) as string[];
        // Add any NEW columns that weren't in storage (so new columns show up)
        const newColumns = defaultVisibleIds.filter(id => !parsed.includes(id) && !localStorage.getItem(`${storageKey}-hidden-${id}`));
        return [...parsed, ...newColumns];
      }
      return defaultVisibleIds;
    } catch {
      return defaultVisibleIds;
    }
  });

  const [columnOrder, setColumnOrder] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(`${storageKey}-order`);
      if (stored) {
        const parsed = JSON.parse(stored) as string[];
        // Insert any NEW columns at their DEFAULT position (after the column
        // that precedes them in defaultOrder), not dumped at the end — a user
        // with stored config would otherwise get e.g. "Canal" behind Acciones.
        return mergeColumnOrder(parsed, defaultOrder);
      }
      return defaultOrder;
    } catch {
      return defaultOrder;
    }
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(`${storageKey}-visible`, JSON.stringify(visibleColumns));
  }, [storageKey, visibleColumns]);

  useEffect(() => {
    localStorage.setItem(`${storageKey}-order`, JSON.stringify(columnOrder));
  }, [storageKey, columnOrder]);

  const handleVisibilityChange = (columnId: string, visible: boolean) => {
    setVisibleColumns(prev =>
      visible
        ? [...prev, columnId]
        : prev.filter(id => id !== columnId)
    );
  };

  const handleOrderChange = (newOrder: string[]) => {
    setColumnOrder(newOrder);
  };

  // Get ordered and visible columns
  const getVisibleOrderedColumns = () => {
    return columnOrder
      .filter(id => visibleColumns.includes(id))
      .map(id => defaultColumns.find(c => c.id === id)!)
      .filter(Boolean);
  };

  return {
    visibleColumns,
    columnOrder,
    handleVisibilityChange,
    handleOrderChange,
    getVisibleOrderedColumns,
  };
}
