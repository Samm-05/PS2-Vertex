import apiClient from './apiClient';

export interface SavedExperiment {
  id: string;
  userName: string;
  algorithm: string;
  title: string;
  parameters: Record<string, any>;
  dataset: Record<string, any>;
  metrics: Record<string, any>;
  visualizationState: Record<string, any>;
  chartData: Record<string, any>;
  pdfUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export const experimentService = {
  saveExperiment: (data: {
    algorithm: string;
    title: string;
    parameters?: Record<string, any>;
    dataset?: Record<string, any>;
    metrics?: Record<string, any>;
    visualizationState?: Record<string, any>;
    chartData?: Record<string, any>;
  }) => apiClient.post<SavedExperiment>('/experiments/save', data),

  getUserExperiments: (algorithm: string) =>
    apiClient.get<SavedExperiment[]>(`/experiments/user/${algorithm}`),

  getExperimentById: (id: string) =>
    apiClient.get<SavedExperiment>(`/experiments/${id}`),

  deleteExperiment: (id: string) =>
    apiClient.delete<{ message: string; id: string }>(`/experiments/${id}`),

  generatePDFReport: (data: {
    experimentId?: string;
    algorithm: string;
    title: string;
    parameters?: Record<string, any>;
    metrics?: Record<string, any>;
  }) => apiClient.post('/reports/pdf', data),
};