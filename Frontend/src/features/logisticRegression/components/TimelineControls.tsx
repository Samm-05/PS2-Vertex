import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  setCurrentEpoch,
  setIsPlaying,
  setPlaybackSpeed,
  resetSimulation,
} from '../logisticRegressionSlice';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
} from 'lucide-react';

export const TimelineControls: React.FC = () => {
  const dispatch = useAppDispatch();
  const { trajectory, currentEpoch, isPlaying, playbackSpeed } = useAppSelector(
    (state) => state.logisticRegression
  );

  const maxEpoch = trajectory.length > 0 ? trajectory.length - 1 : 0;

  // Auto-play animation timer loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        dispatch((dispatch, getState) => {
          const state = getState().logisticRegression;
          if (state.currentEpoch < maxEpoch) {
            dispatch(setCurrentEpoch(state.currentEpoch + 1));
          } else {
            dispatch(setIsPlaying(false));
          }
        });
      }, 300 / playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, maxEpoch, dispatch]);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-midnight/90 backdrop-blur-md rounded-2xl border border-apres/30 font-mono text-xs text-arctic">
      {/* Playback Controls Group */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => dispatch(resetSimulation())}
          className="p-2 rounded-xl bg-mountainside text-slopes hover:text-arctic transition-all"
          title="Reset Simulation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          disabled={currentEpoch <= 0}
          onClick={() => dispatch(setCurrentEpoch(currentEpoch - 1))}
          className="p-2 rounded-xl bg-mountainside text-slopes hover:text-arctic disabled:opacity-40 transition-all"
          title="Step Back"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        <button
          onClick={() => dispatch(setIsPlaying(!isPlaying))}
          className="p-2.5 rounded-xl bg-arctic text-midnight hover:bg-slopes shadow-lg transition-all"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        <button
          disabled={currentEpoch >= maxEpoch}
          onClick={() => dispatch(setCurrentEpoch(currentEpoch + 1))}
          className="p-2 rounded-xl bg-mountainside text-slopes hover:text-arctic disabled:opacity-40 transition-all"
          title="Step Forward"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Epoch Scrubbing Slider */}
      <div className="flex-1 w-full flex items-center gap-3 px-2">
        <span className="text-apres text-[11px] whitespace-nowrap">
          Epoch: <span className="text-cyan-400 font-bold">{currentEpoch}</span> / {maxEpoch}
        </span>
        <input
          type="range"
          min="0"
          max={maxEpoch}
          value={currentEpoch}
          onChange={(e) => dispatch(setCurrentEpoch(parseInt(e.target.value, 10)))}
          className="w-full h-2 bg-mountainside rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />
      </div>

      {/* Speed Selector */}
      <div className="flex items-center gap-1.5">
        <span className="text-[11px] text-apres">Speed:</span>
        {[0.5, 1, 2, 4].map((speed) => (
          <button
            key={speed}
            onClick={() => dispatch(setPlaybackSpeed(speed))}
            className={`px-2 py-1 text-[10px] rounded-lg font-bold transition-all ${
              playbackSpeed === speed
                ? 'bg-cyan-500 text-midnight'
                : 'bg-mountainside/50 text-slopes hover:text-arctic'
            }`}
          >
            {speed}x
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimelineControls;
