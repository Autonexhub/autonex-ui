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
**Qué es:** los avisos efímeros (toasts) del panel. **Es el ÚNICO sistema de toasts**: el
\`toast.tsx\`/\`use-toast.ts\` de Radix se eliminó el 31/08/2026 y no hay que reintroducirlo.
Salen abajo a la derecha a través del envoltorio \`Toaster\` de \`@autonexhub/react\` (iconos Phosphor,
tokens de popover); los diálogos siguen centrados y los sheets entran por la derecha.

**Cuándo:** confirmar una acción (guardado, creado, eliminado), avisar de un error recuperable o
seguir una operación asíncrona. No sirve para errores que bloquean: eso va en la propia página.

## Uso
\`\`\`tsx
import { toast } from 'sonner';

toast.success('Guardado correctamente');
toast.error('Error al guardar');
toast.info('Información importante');
toast.warning('Atención requerida');

// Con descripción
toast.success('Contacto creado', { description: 'El contacto se ha añadido a la lista.' });

// Con acción
toast.error('Error de conexión', { action: { label: 'Reintentar', onClick: () => retry() } });

// Promesa (cargando → éxito/error)
toast.promise(saveData(), {
  loading: 'Guardando…',
  success: 'Guardado correctamente',
  error: 'Error al guardar',
});
\`\`\`

**Montaje:** \`<Toaster />\` se monta una sola vez en la raíz de la app.

**Reglas:** textos en español, cortos y en positivo ("Cambios guardados", no "Se han guardado los
cambios correctamente"). Un toast por acción; nada de encadenarlos.
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const AllVariants: Story = {
  name: 'Variantes',
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => toast.success('Operación completada')}>
        Éxito
      </Button>
      <Button onClick={() => toast.error('Ha ocurrido un error')} variant="destructive">
        Error
      </Button>
      <Button onClick={() => toast.info('Información importante')} variant="outline">
        Información
      </Button>
      <Button onClick={() => toast.warning('Atención requerida')} variant="outline">
        Aviso
      </Button>
      <Button onClick={() => toast('Mensaje neutral')} variant="secondary">
        Neutro
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Pulsa cada botón para ver las variantes.',
      },
    },
  },
};

export const WithDescription: Story = {
  name: 'Con descripción',
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
  name: 'Con acción',
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={() =>
          toast.error('No se pudo conectar', {
            action: {
              label: 'Reintentar',
              onClick: () => toast.success('Conectado'),
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
  name: 'Promesa',
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
        Simular operación asíncrona
      </Button>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Muestra el estado de carga y después éxito o error según el resultado de la promesa.',
      },
    },
  },
};

export const CustomDuration: Story = {
  name: 'Duración',
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
  name: 'Icono propio',
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={() =>
          toast('Sincronizando...', {
            icon: <CircleNotch className="h-4 w-4 animate-spin" />,
          })
        }
      >
        Icono de carga
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.success('Verificado', {
            icon: <CheckCircle className="h-4 w-4 text-success" />,
          })
        }
      >
        Icono de éxito propio
      </Button>
    </div>
  ),
};

export const Dismiss: Story = {
  name: 'Cerrar',
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
        story: 'Cerrar por código un toast concreto o todos.',
      },
    },
  },
};

export const CommonPatterns: Story = {
  name: 'Patrones habituales',
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Patrones habituales en el panel</h3>
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
          Aviso con acción
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Patrones habituales en el panel.',
      },
    },
  },
};
