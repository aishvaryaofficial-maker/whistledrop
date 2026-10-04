import { axiosClient } from './axiosClient';
import type {
  ApiResponse,
  ModeratorStatsResponse,
  ReportCategory,
  ReportDetailResponse,
  ReportStatus,
  ReportSummaryResponse,
  SpringPage,
  UpdateStatusRequest,
} from '../types';

export interface GetReportsParams {
  category?: ReportCategory | '';
  status?: ReportStatus | '';
  search?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export const moderatorApi = {
  /**
   * List and filter reports with search and pagination.
   */
  async getReports(params: GetReportsParams = {}): Promise<SpringPage<ReportSummaryResponse>> {
    const queryParams: Record<string, string | number> = {};
    if (params.category) queryParams.category = params.category;
    if (params.status) queryParams.status = params.status;
    if (params.search && params.search.trim()) queryParams.search = params.search.trim();
    if (typeof params.page === 'number') queryParams.page = params.page;
    if (typeof params.size === 'number') queryParams.size = params.size;
    if (params.sort) queryParams.sort = params.sort;

    const response = await axiosClient.get<ApiResponse<SpringPage<ReportSummaryResponse>>>('/api/moderator/reports', {
      params: queryParams,
    });
    return response.data.data;
  },

  /**
   * Get aggregate metrics for moderator dashboard cards.
   */
  async getStats(): Promise<ModeratorStatsResponse> {
    const response = await axiosClient.get<ApiResponse<ModeratorStatsResponse>>('/api/moderator/reports/stats');
    return response.data.data;
  },

  /**
   * Get full report detail for moderation including status history and allowed transitions.
   */
  async getReportDetail(caseCode: string): Promise<ReportDetailResponse> {
    const normalized = caseCode.trim().toUpperCase();
    const response = await axiosClient.get<ApiResponse<ReportDetailResponse>>(
      `/api/moderator/reports/${encodeURIComponent(normalized)}`
    );
    return response.data.data;
  },

  /**
   * Update report status with audit note.
   */
  async updateStatus(caseCode: string, payload: UpdateStatusRequest): Promise<ReportDetailResponse> {
    const normalized = caseCode.trim().toUpperCase();
    const response = await axiosClient.patch<ApiResponse<ReportDetailResponse>>(
      `/api/moderator/reports/${encodeURIComponent(normalized)}/status`,
      payload
    );
    return response.data.data;
  },
};
