import React, { useEffect, useState } from "react";
import {
    SearchIcon,
    EyeIcon,
    CloseIcon,
    PersonIcon,
} from "../../components/ui";
import { getUsers, updateIsActiveUser, changeUserRole, getRoles } from "../../services/adminService";
import type { AdminUser, Role, UsersResponse, RolesResponse } from "../../types/admin";
import "./AdminTable.css";
import { useCurrentUser } from "../../context/currentUserContext";
import Swal from 'sweetalert2';

const AdminUsers: React.FC = () => {
    const { currentUser } = useCurrentUser() ?? {};
    const [users, setUsers] = useState<UsersResponse | null>(null);
    const [roles, setRoles] = useState<RolesResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [changingRole, setChangingRole] = useState<{ userId: number; roleId: number } | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
                loadData(currentPage, roleFilter, statusFilter, searchQuery);
            }, 400);
        return () => clearTimeout(timer);
    }, [loading, currentPage, roleFilter, statusFilter, searchQuery]);

    const loadData = async (
        page: number,
        roleFilter: string,
        statusFilter: string,
        searchQuery: string,
        ) => {
        try {
            const [usersData, rolesData] = await Promise.all([
                getUsers(page, roleFilter, statusFilter, searchQuery),
                getRoles(),
            ]);
            setUsers(usersData);
            setRoles(rolesData);
        } catch (error) {
            console.error("Error loading users:", error);
        } 
        finally {
            setLoading(false);
        }
    };

    const handleBan = async (id: number) => {
        let result = await updateIsActiveUser(id, false );
        if (result.success){
            Swal.fire({
                title: 'Thành công',
                text: 'Đã khóa tài khoản',
                icon: 'success', // warning, error, success, info, question
                showConfirmButton: false,
                timer: 1500
            });
            setSelectedUser(null);
            setLoading(true);
        }
    };

    const handleUnban = async (id: number) => {
        let result = await updateIsActiveUser(id, true);
        if (result.success){
            Swal.fire({
                title: 'Thành công',
                text: 'Đã mở khóa tài khoản',
                icon: 'success', // warning, error, success, info, question
                showConfirmButton: false,
                timer: 1500
            });
            setSelectedUser(null);
            setLoading(true);
        }
    };

    const handleRoleChange = async () => {
        if (!changingRole) return;
        let result = await changeUserRole(Number(changingRole.userId), Number(changingRole.roleId));
        if(result.success){
            Swal.fire({
                title: 'Thành công',
                text: 'Đã thay đổi quyền',
                icon: 'success', // warning, error, success, info, question
                showConfirmButton: false,
                timer: 1500
            });
            setChangingRole(null);
            setSelectedUser(null);
            setLoading(true);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("vi-VN", {
            day: "2-digit", month: "2-digit", year: "numeric",
            hour: "2-digit", minute: "2-digit",
        });
    };

    const getRoleBadgeClass = (role: string) => {
        switch (role) {
            case "Dev": return "role-dev";
            case "Admin": return "role-admin";
            case "Mod": return "role-mod";
            default: return "role-user";
        }
    };

    let totalPages: number = 0;
    if(!loading && users?.data){
        totalPages = users.data.last_page;
    }
    let activeCount: number = 0;
    if (!loading && users?.data){
        activeCount = users.data.data.filter(u=>u.is_active===true).length;
    }
    
    return (
        <div>
            {/* Header */}
            <div className="admin-page-header">
                <div className="admin-page-header-left">
                    <div className="admin-search-box">
                        <SearchIcon size={18} className="admin-search-icon" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm người dùng..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="admin-filters">
                    <select
                        className="admin-filter-select"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="">Tất cả vai trò</option>
                        {!loading && roles?.data?.map(role => (
                            <option key={role.name} value={role.name}>{role.name}</option>
                        ))}
                    </select>
                    <select
                        className="admin-filter-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="ACTIVE">Đang hoạt động</option>
                        <option value="BANNED">Đã khóa</option>
                        <option value="VERIFIED">Đã xác minh</option>
                        <option value="UNVERIFIED">Chưa xác minh</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Người dùng</th>
                            <th>Email</th>
                            <th>Vai trò</th>
                            <th>Trạng thái</th>
                            <th>Xác minh</th>
                            <th>Ngày tạo</th>
                            <th>Đăng nhập cuối</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i}>
                                    {Array.from({ length: 9 }).map((_, j) => (
                                        <td key={j}><div className="dashboard-skeleton" style={{ height: 14, width: j === 1 ? 140 : 60 }} /></td>
                                    ))}
                                </tr>
                            ))
                        ) : !users?.success ? (
                            <tr>
                                <td colSpan={9}>
                                    <div className="admin-empty">
                                        <div className="admin-empty-icon"><PersonIcon size={40} /></div>
                                        <div className="admin-empty-text">Không tìm thấy người dùng nào</div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            users.data.data.map((user) => (
                                <tr key={user.id} style={{ opacity: !user.is_active ? 0.6 : 1 }}>
                                    <td className="cell-number">#{user.id}</td>
                                    <td>
                                        <div className="cell-user">
                                            <div className="cell-avatar">
                                                {user.first_name?.[0] || user.username[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="cell-username">@{user.username}</div>
                                                {user.first_name && (
                                                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                                                        {user.first_name} {user.last_name}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="cell-content" style={{ maxWidth: 180 }}>{user.email}</div>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${getRoleBadgeClass(user.role.name || "")}`}>
                                            {user.role.name}
                                        </span>
                                    </td>
                                    <td>
                                        {user.is_active ? (
                                            <span className="status-badge active">Hoạt động</span>
                                        ) : (
                                            <span className="status-badge deleted">Đã khóa</span>
                                        )}
                                    </td>
                                    <td>
                                        {user.is_verified ? (
                                            <span className="status-badge resolved">✓ Đã xác minh</span>
                                        ) : (
                                            <span className="status-badge pending">Chưa xác minh</span>
                                        )}
                                    </td>
                                    <td className="cell-date">{formatDate(user.created_at)}</td>
                                    <td className="cell-date">
                                        {user.last_login ? formatDate(user.last_login) : "—"}
                                    </td>
                                    <td>
                                        <div className="cell-actions d-flex flex-row justify-content-center">
                                            {currentUser?.role?.permissions.find(p=>p.slug==='user.view') && (
                                                <button
                                                    className="action-btn view"
                                                    title="Xem chi tiết"
                                                    onClick={() => setSelectedUser(user)}
                                                >
                                                    <EyeIcon size={16} />
                                                </button>
                                                )
                                            }

                                            {currentUser?.role?.permissions.find(p=>p.slug==='user.ban') && (
                                                user.is_active ? (
                                                    <button
                                                        className="action-btn delete"
                                                        title="Khóa tài khoản"
                                                        onClick={() => handleBan(user.id)}
                                                    >
                                                        🔒
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="action-btn restore"
                                                        title="Mở khóa tài khoản"
                                                        onClick={() => handleUnban(user.id)}
                                                    >
                                                        🔓
                                                    </button>
                                                )
                                                )
                                            }
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                {!loading && users?.success && (
                    <div className="admin-pagination">
                        <span className="admin-pagination-info">
                            Hiển thị {users.data.data.length}–{users.data.total} người dùng
                            {" · "}{activeCount} đang hoạt động
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
            {selectedUser && (
                <div className="admin-detail-overlay" onClick={() => setSelectedUser(null)}>
                    <div className="admin-detail-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-detail-header">
                            <h3 className="admin-detail-title">Chi tiết người dùng #{selectedUser.id}</h3>
                            <button className="admin-detail-close" onClick={() => setSelectedUser(null)}>
                                <CloseIcon size={20} />
                            </button>
                        </div>
                        <div className="admin-detail-content">
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Username</span>
                                <span className="admin-detail-value">@{selectedUser.username}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Họ tên</span>
                                <span className="admin-detail-value">
                                    {selectedUser.first_name && selectedUser.last_name
                                        ? `${selectedUser.first_name} ${selectedUser.last_name}`
                                        : "—"}
                                </span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Email</span>
                                <span className="admin-detail-value">{selectedUser.email}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Vai trò</span>
                                <span className="admin-detail-value">
                                    <span className={`status-badge ${getRoleBadgeClass(selectedUser.role.name || "")}`}>
                                        {selectedUser.role.name}
                                    </span>
                                </span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Trạng thái</span>
                                <span className="admin-detail-value">
                                    {selectedUser.is_active
                                        ? <span className="status-badge active">Đang hoạt động</span>
                                        : <span className="status-badge deleted">Đã khóa</span>
                                    }
                                </span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Xác minh</span>
                                <span className="admin-detail-value">
                                    {selectedUser.is_verified
                                        ? <span className="status-badge resolved">✓ Đã xác minh</span>
                                        : <span className="status-badge pending">Chưa xác minh</span>
                                    }
                                </span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Ngày tạo</span>
                                <span className="admin-detail-value">{formatDate(selectedUser.created_at)}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Đăng nhập cuối</span>
                                <span className="admin-detail-value">
                                    {selectedUser.last_login ? formatDate(selectedUser.last_login) : "Chưa đăng nhập"}
                                </span>
                            </div>

                            {/* Actions in modal */}
                            <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
                            {currentUser?.role?.permissions.find(p=> p.slug==='user.ban') && (
                                selectedUser.is_active ? (
                                    <button
                                        style={{
                                            flex: 1, padding: "10px 16px", border: "1px solid #e2e8f0", borderRadius: 10,
                                            background: "white", color: "#ef4444",
                                            fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.2s",
                                            minWidth: 120,
                                        }}
                                        onClick={() => handleBan(selectedUser.id)}
                                    >
                                        🔒 Khóa tài khoản
                                    </button>
                                ) : (
                                    <button
                                        style={{
                                            flex: 1, padding: "10px 16px", border: "none", borderRadius: 10,
                                            background: "linear-gradient(135deg, #10b981, #059669)", color: "white",
                                            fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.2s",
                                            minWidth: 120,
                                        }}
                                        onClick={() => handleUnban(selectedUser.id)}
                                    >
                                        🔓 Mở khóa
                                    </button>
                                )
                                )
                            }
                            {currentUser?.role?.permissions.find(p=>p.slug==='user.assign_role') && (
                                <button
                                    style={{
                                        flex: 1, padding: "10px 16px", border: "1px solid #e2e8f0", borderRadius: 10,
                                        background: "white", color: "#6366f1",
                                        fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.2s",
                                        minWidth: 120,
                                    }}
                                    onClick={() => setChangingRole({ userId: selectedUser.id, roleId: selectedUser.role.id || 0 })}
                                >
                                    🔄 Đổi vai trò
                                </button>
                                )
                            }
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Change Role Modal */}
            {changingRole && (
                <div className="admin-detail-overlay" onClick={() => setChangingRole(null)}>
                    <div className="admin-detail-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400 }}>
                        <div className="admin-detail-header">
                            <h3 className="admin-detail-title">Đổi vai trò</h3>
                            <button className="admin-detail-close" onClick={() => setChangingRole(null)}>
                                <CloseIcon size={20} />
                            </button>
                        </div>
                        <div className="admin-detail-content">
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ fontSize: 13, fontWeight: 600, color: "#475569", display: "block", marginBottom: 8 }}>
                                    Chọn vai trò mới
                                </label>
                                <select
                                    className="admin-filter-select"
                                    style={{ width: "100%" }}
                                    value={changingRole.roleId}
                                    onChange={(e) => setChangingRole({ ...changingRole, roleId: Number(e.target.value) })}
                                >
                                    {roles?.data?.map(role => (
                                        <option key={role.id} value={role.id}>{role.name} — {role.description}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ display: "flex", gap: 12 }}>
                                <button
                                    style={{
                                        flex: 1, padding: "10px 16px", border: "1px solid #e2e8f0", borderRadius: 10,
                                        background: "white", color: "#64748b",
                                        fontWeight: 600, fontSize: 13, cursor: "pointer",
                                    }}
                                    onClick={() => setChangingRole(null)}
                                >
                                    Hủy
                                </button>
                                <button
                                    style={{
                                        flex: 1, padding: "10px 16px", border: "none", borderRadius: 10,
                                        background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white",
                                        fontWeight: 600, fontSize: 13, cursor: "pointer",
                                    }}
                                    onClick={()=> handleRoleChange()}
                                >
                                    Xác nhận
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;