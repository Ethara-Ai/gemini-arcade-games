import React from 'react';

export const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-game-dark">
      {/* Orb 1: Cyan */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vh] h-[50vh] bg-game-brick/20 rounded-full blur-[100px] animate-pulse-slow" />
      
      {/* Orb 2: Amber */}
      <div className="absolute top-[20%] right-[-10%] w-[60vh] h-[60vh] bg-game-tile/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
      
      {/* Orb 3: Green */}
      <div className="absolute bottom-[-10%] left-[20%] w-[55vh] h-[55vh] bg-game-snake/15 rounded-full blur-[110px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      
      {/* Orb 4: Pink Highlight */}
      <div className="absolute bottom-[10%] right-[10%] w-[40vh] h-[40vh] bg-game-highlight/10 rounded-full blur-[90px] animate-pulse-slow" style={{ animationDelay: '3s' }} />
      
      <div className="absolute inset-0 bg-black/20" /> {/* Overlay to deepen blacks */}
    </div>
  );
};

