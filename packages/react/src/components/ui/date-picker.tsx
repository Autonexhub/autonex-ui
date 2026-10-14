import { useState } from 'react';
import { CalendarBlank, X } from "@phosphor-icons/react";
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Calendar } from './calendar';
import { es, ca, enUS, type Locale } from 'date-fns/locale';
import { cn } from '../../lib/utils';

/** Calendario en el idioma del navegador. */
const LOCALES: Record<string, Locale> = { es, ca, en: enUS };
const getLocale = () => {
  const tag = typeof navigator !== 'undefined' ? navigator.language : 'en';
  return LOCALES[tag.slice(0, 2)] ?? enUS;
};

/**
 * Click-to-open date picker that returns ISO "YYYY-MM-DD" strings (browser-local
 * date, no UTC drift). Use this anywhere a native `<input type="date">` would
 * appear — the native input has two papercuts on macOS Chrome: clicking the
 * field doesn't reliably open the picker, and typing the year is brittle
 * (typing a "0" mid-year resets the field).
 */
export function DatePicker({
  value,
  onChange,
  placeholder = 'Elegir fecha',
  className,
  clearable = false,
  align = 'start',
  size = 'inline',
  min,
  max,
  id,
}: {
  value: string | null | undefined;
  onChange: (v: string | null) => void;
  placeholder?: string;
  className?: string;
  clearable?: boolean;
  align?: 'start' | 'center' | 'end';
  /** `inline` (por defecto, filas de ficha) o `field`: alto y ancho de campo de formulario. */
  size?: 'inline' | 'field';
  /** Límites en "YYYY-MM-DD": los días fuera del rango no se pueden elegir. */
  min?: string;
  max?: string;
  id?: string;
}) {
  const [open, setOpen] = useState(false);
  const aFecha = (v?: string | null) => (v ? new Date(v + 'T00:00:00') : undefined);
  const date = aFecha(value);
  const tag = typeof navigator !== 'undefined' ? navigator.language : 'en';
  const locale = getLocale();
  const label = date
    ? size === 'field'
      ? date.toLocaleDateString(tag)
      : date.toLocaleDateString(tag, { day: 'numeric', month: 'short', year: 'numeric' })
    : placeholder;
  const desde = aFecha(min);
  const hasta = aFecha(max);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          className={cn(
            'inline-flex items-center gap-1.5 border border-transparent transition-colors text-left',
            size === 'field'
              ? 'h-9 w-full gap-2 rounded-3xl bg-muted px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30'
              : 'h-7 px-2 text-[12px] rounded-md hover:border-border hover:bg-muted/40',
            !value && 'text-muted-foreground',
            className,
          )}
        >
          <CalendarBlank className={cn('shrink-0 opacity-70', size === 'field' ? 'h-4 w-4' : 'h-3.5 w-3.5')} />
          <span className="truncate">{label}</span>
          {clearable && value && (
            <span
              role="button"
              aria-label="Quitar fecha"
              className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-sm hover:bg-muted"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChange(null);
              }}
            >
              <X className="h-3 w-3" />
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 animate-in fade-in-0 zoom-in-95 duration-150" align={align}>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => {
            if (!d) return;
            const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            onChange(iso);
            setOpen(false);
          }}
          defaultMonth={date}
          locale={locale}
          disabled={[...(desde ? [{ before: desde }] : []), ...(hasta ? [{ after: hasta }] : [])]}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
