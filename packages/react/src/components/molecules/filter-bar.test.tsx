import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import {
  FILTER_NULL,
  FilterBar,
  applyLocalFilters,
  groupItems,
  resolveDateRange,
  type FilterBarState,
  type FilterField,
} from "./filter-bar";

const status: FilterField = {
  key: "status",
  label: "Estado",
  options: [
    { value: "open", label: "Abierta" },
    { value: "closed", label: "Cerrada" },
  ],
};
const city: FilterField = {
  key: "city",
  label: "Ciudad",
  options: ["Madrid", "Sevilla", "Valencia", "Bilbao", "Málaga", "Zaragoza", "Murcia", "Palma"].map((c) => ({ value: c, label: c })),
};

function Harness({ initial, fields = [status, city], onChangeSpy }: {
  initial: FilterBarState;
  fields?: FilterField[];
  onChangeSpy?: (s: FilterBarState) => void;
}) {
  const [state, setState] = useState(initial);
  return (
    <FilterBar
      fields={fields}
      value={state}
      onChange={(s) => { onChangeSpy?.(s); setState(s); }}
    />
  );
}

describe("FilterBar", () => {
  it("muestra lo filtrado como píldoras y el aspa lo quita", () => {
    const spy = vi.fn();
    render(<Harness initial={{ values: { status: ["open"] }, query: "ana" }} onChangeSpy={spy} />);
    expect(screen.getByText("Estado: Abierta")).toBeTruthy();
    expect(screen.getByText("Búsqueda: «ana»")).toBeTruthy();
    fireEvent.click(screen.getByLabelText("Quitar Estado: Abierta"));
    expect(spy).toHaveBeenLastCalledWith(expect.objectContaining({ values: { status: [] } }));
    expect(screen.queryByText("Estado: Abierta")).toBeNull();
  });

  it("Limpiar todo vacía valores, búsqueda y fecha, y aplica las píldoras propias", () => {
    const spy = vi.fn();
    type S = FilterBarState & { recurring?: boolean };
    function WithExtra() {
      const [state, setState] = useState<S>({ values: { status: ["open"] }, query: "x", recurring: true, sort: "new" });
      return (
        <FilterBar<S>
          fields={[status]}
          value={state}
          onChange={(s) => { spy(s); setState(s); }}
          extraChips={state.recurring ? [{ id: "recurring", label: "Recurrentes", clear: (s) => ({ ...s, recurring: undefined }) }] : []}
        />
      );
    }
    render(<WithExtra />);
    expect(screen.getByText("Recurrentes")).toBeTruthy();
    fireEvent.click(screen.getByText("Limpiar todo"));
    expect(spy).toHaveBeenLastCalledWith({ values: {}, query: undefined, dateRange: { preset: "all" }, recurring: undefined, sort: "new" });
  });

  it("pulsar una píldora reabre su filtro", () => {
    render(<Harness initial={{ values: { status: ["open"] } }} />);
    expect(screen.queryByText("Cerrada")).toBeNull();
    fireEvent.click(screen.getByLabelText("Cambiar Estado: Abierta"));
    expect(screen.getByText("Cerrada")).toBeTruthy();
  });

  it("el botón reserva el hueco del contador (no se mueve al marcar)", () => {
    render(<Harness initial={{ values: {} }} />);
    const button = screen.getByText("Estado").closest("button")!;
    expect(button.querySelector(".invisible")).toBeTruthy();
  });

  it("buscador solo con más de 7 opciones", () => {
    render(<Harness initial={{ values: {} }} />);
    fireEvent.click(screen.getByText("Estado").closest("button")!);
    expect(screen.queryByPlaceholderText("Buscar estado…")).toBeNull();
    fireEvent.keyDown(document.activeElement ?? document.body, { key: "Escape" });
    fireEvent.click(screen.getByText("Ciudad").closest("button")!);
    expect(screen.getByPlaceholderText("Buscar ciudad…")).toBeTruthy();
  });

  it("los campos más allá de inlineLimit van a Más filtros", () => {
    const extra: FilterField = { key: "kind", label: "Tipo", options: [{ value: "a", label: "A" }] };
    const four: FilterField = { key: "four", label: "Cuarto", options: [{ value: "b", label: "B" }] };
    render(<Harness initial={{ values: {} }} fields={[status, city, extra, four]} />);
    expect(screen.getByLabelText("Más filtros")).toBeTruthy();
    expect(screen.queryByText("Cuarto")).toBeNull();
  });

  it("disabled deshabilita los controles", () => {
    render(<FilterBar fields={[status]} value={{ values: {} }} onChange={() => {}} disabled />);
    expect((screen.getByText("Estado").closest("button") as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByPlaceholderText("Buscar…") as HTMLInputElement).disabled).toBe(true);
  });
});

describe("resolveDateRange", () => {
  const now = new Date(2026, 10, 25, 10, 0); // miércoles 25/11/2026
  it("presets en fecha local", () => {
    expect(resolveDateRange({ preset: "today" }, now)).toEqual({ from: "2026-11-25", to: "2026-11-25" });
    expect(resolveDateRange({ preset: "yesterday" }, now)).toEqual({ from: "2026-11-24", to: "2026-11-24" });
    expect(resolveDateRange({ preset: "this_week" }, now)).toEqual({ from: "2026-11-23", to: "2026-11-29" });
    expect(resolveDateRange({ preset: "last_week" }, now)).toEqual({ from: "2026-11-16", to: "2026-11-22" });
    expect(resolveDateRange({ preset: "this_month" }, now)).toEqual({ from: "2026-11-01", to: "2026-11-30" });
    expect(resolveDateRange({ preset: "last_month" }, now)).toEqual({ from: "2026-10-01", to: "2026-10-31" });
    expect(resolveDateRange({ preset: "custom", from: "2026-01-01" }, now)).toEqual({ from: "2026-01-01", to: undefined });
    expect(resolveDateRange({ preset: "all" }, now)).toEqual({});
  });
});

describe("applyLocalFilters / groupItems", () => {
  const items = [
    { id: 1, status: "open", tags: ["a"], name: "Ana", at: "2026-11-25T10:00:00" },
    { id: 2, status: null, tags: [], name: "Luis", at: "2026-10-02" },
    { id: 3, status: "closed", tags: ["b", "a"], name: "Marta", at: null },
  ];
  const adapters = {
    getFieldValue: (i: (typeof items)[number], k: string) => (k === "tags" ? i.tags : i.status),
    getDate: (i: (typeof items)[number]) => i.at,
    search: (i: (typeof items)[number]) => i.name,
  };
  it("valores, Sin …, arrays, búsqueda y fecha", () => {
    const ids = (s: FilterBarState) => applyLocalFilters(items, s, adapters).map((i) => i.id);
    expect(ids({ values: { status: ["open"] } })).toEqual([1]);
    expect(ids({ values: { status: [FILTER_NULL] } })).toEqual([2]);
    expect(ids({ values: { status: ["open", FILTER_NULL] } })).toEqual([1, 2]);
    expect(ids({ values: { tags: ["a"] } })).toEqual([1, 3]);
    expect(ids({ values: {}, query: "MAR" })).toEqual([3]);
    expect(ids({ values: {}, dateField: "at", dateRange: { preset: "custom", from: "2026-11-01", to: "2026-11-30" } })).toEqual([1]);
  });
  it("agrupa en orden de aparición", () => {
    const g = groupItems(items, "status", (i) => ({ key: i.status ?? "none", label: i.status ?? "—" }));
    expect(g.map((x) => [x.key, x.items.length])).toEqual([["open", 1], ["none", 1], ["closed", 1]]);
    expect(groupItems(items, undefined, () => ({ key: "", label: "" }))[0].items).toHaveLength(3);
  });
});
