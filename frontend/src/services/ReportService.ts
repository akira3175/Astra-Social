import { api } from "../configs/api";
import type { AdminReport, ReportsResponse } from "../types/admin";

export interface CreateReportDto {
    reporter_id: number;
    target_author_id: number;
    target_type: 'POST' | 'COMMENT' | 'USER';
    target_preview: string;
    target_id: number;
    reason: string;
}

const ENDPOINTS = {
    REPORTS: "/reports",
};

export const createReport = async (data: CreateReportDto): Promise<ReportsResponse> => {
    const response = await api.post<ReportsResponse>(ENDPOINTS.REPORTS, data);
    return response.data;
};

export default { createReport };