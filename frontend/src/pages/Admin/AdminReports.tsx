import React, { useEffect, useState, useMemo } from "react";
import {
    SearchIcon,
    CheckCircleIcon,
    CloseIcon,
    EyeIcon,
    FlagIcon,
} from "../../components/ui";
import { getReports, handleStatus } from "../../services/adminService";
import type { AdminReport } from "../../types/admin";
import "./AdminTable.css";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

type TabType = "ALL" | "POST" | "COMMENT";


const AdminReports: React.FC = () => {
    const [reports, setReports] = useState<AdminReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<TabType>("ALL");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [selectedReport, setSelectedReport] = useState<AdminReport | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [total, setTotal] = useState<number>(10);

    const totalPages = Math.ceil(total / itemsPerPage);

    useEffect(() => {
        loadReports(currentPage, activeTab, statusFilter, searchQuery);
    }, [currentPage, activeTab,  statusFilter, searchQuery]);

    const loadReports = async (page: number,
        activeTab: string,
        statusFilter: string,
        searchQuery: string
        ) => {
        setLoading(true);
        try {
            const data = await getReports(page,null, activeTab, statusFilter, searchQuery);
            setItemsPerPage(data.pagination.per_page);
            setTotal(data.pagination.total);
            setReports(data.data);
        } catch (error) {
            console.error("Error loading reports:", error);
        } finally {
            setLoading(false);
        }
    };

    const pendingCount = useMemo(
        () => reports.filter((r) => r.status === "PENDING").length,
        [reports]
    );

    const handleResolve = async (id: number) => {
        const user = JSON.parse(localStorage.getItem("user"));
        const result = await handleStatus(id, "RESOLVED", user.id);
        if(result.success){
            setReports((i)=>i.map((report)=>(
                report.id===id ? 
                    {...report, status: "RESOLVED"} :
                    report
                ))
            );
            Swal.fire({
                title: 'Thành công',
                text: 'Đã xử lý báo cáo',
                icon: 'success', // warning, error, success, info, question
                showConfirmButton: false,
                timer: 1500
            });
        }
    };

    const handleReject = async (id: number) => {
        const result = await handleStatus(id, "REJECTED");
        if(result.success){
            setReports((i)=>i.map((report)=>(
                report.id===id ? 
                    {...report, status: "REJECTED"} :
                    report
                ))
            );
            Swal.fire({
                title: 'Thành công',
                text: 'Đã từ chối báo cáo',
                icon: 'success', // warning, error, success, info, question
                showConfirmButton: false,
                timer: 1500
            });
        }

    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "PENDING": return "Chờ xử lý";
            case "RESOLVED": return "Đã xử lý";
            case "REJECTED": return "Đã từ chối";
            default: return status;
        }
    };

    return (
        <div>
            {/* Tabs */}
            <div className="admin-tabs">
                <button
                    className={`admin-tab ${activeTab === "ALL" ? "active" : ""}`}
                    onClick={() => setActiveTab("ALL")}
                >
                    Tất cả
                    {/*<span className="admin-tab-badge">{tabCounts.ALL}</span>*/}
                </button>
                <button
                    className={`admin-tab ${activeTab === "POST" ? "active" : ""}`}
                    onClick={() => setActiveTab("POST")}
                >
                    Bài viết
                    {/*<span className="admin-tab-badge">{tabCounts.POST}</span>*/}
                </button>
                <button
                    className={`admin-tab ${activeTab === "COMMENT" ? "active" : ""}`}
                    onClick={() => setActiveTab("COMMENT")}
                >
                    Bình luận
                    {/*<span className="admin-tab-badge">{tabCounts.COMMENT}</span>*/}
                </button>
            </div>

            {/* Header */}
            <div className="admin-page-header">
                <div className="admin-page-header-left">
                    <div className="admin-search-box">
                        <SearchIcon size={18} className="admin-search-icon" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm báo cáo..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="admin-filters">
                    <select
                        className="admin-filter-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="ALL">Tất cả trạng thái</option>
                        <option value="PENDING">Chờ xử lý ({pendingCount})</option>
                        <option value="RESOLVED">Đã xử lý</option>
                        <option value="REJECTED">Đã từ chối</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Người báo cáo</th>
                            <th>Loại</th>
                            <th>Nội dung vi phạm</th>
                            <th>Lý do</th>
                            <th>Trạng thái</th>
                            <th>Ngày báo cáo</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i}>
                                    {Array.from({ length: 8 }).map((_, j) => (
                                        <td key={j}><div className="dashboard-skeleton" style={{ height: 14, width: j === 3 ? 200 : 60 }} /></td>
                                    ))}
                                </tr>
                            ))
                        ) : reports.length === 0 ? (
                            <tr>
                                <td colSpan={8}>
                                    <div className="admin-empty">
                                        <div className="admin-empty-icon"><FlagIcon size={40} /></div>
                                        <div className="admin-empty-text">Không tìm thấy báo cáo nào</div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            reports.map((report) => (
                                <tr key={report.id}>
                                    <td className="cell-number">#{report.id}</td>
                                    <td>
                                        <div className="cell-user">
                                            <div className="cell-avatar">
                                                {report.reporter.username[0].toUpperCase()}
                                            </div>
                                            <span className="cell-username">@{report.reporter.username}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${report.target_type.toLowerCase()}`}>
                                            {report.target_type === "POST" ? "Bài viết" :
                                            report.target_type === "COMMENT" ? "Bình luận":
                                            "Người dùng"
                                            }
                                        </span>
                                    </td>
                                    <td>
                                        <div className="cell-content">{report.target_preview}</div>
                                    </td>
                                    <td>
                                        <div className="cell-content" style={{ maxWidth: 180 }}>{report.reason}</div>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${report.status.toLowerCase()}`}>
                                            {getStatusLabel(report.status)}
                                        </span>
                                    </td>
                                    <td className="cell-date">{formatDate(report.created_at)}</td>
                                    <td>
                                        <div className="cell-actions">
                                            <button
                                                className="action-btn view"
                                                title="Xem chi tiết"
                                                onClick={() => setSelectedReport(report)}
                                            >
                                                <EyeIcon size={16} />
                                            </button>
                                            {report.status === "PENDING" && (
                                                <>
                                                    <button
                                                        className="action-btn resolve"
                                                        title="Xử lý (xóa nội dung vi phạm)"
                                                        onClick={() => handleResolve(report.id)}
                                                    >
                                                        <CheckCircleIcon size={16} />
                                                    </button>
                                                    <button
                                                        className="action-btn reject"
                                                        title="Từ chối báo cáo"
                                                        onClick={() => handleReject(report.id)}
                                                    >
                                                        <CloseIcon size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                {!loading && reports.length > 0 && (
                    <div className="admin-pagination">
                        <span className="admin-pagination-info">
                            Hiển thị {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, reports.length)} báo cáo
                            {" · "}{pendingCount} đang chờ xử lý
                        </span>
                        <div className="admin-pagination-controls">
                        {currentPage>1 &&(
                            <button
                                onClick={()=>setCurrentPage(currentPage-1)}
                                className="admin-pagination-btn nav-btn"
                            >‹</button>
                        )}
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                                if (totalPages <= 7 || page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) {
                                    return (
                                        <button
                                            key={page}
                                            onClick={()=>setCurrentPage(page)}
                                            className={`admin-pagination-btn ${page === currentPage ? "active" : ""}`}
                                        >{page}</button>
                                    );
                                }
                                if (page === 2 && currentPage > 4) return <span key="e1" className="admin-pagination-ellipsis">…</span>;
                                if (page === totalPages - 1 && currentPage < totalPages - 3) return <span key="e2" className="admin-pagination-ellipsis">…</span>;
                                return null;
                            })}
                            {currentPage<totalPages &&(
                                <button
                                    onClick={()=>setCurrentPage(currentPage+1)}
                                    className="admin-pagination-btn nav-btn"
                                >›</button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedReport && (
                <div className="admin-detail-overlay" onClick={() => setSelectedReport(null)}
                >
                    <div className="admin-detail-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-detail-header">
                            <h3 className="admin-detail-title">Chi tiết báo cáo #{selectedReport.id}</h3>
                            <button className="admin-detail-close" onClick={() => setSelectedReport(null)}>
                                <CloseIcon size={20} />
                            </button>
                        </div>
                        <div className="admin-detail-content">
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Người báo cáo</span>
                                <span className="admin-detail-value">@{selectedReport.reporter.username}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Loại</span>
                                <span className="admin-detail-value">
                                    {selectedReport.target_type === "POST" ? "Bài viết" : "Bình luận"} 
                                </span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Tác giả</span>
                                <span className="admin-detail-value">@{selectedReport.target_author.username}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Nội dung</span>
                                <span className="admin-detail-value">{selectedReport.target_preview}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Lý do</span>
                                <span className="admin-detail-value">{selectedReport.reason}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Trạng thái</span>
                                <span className="admin-detail-value">
                                    <span className={`status-badge ${selectedReport.status.toLowerCase()}`}>
                                        {getStatusLabel(selectedReport.status)}
                                    </span>
                                </span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Ngày báo cáo</span>
                                <span className="admin-detail-value">{formatDate(selectedReport.created_at)}</span>
                            </div>
                            {selectedReport.resolved_at && (
                                <div className="admin-detail-row">
                                    <span className="admin-detail-label">Ngày xử lý</span>
                                    <span className="admin-detail-value">{formatDate(selectedReport.resolved_at)}</span>
                                </div>
                            )}

                            {/* Action buttons in modal */}
                            {selectedReport.status === "PENDING" && (
                                <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                                    <button
                                        style={{
                                            flex: 1, padding: "10px 16px", border: "none", borderRadius: 10,
                                            background: "linear-gradient(135deg, #10b981, #059669)", color: "white",
                                            fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.2s"
                                        }}
                                        onClick={() => {
                                            handleResolve(selectedReport.id);
                                            setSelectedReport(null);
                                        }}
                                    >
                                        ✓ Xử lý vi phạm
                                    </button>
                                    <button
                                        style={{
                                            flex: 1, padding: "10px 16px", border: "1px solid #e2e8f0", borderRadius: 10,
                                            background: "white", color: "#ef4444",
                                            fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.2s"
                                        }}
                                        onClick={() => {
                                            handleReject(selectedReport.id);
                                            setSelectedReport(null);
                                        }}
                                    >
                                        ✕ Từ chối báo cáo
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminReports;
