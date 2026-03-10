import { api } from "../configs/api";
import type {
	AdminReport,    
	ReportsResponse,
} from "../types/admin";

const ENDPOINTS = {
    REPORTS : "/reports",
};

export const createReport = async(data: AdminReport):Promise<AdminReport>=>{
	const response = await api.post<ReportsResponse>(ENDPOINTS.REPORTS, data);
	return response.data;
}

export default {
	createReport,
};