import type { Meta, StoryObj } from '@storybook/react';
import { ToolCallTimeline } from '@autonexhub/react';

/** Herramientas que llamó el agente, en orden: segundo (salta en el audio), duración, error y entrada/salida plegadas. */
const meta: Meta<typeof ToolCallTimeline> = {
  title: '2-Molecules/Quality/ToolCallTimeline',
  component: ToolCallTimeline,
  tags: ['autodocs'],
  args: {
    onSeek: (...a: unknown[]) => console.log('ToolCallTimeline', ...a),
    calls: [
      { name: 'kb_search', tOffsetS: 5.1, durationMs: 320, input: { query: 'horario piscina' }, output: { blocks: 2 } },
      { name: 'check_availability', tOffsetS: 13.4, durationMs: 1840, input: { date: '2026-11-27', hour: 19 }, output: '{"free": true}' },
      { name: 'create_booking', tOffsetS: 41.2, durationMs: 10200, error: 'timeout', input: { court: 2 } },
    ],
  },
  decorators: [(S) => <div className="max-w-lg"><S /></div>],
};
export default meta;
export const Default: StoryObj<typeof ToolCallTimeline> = {};
export const Empty: StoryObj<typeof ToolCallTimeline> = { args: { calls: [] } };
