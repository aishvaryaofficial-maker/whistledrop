import { axiosClient } from './axiosClient';
import type { ApiResponse, LoginRequest, LoginResponse, ModeratorSession } from '../types';

export const authApi = {
  /**
   * Authenticate moderator credentials and receive stateless JWT.
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await axiosClient.post<ApiResponse<LoginResponse>>('/api/auth/login', credentials);
    return response.data.data;
  },

  /**
   * Verify active moderator JWT session.
   */
  async getMe(): Promise<ModeratorSession> {
    const response = await axiosClient.get<ApiResponse<ModeratorSession>>('/api/auth/me');
    return response.data.data;
  },
};
