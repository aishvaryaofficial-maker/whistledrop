export type ReportCategory = 'SECURITY' | 'HARASSMENT' | 'CORRUPTION' | 'TECHNICAL' | 'OTHER';

export type ReportStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
  timestamp?: string;
}

export interface StatusUpdateResponse {
  id: number;
  status: ReportStatus;
  statusDisplayName: string;
  message: string;
  createdAt: string;
}

export interface ReportDetailResponse {
  caseCode: string;
  category: ReportCategory;
  categoryDisplayName: string;
  description: string;
  evidenceUrl?: string | null;
  status: ReportStatus;
  statusDisplayName: string;
  statusDescription: string;
  createdAt: string;
  updatedAt: string;
  statusUpdates: StatusUpdateResponse[];
  allowedTransitions: ReportStatus[];
}

export interface ReportSummaryResponse {
  caseCode: string;
  category: ReportCategory;
  categoryDisplayName: string;
  status: ReportStatus;
  statusDisplayName: string;
  previewDescription: string;
  hasEvidence: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ModeratorStatsResponse {
  totalReports: number;
  submittedCount: number;
  underReviewCount: number;
  resolvedCount: number;
  dismissedCount: number;
}

export interface SpringPage<T> {
  content: T[];
  page?: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
  totalElements?: number;
  totalPages?: number;
  number?: number;
  size?: number;
}

export interface CreateReportRequest {
  category: ReportCategory;
  description: string;
  evidenceUrl?: string;
}

export interface UpdateStatusRequest {
  status: ReportStatus;
  message: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  tokenType: string;
  username: string;
  role: string;
  expiresInMs: number;
}

export interface ModeratorSession {
  username: string;
  authorities?: Array<{ authority: string }>;
}
