import type { Meta, StoryObj } from '@storybook/react';
import { GateRow } from '@autonexhub/react';

/** Una puerta RAP con las citas que la prueban; «Ir al momento» salta en la transcripción y el audio. */
const meta: Meta<typeof GateRow> = {
  title: '2-Molecules/Quality/GateRow',
  component: GateRow,
  tags: ['autodocs'],
  args: {
    label: 'Resolución probada',
    description: 'El cliente confirma que se resolvió o hay un evento que lo prueba',
    state: true,
    onSeek: (...a: unknown[]) => console.log('GateRow', ...a),
    evidence: [{ quote: 'Perfecto, ya me queda la reserva para el jueves', reason: 'El cliente confirma la reserva', turnIndex: 9, tOffsetS: 74 }],
  },
};
export default meta;
type Story = StoryObj<typeof GateRow>;

export const Open: Story = {};
export const Closed: Story = { args: { label: 'Sin humano', description: 'No hizo falta pasar a una persona', state: false, evidence: [{ quote: 'Le paso con recepción', turnIndex: 12 }] } };
export const LowConfidence: Story = { args: { label: 'Sin recontacto', state: null, lowConfidence: true, evidence: [] } };
