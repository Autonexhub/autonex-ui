import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { FamilyServiceMatrix, matrixKey } from '@autonexhub/react';

const meta: Meta<typeof FamilyServiceMatrix> = {
  title: '3-Organisms/FamilyServiceMatrix',
  component: FamilyServiceMatrix,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Grid de servicios (agrupados por familia, plegable) × trabajadores. Cada familia lleva un checkbox tri-estado: activa/desactiva toda la familia de una vez y muestra un guion cuando solo algunas celdas están activas. Controlado: no hace fetch ni guarda copia local del estado.',
      },
    },
  },
};
export default meta;

const workers = [
  { id: 1, organization_id: 9, user_id: null, name: 'Ahlem', email: null, phone: null, is_active: true, location_ids: [3] },
  { id: 2, organization_id: 9, user_id: null, name: 'Lucía', email: null, phone: null, is_active: true, location_ids: [3] },
];

const families = [
  { id: 1, organization_id: 9, name: 'Lavado', sort_order: 0, is_active: true, service_count: 2 },
  { id: 2, organization_id: 9, name: 'Mechas', sort_order: 1, is_active: true, service_count: 1 },
];

const services = [
  { id: 10, family_id: 1, name: 'Lavado + secado' },
  { id: 11, family_id: 1, name: 'Lavado técnico' },
  { id: 12, family_id: 2, name: 'Mechas balayage' },
].map((s) => ({
  ...s,
  organization_id: 9,
  description: null,
  price: 20,
  currency: 'EUR',
  billing: 'one_off' as const,
  payment_link: null,
  is_active: true,
  kind: 'service' as const,
  vat: 21,
  duration_minutes: null,
  is_bookable: true,
  sort_order: 0,
  external_source: null,
  external_id: null,
  synced_at: null,
  created_at: '2026-09-20',
}));

const serviceHuerfano = {
  id: 13,
  family_id: 999, // id ausente de `families`: debe caer en "Sin familia", no desaparecer
  name: 'Servicio con familia borrada',
  organization_id: 9,
  description: null,
  price: 20,
  currency: 'EUR',
  billing: 'one_off' as const,
  payment_link: null,
  is_active: true,
  kind: 'service' as const,
  vat: 21,
  duration_minutes: null,
  is_bookable: true,
  sort_order: 0,
  external_source: null,
  external_id: null,
  synced_at: null,
  created_at: '2026-09-20',
};

const alternarPlegado = (prev: Set<number>, id: number) => {
  const next = new Set(prev);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }
  return next;
};

export const ConMezclaEnUnaFamilia: StoryObj<typeof FamilyServiceMatrix> = {
  render: function Render() {
    const [value, setValue] = useState(new Map<string, boolean>([[matrixKey(2, 10), false]]));
    const [collapsed, setCollapsed] = useState(new Set<number>());

    return (
      <FamilyServiceMatrix
        workers={workers}
        services={services}
        families={families}
        value={value}
        defaultEnabled
        collapsed={collapsed}
        onToggleFamily={(id) => setCollapsed((prev) => alternarPlegado(prev, id))}
        onChange={(w, s, next) => setValue((prev) => new Map(prev).set(matrixKey(w, s), next))}
        onChangeMany={(cambios) =>
          setValue((prev) => {
            const next = new Map(prev);
            for (const c of cambios) next.set(matrixKey(c.workerId, c.serviceId), c.next);
            return next;
          })
        }
      />
    );
  },
};

export const ServicioConFamiliaInexistente: StoryObj<typeof FamilyServiceMatrix> = {
  render: function Render() {
    const [value, setValue] = useState(new Map<string, boolean>());
    const [collapsed, setCollapsed] = useState(new Set<number>());

    return (
      <FamilyServiceMatrix
        workers={workers}
        services={[...services, serviceHuerfano]}
        families={families}
        value={value}
        defaultEnabled
        collapsed={collapsed}
        onToggleFamily={(id) => setCollapsed((prev) => alternarPlegado(prev, id))}
        onChange={(w, s, next) => setValue((prev) => new Map(prev).set(matrixKey(w, s), next))}
        onChangeMany={(cambios) =>
          setValue((prev) => {
            const next = new Map(prev);
            for (const c of cambios) next.set(matrixKey(c.workerId, c.serviceId), c.next);
            return next;
          })
        }
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Un servicio con `family_id` que ya no existe en `families` (familia filtrada o borrada entre las dos llamadas de la página) sigue apareciendo, agrupado en "Sin familia" — nunca desaparece del grid.',
      },
    },
  },
};

export const TodoDesactivado: StoryObj<typeof FamilyServiceMatrix> = {
  render: function Render() {
    const [value, setValue] = useState(new Map<string, boolean>());
    const [collapsed, setCollapsed] = useState(new Set<number>());

    return (
      <FamilyServiceMatrix
        workers={workers}
        services={services}
        families={families}
        value={value}
        defaultEnabled={false}
        collapsed={collapsed}
        onToggleFamily={(id) => setCollapsed((prev) => alternarPlegado(prev, id))}
        onChange={(w, s, next) => setValue((prev) => new Map(prev).set(matrixKey(w, s), next))}
        onChangeMany={(cambios) =>
          setValue((prev) => {
            const next = new Map(prev);
            for (const c of cambios) next.set(matrixKey(c.workerId, c.serviceId), c.next);
            return next;
          })
        }
      />
    );
  },
};
