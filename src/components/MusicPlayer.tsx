import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Terminal } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: 'SECTOR_01.WAV',
    artist: 'UNKNOWN_ENTITY',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: '6:12'
  },
  {
    id: 2,
    title: 'CORRUPTION_LOOP.MP3',
    artist: 'SYS_ADMIN',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: '7:05'
  },
  {
    id: 3,
    title: 'VOID_SIGNAL.FLAC',
    artist: 'NULL_POINTER',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: '5:44'
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const playNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleEnded = () => {
    playNext();
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
      setProgress(percentage * 100);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-black border-4 border-cyan-400 p-4 relative">
      <div className="absolute top-0 right-0 bg-cyan-400 text-black px-2 py-1 text-sm font-bold">AUDIO_SUBSYSTEM</div>
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      <div className="flex items-center justify-between mb-6 mt-6 border-b-4 border-fuchsia-500 pb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 border-4 border-fuchsia-500 bg-black flex items-center justify-center animate-pulse">
            <Terminal className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-cyan-400 text-2xl leading-none mb-1 glitch-text" data-text={currentTrack.title}>
              {currentTrack.title}
            </h3>
            <p className="text-fuchsia-500 text-lg">
              SRC: {currentTrack.artist}
            </p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="text-fuchsia-500 hover:text-cyan-400 hover:bg-fuchsia-500 p-2 border-2 border-transparent hover:border-cyan-400 transition-none"
        >
          {isMuted ? <VolumeX className="w-8 h-8" /> : <Volume2 className="w-8 h-8" />}
        </button>
      </div>

      <div 
        className="h-4 w-full bg-black border-2 border-cyan-400 mb-6 cursor-pointer relative"
        onClick={handleProgressClick}
      >
        <div 
          className="h-full bg-fuchsia-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between px-4">
        <button 
          onClick={playPrev}
          className="text-cyan-400 hover:text-black hover:bg-cyan-400 p-2 border-2 border-cyan-400 transition-none"
        >
          <SkipBack className="w-8 h-8" />
        </button>
        
        <button 
          onClick={togglePlay}
          className="w-16 h-16 flex items-center justify-center border-4 border-fuchsia-500 bg-black text-fuchsia-500 hover:bg-fuchsia-500 hover:text-black transition-none"
        >
          {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
        </button>
        
        <button 
          onClick={playNext}
          className="text-cyan-400 hover:text-black hover:bg-cyan-400 p-2 border-2 border-cyan-400 transition-none"
        >
          <SkipForward className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
