import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { BigCelebration, Button, MicroConfetti } from '@autonexhub/react';

const meta: Meta = {
  title: '2-Molecules/Confetti',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '`MicroConfetti` lanza una pequeña ráfaga en la posición del cursor al marcar una tarea como hecha. `BigCelebration` es la celebración de cuando se completa un grupo entero: fuegos artificiales, dos cañones laterales de ~2 s y una píldora que entra desde arriba (`message` cambia el texto, `onDone` avisa al terminar). Respeta "reducir movimiento".',
      },
    },
  },
};
export default meta;
type Story = StoryObj;

export const Micro: Story = {
  name: 'Ráfaga pequeña',
  render: function Render() {
    const [burst, setBurst] = useState<{ x: number; y: number; id: number } | null>(null);
    return (
      <div>
        <Button onClick={(e) => setBurst({ x: e.clientX, y: e.clientY, id: Date.now() })}>Marcar como hecha</Button>
        {burst && <MicroConfetti key={burst.id} x={burst.x} y={burst.y} />}
      </div>
    );
  },
};

export const Grande: Story = {
  name: 'Celebración grande',
  render: function Render() {
    const [on, setOn] = useState(false);
    return (
      <div>
        <Button onClick={() => setOn(true)}>Completar el día</Button>
        {on && <BigCelebration message="¡Todo al día!" onDone={() => setOn(false)} />}
      </div>
    );
  },
};
