import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { PRIORITY_ORDER, PriorityIcon, PrioritySelect, type Priority } from '@autonexhub/react';

/** Priority (Plane style): icon in a colored square + selector with search. Labels default to Spanish; `labels` overrides them. */
const meta: Meta = { title: '2-Molecules/Priority', tags: ['autodocs'] };
export default meta;

export const Icons: StoryObj = {
  render: () => (
    <div className="flex items-center gap-6">
      {PRIORITY_ORDER.map((p) => <span key={p} className="flex items-center gap-2 text-sm"><PriorityIcon priority={p} size={22} />{p}</span>)}
    </div>
  ),
};

function SelectDemo({ english = false }: { english?: boolean }) {
  const [value, setValue] = useState<Priority | null>('high');
  return (
    <div className="flex items-center gap-3 text-sm">
      <PrioritySelect
        value={value}
        onChange={setValue}
        labels={english ? { urgent: 'Urgent', high: 'High', medium: 'Medium', low: 'Low', none: 'No priority' } : undefined}
        searchPlaceholder={english ? 'Search' : undefined}
      />
      <span className="text-muted-foreground">{value ?? 'none'}</span>
    </div>
  );
}

export const Selector: StoryObj = { render: () => <SelectDemo /> };
export const SelectorEnglish: StoryObj = { render: () => <SelectDemo english /> };
