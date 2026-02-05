import { useState, useEffect, useMemo } from "react";
import type { User, UpdateProfileData } from "../../../types/user";
import { updateProfile } from "../../../services/profileService";
import "./EditProfileModal.css";
import "../../../components/ui/Button/Button.css";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    profile: User;
    onProfileUpdated: (updatedProfile: User) => void;
}

// Close Icon
const CloseIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
);

// Generate year options (from 1900 to current year)
const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);
const months = Array.from({ length: 12 }, (_, i) => i + 1);

const EditProfileModal = ({ isOpen, onClose, profile, onProfileUpdated }: EditProfileModalProps) => {
    const [formData, setFormData] = useState<UpdateProfileData>({
        first_name: "",
        last_name: "",
        bio: "",
        phone: "",
        address: "",
        birth_date: "",
        gender: undefined,
    });

    // Separate state for birth date
    const [birthDay, setBirthDay] = useState<string>("");
    const [birthMonth, setBirthMonth] = useState<string>("");
    const [birthYear, setBirthYear] = useState<string>("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [phoneError, setPhoneError] = useState<string | null>(null);

    // Calculate days based on selected month and year
    const daysInMonth = useMemo(() => {
        if (!birthMonth || !birthYear) return 31;
        return new Date(parseInt(birthYear), parseInt(birthMonth), 0).getDate();
    }, [birthMonth, birthYear]);

    const days = useMemo(() => {
        return Array.from({ length: daysInMonth }, (_, i) => i + 1);
    }, [daysInMonth]);

    // Initialize form with profile data
    useEffect(() => {
        if (isOpen && profile) {
            setFormData({
                first_name: profile.firstName || "",
                last_name: profile.lastName || "",
                bio: profile.bio || "",
                phone: profile.phone || "",
                address: profile.address || "",
                birth_date: profile.birthDate || "",
                gender: profile.gender,
            });

            // Parse birth date
            if (profile.birthDate) {
                const date = new Date(profile.birthDate);
                setBirthDay(String(date.getDate()));
                setBirthMonth(String(date.getMonth() + 1));
                setBirthYear(String(date.getFullYear()));
            } else {
                setBirthDay("");
                setBirthMonth("");
                setBirthYear("");
            }

            setError(null);
            setPhoneError(null);
        }
    }, [isOpen, profile]);

    // Update birth_date when day/month/year changes
    useEffect(() => {
        if (birthDay && birthMonth && birthYear) {
            const dateStr = `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`;
            setFormData(prev => ({ ...prev, birth_date: dateStr }));
        } else {
            setFormData(prev => ({ ...prev, birth_date: "" }));
        }
    }, [birthDay, birthMonth, birthYear]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value || undefined,
        }));
    };

    // Phone validation - only allow numbers
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Only allow digits
        const numbersOnly = value.replace(/[^0-9]/g, '');
        setFormData(prev => ({ ...prev, phone: numbersOnly }));

        if (value !== numbersOnly && value.length > 0) {
            setPhoneError("Số điện thoại chỉ được chứa số");
        } else {
            setPhoneError(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validate phone
        if (formData.phone && !/^\d*$/.test(formData.phone)) {
            setPhoneError("Số điện thoại chỉ được chứa số");
            return;
        }

        setIsSubmitting(true);

        try {
            const updatedProfile = await updateProfile(formData);
            onProfileUpdated(updatedProfile);
            onClose();
        } catch (err) {
            console.error("Failed to update profile:", err);
            setError(err instanceof Error ? err.message : "Không thể cập nhật thông tin");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="edit-profile-overlay" onClick={onClose}>
            <div className="edit-profile-modal" onClick={e => e.stopPropagation()}>
                <div className="edit-profile-header">
                    <h2 className="edit-profile-title">Chỉnh sửa hồ sơ</h2>
                    <button className="edit-profile-close-btn" onClick={onClose}>
                        <CloseIcon />
                    </button>
                </div>

                <form className="edit-profile-form" onSubmit={handleSubmit}>
                    {error && (
                        <div className="edit-profile-error">
                            {error}
                        </div>
                    )}

                    <div className="edit-profile-row">
                        <div className="edit-profile-field">
                            <label htmlFor="last_name">Họ</label>
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                value={formData.last_name || ""}
                                onChange={handleChange}
                                placeholder="Nhập họ"
                                maxLength={50}
                            />
                        </div>
                        <div className="edit-profile-field">
                            <label htmlFor="first_name">Tên</label>
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                value={formData.first_name || ""}
                                onChange={handleChange}
                                placeholder="Nhập tên"
                                maxLength={50}
                            />
                        </div>
                    </div>

                    <div className="edit-profile-field">
                        <label htmlFor="bio">Tiểu sử</label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio || ""}
                            onChange={handleChange}
                            placeholder="Viết gì đó về bạn..."
                            rows={3}
                        />
                    </div>

                    <div className="edit-profile-field">
                        <label htmlFor="phone">Số điện thoại</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone || ""}
                            onChange={handlePhoneChange}
                            placeholder="Nhập số điện thoại"
                            maxLength={20}
                            inputMode="numeric"
                            pattern="[0-9]*"
                        />
                        {phoneError && <span className="edit-profile-field-error">{phoneError}</span>}
                    </div>

                    <div className="edit-profile-field">
                        <label htmlFor="address">Địa chỉ</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address || ""}
                            onChange={handleChange}
                            placeholder="Nhập địa chỉ"
                            maxLength={255}
                        />
                    </div>

                    <div className="edit-profile-field">
                        <label>Ngày sinh</label>
                        <div className="edit-profile-birthdate-row">
                            <select
                                value={birthDay}
                                onChange={(e) => setBirthDay(e.target.value)}
                            >
                                <option value="">Ngày</option>
                                {days.map(d => (
                                    <option key={d} value={String(d)}>{d}</option>
                                ))}
                            </select>
                            <select
                                value={birthMonth}
                                onChange={(e) => setBirthMonth(e.target.value)}
                            >
                                <option value="">Tháng</option>
                                {months.map(m => (
                                    <option key={m} value={String(m)}>Tháng {m}</option>
                                ))}
                            </select>
                            <select
                                value={birthYear}
                                onChange={(e) => setBirthYear(e.target.value)}
                            >
                                <option value="">Năm</option>
                                {years.map(y => (
                                    <option key={y} value={String(y)}>{y}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="edit-profile-field">
                        <label htmlFor="gender">Giới tính</label>
                        <select
                            id="gender"
                            name="gender"
                            value={formData.gender || ""}
                            onChange={handleChange}
                        >
                            <option value="">Chọn giới tính</option>
                            <option value="MALE">Nam</option>
                            <option value="FEMALE">Nữ</option>
                            <option value="OTHER">Khác</option>
                        </select>
                    </div>

                    <div className="edit-profile-actions">
                        <button
                            type="button"
                            className="btn btn-outlined btn-secondary btn-medium"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="btn btn-contained btn-primary btn-medium"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;
