import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { BsBricks } from 'react-icons/bs';
import { MdGrid4X4 } from 'react-icons/md';
import { GiSnake } from 'react-icons/gi';
import { useKeyPress } from '../../hooks/useKeyboard';

interface GameSelectorProps {
  onSelectGame: (gameId: 'brickrush' | '1024' | 'snake') => void;
}

const games = [
  {
    id: 'brickrush',
    title: 'Brickrush',
    description: 'Classic breakout action with power-ups and boss battles.',
    icon: BsBricks,
    color: 'text-game-brick',
    borderColor: 'hover:border-game-brick',
    key: '1',
  },
  {
    id: '1024',
    title: '1024',
    description: 'Slide and merge tiles to reach the legendary 1024 tile.',
    icon: MdGrid4X4,
    color: 'text-game-tile',
    borderColor: 'hover:border-game-tile',
    key: '2',
  },
  {
    id: 'snake',
    title: 'Snake',
    description: 'Grow your snake, avoid walls, and collect golden food.',
    icon: GiSnake,
    color: 'text-game-snake',
    borderColor: 'hover:border-game-snake',
    key: '3',
  },
] as const;

export const GameSelector: React.FC<GameSelectorProps> = ({ onSelectGame }) => {
  const press1 = useKeyPress('1');
  const press2 = useKeyPress('2');
  const press3 = useKeyPress('3');

  useEffect(() => {
    if (press1) onSelectGame('brickrush');
    if (press2) onSelectGame('1024');
    if (press3) onSelectGame('snake');
  }, [press1, press2, press3, onSelectGame]);

  return (
    <div className="min-h-screen flex items-center justify-center p-8 z-10 relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            onClick={() => onSelectGame(game.id as any)}
            className={`group relative glass-panel p-8 cursor-pointer transition-all duration-300 hover:scale-105 border-2 border-transparent ${game.borderColor}`}
          >
            <div className={`text-6xl mb-6 ${game.color} transition-transform group-hover:scale-110 duration-300`}>
              <game.icon />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">{game.title}</h2>
            <p className="text-gray-400 mb-6 min-h-[3rem]">{game.description}</p>
            
            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-mono text-sm text-gray-400 border border-white/10">
              {game.key}
            </div>
            
            <div className="flex flex-wrap gap-2">
                <span className="text-xs font-semibold px-2 py-1 rounded bg-white/5 text-gray-300">Arcade</span>
                <span className="text-xs font-semibold px-2 py-1 rounded bg-white/5 text-gray-300">Single Player</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

