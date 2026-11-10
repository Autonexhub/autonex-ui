import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ServicePriceEditor, priceKey } from '@autonexhub/react';

const meta: Meta<typeof ServicePriceEditor> = {
  title: '3-Organisms/ServicePriceEditor',
  component: ServicePriceEditor,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Editor de los precios de un servicio: una fila por centro, con la casilla de si se presta ahí, y una columna por tarifa. Controlado y sin datos propios. ' +
          'Un campo vacío hereda y enseña en gris el precio que cobrará: el de la tarifa por defecto del centro o, si no lo tiene, el precio base. ' +
          'Es la otra cara de `ServicePriceMatrix`: esa edita una celda suelta de todos los servicios, esta pone todos los precios de uno.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof ServicePriceEditor>;

const locations = [
  { id: 1, name: 'Serrano' },
  { id: 2, name: 'Retiro' },
  { id: 3, name: 'Chamberí' },
];
const tariffs = [
  { id: 10, name: 'Abonado' },
  { id: 11, name: 'No abonado' },
  { id: 12, name: 'General' },
];

function Interactivo({ columns, inicial, presta, basePrice = null }: {
  columns: Array<{ id: number; name: string }>;
  inicial: Record<string, string>;
  presta: Record<number, boolean>;
  basePrice?: number | null;
}) {
  const [inputs, setInputs] = useState(new Map(Object.entries(inicial)));
  const [sePresta, setSePresta] = useState(new Map(Object.entries(presta).map(([k, v]) => [Number(k), v])));
  return (
    <ServicePriceEditor
      locations={locations}
      columns={columns}
      sePresta={sePresta}
      inputs={inputs}
      basePrice={basePrice}
      defaultTariffId={columns[columns.length - 1].id}
      currency="EUR"
      onToggleLocation={(id, checked) => setSePresta((m) => new Map(m).set(id, checked))}
      onChangePrice={(loc, tariff, value) => setInputs((m) => new Map(m).set(priceKey(loc, tariff), value))}
    />
  );
}

export const TresTarifas: Story = {
  render: () => (
    <Interactivo
      columns={tariffs}
      presta={{ 1: true, 2: true, 3: false }}
      basePrice={35}
      inicial={{
        [priceKey(1, 10)]: '27.20', [priceKey(1, 11)]: '41.80',
        [priceKey(2, 10)]: '27.20', [priceKey(2, 11)]: '41.80',
      }}
    />
  ),
  parameters: { docs: { description: { story: 'Chamberí no presta el servicio; en los otros dos, General (la tarifa por defecto) está vacía y enseña el precio base en gris.' } } },
};

export const UnaSolaTarifa: Story = {
  render: () => (
    <Interactivo
      columns={[{ id: 0, name: 'Precio' }]}
      presta={{ 1: true, 2: true, 3: true }}
      inicial={{ [priceKey(1, 0)]: '20.00' }}
      basePrice={20}
    />
  ),
  parameters: { docs: { description: { story: 'Una organización sin tarifas ve una sola columna. Un centro con el campo vacío cobra el precio base y lo enseña en gris.' } } },
};

export const SinPreciosPropios: Story = {
  name: 'Sin precios propios',
  render: () => (
    <Interactivo columns={tariffs} presta={{ 1: true, 2: false, 3: false }} inicial={{}} basePrice={35} />
  ),
};
