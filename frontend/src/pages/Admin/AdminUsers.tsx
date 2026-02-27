import React, { useEffect, useState, useMemo } from "react";
import {
    SearchIcon,
    EyeIcon,
    CloseIcon,
    PersonIcon,
} from "../../components/ui";
import { getAdminUsers, banUser, unbanUser, changeUserRole, getRoles } from "../../services/adminService";
import type { AdminUser, Role } from "../../types/admin";
import "./AdminTable.css";

const ITEMS_PER_PAGE = 5;

const AdminUsers: React.FC = () => {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("ALL");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [changingRole, setChangingRole] = useState<{ userId: number; newRole: string } | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [usersData, rolesData] = await Promise.all([
                getAdminUsers(),
                getRoles(),
            ]);
            setUsers(usersData);
            setRoles(rolesData);
        } catch (error) {
            console.error("Error loading users:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = useMemo(() => {
        setCurrentPage(1);
        return users.filter((user) => {
            const fullName = `${user.first_name || ""} ${user.last_name || ""}`.toLowerCase();
            const matchesSearch = !searchQuery ||
                user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                fullName.includes(searchQuery.toLowerCase());

            const matchesRole = roleFilter === "ALL" || user.role === roleFilter;

            const matchesStatus = statusFilter === "ALL" ||
                (statusFilter === "ACTIVE" && user.is_active) ||
                (statusFilter === "BANNED" && !user.is_active) ||
                (statusFilter === "VERIFIED" && user.is_verified) ||
                (statusFilter === "UNVERIFIED" && !user.is_verified);

            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [users, searchQuery, roleFilter, statusFilter]);

    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleBan = async (id: number) => {
        await banUser(id);
        setUsers(prev => prev.map(u => u.id === id ? { ...u, is_active: false } : u));
        if (selectedUser?.id === id) setSelectedUser(prev => prev ? { ...prev, is_active: false } : null);
    };

    const handleUnban = async (id: number) => {
        await unbanUser(id);
        setUsers(prev => prev.map(u => u.id === id ? { ...u, is_active: true } : u));
        if (selectedUser?.id === id) setSelectedUser(prev => prev ? { ...prev, is_active: true } : null);
    };

    const handleRoleChange = async () => {
        if (!changingRole) return;
        await changeUserRole(changingRole.userId, changingRole.newRole);
        setUsers(prev => prev.map(u => u.id === changingRole.userId ? { ...u, role: changingRole.newRole } : u));
        if (selectedUser?.id === changingRole.userId) {
            setSelectedUser(prev => prev ? { ...prev, role: changingRole.newRole } : null);
        }
        setChangingRole(null);
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

    const uniqueRoles = [...new Set(users.map(u => u.role))];

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
                        <option value="ALL">Tất cả vai trò</option>
                        {uniqueRoles.map(role => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                    <select
                        className="admin-filter-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="ALL">Tất cả trạng thái</option>
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
                        ) : filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={9}>
                                    <div className="admin-empty">
                                        <div className="admin-empty-icon"><PersonIcon size={40} /></div>
                                        <div className="admin-empty-text">Không tìm thấy người dùng nào</div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            paginatedUsers.map((user) => (
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
                                        <span className={`status-badge ${getRoleBadgeClass(user.role)}`}>
                                            {user.role}
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
                                        <div className="cell-actions">
                                            <button
                                                className="action-btn view"
                                                title="Xem chi tiết"
                                                onClick={() => setSelectedUser(user)}
                                            >
                                                <EyeIcon size={16} />
                                            </button>
                                            {user.is_active ? (
                                                <button
                                                    className="action-btn delete"
                                                    title="Khóa tài khoản"
                                                    onClick={() => handleBan(user.id)}
                                                >
                                                    🔒
                                                </button>
                                            ) : (
                                                <button
                                                    className="action-btn restore"
                                                    title="Mở khóa tài khoản"
                                                    onClick={() => handleUnban(user.id)}
                                                >
                                                    🔓
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                {!loading && filteredUsers.length > 0 && (
                    <div className="admin-pagination">
                        <span className="admin-pagination-info">
                            Hiển thị {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)} / {filteredUsers.length} người dùng
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
                                    <span className={`status-badge ${getRoleBadgeClass(selectedUser.role)}`}>
                                        {selectedUser.role}
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
                                {selectedUser.is_active ? (
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
                                )}
                                <button
                                    style={{
                                        flex: 1, padding: "10px 16px", border: "1px solid #e2e8f0", borderRadius: 10,
                                        background: "white", color: "#6366f1",
                                        fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.2s",
                                        minWidth: 120,
                                    }}
                                    onClick={() => setChangingRole({ userId: selectedUser.id, newRole: selectedUser.role })}
                                >
                                    🔄 Đổi vai trò
                                </button>
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
                                    value={changingRole.newRole}
                                    onChange={(e) => setChangingRole({ ...changingRole, newRole: e.target.value })}
                                >
                                    {roles.map(role => (
                                        <option key={role.id} value={role.name}>{role.name} — {role.description}</option>
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
                                    onClick={handleRoleChange}
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
