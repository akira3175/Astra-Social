import React, { useEffect, useState, useMemo } from "react";
import {
    CloseIcon,
    PersonIcon,
} from "../../components/ui";
import {
    getRoles,
    getPermissions,
    createRole,
    updateRole,
    deleteRole,
} from "../../services/adminService";
import { useCurrentUser } from "../../context/currentUserContext";
import type { Role, Permission } from "../../types/admin";
import "./AdminRoles.css";
import Swal from 'sweetalert2';

const AdminRoles: React.FC = () => {
    const { currentUser } = useCurrentUser() ?? {};
    const [roles, setRoles] = useState<Role[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [formName, setFormName] = useState("");
    const [formDesc, setFormDesc] = useState("");
    const [formPerms, setFormPerms] = useState<number[]>([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [rolesData, permsData] = await Promise.all([getRoles(), getPermissions()]);
            setRoles(rolesData.data);
            setPermissions(permsData.data);
        } catch (err) {
            console.error("Error loading roles:", err);
        } finally {
            setLoading(false);
        }
    };

    // Group permissions by group
    const permGroups = useMemo(() => {
        const groups: Record<string, Permission[]> = {};
        permissions.forEach((p) => {
            if (!groups[p.group]) groups[p.group] = [];
            groups[p.group].push(p);
        });
        return groups;
    }, [permissions]);

    const openCreate = () => {
        setEditingRole(null);
        setFormName("");
        setFormDesc("");
        setFormPerms([]);
        setShowModal(true);
    };

    const openEdit = (role: Role) => {
        setEditingRole(role);
        setFormName(role.name);
        setFormDesc(role.description);
        setFormPerms(role.permissions.map(p=> p.id));
        setShowModal(true);
    };

    const togglePerm = (id: number) => {
        setFormPerms((prev) => {
            let isChecked = prev.includes(id);
            if(isChecked)
                return prev.filter(p=>p!==id);
            return [...prev, id];    
        });
    };

    const toggleGroup = (groupPerms: Permission[]) => {
        const allSelected = groupPerms.every((p) => formPerms.includes(p.id));
        const groupPermsIds = groupPerms.map(g=>g.id);
        setFormPerms((prev) => {
            if (allSelected){
                return prev.filter(p=> !groupPermsIds.includes(p));
            }
            return [...prev, ...groupPermsIds.filter(g=> !prev.includes(g))];
        });
    };

    const handleSave = async () => {
        if (!formName.trim()) return;
        setSaving(true);
        try {
            let result;
            const actionText = editingRole ? 'Cập nhật' : 'Tạo';
            if (editingRole) {
                result = await updateRole(editingRole.id, {
                    description: formDesc,
                    permissions: [...formPerms],
                });
            } 
            else {
                result = await createRole({
                    name: formName.trim(),
                    description: formDesc,
                    permissions: [...formPerms],
                });
            }
            if(!result.success){
                Swal.fire({
                    title: 'Thất bại',
                    text: result.message || result.errors || `${actionText} vai trò thất bại`,
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 3000
                });
                return;
            }
            
            Swal.fire({
                title: 'Thành công',
                text: result.message || `${actionText} vai trò thành công`,
                icon: 'success',
                showConfirmButton: false,
                timer: 3000
            });

            await loadData();
            setShowModal(false);
        } catch (err: any) {
            console.error("Save role error:", err);
            Swal.fire({
                title: 'Lỗi',
                text: err.response?.data?.message || 'Có lỗi xảy ra khi lưu vai trò',
                icon: 'error',
                showConfirmButton: false,
                timer: 3000
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        const confirm = await Swal.fire({
            title: 'Xác nhận xóa',
            text: 'Bạn có chắc muốn xóa vai trò này không?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
        });
        if (!confirm.isConfirmed) return;

        try {
            const result = await deleteRole(id);
            if (!result.success) {
                Swal.fire({
                    title: 'Thất bại',
                    text: result.message || 'Vai trò này đã có người dùng, không thể xóa',
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 3000,
                });
                return;
            }
            Swal.fire({
                title: 'Thành công',
                text: result.message || 'Đã xóa vai trò thành công',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000,
            });
            await loadData();
        } catch (err: any) {
            Swal.fire({
                title: 'Lỗi',
                text: err.response?.data?.message || 'Không thể xóa vai trò này',
                icon: 'error',
                showConfirmButton: false,
                timer: 3000,
            });
        }
    };

    const getPermLabel = (permId: number) => {
        return permissions.find((p) => p.id === permId)?.slug || `#${permId}`;
    };

    if (loading) {
        return <div className="roles-loading">Đang tải dữ liệu phân quyền...</div>;
    }

    return (
        <div>
            {/* Header */}
            <div className="roles-header">
                <div>
                    <h2>Quản lý phân quyền</h2>
                    <p>Tạo, chỉnh sửa vai trò và gán quyền hạn cho từng vai trò</p>
                </div>
                {currentUser.role.permissions.find(p=>p.slug==='role.create') && (
                <button className="roles-btn-create" onClick={openCreate}>
                    + Tạo vai trò mới
                </button>
                )}
            </div>

            {/* Roles Grid */}
            <div className="roles-grid">
                {roles.map((role) => (
                    <div key={`role_${role.id}`} className={`role-card ${role.is_default ? "is-default" : ""}`}>
                        <div className="role-card-top">
                            <div className="role-card-info">
                                <h3>
                                    {role.name}
                                </h3>
                                <p>{role.description}</p>
                            </div>
                            <div className="role-card-actions">
                            {currentUser.role.permissions.find(p=>p.slug==='role.edit') && (
                                <button
                                    className="role-action-btn"
                                    title="Chỉnh sửa"
                                    onClick={() => openEdit(role)}
                                >
                                    ✏️
                                </button>
                            )}
                            {currentUser.role.permissions.find(p=>p.slug==='role.delete') && (
                                <button
                                    className="role-action-btn delete"
                                    title="Xóa"
                                    onClick={() => handleDelete(role.id)}
                                    disabled={role.is_default}
                                >
                                    🗑️
                                </button>
                            )}
                            </div>
                        </div>

                        <div className="role-card-stats">
                            <div className="role-stat">
                                <PersonIcon size={14} className="role-stat-icon" />
                                {role.user_count} người dùng
                            </div>
                            <div className="role-stat">
                                🔑 {role.permissions.length}/{permissions.length} quyền
                            </div>
                        </div>

                        <div className="role-card-perms">
                            {role.permissions.slice(0, 5).map((pid) => (
                                <span key={`role_${role.id}_permission_${pid.id}`} className="role-perm-tag">
                                    {getPermLabel(pid.slug)}
                                </span>
                            ))}
                            {role.permissions.length > 5 && (
                                <span className="role-perm-tag more">
                                    +{role.permissions.length - 5}
                                </span>
                            )}
                            {role.permissions.length === 0 && (
                                <span className="role-perm-tag" style={{ fontStyle: "italic", color: "#94a3b8" }}>
                                    Không có quyền
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="roles-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="roles-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="roles-modal-header">
                            <h3>{editingRole ? "Chỉnh sửa vai trò" : "Tạo vai trò mới"}</h3>
                            <button className="roles-modal-close" onClick={() => setShowModal(false)}>
                                <CloseIcon size={18} />
                            </button>
                        </div>

                        <div className="roles-modal-body">
                            <div className="roles-form-group">
                                <label>Tên vai trò</label>
                                <input
                                    type="text"
                                    className="roles-form-input"
                                    placeholder="VD: Content Writer, Support Agent..."
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                />
                            </div>
                            <div className="roles-form-group">
                                <label>Mô tả</label>
                                <input
                                    type="text"
                                    className="roles-form-input"
                                    placeholder="Mô tả ngắn gọn về vai trò"
                                    value={formDesc}
                                    onChange={(e) => setFormDesc(e.target.value)}
                                />
                            </div>

                            <div className="roles-form-group">
                                <label>Quyền hạn ({formPerms.length}/{permissions.length})</label>
                                <div className="perm-matrix">
                                    {Object.entries(permGroups).map(([group, groupPerms]) => {
                                        const allSelected = groupPerms.every((p) => formPerms.includes(p.id));
                                        const someSelected = groupPerms.some((p) => formPerms.includes(p.id));
                                        return (
                                            <div key={group} className="perm-group">
                                                <div className="perm-group-header" onClick={() => toggleGroup(groupPerms)}>
                                                    <span className="perm-group-name">
                                                        {group}
                                                        <span className="perm-group-count">
                                                            {groupPerms.filter((p) => formPerms.includes(p.id)).length}/{groupPerms.length}
                                                        </span>
                                                    </span>
                                                    <button
                                                        className={`perm-group-toggle ${allSelected ? "all-selected" : ""}`}
                                                        onClick={(e) => { e.stopPropagation(); toggleGroup(groupPerms); }}
                                                    >
                                                        {allSelected ? "Bỏ chọn tất cả" : someSelected ? "Chọn tất cả" : "Chọn tất cả"}
                                                    </button>
                                                </div>
                                                <div className="perm-items">
                                                    {groupPerms.map((perm) => (
                                                        <div
                                                            key={perm.id}
                                                            className="perm-item"
                                                            onClick={() => togglePerm(perm.id)}
                                                        >
                                                            <div className={`perm-checkbox ${formPerms.includes(perm.id) ? "checked" : ""}`} />
                                                            <div className="perm-detail">
                                                                <div className="perm-slug">{perm.slug}</div>
                                                                <div className="perm-desc">{perm.description}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="roles-modal-footer">
                            <button className="roles-btn-cancel" onClick={() => setShowModal(false)}>
                                Hủy
                            </button>
                            <button
                                className="roles-btn-save"
                                onClick={handleSave}
                                disabled={!formName.trim() || saving}
                            >
                                {saving ? "Đang lưu..." : editingRole ? "Cập nhật" : "Tạo vai trò"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Error toast */}
            {error && <div className="roles-error-toast">{error}</div>}
        </div>
    );
};

export default AdminRoles;