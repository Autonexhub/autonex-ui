import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { FindingCard, TranscriptEvidence } from '@autonexhub/react';

const turns = [
  { index: 0, role: 'assistant', text: 'Hola, soy Marta, del club. ¿En qué te ayudo?', t: 0.8 },
  { index: 1, role: 'user', text: 'Quería reservar pista de pádel para el jueves.', t: 4.2 },
  { index: 2, role: 'assistant', text: 'Claro, ¿a qué hora?', t: 7.9 },
  { index: 3, role: 'user', text: 'A las siete de la tarde.', t: 10.4 },
  { index: 4, role: 'assistant', text: 'Un momento, lo compruebo.', t: 13.1 },
  { index: 5, role: 'assistant', text: 'Un momento, lo vuelvo a comprobar.', t: 41.5 },
  { index: 6, role: 'user', text: '¿Sigue ahí?', t: 52.0 },
  { index: 7, role: 'agent', text: 'Hola, te atiende recepción.', t: 60.3 },
];

/** Transcripción con el turno de la evidencia resaltado (se lleva a la vista) y tiempos que saltan en el audio. */
const meta: Meta<typeof TranscriptEvidence> = {
  title: '2-Molecules/Quality/TranscriptEvidence',
  component: TranscriptEvidence,
  tags: ['autodocs'],
  args: { turns, highlightIndex: 5, highlightIndexes: [4, 5], onSeek: (...a: unknown[]) => console.log('TranscriptEvidence', ...a), maxHeight: 260 },
};
export default meta;
type Story = StoryObj<typeof TranscriptEvidence>;

export const Default: Story = {};
export const Empty: Story = { args: { turns: [] } };

export const LinkedToFindings: Story = {
  render: () => {
    const [active, setActive] = useState<number | null>(null);
    const findings = [
      { code: 'A13', label: 'Bucle de herramienta', severity: 'high', quote: 'Un momento, lo vuelvo a comprobar.', turn: 5, t: 41.5 },
      { code: 'T01', label: 'Transferencia', severity: 'low', quote: 'Hola, te atiende recepción.', turn: 7, t: 60.3 },
    ];
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          {findings.map((f) => (
            <FindingCard key={f.code} patternCode={f.code} patternLabel={f.label} severity={f.severity} quote={f.quote}
              turnIndex={f.turn} tOffsetS={f.t} active={active === f.turn} onGoTo={() => setActive(f.turn)} />
          ))}
        </div>
        <TranscriptEvidence turns={turns} highlightIndex={active} highlightIndexes={findings.map((f) => f.turn)} maxHeight={260} />
      </div>
    );
  },
};
