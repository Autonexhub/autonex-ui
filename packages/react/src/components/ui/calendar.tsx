import * as React from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { DayPicker } from "react-day-picker";

import { cn } from "../../lib/utils";
import { buttonVariants } from "./button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 bg-transparent p-0 aria-disabled:opacity-50",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-4xl w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        // El fondo de celda solo existe para el carril de rangos; un día suelto
        // seleccionado es únicamente su círculo (sin rectángulo detrás).
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has(.day-range-middle)]:bg-muted [&:has(.day-range-start)]:rounded-l-4xl [&:has(.day-range-end)]:rounded-r-4xl [&:has([aria-selected].day-outside)]:bg-muted/50 focus-within:relative focus-within:z-20",
        day: cn(buttonVariants({ variant: "ghost" }), "h-9 w-9 rounded-4xl p-0 font-normal aria-selected:opacity-100"),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-muted text-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-muted/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "day-range-middle aria-selected:bg-muted aria-selected:text-foreground aria-selected:rounded-none",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <CaretLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <CaretRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
