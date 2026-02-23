import React, { useEffect, useState, useMemo } from "react";
import {
    SearchIcon,
    TrashIcon,
    EyeIcon,
    CloseIcon,
    CommentIcon,
} from "../../components/ui";
import { getAdminComments, deleteAdminComment } from "../../services/adminService";
import type { AdminComment } from "../../types/admin";
import "./AdminTable.css";

const ITEMS_PER_PAGE = 5;

const AdminComments: React.FC = () => {
    const [comments, setComments] = useState<AdminComment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState<string>("ALL");
    const [selectedComment, setSelectedComment] = useState<AdminComment | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        loadComments();
    }, []);

    const loadComments = async () => {
        setLoading(true);
        try {
            const data = await getAdminComments();
            setComments(data);
        } catch (error) {
            console.error("Error loading comments:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredComments = useMemo(() => {
        setCurrentPage(1);
        return comments.filter((comment) => {
            const matchesSearch = !searchQuery ||
                comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                comment.user.username.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesType = typeFilter === "ALL" ||
                (typeFilter === "ROOT" && !comment.parent_id) ||
                (typeFilter === "REPLY" && comment.parent_id);

            return matchesSearch && matchesType;
        });
    }, [comments, searchQuery, typeFilter]);

    const totalPages = Math.ceil(filteredComments.length / ITEMS_PER_PAGE);
    const paginatedComments = filteredComments.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleDelete = async (id: number) => {
        await deleteAdminComment(id);
        setComments((prev) => prev.filter((c) => c.id !== id));
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

    return (
        <div>
            {/* Header */}
            <div className="admin-page-header">
                <div className="admin-page-header-left">
                    <div className="admin-search-box">
                        <SearchIcon size={18} className="admin-search-icon" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm bình luận..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="admin-filters">
                    <select
                        className="admin-filter-select"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                    >
                        <option value="ALL">Tất cả loại</option>
                        <option value="ROOT">Bình luận gốc</option>
                        <option value="REPLY">Trả lời</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Người viết</th>
                            <th>Nội dung</th>
                            <th>Bài viết</th>
                            <th>Loại</th>
                            <th>Ngày tạo</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i}>
                                    {Array.from({ length: 7 }).map((_, j) => (
                                        <td key={j}><div className="dashboard-skeleton" style={{ height: 14, width: j === 2 ? 200 : 60 }} /></td>
                                    ))}
                                </tr>
                            ))
                        ) : filteredComments.length === 0 ? (
                            <tr>
                                <td colSpan={7}>
                                    <div className="admin-empty">
                                        <div className="admin-empty-icon"><CommentIcon size={40} /></div>
                                        <div className="admin-empty-text">Không tìm thấy bình luận nào</div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            paginatedComments.map((comment) => (
                                <tr key={comment.id}>
                                    <td className="cell-number">#{comment.id}</td>
                                    <td>
                                        <div className="cell-user">
                                            <div className="cell-avatar">
                                                {comment.user.first_name?.[0] || comment.user.username[0].toUpperCase()}
                                            </div>
                                            <span className="cell-username">@{comment.user.username}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="cell-content">{comment.content}</div>
                                    </td>
                                    <td>
                                        <div className="cell-content" style={{ fontSize: 12, color: "#94a3b8" }}>
                                            #{comment.post_id} — {comment.post_preview}
                                        </div>
                                    </td>
                                    <td>
                                        {comment.parent_id ? (
                                            <span className="status-badge comment">Trả lời #{comment.parent_id}</span>
                                        ) : (
                                            <span className="status-badge post">Gốc</span>
                                        )}
                                    </td>
                                    <td className="cell-date">{formatDate(comment.created_at)}</td>
                                    <td>
                                        <div className="cell-actions">
                                            <button
                                                className="action-btn view"
                                                title="Xem chi tiết"
                                                onClick={() => setSelectedComment(comment)}
                                            >
                                                <EyeIcon size={16} />
                                            </button>
                                            <button
                                                className="action-btn delete"
                                                title="Xóa bình luận"
                                                onClick={() => handleDelete(comment.id)}
                                            >
                                                <TrashIcon size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                {!loading && filteredComments.length > 0 && (
                    <div className="admin-pagination">
                        <span className="admin-pagination-info">
                            Hiển thị {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredComments.length)} / {filteredComments.length} bình luận
                        </span>
                        <div className="admin-pagination-controls">
                            <button
                                className="admin-pagination-btn nav-btn"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(p => p - 1)}
                            >‹</button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                                if (totalPages <= 7 || page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) {
                                    return (
                                        <button
                                            key={page}
                                            className={`admin-pagination-btn ${page === currentPage ? "active" : ""}`}
                                            onClick={() => setCurrentPage(page)}
                                        >{page}</button>
                                    );
                                }
                                if (page === 2 && currentPage > 4) return <span key="e1" className="admin-pagination-ellipsis">…</span>;
                                if (page === totalPages - 1 && currentPage < totalPages - 3) return <span key="e2" className="admin-pagination-ellipsis">…</span>;
                                return null;
                            })}
                            <button
                                className="admin-pagination-btn nav-btn"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(p => p + 1)}
                            >›</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedComment && (
                <div className="admin-detail-overlay" onClick={() => setSelectedComment(null)}>
                    <div className="admin-detail-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-detail-header">
                            <h3 className="admin-detail-title">Chi tiết bình luận #{selectedComment.id}</h3>
                            <button className="admin-detail-close" onClick={() => setSelectedComment(null)}>
                                <CloseIcon size={20} />
                            </button>
                        </div>
                        <div className="admin-detail-content">
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Người viết</span>
                                <span className="admin-detail-value">
                                    @{selectedComment.user.username}
                                    {selectedComment.user.first_name && ` (${selectedComment.user.first_name} ${selectedComment.user.last_name})`}
                                </span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Nội dung</span>
                                <span className="admin-detail-value">{selectedComment.content}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Bài viết</span>
                                <span className="admin-detail-value">#{selectedComment.post_id} — {selectedComment.post_preview}</span>
                            </div>
                            {selectedComment.parent_id && (
                                <div className="admin-detail-row">
                                    <span className="admin-detail-label">Trả lời cho</span>
                                    <span className="admin-detail-value">Bình luận #{selectedComment.parent_id}</span>
                                </div>
                            )}
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Ngày tạo</span>
                                <span className="admin-detail-value">{formatDate(selectedComment.created_at)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminComments;
