import type { Meta, StoryObj } from '@storybook/react';
import { toast, Toaster, Button } from '@autonexhub/react';
import { CheckCircle, CircleNotch } from '@phosphor-icons/react';

const meta: Meta = {
  title: '2-Molecules/Sonner',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: `
Sonner is the toast notification library used throughout the dashboard.

## IMPORTANT
**This is the ONLY toast system** — the legacy Radix \`toast.tsx\`/\`use-toast.ts\`
were removed (2026-08-31). Toasts appear bottom-right via the \`@/components/ui/sonner\`
wrapper (Phosphor icons, popover tokens); dialogs stay centered, sheets slide from the right.

## Usage
\`\`\`tsx
import { toast } from 'sonner';

// Simple messages
toast.success('Guardado correctamente');
toast.error('Error al guardar');
toast.info('Información importante');
toast.warning('Atención requerida');

// With description
toast.success('Contacto creado', {
  description: 'El contacto ha sido añadido a la lista.',
});

// With action
toast.error('Error de conexión', {
  action: {
    label: 'Reintentar',
    onClick: () => retry(),
  },
});

// Promise toast (loading → success/error)
toast.promise(saveData(), {
  loading: 'Guardando...',
  success: 'Guardado correctamente',
  error: 'Error al guardar',
});
\`\`\`

## Setup
The \`<Toaster />\` component must be mounted once at the app root (in App.tsx or layout).

## Props (Toaster)
- **position**: Where toasts appear (bottom-right default)
- **richColors**: Enhanced color styling
- **theme**: light/dark/system
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => toast.success('Operación completada')}>
        Success
      </Button>
      <Button onClick={() => toast.error('Ha ocurrido un error')} variant="destructive">
        Error
      </Button>
      <Button onClick={() => toast.info('Información importante')} variant="outline">
        Info
      </Button>
      <Button onClick={() => toast.warning('Atención requerida')} variant="outline">
        Warning
      </Button>
      <Button onClick={() => toast('Mensaje neutral')} variant="secondary">
        Default
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Click buttons to see different toast variants.',
      },
    },
  },
};

export const WithDescription: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={() =>
          toast.success('Contacto guardado', {
            description: 'Juan García ha sido añadido a tu lista de contactos.',
          })
        }
      >
        Con descripción
      </Button>
      <Button
        variant="destructive"
        onClick={() =>
          toast.error('Error de validación', {
            description: 'El campo email es requerido.',
          })
        }
      >
        Error con detalle
      </Button>
    </div>
  ),
};

export const WithAction: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={() =>
          toast.error('No se pudo conectar', {
            action: {
              label: 'Reintentar',
              onClick: () => toast.success('Conectado!'),
            },
          })
        }
      >
        Con acción
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast('Cambios sin guardar', {
            action: {
              label: 'Guardar',
              onClick: () => toast.success('Guardado'),
            },
            cancel: {
              label: 'Descartar',
              onClick: () => toast.info('Descartado'),
            },
          })
        }
      >
        Con acción y cancelar
      </Button>
    </div>
  ),
};

export const PromiseToast: Story = {
  render: function Render() {
    const simulateAsync = () =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.3) resolve('done');
          else reject(new Error('fail'));
        }, 2000);
      });

    return (
      <Button
        onClick={() =>
          toast.promise(simulateAsync(), {
            loading: 'Guardando cambios...',
            success: 'Cambios guardados correctamente',
            error: 'Error al guardar los cambios',
          })
        }
      >
        Simular operación async
      </Button>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Promise toast shows loading state, then success or error based on promise result.',
      },
    },
  },
};

export const CustomDuration: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        onClick={() => toast.info('Desaparece en 2s', { duration: 2000 })}
      >
        2 segundos
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.info('Desaparece en 10s', { duration: 10000 })}
      >
        10 segundos
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.info('Permanente (cerrar manual)', { duration: Infinity })}
      >
        Permanente
      </Button>
    </div>
  ),
};

export const WithCustomIcon: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={() =>
          toast('Sincronizando...', {
            icon: <CircleNotch className="h-4 w-4 animate-spin" />,
          })
        }
      >
        Loading icon
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.success('Verificado', {
            icon: <CheckCircle className="h-4 w-4 text-success" />,
          })
        }
      >
        Custom success icon
      </Button>
    </div>
  ),
};

export const Dismiss: Story = {
  render: function Render() {
    let toastId: string | number;
    return (
      <div className="flex gap-2">
        <Button
          onClick={() => {
            toastId = toast.loading('Procesando...', { duration: Infinity });
          }}
        >
          Mostrar toast
        </Button>
        <Button variant="outline" onClick={() => toast.dismiss(toastId)}>
          Cerrar toast
        </Button>
        <Button variant="destructive" onClick={() => toast.dismiss()}>
          Cerrar todos
        </Button>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Programmatically dismiss specific or all toasts.',
      },
    },
  },
};

export const CommonPatterns: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Patrones comunes en el dashboard:</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={() => toast.success('Contacto creado correctamente')}
        >
          Crear registro
        </Button>
        <Button
          size="sm"
          onClick={() => toast.success('Cambios guardados')}
        >
          Guardar cambios
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() =>
            toast.error('Error al eliminar', {
              description: 'No tienes permisos para esta acción.',
            })
          }
        >
          Error de permisos
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            toast.warning('Sesión por expirar', {
              description: 'Tu sesión expirará en 5 minutos.',
              action: {
                label: 'Extender',
                onClick: () => toast.success('Sesión extendida'),
              },
            })
          }
        >
          Warning con acción
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Common toast patterns used throughout the dashboard.',
      },
    },
  },
};
