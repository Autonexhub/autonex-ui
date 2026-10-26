import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@autonexhub/react';
import { Input } from '@autonexhub/react';
import { Button } from '@autonexhub/react';
import { Textarea } from '@autonexhub/react';
import { Checkbox } from '@autonexhub/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@autonexhub/react';
import { toast, Toaster } from '@autonexhub/react';

const meta: Meta = {
  title: '3-Organisms/Form',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Form components with react-hook-form and Zod validation.',
      },
    },
  },
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
};

export default meta;
type Story = StoryObj;

// Simple form schema and component
const simpleSchema = z.object({
  username: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
  email: z.string().email({ message: 'Email inválido.' }),
});

function SimpleFormExample() {
  const form = useForm<z.infer<typeof simpleSchema>>({
    resolver: zodResolver(simpleSchema),
    defaultValues: {
      username: '',
      email: '',
    },
  });

  function onSubmit(values: z.infer<typeof simpleSchema>) {
    toast.success('Formulario enviado', {
      description: `Usuario: ${values.username}, Email: ${values.email}`,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de usuario</FormLabel>
              <FormControl>
                <Input placeholder="tu_usuario" {...field} />
              </FormControl>
              <FormDescription>Este será tu nombre público.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="tu@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Enviar</Button>
      </form>
    </Form>
  );
}

export const Simple: Story = {
  render: () => <SimpleFormExample />,
};

// Contact form schema and component
const contactSchema = z.object({
  name: z.string().min(2, { message: 'Nombre requerido.' }),
  email: z.string().email({ message: 'Email inválido.' }),
  phone: z.string().optional(),
  channel: z.string({ required_error: 'Selecciona un canal.' }),
  message: z.string().min(10, { message: 'El mensaje debe tener al menos 10 caracteres.' }),
  terms: z.boolean().refine((val) => val === true, { message: 'Debes aceptar los términos.' }),
});

function ContactFormExample() {
  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
      terms: false,
    },
  });

  function onSubmit(values: z.infer<typeof contactSchema>) {
    toast.success('Mensaje enviado', {
      description: `Gracias ${values.name}, te contactaremos pronto.`,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre completo</FormLabel>
              <FormControl>
                <Input placeholder="Juan Pérez" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="tu@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono (opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="+34 612 345 678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="channel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Canal preferido</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un canal" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Teléfono</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mensaje</FormLabel>
              <FormControl>
                <Textarea placeholder="¿En qué podemos ayudarte?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Acepto los términos y condiciones</FormLabel>
                <FormDescription>
                  Al marcar esta casilla, aceptas nuestra política de privacidad.
                </FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Enviar mensaje
        </Button>
      </form>
    </Form>
  );
}

export const Contact: Story = {
  render: () => <ContactFormExample />,
};

// Login form schema and component
const loginSchema = z.object({
  email: z.string().email({ message: 'Email inválido.' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
  remember: z.boolean().default(false),
});

function LoginFormExample() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    toast.success('Iniciando sesión...', {
      description: `Email: ${values.email}`,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-sm">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="tu@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="remember"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel className="font-normal">Recordarme</FormLabel>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Iniciar sesión
        </Button>
      </form>
    </Form>
  );
}

export const Login: Story = {
  render: () => <LoginFormExample />,
};

// Error example component
const withErrorSchema = z.object({
  email: z.string().email({ message: 'Email inválido.' }),
});

function WithErrorFormExample() {
  const form = useForm<z.infer<typeof withErrorSchema>>({
    resolver: zodResolver(withErrorSchema),
    defaultValues: {
      email: 'invalid-email',
    },
  });

  // Trigger validation on mount to show error
  form.trigger('email');

  return (
    <Form {...form}>
      <form className="space-y-4 max-w-sm">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email con error</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormDescription>Este campo muestra un error de validación.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

export const WithError: Story = {
  render: () => <WithErrorFormExample />,
};
