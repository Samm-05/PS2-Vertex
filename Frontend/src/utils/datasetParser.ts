import Papa from 'papaparse';

export interface Dataset {
  headers: string[];
  data: any[];
  numericColumns: string[];
  categoricalColumns: string[];
  summary: {
    rows: number;
    columns: number;
    missingValues: number;
  };
}

export const parseCSV = (file: File): Promise<Dataset> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields || [];
        const data = results.data;
        
        // Detect column types
        const numericColumns: string[] = [];
        const categoricalColumns: string[] = [];
        
        headers.forEach((header) => {
          const columnData = data.map(row => row[header]);
          const isNumeric = columnData.every(val => 
            val === null || val === undefined || typeof val === 'number'
          );
          
          if (isNumeric) {
            numericColumns.push(header);
          } else {
            categoricalColumns.push(header);
          }
        });

        // Calculate missing values
        let missingValues = 0;
        data.forEach(row => {
          headers.forEach(header => {
            if (row[header] === null || row[header] === undefined) {
              missingValues++;
            }
          });
        });

        resolve({
          headers,
          data,
          numericColumns,
          categoricalColumns,
          summary: {
            rows: data.length,
            columns: headers.length,
            missingValues,
          },
        });
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

export const generateDataset = (
  type: 'linear' | 'clustering' | 'classification',
  nSamples: number,
  noise: number = 0.1
) => {
  switch (type) {
    case 'linear':
      return generateLinearData(nSamples, noise);
    case 'clustering':
      return generateClusteringData(nSamples, 3, noise);
    case 'classification':
      return generateClassificationData(nSamples, noise);
    default:
      return [];
  }
};

const generateLinearData = (n: number, noise: number) => {
  const data = [];
  for (let i = 0; i < n; i++) {
    const x = Math.random() * 10 - 5;
    const y = 2 * x + 1 + (Math.random() - 0.5) * noise * 10;
    data.push({ x, y });
  }
  return data;
};

const generateClusteringData = (n: number, k: number, noise: number) => {
  const centers = Array.from({ length: k }, () => ({
    x: (Math.random() - 0.5) * 20,
    y: (Math.random() - 0.5) * 20,
  }));

  const data = [];
  for (let i = 0; i < n; i++) {
    const center = centers[Math.floor(Math.random() * k)];
    data.push({
      x: center.x + (Math.random() - 0.5) * noise * 10,
      y: center.y + (Math.random() - 0.5) * noise * 10,
      cluster: Math.floor(Math.random() * k),
    });
  }
  return data;
};

const generateClassificationData = (n: number, noise: number) => {
  const data = [];
  for (let i = 0; i < n; i++) {
    const x = Math.random() * 10 - 5;
    const y = Math.random() * 10 - 5;
    const label = Math.sin(x) > y ? 1 : 0;
    data.push({
      x: x + (Math.random() - 0.5) * noise,
      y: y + (Math.random() - 0.5) * noise,
      label,
    });
  }
  return data;
};