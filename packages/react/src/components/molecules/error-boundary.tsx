import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from "../ui/button";
import { Warning as AlertTriangle, ArrowsClockwise as RefreshCw, House as Home } from "@phosphor-icons/react";

export interface ErrorBoundaryLabels {
  title: string;
  description: string;
  technicalDetails: string;
  reload: string;
  home: string;
}

const DEFAULT_LABELS: ErrorBoundaryLabels = {
  title: 'Algo se ha roto en esta página',
  description: 'No te preocupes, tu sesión sigue activa. Esto NO te ha desconectado. Puedes volver al inicio o recargar la página.',
  technicalDetails: 'Detalles técnicos',
  reload: 'Recargar',
  home: 'Inicio',
};

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (e: Error, reset: () => void) => ReactNode;
  labels?: Partial<ErrorBoundaryLabels>;
}
type Props = ErrorBoundaryProps;
interface State { error: Error | null }

/**
 * Catches render-time errors anywhere in the tree and renders a friendly
 * error UI instead of leaving the user staring at a blank page.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary] React render error:', error);
    console.error('[ErrorBoundary] Component stack:', info.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback(this.state.error, this.reset);
      const l = { ...DEFAULT_LABELS, ...this.props.labels };
      return (
        <div className="flex flex-1 items-center justify-center px-10 py-6">
          <div className="max-w-md w-full text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-destructive-soft flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <h2 className="mb-1 text-lg font-semibold">{l.title}</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              {l.description}
            </p>
            <details className="mb-4 rounded bg-muted/40 p-3 text-left font-mono text-xs text-muted-foreground">
              <summary className="cursor-pointer hover:text-foreground select-none">{l.technicalDetails}</summary>
              <div className="mt-2 break-all">{this.state.error.message}</div>
              {this.state.error.stack && (
                <pre className="mt-2 max-h-32 overflow-auto whitespace-pre-wrap text-xs">{this.state.error.stack.split('\n').slice(0, 8).join('\n')}</pre>
              )}
            </details>
            <div className="flex items-center justify-center gap-2">
              <Button variant="outline" onClick={() => { this.reset(); window.location.reload(); }} className="gap-1.5"><RefreshCw className="h-3.5 w-3.5" />{l.reload}</Button>
              <Button onClick={() => { this.reset(); window.location.href = '/'; }} className="gap-1.5"><Home className="h-3.5 w-3.5" />{l.home}</Button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
