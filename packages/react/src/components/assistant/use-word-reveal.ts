import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "./use-reduced-motion";

export interface WordRevealOptions {
  /** Milisegundos entre palabra y palabra (por defecto 25). */
  msPerWord?: number;
  /** `false` pinta el texto completo de golpe (mensajes ya revelados). */
  enabled?: boolean;
  /** Se llama una vez cuando todas las palabras están visibles. */
  onDone?: () => void;
}

export interface WordRevealToken {
  /** Texto del token (palabra o espacio/salto de línea). */
  text: string;
  /** `true` si el token es un espacio en blanco (no cuenta como palabra). */
  space: boolean;
  /** Índice de palabra (solo para tokens que son palabra). */
  wordIndex: number;
}

export interface WordReveal {
  /** Tokens del texto conservando espacios y saltos de línea. */
  tokens: WordRevealToken[];
  /** Palabras visibles hasta ahora. */
  visibleWords: number;
  /** Total de palabras. */
  totalWords: number;
  /** `true` cuando el texto está completo. */
  done: boolean;
}

/**
 * Revelado por palabras (patrón "wordfade" del widget de Autonex): la respuesta
 * llega completa y se pinta palabra a palabra a ~25 ms por palabra.
 * Con `prefers-reduced-motion` o `enabled=false` el texto sale entero al instante.
 * Los tokens ocupan su sitio desde el principio (se pintan con opacidad 0), así
 * el alto del mensaje no salta mientras se revela.
 */
export function useWordReveal(text: string, options: WordRevealOptions = {}): WordReveal {
  const { msPerWord = 25, enabled = true, onDone } = options;
  const reduced = useReducedMotion();

  const tokens = useMemo<WordRevealToken[]>(() => {
    let wordIndex = 0;
    return text
      .split(/(\s+)/)
      .filter((t) => t !== "")
      .map((t) => {
        const space = /^\s+$/.test(t);
        return { text: t, space, wordIndex: space ? -1 : wordIndex++ };
      });
  }, [text]);

  const totalWords = useMemo(() => tokens.filter((t) => !t.space).length, [tokens]);
  const instant = !enabled || reduced;

  const [visibleWords, setVisibleWords] = useState(instant ? totalWords : 0);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const doneFired = useRef(false);

  useEffect(() => {
    doneFired.current = false;
    if (instant) {
      setVisibleWords(totalWords);
      return;
    }
    setVisibleWords(0);
    if (totalWords === 0) return;
    const id = window.setInterval(() => {
      setVisibleWords((n) => {
        if (n + 1 >= totalWords) {
          window.clearInterval(id);
          return totalWords;
        }
        return n + 1;
      });
    }, msPerWord);
    return () => window.clearInterval(id);
  }, [text, totalWords, instant, msPerWord]);

  const done = visibleWords >= totalWords;

  useEffect(() => {
    if (done && !doneFired.current) {
      doneFired.current = true;
      onDoneRef.current?.();
    }
  }, [done]);

  return { tokens, visibleWords, totalWords, done };
}
