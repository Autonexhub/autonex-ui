import type { Meta, StoryObj } from '@storybook/react';
import { Button, FindingCard } from '@autonexhub/react';

/** Un hallazgo RAP: patrón, gravedad, dimensión, confianza, la cita que lo prueba y «Ir al momento». */
const meta: Meta<typeof FindingCard> = {
  title: '2-Molecules/Quality/FindingCard',
  component: FindingCard,
  tags: ['autodocs'],
  args: {
    patternCode: 'A13',
    patternLabel: 'Bucle de herramienta',
    description: 'La misma herramienta con los mismos argumentos tres veces seguidas.',
    severity: 'high',
    dimension: 've',
    quote: 'Un momento, lo vuelvo a comprobar',
    reason: 'Tercera llamada idéntica a reservar',
    turnIndex: 7,
    tOffsetS: 41.5,
    confidence: 0.82,
    penalty: -18,
    onGoTo: (...a: unknown[]) => console.log('FindingCard', ...a),
  },
  decorators: [(S) => <div className="max-w-xl"><S /></div>],
};
export default meta;
type Story = StoryObj<typeof FindingCard>;

export const Default: Story = {};
export const Active: Story = { args: { active: true } };
export const Confirmed: Story = { args: { verdict: 'confirmed' } };
export const WithReviewActions: Story = {
  args: {
    actions: (
      <>
        <Button size="xs" variant="outline">Confirmar</Button>
        <Button size="xs" variant="ghost">Rechazar</Button>
      </>
    ),
  },
};
export const Rejected: Story = { args: { verdict: 'rejected', onGoTo: undefined } };
