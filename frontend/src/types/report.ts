export interface Report{
	id: number;
	reporter_id: number;
	target_type: {
		POST: string;
		USER: string;
		COMMENT: string;
	};
	target_id: number;
	reason: string;
	status: {
		PENDING: string;
		RESOLVED: string;
		REJECTED: string;
	}

}