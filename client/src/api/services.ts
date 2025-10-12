import apiClient from "./client";
import type { Service } from "../types/service";

export const servicesApi = {
  async getServices(): Promise<Service[]> {
    const response = await apiClient.get<{ services: Service[] }>("/services");
    return response.data.services;
  },
  async getServiceById(id: string): Promise<Service> {
    const response = await apiClient.get<Service>(`/services/${id}`);
    return response.data;
  },
};
