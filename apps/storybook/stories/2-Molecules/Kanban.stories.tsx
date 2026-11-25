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

const many = ['Nuevo', 'Contactado', 'Cualificado', 'Propuesta', 'Negociación', 'Ganado', 'Perdido'];

/**
 * Más columnas de las que caben: al hacer scroll los bordes se desvanecen 24px (máscara, solo en el lado que aún
 * tiene contenido). `fadeEdges={false}` lo quita; `fadeWidth` cambia el ancho.
 */
export const EdgeFade: StoryObj = {
  render: () => (
    <div className="h-[360px] w-[720px]">
      <KanbanBoard>
        {many.map((name, i) => (
          <KanbanColumn key={name} title={<KanbanColumnTitle label={name} />} count={i % 3}>
            {Array.from({ length: i % 3 }, (_, j) => <Card key={j} title={`Negocio ${i}-${j}`} sub="Ana López" />)}
            {i % 3 === 0 && <KanbanEmpty>Sin negocios</KanbanEmpty>}
          </KanbanColumn>
        ))}
      </KanbanBoard>
    </div>
  ),
};

export const WithoutFade: StoryObj = {
  render: () => (
    <div className="h-[360px] w-[720px]">
      <KanbanBoard fadeEdges={false}>
        {many.map((name) => (
          <KanbanColumn key={name} title={<KanbanColumnTitle label={name} />} count={0}>
            <KanbanEmpty>Sin negocios</KanbanEmpty>
          </KanbanColumn>
        ))}
      </KanbanBoard>
    </div>
  ),
};
