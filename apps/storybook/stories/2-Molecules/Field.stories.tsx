import type { Meta, StoryObj } from '@storybook/react';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from '@autonexhub/react';
import { Input } from '@autonexhub/react';
import { Textarea } from '@autonexhub/react';
import { Checkbox } from '@autonexhub/react';
import { Switch } from '@autonexhub/react';
import { Button } from '@autonexhub/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@autonexhub/react';

const meta: Meta<typeof Field> = {
  title: '2-Molecules/Field',
  component: Field,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal', 'responsive'],
      description:
        'vertical: label encima del control (formularios). horizontal: label y control en fila (switches, checkboxes). responsive: vertical en móvil, horizontal desde sm.',
      table: { defaultValue: { summary: 'vertical' } },
    },
    className: {
      control: 'text',
      description: 'Clases adicionales (ancho, márgenes)',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Patrón estándar de formularios: Field agrupa FieldLabel + control + FieldDescription + FieldError. Usar SIEMPRE que un control lleve label, en lugar de apilar Label/Input a mano. FieldGroup separa campos de un formulario, FieldSet/FieldLegend agrupan campos relacionados y FieldSeparator divide secciones. El estado de error se marca con aria-invalid en el control (pinta el anillo rojo, como input.tsx) + data-invalid en el Field + FieldError con el mensaje.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Field>;

export const Default: Story = {
  render: (args) => (
    <Field {...args} className="w-96">
      <FieldLabel htmlFor="nombre-default">Nombre</FieldLabel>
      <Input id="nombre-default" placeholder="María García" />
      <FieldDescription>Nombre y apellidos del contacto.</FieldDescription>
    </Field>
  ),
  args: { orientation: 'vertical' },
};

export const WithError: Story = {
  name: 'Con error',
  render: () => (
    <Field data-invalid="true" className="w-96">
      <FieldLabel htmlFor="telefono-error">Teléfono</FieldLabel>
      <Input
        id="telefono-error"
        type="tel"
        defaultValue="12345"
        aria-invalid="true"
        aria-describedby="telefono-error-msg"
      />
      <FieldError id="telefono-error-msg">
        Introduce un teléfono válido de 9 dígitos.
      </FieldError>
    </Field>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <div className="w-96 flex flex-col gap-4">
      <Field orientation="horizontal">
        <FieldContent>
          <FieldTitle>Notificaciones por email</FieldTitle>
          <FieldDescription>
            Recibe un resumen diario de las conversaciones.
          </FieldDescription>
        </FieldContent>
        <Switch id="notif-email" defaultChecked />
      </Field>
      <Field orientation="horizontal">
        <Checkbox id="acepta-terminos" />
        <FieldLabel htmlFor="acepta-terminos" className="font-normal">
          He leído y acepto la política de privacidad
        </FieldLabel>
      </Field>
    </div>
  ),
};

export const MultipleErrors: Story = {
  name: 'Varios errores (prop errors)',
  render: () => (
    <Field data-invalid="true" className="w-96">
      <FieldLabel htmlFor="password-errors">Contraseña</FieldLabel>
      <Input id="password-errors" type="password" defaultValue="abc" aria-invalid="true" />
      <FieldError
        errors={[
          { message: 'Debe tener al menos 8 caracteres.' },
          { message: 'Debe incluir un número.' },
        ]}
      />
    </Field>
  ),
};

export const ContactForm: Story = {
  name: 'Formulario de contacto (panel Marta)',
  render: () => (
    <form className="w-[28rem] rounded-lg border border-border bg-card p-6" onSubmit={(e) => e.preventDefault()}>
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Nuevo contacto</FieldLegend>
          <FieldDescription>
            Se vinculará automáticamente a las conversaciones existentes por teléfono.
          </FieldDescription>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="cf-nombre">Nombre completo</FieldLabel>
              <Input id="cf-nombre" placeholder="María García López" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="cf-telefono">Teléfono</FieldLabel>
                <Input id="cf-telefono" type="tel" placeholder="612 345 678" />
                <FieldDescription>Con prefijo si no es +34.</FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="cf-email">Email</FieldLabel>
                <Input id="cf-email" type="email" placeholder="maria@ejemplo.com" />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="cf-org">Organización</FieldLabel>
              <Select>
                <SelectTrigger id="cf-org" className="w-full">
                  <SelectValue placeholder="Selecciona una organización" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eurofitness">Eurofitness Can Dragó</SelectItem>
                  <SelectItem value="hemomadrid">Hemomadrid</SelectItem>
                  <SelectItem value="mqa">Máis que Auga</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSeparator>Detalles opcionales</FieldSeparator>

        <Field>
          <FieldLabel htmlFor="cf-notas">Notas internas</FieldLabel>
          <Textarea
            id="cf-notas"
            placeholder="Prefiere que le llamen por la tarde…"
            rows={3}
          />
          <FieldDescription>Solo visibles para el equipo, nunca para el cliente.</FieldDescription>
        </Field>

        <Field orientation="horizontal">
          <Checkbox id="cf-consentimiento" defaultChecked />
          <FieldContent>
            <FieldLabel htmlFor="cf-consentimiento">Consentimiento RGPD</FieldLabel>
            <FieldDescription>
              El contacto ha dado su consentimiento para recibir comunicaciones.
            </FieldDescription>
          </FieldContent>
        </Field>

        <Field orientation="horizontal">
          <Button type="submit">Guardar contacto</Button>
          <Button variant="outline" type="button">
            Cancelar
          </Button>
        </Field>
      </FieldGroup>
    </form>
  ),
};
