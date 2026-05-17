import { StrictMode, Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'
import { createRoot } from 'react-dom/client'
import i18n from './i18n/index'
import './index.css'
import App from './App'

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '2rem', color: '#ff6b6b', fontFamily: 'monospace' }}>
          <h2>{i18n.t('error.title')}</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{(this.state.error as Error).message}</pre>
          <button onClick={() => this.setState({ error: null })} style={{ marginTop: '1rem', cursor: 'pointer' }}>
            {i18n.t('error.retry')}
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

const container = document.getElementById('root')!

// Avoid double createRoot calls during HMR
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const root = (container as any).__reactRoot ?? createRoot(container)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(container as any).__reactRoot = root

root.render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
