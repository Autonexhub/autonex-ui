import { describe, expect, it, vi } from "vitest";
import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import {
  DimensionBars, FindingCard, GateBadge, GateRow, RapVerdictBadge, SeverityBadge, Sparkline, ToolCallTimeline,
  TranscriptEvidence, formatOffset, sparklineSegments, type TranscriptEvidenceHandle,
} from "./index";

describe("formatOffset", () => {
  it("m:ss, h:mm:ss y guion", () => {
    expect(formatOffset(0)).toBe("0:00");
    expect(formatOffset(65.7)).toBe("1:05");
    expect(formatOffset(3725)).toBe("1:02:05");
    expect(formatOffset(null)).toBe("—");
  });
});

describe("badges", () => {
  it("GateBadge: abierta, cerrada, sin medir y baja confianza", () => {
    const { rerender, container } = render(<GateBadge state={true} />);
    expect(screen.getByText("Abierta")).toBeTruthy();
    rerender(<GateBadge state={false} label="Resolución" />);
    expect(screen.getByText("Cerrada")).toBeTruthy();
    expect(screen.getByText("Resolución ·")).toBeTruthy();
    rerender(<GateBadge state={null} lowConfidence />);
    expect(screen.getByText("Sin medir")).toBeTruthy();
    expect(screen.getByLabelText("baja confianza")).toBeTruthy();
    expect(container.querySelector("[data-state=unmeasured]")).toBeTruthy();
  });
  it("RapVerdictBadge y SeverityBadge en español; desconocido = guion", () => {
    render(<><RapVerdictBadge verdict="fail" /><RapVerdictBadge verdict={null} /><SeverityBadge severity="critical" /></>);
    expect(screen.getByText("No aprobada")).toBeTruthy();
    expect(screen.getByText("—")).toBeTruthy();
    expect(screen.getByText("Crítica")).toBeTruthy();
  });
});

describe("GateRow", () => {
  it("cita con enlace al momento", () => {
    const onSeek = vi.fn();
    const q = { quote: "Abre de 7 a 22", reason: "lo confirma", turnIndex: 1, tOffsetS: 63 };
    render(<GateRow label="Resolución probada" state={true} evidence={[q, { quote: "otra", turnIndex: 4 }]} onSeek={onSeek} />);
    fireEvent.click(screen.getByText(/1:03/));
    expect(onSeek).toHaveBeenCalledWith(q);
    expect(screen.getByText(/turno 4/)).toBeTruthy();
  });
});

describe("DimensionBars", () => {
  it("null = Sin evaluar", () => {
    render(<DimensionBars values={{ ve: 80, pr: null, co: 40 }} showWeights />);
    expect(screen.getAllByText("Sin evaluar").length).toBe(2);
    expect(screen.getByText("peso 32", { exact: false })).toBeTruthy();
    expect(screen.getByLabelText("VE Veracidad").getAttribute("aria-valuenow")).toBe("80");
  });
});

describe("FindingCard", () => {
  it("ir al momento, veredicto y acciones", () => {
    const onGoTo = vi.fn();
    render(<FindingCard patternCode="A13" patternLabel="Bucle de herramienta" severity="high" dimension="ve" quote="Lo vuelvo a comprobar" tOffsetS={41.5} confidence={0.82} verdict="confirmed" onGoTo={onGoTo} actions={<button>Rechazar</button>} />);
    fireEvent.click(screen.getByText(/Ir al momento/));
    expect(onGoTo).toHaveBeenCalled();
    expect(screen.getByText("Confirmado")).toBeTruthy();
    expect(screen.getByText("82 % confianza")).toBeTruthy();
    expect(screen.getByText("Rechazar")).toBeTruthy();
  });
  it("sin onGoTo no hay enlace", () => {
    render(<FindingCard patternCode="T01" severity="low" turnIndex={3} />);
    expect(screen.queryByText(/Ir al momento/)).toBeNull();
  });
});

describe("TranscriptEvidence", () => {
  const turns = [
    { index: 0, role: "user", text: "Horario de la piscina", t: 1.2 },
    { index: 1, role: "assistant", text: "Abre de 7 a 22", t: 3 },
  ];
  it("resalta, lleva a la vista y busca en el audio", () => {
    const onSeek = vi.fn();
    const spy = vi.fn();
    (HTMLElement.prototype as unknown as { scrollIntoView: unknown }).scrollIntoView = spy;
    const ref = createRef<TranscriptEvidenceHandle>();
    const { container } = render(<TranscriptEvidence ref={ref} turns={turns} highlightIndex={1} onSeek={onSeek} />);
    expect(container.querySelector('[data-turn-index="1"]')?.getAttribute("data-active")).toBe("true");
    expect(spy).toHaveBeenCalled();
    fireEvent.click(screen.getByLabelText("Ir a 0:03"));
    expect(onSeek).toHaveBeenCalledWith(3, turns[1]);
    ref.current!.scrollToTurn(0);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(screen.getByText("Cliente")).toBeTruthy();
  });
  it("vacía", () => {
    render(<TranscriptEvidence turns={[]} />);
    expect(screen.getByText("Sin transcripción")).toBeTruthy();
  });
});

describe("ToolCallTimeline", () => {
  it("lista, error y detalle plegado", () => {
    const onSeek = vi.fn();
    const { container } = render(<ToolCallTimeline calls={[{ name: "kb_search", tOffsetS: 2, durationMs: 320, input: { q: "piscina" } }, { name: "reservar", error: "timeout" }]} onSeek={onSeek} />);
    expect(screen.getByText("kb_search")).toBeTruthy();
    expect(screen.getByText("320 ms")).toBeTruthy();
    expect(screen.getByText("timeout")).toBeTruthy();
    expect(container.querySelector("[data-error=true]")).toBeTruthy();
    fireEvent.click(screen.getByLabelText("Ir a 0:02"));
    expect(onSeek).toHaveBeenCalledWith(2);
    fireEvent.click(screen.getByText("Detalle"));
    expect(screen.getByText(/piscina/)).toBeTruthy();
  });
});

describe("Sparkline", () => {
  it("los null cortan la línea", () => {
    const { segments } = sparklineSegments([1, 2, null, 3, 4], 100, 20);
    expect(segments.length).toBe(2);
    const { container } = render(<Sparkline values={[1, 2, null, 3, 4]} ariaLabel="Tendencia" />);
    expect(container.querySelectorAll("polyline").length).toBe(2);
    expect(screen.getByLabelText("Tendencia")).toBeTruthy();
  });
});
