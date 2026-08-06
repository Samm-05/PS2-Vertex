import React from 'react';
import TimelineControls from './TimelineControls';
import LiveGraphsPanel from './LiveGraphsPanel';

export const BottomPanel: React.FC = () => {
  return (
    <div className="w-full space-y-3">
      {/* Timeline Controls */}
      <TimelineControls />

      {/* Live Analytics Graphs */}
      <LiveGraphsPanel />
    </div>
  );
};

export default BottomPanel;
