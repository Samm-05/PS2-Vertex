import apiClient from './apiClient';

export const simulationService = {
  runSimulation: (algorithm: string, parameters: any) =>
    apiClient.post('/simulations/run', { algorithm, parameters }),

  saveSimulation: (data: any) =>
    apiClient.post('/simulations/save', data),

  getSimulation: (id: string) =>
    apiClient.get(`/simulations/${id}`),

  getUserSimulations: () =>
    apiClient.get('/simulations/user'),

  deleteSimulation: (id: string) =>
    apiClient.delete(`/simulations/${id}`),

  compareSimulations: (ids: string[]) =>
    apiClient.post('/simulations/compare', { ids }),
};