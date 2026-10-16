import type { Meta, StoryObj } from '@storybook/react';
import { AudioPlayerSkeleton } from '@autonexhub/react';

const meta: Meta<typeof AudioPlayerSkeleton> = {
  title: '3-Organisms/Skeletons/AudioPlayerSkeleton',
  component: AudioPlayerSkeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Skeleton del reproductor de audio (decisión Bruno 01/09): píldora de ' +
          'tiempo, play redondo, barra de onda y dos controles redondos. Se superpone al ' +
          'reproductor real mientras WaveSurfer descarga y decodifica la grabación — así la ' +
          'estructura del player es reconocible desde el primer frame.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AudioPlayerSkeleton>;

export const Default: Story = {
  render: () => (
    <div className="max-w-2xl">
      <AudioPlayerSkeleton />
    </div>
  ),
};
