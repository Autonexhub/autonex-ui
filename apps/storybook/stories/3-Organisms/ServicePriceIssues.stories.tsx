import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ServicePriceIssues, type PriceIssueRow } from '@autonexhub/react';

const meta: Meta<typeof ServicePriceIssues> = {
  title: '3-Organisms/ServicePriceIssues',
  component: ServicePriceIssues,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Precios de un servicio que avisan en su ficha: un centro que cobra distinto que los demás en la misma tarifa, o un precio de 0 €. ' +
          'Cada uno tiene "Es correcto": darlo por bueno apaga el aviso en la ficha, la lista y la matriz, pero solo para ese precio; si cambia, vuelve a avisar. Sin avisos no pinta nada.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof ServicePriceIssues>;

const inicial: PriceIssueRow[] = [
  { key: '1', kind: 'distinto', locationName: 'Chamberí', tariffName: 'Abonado', price: 10.4, usual: 10.45 },
  { key: '2', kind: 'distinto', locationName: 'Chamberí', tariffName: 'No abonado', price: 20.8, usual: 20.9 },
  { key: '3', kind: 'cero', locationName: 'Retiro', tariffName: 'General', price: 0, usual: null },
];

function Interactivo() {
  const [issues, setIssues] = useState(inicial);
  return (
    <div className="max-w-3xl">
      <ServicePriceIssues
        issues={issues}
        currency="EUR"
        onConfirm={async (i) => {
          await new Promise((r) => setTimeout(r, 400));
          setIssues((p) => p.filter((x) => x.key !== i.key));
        }}
      />
    </div>
  );
}

export const Default: Story = { name: 'Por defecto', render: () => <Interactivo /> };

export const SinAvisos: Story = {
  args: { issues: [], currency: 'EUR', onConfirm: async () => {} },
  parameters: { docs: { description: { story: 'Sin nada que revisar no se pinta nada.' } } },
};
