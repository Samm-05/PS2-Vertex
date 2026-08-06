import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  setCurrentEpoch,
  setIsPlaying,
  setPlaybackSpeed,
  resetSimulation,
} from '../neuralNetworkSlice';
import Card from '../../../components/ui/Card';
import { Play, Pause, RotateCcw, SkipBack, SkipForward } from 'lucide-react';
import { soundFx } from '../../gradientDescent/utils/soundEffects';

export const TimelineControls: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentEpoch, trajectory, isPlaying, playbackSpeed } = useAppSelector(
    (state) => state.neuralNetwork
  );

  const maxEpoch = trajectory.length > 0 ? trajectory.length - 1 : 0;

  // Auto-play timer interval
  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = Math.max(80, 400 / playbackSpeed);
    const timer = setInterval(() => {
      if (currentEpoch < maxEpoch) {
        dispatch(setCurrentEpoch(currentEpoch + 1));
        soundFx.playStepSound();
      } else {
        dispatch(setIsPlaying(false));
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, currentEpoch, maxEpoch, playbackSpeed, dispatch]);

  return (
    <Card className="p-3 bg-midnight/90 border border-apres/30 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Controls Group */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => dispatch(resetSimulation())}
          className="p-2 rounded-xl bg-mountainside/50 text-slopes hover:text-arctic hover:bg-mountainside border border-apres/30 transition-all"
          title="Reset Simulation (R)"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          disabled={currentEpoch <= 0}
          onClick={() => dispatch(setCurrentEpoch(currentEpoch - 1))}
          className="p-2 rounded-xl bg-mountainside/50 text-slopes hover:text-arctic hover:bg-mountainside border border-apres/30 transition-all disabled:opacity-40"
          title="Previous Epoch (Left Arrow)"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            if (currentEpoch >= maxEpoch) dispatch(setCurrentEpoch(0));
            dispatch(setIsPlaying(!isPlaying));
          }}
          className="px-4 py-2 rounded-xl bg-arctic text-midnight hover:bg-slopes font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
          title="Play / Pause (Space)"
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-midnight" /> : <Play className="w-4 h-4 fill-midnight" />}
          <span>{isPlaying ? 'Pause' : 'Train'}</span>
        </button>

        <button
          disabled={currentEpoch >= maxEpoch}
          onClick={() => dispatch(setCurrentEpoch(currentEpoch + 1))}
          className="p-2 rounded-xl bg-mountainside/50 text-slopes hover:text-arctic hover:bg-mountainside border border-apres/30 transition-all disabled:opacity-40"
          title="Next Epoch (Right Arrow)"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Scrub Slider */}
      <div className="flex-1 w-full max-w-xl flex items-center gap-3 font-mono text-xs">
        <span className="text-cyan-400 font-bold w-16 text-right">Epoch {currentEpoch}</span>
        <input
          type="range"
          min="0"
          max={maxEpoch}
          value={currentEpoch}
          onChange={(e) => dispatch(setCurrentEpoch(parseInt(e.target.value, 10)))}
          className="flex-1 h-2 bg-mountainside rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />
        <span className="text-apres w-12">/ {maxEpoch}</span>
      </div>

      {/* Speed Selector */}
      <div className="flex items-center gap-1 bg-mountainside/50 p-1 rounded-xl border border-apres/30 text-xs font-mono">
        {[0.5, 1, 2, 4].map((spd) => (
          <button
            key={spd}
            onClick={() => dispatch(setPlaybackSpeed(spd))}
            className={`px-2 py-1 rounded-lg transition-all ${
              playbackSpeed === spd
                ? 'bg-arctic text-midnight font-bold'
                : 'text-slopes hover:text-arctic'
            }`}
          >
            {spd}x
          </button>
        ))}
      </div>
    </Card>
  );
};

export default TimelineControls;
