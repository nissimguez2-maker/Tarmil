import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

type State = {
  error: Error | null;
};

/**
 * App-level error boundary. Without this, an uncaught error during render or
 * commit (e.g., a Mapbox-GL teardown throw on tab navigation) unmounts the
 * entire React tree and leaves a blank page until the user hard-refreshes.
 *
 * Catches the error, logs it, and renders a small Hebrew fallback. Tapping
 * the reload pill resets the boundary so the next nav can succeed.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      return (
        <div className="flex h-dvh w-full flex-col items-center justify-center gap-md bg-ivory p-md text-center">
          <h1 className="font-serif text-sub text-cocoa">משהו השתבש</h1>
          <p className="max-w-body text-body text-cocoa-70">
            המסך נפל לרגע. נסה לרענן או לחזור למסך הקודם.
          </p>
          <button
            type="button"
            onClick={this.reset}
            className="inline-flex h-12 items-center justify-center rounded-full bg-cocoa px-md text-[11pt] font-medium text-ivory active:bg-cocoa-70"
          >
            נסה שוב
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
