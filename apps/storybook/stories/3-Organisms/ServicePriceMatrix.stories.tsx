import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ServicePriceMatrix, type PriceEdit, type MatrixLocation, type MatrixTariff, type MatrixFamily, type MatrixService, type ServicePriceRecord } from '@autonexhub/react';

// Los datos de ejemplo llevan los mismos campos que la API; la matriz solo lee los que declaran estos tipos.
type Location = MatrixLocation & Record<string, unknown>;
type PriceTariff = MatrixTariff & Record<string, unknown>;
type ServiceFamily = MatrixFamily & Record<string, unknown>;
type CatalogService = MatrixService & Record<string, unknown>;
type ServicePrice = ServicePriceRecord & Record<string, unknown>;

const meta: Meta<typeof ServicePriceMatrix> = {
  title: '3-Organisms/ServicePriceMatrix',
  component: ServicePriceMatrix,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Matriz de precios: servicios (agrupados por familia, plegables) × centros o × tarifas. Controlada y sin datos propios. ' +
          'Una celda es un precio propio, un precio heredado en gris (la tarifa no tiene uno y cobra el de la tarifa por defecto del centro o el precio base), "Sin precio" (se presta pero ninguna capa tiene precio) o "—" (no se presta en ese centro). ' +
          'Enseña todos los centros y todas las tarifas a la vez, con doble cabecera (centro arriba, tarifas debajo); para ver menos se filtran los centros. En cada tarifa se resalta en ámbar el centro que cobra distinto que los demás y en rojo el precio de 0 €; pulsar una de esas celdas abre un recuadro que explica el aviso con "Es correcto" (deja de avisar) y "Cambiar precio". Pulsa cualquier otra celda para editarla: Intro guarda, Escape cancela y vaciarla quita el precio.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof ServicePriceMatrix>;

const locations: Location[] = [
  { id: 1, organization_id: 9, name: 'Serrano', is_active: true, sort_order: 0, external_source: null, external_id: null, external_meta: null },
  { id: 2, organization_id: 9, name: 'Retiro', is_active: true, sort_order: 10, external_source: null, external_id: null, external_meta: null },
  { id: 3, organization_id: 9, name: 'Chamberí', is_active: true, sort_order: 20, external_source: null, external_id: null, external_meta: null },
];

const tariffs: PriceTariff[] = [
  { id: 10, organization_id: 9, name: 'Abonado', sort_order: 10, is_default: false, is_active: true },
  { id: 11, organization_id: 9, name: 'No abonado', sort_order: 20, is_default: false, is_active: true },
  { id: 12, organization_id: 9, name: 'General', sort_order: 30, is_default: true, is_active: true },
];

const families: ServiceFamily[] = [
  { id: 1, organization_id: 9, name: 'Clases en piscina', sort_order: 0, is_active: true, service_count: 2 },
  { id: 2, organization_id: 9, name: 'Entrenamiento personal', sort_order: 10, is_active: true, service_count: 3 },
];

const svc = (id: number, familyId: number, name: string, isActive = true): CatalogService => ({
  id, family_id: familyId, name, is_active: isActive,
  organization_id: 9, description: null, price: null, currency: 'EUR', billing: 'monthly', payment_link: null,
  kind: 'service', vat: null, duration_minutes: null, is_bookable: true, sort_order: id,
  external_source: null, external_id: null, synced_at: null, created_at: '2026-10-14',
});

const services: CatalogService[] = [
  svc(100, 1, 'Natación adultos, 1 día a la semana'),
  svc(101, 1, 'Aquagym, 2 días a la semana'),
  svc(200, 2, 'Sesión de 1 hora'),
  svc(201, 2, 'Bono de 5 horas'),
  svc(202, 2, 'Valoración funcional (borrador)', false),
];

let nextId = 1;
const p = (service: number, location: number, tariff: number, price: number): ServicePrice => ({
  id: nextId++, service_id: service, location_id: location, tariff_id: tariff,
  price, vat: null, currency: null, effective_price: price, effective_vat: null, effective_currency: 'EUR', price_source: 'tarifa',
});

const initialPrices: ServicePrice[] = [
  // Natación: Chamberí cobra distinto al resto (se marca al comparar).
  p(100, 1, 10, 10.45), p(100, 1, 11, 20.9), p(100, 2, 10, 10.45), p(100, 2, 11, 20.9), p(100, 3, 10, 10.4), p(100, 3, 11, 20.8),
  // Aquagym: solo se presta en Serrano y Retiro.
  p(101, 1, 10, 14), p(101, 1, 11, 28), p(101, 2, 10, 14), p(101, 2, 11, 28),
  // Entrenamiento: solo tarifa general en los tres centros; Abonado y No abonado heredan ese precio (en gris).
  p(200, 1, 12, 34.8), p(200, 2, 12, 34.8), p(200, 3, 12, 34.8),
  p(201, 1, 12, 161.6), p(201, 2, 12, 161.6), p(201, 3, 12, 161.6),
  // Un 0 € en el borrador: se resalta para que alguien lo revise.
  p(202, 2, 12, 0),
];

/** Aplica una edición como lo haría el backend: sustituye, añade o quita la fila de esa celda. */
function applyEdit(prev: ServicePrice[], e: PriceEdit): ServicePrice[] {
  const sin = prev.filter((x) => !(x.service_id === e.serviceId && x.location_id === e.locationId && x.tariff_id === e.tariffId));
  return e.price === null ? sin : [...sin, p(e.serviceId, e.locationId, e.tariffId, e.price)];
}

function Interactive(args: Story['args']) {
  const [prices, setPrices] = useState(initialPrices);
  // "Es correcto" del recuadro de aviso: la celda deja de avisar con ese precio.
  const [confirmed, setConfirmed] = useState<Map<string, number>>(new Map());
  const [collapsed, setCollapsed] = useState<Set<number>>(new Set());
  return (
    <ServicePriceMatrix
      {...(args as React.ComponentProps<typeof ServicePriceMatrix>)}
      prices={prices}
      collapsed={collapsed}
      onToggleFamily={(id) =>
        setCollapsed((c) => {
          const n = new Set(c);
          if (n.has(id)) n.delete(id); else n.add(id);
          return n;
        })
      }
      onEditPrice={(e) => setPrices((prev) => applyEdit(prev, e))}
      confirmed={confirmed}
      onConfirmPrice={async (c) => setConfirmed((m) => new Map(m).set(`${c.serviceId}|${c.locationId}|${c.tariffId}`, c.price))}
    />
  );
}

const base = { services, families, locations, tariffs, prices: initialPrices, collapsed: new Set<number>(), onToggleFamily: () => {} };

export const TodosLosCentrosYTarifas: Story = {
  args: { ...base },
  render: (args) => <Interactive {...args} />,
  parameters: { docs: { description: { story: 'Todos los centros con todas sus tarifas a la vez, con doble cabecera. Nada queda escondido: Natación cobra distinto en Chamberí (naranja) y Entrenamiento hereda el precio General en Abonado y No abonado (gris).' } } },
};

export const UnCentro: Story = {
  args: { ...base, locations: [locations[2]] },
  render: (args) => <Interactive {...args} />,
  parameters: { docs: { description: { story: 'Con el filtro de Centro se pasan solo esos centros: la tabla se estrecha, pero sigue enseñando todas sus tarifas.' } } },
};

export const UnaSolaTarifa: Story = {
  args: { ...base, tariffs: [tariffs[2]] },
  render: (args) => <Interactive {...args} />,
  parameters: { docs: { description: { story: 'Con una sola tarifa la cabecera es de una línea: solo los centros.' } } },
};

export const SoloLectura: Story = {
  args: { ...base },
};

export const SinTarifas: Story = {
  args: { ...base, tariffs: [] },
};
