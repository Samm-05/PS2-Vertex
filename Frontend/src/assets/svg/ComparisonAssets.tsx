import React from 'react';

export const PassiveLearningDiagram: React.FC<{ className?: string }> = ({ className = 'w-full h-auto' }) => (
  <svg className={className} viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="240" rx="16" fill="#1e293b" fillOpacity="0.6" stroke="#334155" strokeWidth="1.5" />
    {/* Confusing Static Equations */}
    <text x="30" y="50" fill="#94a3b8" fontSize="13" fontFamily="monospace">
      J(w,b) = (1/2m) * Σ (h_θ(x^(i)) - y^(i))^2
    </text>
    <text x="30" y="85" fill="#64748b" fontSize="13" fontFamily="monospace">
      ∂J/∂w_j = (1/m) * Σ (h_θ(x^(i)) - y^(i)) * x_j^(i)
    </text>
    <text x="30" y="120" fill="#475569" fontSize="13" fontFamily="monospace">
      θ_j := θ_j - α * (1/m) * Σ (h_θ(x^(i)) - y^(i)) * x_j^(i)
    </text>
    {/* Passive Static Slide Box */}
    <rect x="30" y="145" width="340" height="60" rx="8" fill="#0f172a" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 4" />
    <text x="45" y="170" fill="#f87171" fontSize="12" fontWeight="600">
      Static Powerpoint Slide (No Interaction)
    </text>
    <text x="45" y="190" fill="#94a3b8" fontSize="11">
      Result: High cognitive load, abstract formulas, rapid forgetting
    </text>
    {/* Confusion Warning Icon */}
    <circle cx="345" cy="50" r="16" fill="#ef4444" fillOpacity="0.2" stroke="#ef4444" strokeWidth="1.5" />
    <path d="M345 42v10M345 57v2" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const ActiveLearningDiagram: React.FC<{ className?: string }> = ({ className = 'w-full h-auto' }) => (
  <svg className={className} viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="240" rx="16" fill="#0f172a" stroke="#6366f1" strokeWidth="1.5" />
    {/* Dynamic Glowing Loss Surface Contour */}
    <path d="M40 180 Q 120 40, 200 130 T 360 60" stroke="#6366f1" strokeWidth="3" fill="none" />
    <path d="M40 190 Q 120 50, 200 140 T 360 70" stroke="#14b8a6" strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="3 3" fill="none" />
    {/* Interactive Gradient Descent Ball & Step Vector */}
    <circle cx="145" cy="85" r="10" fill="#6366f1" />
    <circle cx="145" cy="85" r="16" fill="#6366f1" fillOpacity="0.3" />
    <path d="M145 85 L180 115" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" markerEnd="url(#arrow)" />
    {/* Live Step Badge */}
    <rect x="220" y="155" width="150" height="55" rx="10" fill="#1e293b" stroke="#14b8a6" strokeWidth="1.5" />
    <text x="235" y="178" fill="#14b8a6" fontSize="12" fontWeight="700">
      Step 14: Loss 0.042
    </text>
    <text x="235" y="196" fill="#e2e8f0" fontSize="11">
      Real-Time 3D Convergence
    </text>
    {/* Glowing Success Sparkle */}
    <circle cx="345" cy="45" r="16" fill="#14b8a6" fillOpacity="0.2" stroke="#14b8a6" strokeWidth="1.5" />
    <path d="M345 37v16M337 45h16" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
