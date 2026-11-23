import type { Meta, StoryObj } from '@storybook/react';
import { KanbanBoard, KanbanCard, KanbanCardSection, KanbanColumn, KanbanColumnTitle, KanbanEmpty } from '@autonexhub/react';

/**
 * Kanban — the one board recipe (Negocios, Tareas, Candidatos, Incidencias). Presentation only: drag & drop is
 * wired by each page (HTML5 or dnd-kit) through props/ref.
 */
const meta: Meta = { title: '2-Molecules/Kanban', tags: ['autodocs'] };
export default meta;

const Card = ({ title, sub, selected }: { title: string; sub: string; selected?: boolean }) => (
  <KanbanCard selected={selected}>
    <KanbanCardSection><p className="text-sm font-medium">{title}</p></KanbanCardSection>
    <KanbanCardSection><p className="text-xs text-muted-foreground">{sub}</p></KanbanCardSection>
  </KanbanCard>
);

export const Board: StoryObj = {
  render: () => (
    <div className="h-[520px]">
      <KanbanBoard>
        <KanbanColumn title={<KanbanColumnTitle label="Pendiente" variant="warning" />} count={2} footer="1 urgente">
          <Card title="Cambio de cita del jueves" sub="Ana López · WhatsApp" selected />
          <Card title="Factura duplicada" sub="Luis Gil · Llamada" />
        </KanbanColumn>
        <KanbanColumn title={<KanbanColumnTitle label="En progreso" variant="info" />} count={1}>
          <Card title="Resultados sin recibir" sub="Marta Ruiz · Web" />
        </KanbanColumn>
        <KanbanColumn title={<KanbanColumnTitle label="Propuesta" dotClassName="bg-[var(--chart-1)]" />} count={0} isDropTarget>
          <KanbanEmpty>Suelta aquí</KanbanEmpty>
        </KanbanColumn>
      </KanbanBoard>
    </div>
  ),
};
