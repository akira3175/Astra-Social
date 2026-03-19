import React, { useState } from "react";
import { changePassword } from "../../services/authService";
import "./SettingsPage.css";

interface FormData {
    current_password: string;
    password: string;
    password_confirmation: string;
}

interface FormErrors {
    current_password?: string;
    password?: string;
    password_confirmation?: string;
}

const SettingsPage: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        current_password: "",
        password: "",
        password_confirmation: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

    // Toggle visibility per field
    const [showCurrentPw, setShowCurrentPw] = useState(false);
    const [showNewPw, setShowNewPw] = useState(false);
    const [showConfirmPw, setShowConfirmPw] = useState(false);

    const validate = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.current_password) {
            newErrors.current_password = "Vui lòng nhập mật khẩu hiện tại.";
        }

        if (!formData.password) {
            newErrors.password = "Vui lòng nhập mật khẩu mới.";
        } else if (formData.password.length < 6) {
            newErrors.password = "Mật khẩu mới phải có ít nhất 6 ký tự.";
        }

        if (!formData.password_confirmation) {
            newErrors.password_confirmation = "Vui lòng xác nhận mật khẩu mới.";
        } else if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = "Xác nhận mật khẩu không khớp.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear field error on change
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setAlert(null);

        if (!validate()) return;

        setLoading(true);
        try {
            const result = await changePassword(formData);
            if (result.success) {
                setAlert({ type: "success", message: result.message || "Đổi mật khẩu thành công!" });
                setFormData({ current_password: "", password: "", password_confirmation: "" });
            } else {
                setAlert({ type: "error", message: result.message || "Có lỗi xảy ra." });
            }
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.errors?.current_password?.[0] ||
                err?.response?.data?.errors?.password?.[0] ||
                "Có lỗi xảy ra. Vui lòng thử lại.";
            setAlert({ type: "error", message: msg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="settings-page">
            {/* Sidebar */}
            <aside className="settings-sidebar">
                <div className="settings-sidebar-card">
                    <div className="settings-sidebar-title">Cài đặt</div>
                    <button className="settings-nav-item active">
                        <span className="nav-icon">🔒</span>
                        Đổi mật khẩu
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="settings-content">
                <div className="settings-content-card">
                    <div className="settings-content-header">
                        <h2>
                            🔑 Đổi mật khẩu
                        </h2>
                        <p>Cập nhật mật khẩu để bảo vệ tài khoản của bạn</p>
                    </div>

                    <div className="settings-content-body">
                        {alert && (
                            <div className={`settings-alert ${alert.type}`}>
                                <span className="alert-icon">
                                    {alert.type === "success" ? "✅" : "❌"}
                                </span>
                                {alert.message}
                            </div>
                        )}

                        <form className="change-password-form" onSubmit={handleSubmit} noValidate>
                            {/* Current password */}
                            <div className="form-group">
                                <label htmlFor="current_password">Mật khẩu hiện tại</label>
                                <div className="input-wrapper">
                                    <input
                                        id="current_password"
                                        name="current_password"
                                        type={showCurrentPw ? "text" : "password"}
                                        value={formData.current_password}
                                        onChange={handleChange}
                                        placeholder="Nhập mật khẩu hiện tại"
                                        className={errors.current_password ? "input-error" : ""}
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password-btn"
                                        onClick={() => setShowCurrentPw(!showCurrentPw)}
                                        tabIndex={-1}
                                        aria-label="Toggle visibility"
                                    >
                                        {showCurrentPw ? "👁️" : "👁️‍🗨️"}
                                    </button>
                                </div>
                                {errors.current_password && (
                                    <span className="field-error">{errors.current_password}</span>
                                )}
                            </div>

                            {/* New password */}
                            <div className="form-group">
                                <label htmlFor="password">Mật khẩu mới</label>
                                <div className="input-wrapper">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showNewPw ? "text" : "password"}
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                                        className={errors.password ? "input-error" : ""}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password-btn"
                                        onClick={() => setShowNewPw(!showNewPw)}
                                        tabIndex={-1}
                                        aria-label="Toggle visibility"
                                    >
                                        {showNewPw ? "👁️" : "👁️‍🗨️"}
                                    </button>
                                </div>
                                {errors.password && (
                                    <span className="field-error">{errors.password}</span>
                                )}
                            </div>

                            {/* Confirm new password */}
                            <div className="form-group">
                                <label htmlFor="password_confirmation">Xác nhận mật khẩu mới</label>
                                <div className="input-wrapper">
                                    <input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type={showConfirmPw ? "text" : "password"}
                                        value={formData.password_confirmation}
                                        onChange={handleChange}
                                        placeholder="Nhập lại mật khẩu mới"
                                        className={errors.password_confirmation ? "input-error" : ""}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password-btn"
                                        onClick={() => setShowConfirmPw(!showConfirmPw)}
                                        tabIndex={-1}
                                        aria-label="Toggle visibility"
                                    >
                                        {showConfirmPw ? "👁️" : "👁️‍🗨️"}
                                    </button>
                                </div>
                                {errors.password_confirmation && (
                                    <span className="field-error">{errors.password_confirmation}</span>
                                )}
                            </div>

                            {/* Submit */}
                            <div className="form-actions">
                                <button
                                    type="submit"
                                    className="btn-submit"
                                    disabled={loading}
                                >
                                    {loading && <span className="spinner" />}
                                    {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
