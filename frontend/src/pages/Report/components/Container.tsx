import React, { ReactNode, useState } from "react";
import { FaEye } from "react-icons/fa";
import "./style.css";

const Container = () =>{
	const {reports, setReports} = useReport();
	return (
		<div className="w-100">
			<table className="w-100 table-bordered">
				<thead>
					<tr className="text-center">
						<th className="p-2">Thứ tự</th>
						<th className="p-2">Người báo cáo</th>
						<th className="p-2">Loại</th>
						<th className="p-2">Mã bài viết</th>
						<th className="p-2">Trạng thái</th>						
						<th className="p-2">Thao tác</th>						
					</tr>
				</thead>
				<tbody>
				{ reports.map((report, index)=>(
					<tr key={report.id} className="text-center">
						<th className="p-2">{index+1}</th>
						<td className="p-2">{report.reporter_id}</td>
						<td className="p-2">{report.target_type}</td>
						<td className="p-2">{report.target_id}</td>
						<td className="p-2">
							<span className="pending">{report.status}</span>
						</td>
						<td>
						<FaEye className="cursor-pointer" />
						</td>
					</tr>
				) )}
				</tbody>
			</table>
		</div>
	);
}

export default Container;