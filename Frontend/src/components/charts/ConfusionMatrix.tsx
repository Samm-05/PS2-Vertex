import React from 'react';

interface ConfusionMatrixProps {
  matrix: number[][];
  labels?: string[];
}

const ConfusionMatrix: React.FC<ConfusionMatrixProps> = ({
  matrix,
  labels = ['Positive', 'Negative'],
}) => {
  const maxValue = Math.max(...matrix.flat());

  return (
    <div className="inline-block">
      <div className="grid grid-cols-3 gap-2">
        <div className="col-start-2 col-span-2 text-center text-sm font-medium text-secondary-600 mb-2">
          Predicted
        </div>
        
        <div className="row-start-2 text-sm font-medium text-secondary-600 flex items-center justify-center">
          Actual
        </div>
        
        <div className="col-span-2">
          <div className="grid grid-cols-2 gap-2">
            {labels.map((label, i) => (
              <div key={i} className="text-center text-xs text-secondary-500">
                {label}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-2">
            {matrix.map((row, i) => (
              row.map((value, j) => (
                <div
                  key={`${i}-${j}`}
                  className="aspect-square rounded-lg flex items-center justify-center text-white font-bold"
                  style={{
                    backgroundColor: `rgba(37, 99, 235, ${value / maxValue})`,
                  }}
                >
                  {value}
                </div>
              ))
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-2">
            {labels.map((label, i) => (
              <div key={i} className="text-center text-xs text-secondary-500">
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfusionMatrix;