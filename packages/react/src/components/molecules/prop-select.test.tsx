import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { PropSelect } from "./prop-select";
import { PersonAvatar } from "./person-avatar";
import { TagChip } from "./tag-chip";
import { KanbanBoard } from "./kanban";

const people = [
  { id: 1, label: "Ana López", group: "Recepción", person: { name: "Ana López" } },
  { id: 2, label: "Luis Gil", group: "Dirección", person: { name: "Luis Gil", avatar_url: "https://example.com/l.png" } },
];

describe("PropSelect", () => {
  it("sin onChange es solo lectura", () => {
    render(<PropSelect value={null} options={people} emptyLabel="Sin responsable" ariaLabel="Cambiar responsable" />);
    expect(screen.getByText("Sin responsable")).toBeTruthy();
    expect(screen.queryByLabelText("Cambiar responsable")).toBeNull();
  });

  it("abre el menú, agrupa y elige", () => {
    const onChange = vi.fn();
    render(<PropSelect value={{ id: 1, label: "Ana López" }} options={people} onChange={onChange} emptyLabel="Sin responsable" ariaLabel="Cambiar responsable" />);
    fireEvent.click(screen.getByLabelText("Cambiar responsable"));
    expect(screen.getByText("Dirección")).toBeTruthy();
    expect(screen.queryByPlaceholderText("Buscar…")).toBeNull();
    fireEvent.click(screen.getByText("Luis Gil"));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("buscador con más de 7 opciones y acciones al pie", () => {
    const onManage = vi.fn();
    const many = Array.from({ length: 9 }, (_, i) => ({ id: `c${i}`, label: `Categoría ${i}`, color: "var(--chart-1)" }));
    render(
      <PropSelect value={null} options={many} onChange={() => {}} emptyLabel="Sin categoría" ariaLabel="Cambiar categoría"
        actions={[{ label: "Gestionar categorías", onSelect: onManage }]} />,
    );
    fireEvent.click(screen.getByLabelText("Cambiar categoría"));
    expect(screen.getByPlaceholderText("Buscar…")).toBeTruthy();
    fireEvent.click(screen.getByText("Gestionar categorías"));
    expect(onManage).toHaveBeenCalled();
  });
});

describe("PersonAvatar", () => {
  it("iniciales de respaldo y hueco sin asignar", () => {
    render(<><PersonAvatar person={{ name: "Ana López" }} /><PersonAvatar person={null} size="xs" /></>);
    expect(screen.getByText("AL")).toBeTruthy();
    expect(screen.getByLabelText("Sin asignar")).toBeTruthy();
  });
});

describe("TagChip", () => {
  it("punto de color, vacío y aspa", () => {
    const onRemove = vi.fn();
    const { rerender } = render(<TagChip label="Facturación" color="#f00" onRemove={onRemove} />);
    fireEvent.click(screen.getByLabelText("Quitar Facturación"));
    expect(onRemove).toHaveBeenCalled();
    rerender(<TagChip emptyLabel="Sin categoría" />);
    expect(screen.getByText("Sin categoría")).toBeTruthy();
  });

  it("con onClick es un botón", () => {
    const onClick = vi.fn();
    render(<TagChip label="Citas" onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalled();
  });
});

describe("KanbanBoard", () => {
  it("sin desvanecido no hay máscara", () => {
    const { container } = render(<KanbanBoard fadeEdges={false}><div /></KanbanBoard>);
    expect((container.firstChild as HTMLElement).style.maskImage).toBeFalsy();
  });
});
