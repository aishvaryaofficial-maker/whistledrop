import { axiosClient } from './axiosClient';
import type { ApiResponse, CreateReportRequest, ReportDetailResponse } from '../types';

export const reportApi = {
  /**
   * Submit an anonymous confidential report without credentials or identity fields.
   */
  async submitReport(data: CreateReportRequest): Promise<ReportDetailResponse> {
    const response = await axiosClient.post<ApiResponse<ReportDetailResponse>>('/api/reports', data);
    return response.data.data;
  },

  /**
   * Track status timeline solely by using the private case code.
   */
  async trackReport(caseCode: string): Promise<ReportDetailResponse> {
    const normalized = caseCode.trim().toUpperCase();
    const response = await axiosClient.get<ApiResponse<ReportDetailResponse>>(`/api/reports/${encodeURIComponent(normalized)}`);
    return response.data.data;
  },
};
