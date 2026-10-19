import { api } from './api';
import { PortfolioData } from '../types';

export const portfolioService = {
  getPortfolio: async (userId: string): Promise<PortfolioData> => {
    const res = await api.get<PortfolioData>(`/portfolio/${userId}`);
    return res.data;
  },
};
