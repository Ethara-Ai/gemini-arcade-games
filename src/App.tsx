import { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Background } from './components/layout/Background';
import { LoadingScreen } from './components/layout/LoadingScreen';
import { GameSelector } from './components/layout/GameSelector';
import { BrickrushGame } from './games/brickrush/BrickrushGame';
import { Game1024 } from './games/1024/Game1024';
import { SnakeGame } from './games/snake/SnakeGame';
import { Button } from './components/common/Button';

type AppState = 'loading' | 'menu' | 'brickrush' | '1024' | 'snake';

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div role="alert" className="min-h-screen flex items-center justify-center bg-game-dark p-4 text-center">
      <div className="glass-panel p-8 max-w-md">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Something went wrong</h2>
        <pre className="text-xs text-left bg-black/50 p-4 rounded mb-6 overflow-auto max-h-40 text-gray-300">
            {error.message}
        </pre>
        <Button onClick={resetErrorBoundary}>Try again</Button>
      </div>
    </div>
  );
}

function App() {
  const [appState, setAppState] = useState<AppState>('loading');

  const renderContent = () => {
    switch (appState) {
      case 'loading':
        return <LoadingScreen onComplete={() => setAppState('menu')} />;
      case 'menu':
        return <GameSelector onSelectGame={(game) => setAppState(game)} />;
      case 'brickrush':
        return <BrickrushGame />;
      case '1024':
        return <Game1024 />;
      case 'snake':
        return <SnakeGame />;
      default:
        return null;
    }
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => setAppState('menu')}>
      <div className="relative min-h-screen font-sans">
        <Background />
        {renderContent()}
        
        {/* Global Back Button (except on loading/menu) - temporary until games have their own menus */}
        {appState !== 'loading' && appState !== 'menu' && (
             <div className="fixed top-4 left-4 z-40">
                <Button variant="ghost" size="sm" onClick={() => setAppState('menu')}>
                    ← Back to Menu
                </Button>
            </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
