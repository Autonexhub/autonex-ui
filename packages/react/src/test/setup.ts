import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Radix / cmdk usan APIs de layout que happy-dom no trae completas.
const g = globalThis as unknown as Record<string, unknown>;
if (!g.ResizeObserver) {
  g.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
if (typeof Element !== "undefined" && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = function scrollIntoView() {};
}

afterEach(() => cleanup());
