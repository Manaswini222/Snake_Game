import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-digital overflow-hidden flex flex-col relative uppercase screen-tear">
      <div className="bg-noise" />
      <div className="scanlines" />
      
      {/* Header */}
      <header className="relative z-10 w-full p-4 flex justify-between items-end border-b-4 border-fuchsia-500 bg-black">
        <div className="flex flex-col">
          <span className="text-fuchsia-500 text-xl tracking-widest animate-pulse">SYS.INIT //</span>
          <h1 className="text-6xl font-digital tracking-tighter text-cyan-400 glitch-text" data-text="NEON_SNAKE.EXE">
            NEON_SNAKE.EXE
          </h1>
        </div>
        
        <div className="flex flex-col items-end border-l-4 border-cyan-400 pl-4">
          <span className="text-xl text-fuchsia-500 tracking-widest mb-1">MEMORY_ALLOCATION</span>
          <span 
            className="text-6xl text-cyan-400 glitch-text"
            data-text={score.toString().padStart(4, '0')}
          >
            {score.toString().padStart(4, '0')}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 flex flex-col lg:flex-row items-start justify-center gap-8 p-4 lg:p-8">
        {/* Game Area */}
        <div className="flex-1 w-full max-w-3xl flex items-center justify-center border-4 border-cyan-400 p-2 bg-black relative">
          <div className="absolute top-0 left-0 bg-cyan-400 text-black px-2 py-1 text-sm font-bold">EXECUTION_ENVIRONMENT</div>
          <SnakeGame onScoreUpdate={setScore} />
        </div>

        {/* Sidebar / Music Player Area */}
        <div className="w-full lg:w-96 flex flex-col gap-8">
          <div className="border-4 border-fuchsia-500 p-4 bg-black relative">
            <div className="absolute top-0 left-0 bg-fuchsia-500 text-black px-2 py-1 text-sm font-bold">DIAGNOSTICS</div>
            <h2 className="text-3xl text-cyan-400 mb-4 mt-6 flex items-center gap-2 glitch-text" data-text="SYSTEM COMPROMISED">
              SYSTEM COMPROMISED
            </h2>
            <div className="space-y-2 text-xl">
              <div className="flex justify-between border-b-2 border-dashed border-cyan-400/50 pb-1">
                <span className="text-fuchsia-500">UPLINK</span>
                <span className="text-cyan-400 animate-pulse">UNSTABLE</span>
              </div>
              <div className="flex justify-between border-b-2 border-dashed border-cyan-400/50 pb-1">
                <span className="text-fuchsia-500">PACKET_LOSS</span>
                <span className="text-cyan-400">84.2%</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-fuchsia-500">OVERRIDE</span>
                <span className="text-fuchsia-500 glitch-text" data-text="REQUIRED">REQUIRED</span>
              </div>
            </div>
          </div>

          <MusicPlayer />
        </div>
      </main>
    </div>
  );
}
