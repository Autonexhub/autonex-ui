import type { Meta, StoryObj } from '@storybook/react';
import { TopicsBubbleChart } from '@autonexhub/react';

const meta: Meta<typeof TopicsBubbleChart> = {
  title: '3-Organisms/TopicsBubbleChart',
  component: TopicsBubbleChart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Gráfica de burbujas empaquetadas para ver la distribución de temas. Usa d3-hierarchy para empaquetar los círculos.

## Características
- **Colores pastel**: círculos al 20 % de opacidad con la paleta de gráficas.
- **Responsive**: se adapta al ancho del contenedor.
- **Zoom y desplazamiento**: rueda del ratón para el zoom, arrastrar para desplazar y botones para el ajuste fino.
- **Etiquetas inteligentes**: el texto se parte dentro de la burbuja y se oculta en los círculos pequeños.
- **Tooltips al pasar el ratón**: todas las burbujas muestran el nombre del tema y el recuento.

## Uso
\`\`\`tsx
<TopicsBubbleChart
  data={[
    { name: "Citas", count: 150, percentage: 35, color: "" },
    { name: "Horarios", count: 80, percentage: 19, color: "" },
  ]}
  height={320}
  zoomable={true}
/>
\`\`\`
`,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-lg p-4 bg-card rounded-lg border">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TopicsBubbleChart>;

const sampleTopics = [
  { name: "Citas", count: 150, percentage: 35, color: "" },
  { name: "Horarios", count: 80, percentage: 19, color: "" },
  { name: "Precios", count: 65, percentage: 15, color: "" },
  { name: "Ubicación", count: 45, percentage: 10, color: "" },
  { name: "Servicios", count: 40, percentage: 9, color: "" },
  { name: "Cancelaciones", count: 25, percentage: 6, color: "" },
  { name: "Otros", count: 20, percentage: 5, color: "" },
];

export const Default: Story = {
  name: 'Por defecto',
  args: {
    data: sampleTopics,
    height: 320,
    zoomable: true,
  },
};

export const WithoutZoom: Story = {
  name: 'Sin zoom',
  args: {
    data: sampleTopics,
    height: 320,
    zoomable: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Versión estática, sin controles de zoom ni desplazamiento.',
      },
    },
  },
};

export const FewTopics: Story = {
  name: 'Pocos temas',
  args: {
    data: [
      { name: "Reservas", count: 200, percentage: 60, color: "" },
      { name: "Consultas", count: 100, percentage: 30, color: "" },
      { name: "Otros", count: 30, percentage: 10, color: "" },
    ],
    height: 320,
    zoomable: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Gráfica con solo 3 temas: burbujas más grandes.',
      },
    },
  },
};

export const ManyTopics: Story = {
  name: 'Muchos temas',
  args: {
    data: [
      { name: "Citas médicas", count: 120, percentage: 18, color: "" },
      { name: "Horarios disponibles", count: 95, percentage: 14, color: "" },
      { name: "Precios y tarifas", count: 85, percentage: 13, color: "" },
      { name: "Ubicación clínica", count: 70, percentage: 11, color: "" },
      { name: "Servicios ofrecidos", count: 60, percentage: 9, color: "" },
      { name: "Cancelar cita", count: 50, percentage: 8, color: "" },
      { name: "Reprogramar", count: 45, percentage: 7, color: "" },
      { name: "Seguros médicos", count: 40, percentage: 6, color: "" },
      { name: "Resultados", count: 35, percentage: 5, color: "" },
      { name: "Especialistas", count: 30, percentage: 5, color: "" },
      { name: "Emergencias", count: 20, percentage: 3, color: "" },
      { name: "Otros", count: 10, percentage: 1, color: "" },
    ],
    height: 400,
    zoomable: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Gráfica con muchos temas: usa el zoom para ver las burbujas pequeñas.',
      },
    },
  },
};

export const Empty: Story = {
  name: 'Vacía',
  args: {
    data: [],
    height: 320,
  },
  parameters: {
    docs: {
      description: {
        story: 'Estado vacío cuando no hay temas.',
      },
    },
  },
};

export const SingleTopic: Story = {
  name: 'Un solo tema',
  args: {
    data: [
      { name: "Consultas generales", count: 500, percentage: 100, color: "" },
    ],
    height: 320,
    zoomable: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Un solo tema ocupa todo el espacio.',
      },
    },
  },
};

export const LongTopicNames: Story = {
  name: 'Nombres largos',
  args: {
    data: [
      { name: "Consultas sobre disponibilidad horaria", count: 100, percentage: 30, color: "" },
      { name: "Información de precios", count: 80, percentage: 24, color: "" },
      { name: "Reprogramación de citas", count: 60, percentage: 18, color: "" },
      { name: "Cancelaciones y reembolsos", count: 50, percentage: 15, color: "" },
      { name: "Otros", count: 40, percentage: 12, color: "" },
    ],
    height: 320,
    zoomable: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Temas con nombres largos: el texto se parte dentro de las burbujas.',
      },
    },
  },
};

export const SmallContainer: Story = {
  name: 'Contenedor pequeño',
  args: {
    data: sampleTopics,
    height: 200,
    zoomable: true,
  },
  decorators: [
    (Story) => (
      <div className="w-64 p-4 bg-card rounded-lg border">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Gráfica en un contenedor pequeño: tamaño adaptable.',
      },
    },
  },
};
