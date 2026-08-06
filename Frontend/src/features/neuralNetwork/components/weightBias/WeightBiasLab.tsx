import React from 'react';
import WeightBias3DScene from './WeightBias3DScene';
import WeightMatrixHeatmap from './WeightMatrixHeatmap';
import WeightHistoryTimeline from './WeightHistoryTimeline';
import GradientMagnitudeInspector from './GradientMagnitudeInspector';
import TimelineControls from '../TimelineControls';
import ExplanationPanel from '../ExplanationPanel';
import NeuronInspector from '../NeuronInspector';

export const WeightBiasLab: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* 3D Viewport & Interactive Weight Matrices Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch min-h-[560px]">
        {/* Left 3D Viewport Column */}
        <div className="lg:col-span-7 h-full min-h-[480px]">
          <WeightBias3DScene />
        </div>

        {/* Right Weight Matrices & Inspection Column */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          <WeightMatrixHeatmap />
          <NeuronInspector />
        </div>
      </div>

      {/* Analytics & Timeline Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7">
          <WeightHistoryTimeline />
        </div>
        <div className="lg:col-span-5">
          <GradientMagnitudeInspector />
        </div>
      </div>

      {/* Global Playback & Step Controls */}
      <TimelineControls />
      <ExplanationPanel />
    </div>
  );
};

export default WeightBiasLab;
