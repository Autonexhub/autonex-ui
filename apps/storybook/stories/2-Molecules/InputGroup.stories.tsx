import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from '@autonexhub/react';
import { Kbd } from '@autonexhub/react';
import { Check, Copy, EnvelopeSimple, MagnifyingGlass, PaperPlaneTilt } from '@phosphor-icons/react';

const meta: Meta<typeof InputGroup> = {
  title: '2-Molecules/InputGroup',
  component: InputGroup,
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Clases adicionales (ancho, márgenes)',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Input con addons: icono, prefijo/sufijo de texto (InputGroupText), atajo de teclado (Kbd) o botones (InputGroupButton). El contenedor pinta el relleno bg-muted y el anillo de foco/error (mismo patrón que Input); usar InputGroupInput/InputGroupTextarea dentro, nunca Input suelto. InputGroupAddon acepta align: inline-start | inline-end | block-start | block-end. Error vía aria-invalid en el control.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof InputGroup>;

export const Buscador: Story = {
  render: () => (
    <InputGroup className="w-80">
      <InputGroupAddon>
        <MagnifyingGlass />
      </InputGroupAddon>
      <InputGroupInput type="search" placeholder="Buscar conversaciones…" />
      <InputGroupAddon align="inline-end">
        <Kbd>⌘K</Kbd>
      </InputGroupAddon>
    </InputGroup>
  ),
};

export const TelefonoConPrefijo: Story = {
  name: 'Teléfono con prefijo',
  render: () => (
    <InputGroup className="w-80">
      <InputGroupAddon>
        <InputGroupText>+34</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput type="tel" placeholder="612 345 678" />
    </InputGroup>
  ),
};

const CopiarApiKeyDemo = () => {
  const [copied, setCopied] = useState(false);
  return (
    <InputGroup className="w-96">
      <InputGroupInput readOnly value="mcp_a1b2c3d4e5f6g7h8i9j0" className="font-mono text-xs" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          size="icon-xs"
          aria-label="Copiar token"
          onClick={() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
        >
          {copied ? <Check className="text-success" /> : <Copy />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
};

export const CopiarApiKey: Story = {
  name: 'Copiar API key',
  render: () => <CopiarApiKeyDemo />,
};

export const ConBotonDeTexto: Story = {
  name: 'Con botón de acción',
  render: () => (
    <InputGroup className="w-96">
      <InputGroupAddon>
        <EnvelopeSimple />
      </InputGroupAddon>
      <InputGroupInput type="email" placeholder="email@ejemplo.com" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton variant="brand">Invitar</InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
};

export const ConError: Story = {
  name: 'Con error (aria-invalid)',
  render: () => (
    <InputGroup className="w-80">
      <InputGroupAddon>
        <InputGroupText>+34</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput type="tel" defaultValue="12345" aria-invalid="true" />
    </InputGroup>
  ),
};

export const ConTextarea: Story = {
  name: 'Textarea con acciones',
  render: () => (
    <InputGroup className="w-96">
      <InputGroupTextarea placeholder="Escribe una respuesta al cliente…" rows={3} />
      <InputGroupAddon align="block-end">
        <InputGroupText className="text-xs">0 / 500</InputGroupText>
        <InputGroupButton variant="brand" size="icon-sm" aria-label="Enviar" className="ml-auto">
          <PaperPlaneTilt />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
};
