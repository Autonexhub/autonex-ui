import { ButtonGroup } from "../ui/button-group";
import { Button } from "../ui/button";
import { Kanban, List } from "@phosphor-icons/react";
import { cn } from "../../lib/utils";

/**
 * Toggle tablero/lista — UN solo componente para las páginas del CRM con
 * doble vista (Tareas y Negocios). Origen: extraído del `<div>` segmentado
 * a mano que vivía duplicado en ambas páginas (revisión Ola 2, diff 10);
 * regla Forms: los clusters segmentados componen con `ButtonGroup`.
 * Tamaño `icon-lg` (40 px): vive en toolbars de listado, que van todas a 40 px
 * (regla Toolbars de listado, Bruno 02/09).
 */
export function ViewToggle({
  value,
  onChange,
  boardLabel,
  listLabel,
}: {
  value: 'board' | 'list';
  onChange: (v: 'board' | 'list') => void;
  boardLabel: string;
  listLabel: string;
}) {
  return (
    <ButtonGroup>
      <Button
        variant="outline"
        size="icon-lg"
        aria-label={boardLabel}
        aria-pressed={value === 'board'}
        onClick={() => onChange('board')}
        className={cn(value === 'board' ? 'bg-muted text-foreground' : 'text-muted-foreground')}
      >
        <Kanban className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon-lg"
        aria-label={listLabel}
        aria-pressed={value === 'list'}
        onClick={() => onChange('list')}
        className={cn(value === 'list' ? 'bg-muted text-foreground' : 'text-muted-foreground')}
      >
        <List className="h-4 w-4" />
      </Button>
    </ButtonGroup>
  );
}
