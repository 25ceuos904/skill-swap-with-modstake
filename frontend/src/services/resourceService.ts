import { api } from './api';
import { Resource } from '../types';

export const resourceService = {
  getResources: async (tag?: string, search?: string): Promise<Resource[]> => {
    const params = new URLSearchParams();
    if (tag) params.append('tag', tag);
    if (search) params.append('search', search);

    const queryString = params.toString();
    const url = queryString ? `/resources?${queryString}` : '/resources';

    const res = await api.get<Resource[]>(url);
    return res.data;
  },

  createResource: async (data: {
    title: string;
    description?: string;
    link: string;
    tags?: string[];
  }): Promise<Resource> => {
    const res = await api.post<Resource>('/resources', data);
    return res.data;
  },
};
