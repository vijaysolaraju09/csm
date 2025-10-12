import apiClient from "./client";
import type { AuthResponse, LoginPayload, SignupPayload, User } from "../types/auth";

export const authApi = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/login", payload);
    return response.data;
  },
  async signup(payload: SignupPayload): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/signup", payload);
    return response.data;
  },
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>("/auth/me");
    return response.data;
  },
};
