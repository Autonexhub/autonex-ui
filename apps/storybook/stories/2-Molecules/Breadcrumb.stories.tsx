import type { Meta, StoryObj } from '@storybook/react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@autonexhub/react';

const meta: Meta<typeof Breadcrumb> = {
  title: '2-Molecules/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  argTypes: {
    separator: {
      control: 'text',
      description: 'Separador personalizado (por defecto, un icono de chevron). Se pasa como hijo de BreadcrumbSeparator.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Migas de pan de navegación. Se componen con BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage y BreadcrumbSeparator.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
  name: 'Por defecto',
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/contactos">Contactos</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>María García</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

export const StoragePath: Story = {
  name: 'Ruta de archivos',
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/storage">Archivos</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/storage/facturas">Facturas</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>2026</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};
