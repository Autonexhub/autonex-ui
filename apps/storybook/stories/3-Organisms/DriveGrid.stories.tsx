import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { FileCard, GridView, type DriveFile, type DriveFolder } from '@autonexhub/react';

const meta: Meta<typeof GridView> = {
  title: '3-Organisms/DriveGrid',
  component: GridView,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Vista en cuadrícula del Drive: carpetas primero y luego archivos, cada uno como `FileCard` (icono por tipo MIME, fecha relativa, tamaño o nº de archivos). ' +
          'Cada tarjeta tiene menú de tres puntos y menú contextual (clic derecho) con Abrir, Vista previa, Renombrar, Descargar, Compartir y Eliminar según las acciones que se pasen. Sin contenido, estado vacío. Textos en `labels`.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof GridView>;

const ago = (days: number) => new Date(Date.now() - days * 86_400_000).toISOString();

const folders: DriveFolder[] = [
  { id: 1, name: 'Contratos', path: '/Contratos', updated_at: ago(0), file_count: 12 },
  { id: 2, name: 'Facturas 2026', path: '/Facturas 2026', updated_at: ago(3), file_count: 48 },
];

const files: DriveFile[] = [
  { id: 10, original_name: 'Propuesta comercial.pdf', storage_key: 'a', mime_type: 'application/pdf', file_size: 1_240_000, updated_at: ago(1) },
  { id: 11, original_name: 'Logo.png', storage_key: 'b', mime_type: 'image/png', file_size: 84_000, updated_at: ago(5) },
  { id: 12, original_name: 'Llamada cliente.mp3', storage_key: 'c', mime_type: 'audio/mpeg', file_size: 5_300_000, updated_at: ago(30) },
  { id: 13, original_name: 'Demo.mp4', storage_key: 'd', mime_type: 'video/mp4', file_size: 92_000_000, updated_at: ago(400) },
  { id: 14, original_name: 'Export.zip', storage_key: 'e', mime_type: 'application/zip', file_size: 0, updated_at: ago(2) },
  { id: 15, original_name: 'config.json', storage_key: 'f', mime_type: 'application/json', file_size: 2_048, updated_at: ago(8) },
];

const noop = () => {};

export const Default: Story = {
  name: 'Por defecto',
  render: function Render() {
    const [opened, setOpened] = useState<string>('—');
    return (
      <div className="space-y-4">
        <GridView
          folders={folders}
          files={files}
          onOpenFolder={(id) => setOpened(`carpeta ${id}`)}
          onOpenFile={(f) => setOpened(f.original_name)}
          onDownload={noop}
          onShare={noop}
          onDeleteFile={noop}
          onDeleteFolder={noop}
          onRenameFile={noop}
          onRenameFolder={noop}
        />
        <p className="text-xs text-muted-foreground">Último abierto: {opened}</p>
      </div>
    );
  },
};

export const SoloLectura: Story = {
  name: 'Sin acciones (solo abrir)',
  args: { folders, files, onOpenFolder: noop, onOpenFile: noop },
};

export const Vacio: Story = {
  name: 'Vacío',
  args: { folders: [], files: [], onOpenFolder: noop, onOpenFile: noop },
};

export const TarjetaSuelta: Story = {
  name: 'FileCard suelta',
  render: () => (
    <div className="w-48">
      <FileCard item={files[0]} type="file" onOpen={noop} onDownload={noop} onShare={noop} onDelete={noop} onRename={noop} />
    </div>
  ),
};
