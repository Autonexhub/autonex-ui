import type { Meta, StoryObj } from '@storybook/react';
import { AssistantThinking } from '@autonexhub/react';

const meta: Meta<typeof AssistantThinking> = {
  title: '2-Molecules/AssistantThinking',
  component: AssistantThinking,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Espera del asistente (sin skeleton): pájaro `text-ai` que se mece, una palabra que rota entre `labels.thinkingWords` cada 1,5 s y tres puntos `animate-pulse` escalonados. Quieto con `prefers-reduced-motion`.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof AssistantThinking>;

export const Rotando: Story = {};
export const PalabraFija: Story = { args: { word: 'Pensando' } };
export const PalabrasPersonalizadas: Story = { args: { labels: { thinkingWords: ['Thinking', 'Searching', 'Reviewing'] } } };
