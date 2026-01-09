# Gemini Arcade Games

A polished, production-ready arcade game collection built with React 18, Vite, and Tailwind CSS.
Featuring three classic games: **Brickrush**, **1024**, and **Snake**.

## Features

- **Classic Gameplay**: Three fully playable games with high score tracking.
- **Modern UI**: Dark glassmorphism aesthetic with animated backgrounds and smooth transitions.
- **Responsive**: Play on desktop (keyboard/mouse) or mobile (touch/swipe).
- **Accessibility**: Keyboard navigation, ARIA support, and reduced motion considerations.
- **Robust Architecture**: Custom React hooks for game logic, Canvas API for performance, and extensive error handling.

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Run development server**:
    ```bash
    npm run dev
    ```

3.  **Build for production**:
    ```bash
    npm run build
    ```

## Controls

### Global
- **Escape**: Close menus / modals.

### Brickrush (Breakout)
- **Desktop**: Mouse to move paddle.
- **Mobile**: Touch and drag to move paddle.
- **Goal**: Destroy all bricks. Catch power-ups. Don't let the ball fall.

### 1024 (Puzzle)
- **Desktop**: Arrow keys or WASD to slide tiles.
- **Mobile**: Swipe to slide tiles.
- **Goal**: Merge matching numbers to reach 1024.

### Snake
- **Desktop**: Arrow keys or WASD to change direction. Space/P to pause.
- **Mobile**: Swipe or use on-screen D-Pad.
- **Goal**: Eat food to grow. Avoid walls and your own tail.

## Architecture

- **Tech Stack**: React 18, TypeScript, Tailwind CSS, Framer Motion, Vitest.
- **State Management**: React Hooks (`useState`, `useReducer`) and Context where appropriate.
- **Rendering**: 
  - Brickrush & Snake: HTML5 Canvas for high-performance rendering.
  - 1024: DOM elements with CSS/Framer Motion animations.
- **Testing**: Unit tests for game logic using Vitest.

## Contributing

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit changes (`git commit -m 'Add amazing feature'`).
4.  Push to branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.

## License

MIT

