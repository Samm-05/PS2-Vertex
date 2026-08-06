import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  togglePlayPause,
  stepForward,
  stepBackward,
  resetPlayback,
  setPlaybackSpeed,
  setCurrentStepIndex,
  toggleAudioMuted,
  toggleComparisonMode,
} from '../linearRegressionSlice';
import { Play, Pause, RotateCcw, SkipBack, SkipForward, Volume2, VolumeX, Split } from 'lucide-react';
import { soundFx } from '../../gradientDescent/utils/soundEffects';

export const TimelineControls: React.FC = () => {
  const dispatch = useAppDispatch();
  const lrState = useAppSelector((state) => state.linearRegression);

  const steps = lrState?.steps ?? [];
  const currentStepIndex = lrState?.currentStepIndex ?? 0;
  const isPlaying = lrState?.isPlaying ?? false;
  const playbackSpeed = lrState?.playbackSpeed ?? 1;
  const audioMuted = lrState?.audioMuted ?? true;
  const comparisonMode = lrState?.comparisonMode ?? false;

  const totalSteps = Math.max(1, steps.length - 1);

  // Playback timer loop
  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = Math.max(100, 600 / playbackSpeed);
    const timer = window.setInterval(() => {
      dispatch(stepForward());
      soundFx.playStepSound();
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [isPlaying, playbackSpeed, dispatch]);

  const handleAudioToggle = () => {
    dispatch(toggleAudioMuted());
    soundFx.setMuted(!audioMuted);
  };

  return (
    <div className="bg-midnight border border-mountainside rounded-3xl p-4 shadow-hard flex flex-col md:flex-row items-center justify-between gap-4 select-none">
      {/* Primary Playback Buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => dispatch(resetPlayback())}
          className="p-2.5 rounded-xl bg-mountainside/50 text-slopes hover:text-arctic hover:bg-mountainside border border-apres/30 transition-colors"
          title="Reset to Epoch 0 (R)"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => dispatch(stepBackward())}
          disabled={currentStepIndex === 0}
          className="p-2.5 rounded-xl bg-mountainside/50 text-slopes hover:text-arctic hover:bg-mountainside border border-apres/30 transition-colors disabled:opacity-40"
          title="Previous Step (Left Arrow)"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => dispatch(togglePlayPause())}
          className="px-5 py-2.5 rounded-xl bg-arctic text-midnight hover:bg-slopes font-bold text-xs transition-all shadow-soft flex items-center gap-2"
          title="Play / Pause (Space)"
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-midnight" /> : <Play className="w-4 h-4 fill-midnight" />}
          <span>{isPlaying ? 'Pause' : 'Play'}</span>
        </button>

        <button
          type="button"
          onClick={() => dispatch(stepForward())}
          disabled={currentStepIndex >= totalSteps}
          className="p-2.5 rounded-xl bg-mountainside/50 text-slopes hover:text-arctic hover:bg-mountainside border border-apres/30 transition-colors disabled:opacity-40"
          title="Next Step (Right Arrow)"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Center Interactive Timeline Scrub Slider */}
      <div className="flex-1 w-full max-w-xl flex items-center gap-3">
        <span className="text-xs font-mono text-cyan-400 font-bold w-14 text-right">Epoch {currentStepIndex}</span>
        <input
          type="range"
          min="0"
          max={totalSteps}
          value={currentStepIndex}
          onChange={(e) => dispatch(setCurrentStepIndex(parseInt(e.target.value, 10)))}
          className="flex-1 h-2 bg-mountainside rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />
        <span className="text-xs font-mono text-apres w-12">/ {totalSteps}</span>
      </div>

      {/* Right Controls: Speed Options, Comparison Toggle & Audio Toggle */}
      <div className="flex items-center gap-2.5">
        {/* Comparison Split Screen Mode Toggle */}
        <button
          type="button"
          onClick={() => dispatch(toggleComparisonMode())}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
            comparisonMode
              ? 'bg-mountainside text-amber-400 border-amber-500/50 shadow-soft'
              : 'bg-mountainside/40 text-slopes border-apres/30 hover:text-arctic'
          }`}
          title="Toggle Dual Comparison Mode (Split Screen)"
        >
          <Split className="w-3.5 h-3.5" />
          <span>{comparisonMode ? 'Single View' : 'Compare LR'}</span>
        </button>

        {/* Speed Options */}
        <div className="flex items-center gap-1 bg-mountainside/50 border border-apres/30 p-1 rounded-xl">
          {[0.25, 0.5, 1, 2, 4].map((spd) => (
            <button
              key={spd}
              type="button"
              onClick={() => dispatch(setPlaybackSpeed(spd))}
              className={`px-2 py-1 rounded-lg text-[11px] font-mono font-bold transition-colors ${
                playbackSpeed === spd
                  ? 'bg-mountainside text-arctic border border-apres/50 shadow-soft'
                  : 'text-slopes hover:text-arctic'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>

        {/* Audio FX Toggle Button */}
        <button
          type="button"
          onClick={handleAudioToggle}
          className={`p-2.5 rounded-xl border transition-colors ${
            !audioMuted
              ? 'bg-mountainside text-amber-400 border-amber-500/40 shadow-soft'
              : 'bg-mountainside/40 text-apres border-apres/20'
          }`}
          title={audioMuted ? 'Unmute Audio FX' : 'Mute Audio FX'}
        >
          {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
