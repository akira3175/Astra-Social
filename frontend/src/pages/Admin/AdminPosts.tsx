import { useNavigate } from "react-router-dom";
import React, { useEffect, useState, useMemo } from "react";
import {
    SearchIcon,
    TrashIcon,
    RefreshIcon,
    EyeIcon,
    CloseIcon,
    FileTextIcon,
} from "../../components/ui";
import {ENDPOINTS, getPosts, deletePost, restorePost } from "../../services/adminService";
import type { AdminPost } from "../../types/admin";
import "./AdminTable.css";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const AdminPosts: React.FC = () => {
    const [posts, setPosts] = useState<AdminPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [privacyFilter, setPrivacyFilter] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [selectedPost, setSelectedPost] = useState<AdminPost | null>(null);
    const [showDetailPost, setShowDetailPost] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const timer = setTimeout(() => {
                loadPosts(currentPage, privacyFilter,statusFilter, searchQuery);
        }, 400);
        return () => clearTimeout(timer);
    }, [loading, currentPage, privacyFilter, statusFilter, searchQuery]);

    const loadPosts = async (currentPage, privacyFilter, statusFilter, searchQuery) => {
        try {
            const data = await getPosts(currentPage, privacyFilter,statusFilter, searchQuery);
            setPosts(data);
        } catch (error) {
            console.error("Error loading posts:", error);
        } finally {
            setLoading(false);
        }
    };

    let totalPages;
    if(!loading){
        totalPages= posts.data.last_page;
    }
    const navigate = useNavigate();
    const handleDelete = async (id: number) => {
        let result = await deletePost(id);
        if (result.success){
            Swal.fire({
                title: 'Thành công',
                text: result.message,
                icon: 'success', // warning, error, success, info, question
                showConfirmButton: false,
                timer: 3000
            });
            setSelectedPost(null);
            setLoading(true);
        }
    };

    const handleView= (id:number)=>{
        navigate(`${ENDPOINTS.POSTS_BY_ID(id)}`);
    }
    
    const handleRestore = async (id: number) => {
        let result = await restorePost(id);
        if(result.success){
            Swal.fire({
                title: 'Thành công',
                text: result.message,
                icon: 'success', // warning, error, success, info, question
                showConfirmButton: false,
                timer: 2000
            });
            setSelectedPost(null);
            setLoading(true);
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

    const getPrivacyLabel = (privacy: string) => {
        switch (privacy) {
            case "PUBLIC": return "Công khai";
            case "FRIENDS": return "Bạn bè";
            case "ONLY_ME": return "Riêng tư";
            default: return privacy;
        }
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
                            placeholder="Tìm kiếm bài viết..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                </div>
                <div className="admin-filters">
                    <select
                        className="admin-filter-select"
                        value={privacyFilter}
                        onChange={(e) =>{
                            setPrivacyFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="">Tất cả quyền riêng tư</option>
                        <option value="PUBLIC">Công khai</option>
                        <option value="FRIENDS">Bạn bè</option>
                        <option value="ONLY_ME">Riêng tư</option>
                    </select>
                    <select
                        className="admin-filter-select"
                        value={statusFilter}
                        onChange={(e) =>{ 
                            setStatusFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="ACTIVE">Đang hoạt động</option>
                        <option value="DELETED">Đã xóa</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tác giả</th>
                            <th>Nội dung</th>
                            <th>Quyền riêng tư</th>
                            <th>Lượt thích</th>
                            <th>Bình luận</th>
                            <th>Ngày tạo</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i}>
                                    {Array.from({ length: 9 }).map((_, j) => (
                                        <td key={j}><div className="dashboard-skeleton" style={{ height: 14, width: j === 2 ? 200 : 60 }} /></td>
                                    ))}
                                </tr>
                            ))
                        ) : !posts.success ?(
                            <tr>
                                <td colSpan={9}>
                                    <div className="admin-empty">
                                        <div className="admin-empty-icon"><FileTextIcon size={40} /></div>
                                        <div className="admin-empty-text">Không tìm thấy bài viết nào</div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            posts.data.data.map((post) => (
                                <tr key={post.id} style={{ opacity: post.deleted_at ? 0.6 : 1 }}>
                                    <td className="cell-number">#{post.id}</td>
                                    <td>
                                        <div className="cell-user">
                                            <div className="cell-avatar">
                                                {post.user.first_name?.[0] || post.user.username[0].toUpperCase()}
                                            </div>
                                            <span className="cell-username">@{post.user.username}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="cell-content">{post.content || "—"}</div>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${post.privacy.toLowerCase().replace("_", "-")}`}>
                                            {getPrivacyLabel(post.privacy)}
                                        </span>
                                    </td>
                                    <td className="cell-number">{post.likes_count}</td>
                                    <td className="cell-number">{post.comments_count}</td>
                                    <td className="cell-date">{formatDate(post.created_at)}</td>
                                    <td>
                                        {post.deleted_at ? (
                                            <span className="status-badge deleted">Đã xóa</span>
                                        ) : (
                                            <span className="status-badge active">Hoạt động</span>
                                        )}
                                    </td>
                                    <td>
                                        <div className="cell-actions d-flex flex-row justify-content-center">
                                            <button
                                                className="action-btn view"
                                                title="Xem chi tiết"
                                                onClick={() => setSelectedPost(post)}
                                            >
                                                <EyeIcon size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                {!loading && posts.success && (
                    <div className="admin-pagination">
                        <span className="admin-pagination-info">
                            Hiển thị {posts.data.data.length} / {posts.data.total} bài viết
                        </span>
                        <div className="admin-pagination-controls">
                            {posts.data.prev_page_url && (
                                <button
                                    className="admin-pagination-btn nav-btn"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(p => p - 1)}
                                >‹</button>
                            )}
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
                            {posts.data.next_page_url &&(
                                <button
                                    className="admin-pagination-btn nav-btn"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(p => p + 1)}
                                >›</button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedPost && (
                <div className="admin-detail-overlay" onClick={() => setSelectedPost(null)}>
                    <div className="admin-detail-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-detail-header">
                            <h3 className="admin-detail-title">Chi tiết bài viết #{selectedPost.id}</h3>
                            <button className="admin-detail-close" onClick={() => setSelectedPost(null)}>
                                <CloseIcon size={20} />
                            </button>
                        </div>
                        <div className="admin-detail-content">
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Tác giả</span>
                                <span className="admin-detail-value">
                                    @{selectedPost.user.username}
                                    {selectedPost.user.first_name && ` (${selectedPost.user.first_name} ${selectedPost.user.last_name})`}
                                </span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Nội dung</span>
                                <span className="admin-detail-value">{selectedPost.content || "—"}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Quyền</span>
                                <span className="admin-detail-value">{getPrivacyLabel(selectedPost.privacy)}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Thống kê</span>
                                <span className="admin-detail-value">
                                    {selectedPost.likes_count} lượt thích · {selectedPost.comments_count} bình luận · {selectedPost.report_count} báo cáo
                                </span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Ngày tạo</span>
                                <span className="admin-detail-value">{formatDate(selectedPost.created_at)}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Trạng thái</span>
                                <span className="admin-detail-value">
                                    {selectedPost.deleted_at ? `Đã xóa (${formatDate(selectedPost.deleted_at)})` : "Đang hoạt động"}
                                </span>
                            </div>
                            {/* Actions in modal */}
                            <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
                                {selectedPost.deleted_at ? (
                                    <button
                                        style={{
                                            display: "flex", flexDirection: "row", flex: 1, padding: "10px 16px", border: "1px solid #e2e8f0", borderRadius: 10,
                                            background: "white", color: "#ef4444",
                                            fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.2s",
                                            minWidth: 120, alignItems: "center", justifyContent: "center"
                                        }}
                                        onClick={() => handleRestore(selectedPost.id)}
                                    >
                                        <RefreshIcon size={16} />
                                        Khôi phục bài viết
                                    </button>
                                ) : (
                                    <button
                                        style={{
                                            display: "flex", flexDirection: "row", flex: 1, padding: "10px 16px", border: "none", borderRadius: 10,
                                            background: "linear-gradient(135deg, #10b981, #059669)", color: "white",
                                            fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.2s",
                                            minWidth: 120, alignItems: "center", justifyContent: "center"
                                        }}
                                        onClick={() => handleDelete(selectedPost.id)}
                                    >
                                        <TrashIcon size={16} />
                                        Xóa bài viết
                                    </button>
                                )}
                                <button
                                    style={{
                                        display: "flex", flexDirection: "row", flex: 1, padding: "10px 16px", border: "1px solid #e2e8f0", borderRadius: 10,
                                        background: "white", color: "#6366f1",
                                        fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.2s",
                                        minWidth: 120, alignItems: "center", justifyContent: "center"
                                    }}
                                        onClick={() => handleView(selectedPost.id)}
                                >
                                    <EyeIcon size={16} />
                                    Nguồn bài viết
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPosts;
