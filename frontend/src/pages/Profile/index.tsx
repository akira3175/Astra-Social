import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProfileById, uploadAvatar, uploadCover, updateCoverPosition } from "../../services/profileService";
import { useCurrentUser } from "../../context/currentUserContext";
import type { User } from "../../types/user";
import EditProfileModal from "./components/EditProfileModal";
import "./ProfilePage.css";
import "../../components/ui/Button/Button.css";
import "../../components/ui/Card/Card.css";

// Camera Icon SVG
const CameraIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M12 15.2c1.8 0 3.2-1.4 3.2-3.2S13.8 8.8 12 8.8 8.8 10.2 8.8 12s1.4 3.2 3.2 3.2zm9-9.6h-2.4l-1.6-2.4H7l-1.6 2.4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2v-12c0-1.1-.9-2-2-2zM12 17c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z" />
    </svg>
);

// Move Icon SVG for reposition
const MoveIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z" />
    </svg>
);

const ProfilePage = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const currentUserContext = useCurrentUser();
    const currentUser = currentUserContext?.currentUser;
    const refreshUser = currentUserContext?.refreshUser;

    const [profile, setProfile] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

    // Cover reposition state
    const [isRepositioning, setIsRepositioning] = useState(false);
    const [tempPosition, setTempPosition] = useState<number>(50);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartY = useRef<number>(0);
    const dragStartPosition = useRef<number>(50);

    // Pending cover upload state (preview before upload)
    const [pendingCoverFile, setPendingCoverFile] = useState<File | null>(null);
    const [pendingCoverPreview, setPendingCoverPreview] = useState<string | null>(null);

    const avatarInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);
    const coverRef = useRef<HTMLDivElement>(null);

    // Edit profile modal state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Check if viewing own profile
    const isOwnProfile = currentUser && profile && String(currentUser.id) === String(profile.id);

    useEffect(() => {
        const loadProfile = async () => {
            if (!userId) {
                setError("User ID is required");
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);
                const data = await getProfileById(userId);
                setProfile(data);
                setTempPosition(data.backgroundPosition ?? 50);
            } catch (err) {
                console.error("Failed to load profile:", err);
                setError("Profile not found");
            } finally {
                setIsLoading(false);
            }
        };

        loadProfile();
    }, [userId]);

    // Get display name
    const getDisplayName = () => {
        if (!profile) return "";
        const firstName = profile.firstName || "";
        const lastName = profile.lastName || "";
        if (lastName && firstName) return `${lastName} ${firstName}`;
        if (lastName) return lastName;
        if (firstName) return firstName;
        return profile.username || profile.email;
    };

    // Get avatar initial
    const getAvatarInitial = () => {
        if (!profile) return "?";
        if (profile.firstName) return profile.firstName.charAt(0).toUpperCase();
        if (profile.lastName) return profile.lastName.charAt(0).toUpperCase();
        if (profile.username) return profile.username.charAt(0).toUpperCase();
        return profile.email.charAt(0).toUpperCase();
    };

    // Handle avatar upload
    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const updatedProfile = await uploadAvatar(file);
            setProfile(updatedProfile);
            if (refreshUser) {
                refreshUser();
            }
            setNotification({ type: "success", message: "Đã cập nhật ảnh đại diện" });
        } catch (err) {
            console.error("Failed to upload avatar:", err);
            setNotification({ type: "error", message: "Không thể cập nhật ảnh đại diện" });
        } finally {
            setIsUploading(false);
            // Reset input
            if (avatarInputRef.current) {
                avatarInputRef.current.value = "";
            }
        }
    };

    // Handle cover file selection - create preview and enter reposition mode
    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setPendingCoverFile(file);
        setPendingCoverPreview(previewUrl);
        setTempPosition(50); // Start at center
        setIsRepositioning(true);

        // Reset input
        if (coverInputRef.current) {
            coverInputRef.current.value = "";
        }
    };

    // Cleanup preview URL when component unmounts or preview changes
    useEffect(() => {
        return () => {
            if (pendingCoverPreview) {
                URL.revokeObjectURL(pendingCoverPreview);
            }
        };
    }, [pendingCoverPreview]);

    // Start reposition mode (for existing cover)
    const handleStartReposition = () => {
        setTempPosition(profile?.backgroundPosition ?? 50);
        setIsRepositioning(true);
    };

    // Cancel reposition - clear pending file if any
    const handleCancelReposition = () => {
        // Cleanup preview URL
        if (pendingCoverPreview) {
            URL.revokeObjectURL(pendingCoverPreview);
        }
        setPendingCoverFile(null);
        setPendingCoverPreview(null);
        setTempPosition(profile?.backgroundPosition ?? 50);
        setIsRepositioning(false);
    };

    // Save cover - upload new file or just update position
    const handleSavePosition = async () => {
        try {
            setIsUploading(true);

            let updatedProfile;
            if (pendingCoverFile) {
                // Upload new cover with position
                updatedProfile = await uploadCover(pendingCoverFile, tempPosition);
                // Cleanup preview URL
                if (pendingCoverPreview) {
                    URL.revokeObjectURL(pendingCoverPreview);
                }
                setPendingCoverFile(null);
                setPendingCoverPreview(null);
                setNotification({ type: "success", message: "Đã cập nhật ảnh bìa" });
            } else {
                // Just update position of existing cover
                updatedProfile = await updateCoverPosition(tempPosition);
                setNotification({ type: "success", message: "Đã cập nhật vị trí ảnh bìa" });
            }

            setProfile(updatedProfile);
            if (refreshUser) {
                refreshUser();
            }
            setIsRepositioning(false);
        } catch (err) {
            console.error("Failed to save cover:", err);
            setNotification({ type: "error", message: "Không thể cập nhật ảnh bìa" });
        } finally {
            setIsUploading(false);
        }
    };

    // Drag handlers for cover reposition
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (!isRepositioning) return;
        e.preventDefault();
        setIsDragging(true);
        dragStartY.current = e.clientY;
        dragStartPosition.current = tempPosition;
    }, [isRepositioning, tempPosition]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging || !coverRef.current) return;

        const coverHeight = coverRef.current.offsetHeight;
        const deltaY = e.clientY - dragStartY.current;
        // INVERTED: Kéo xuống → ảnh đi lên (giảm position)
        // Kéo lên → ảnh đi xuống (tăng position)
        const deltaPercent = (deltaY / coverHeight) * 100;
        const newPosition = Math.max(0, Math.min(100, dragStartPosition.current - deltaPercent));
        setTempPosition(Math.round(newPosition));
    }, [isDragging]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Global mouse event listeners for dragging
    useEffect(() => {
        if (isRepositioning) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
            return () => {
                window.removeEventListener("mousemove", handleMouseMove);
                window.removeEventListener("mouseup", handleMouseUp);
            };
        }
    }, [isRepositioning, handleMouseMove, handleMouseUp]);

    // Auto hide notification
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    // Loading state
    if (isLoading) {
        return (
            <div className="profile-page">
                <div className="profile-loading">
                    <div className="profile-spinner"></div>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !profile) {
        return (
            <div className="profile-page">
                <div className="profile-error">
                    <p className="profile-error-text">{error || "Profile not found"}</p>
                    <button
                        className="btn btn-contained btn-primary btn-medium"
                        onClick={() => navigate(-1)}
                    >
                        Quay lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            {/* Notification */}
            {notification && (
                <div className={`profile-notification profile-notification-${notification.type}`}>
                    {notification.message}
                </div>
            )}

            {/* Uploading overlay */}
            {isUploading && (
                <div className="profile-uploading-overlay">
                    <div className="profile-spinner"></div>
                    <p>Đang tải lên...</p>
                </div>
            )}

            {/* Profile Header */}
            <div className="profile-header">
                {/* Cover Image */}
                <div
                    ref={coverRef}
                    className={`profile-cover ${isRepositioning ? 'profile-cover--repositioning' : ''}`}
                    onMouseDown={handleMouseDown}
                >
                    {(pendingCoverPreview || profile.background) && (
                        <img
                            src={pendingCoverPreview || profile.background}
                            alt="Cover"
                            className="profile-cover-img"
                            style={{
                                objectPosition: `center ${isRepositioning ? tempPosition : (profile.backgroundPosition ?? 50)}%`
                            }}
                            draggable={false}
                        />
                    )}

                    {/* Reposition mode overlay */}
                    {isRepositioning && (
                        <div className="profile-cover-reposition-overlay">
                            <p className="profile-cover-reposition-hint">
                                Kéo để điều chỉnh vị trí
                            </p>
                            <div className="profile-cover-reposition-actions">
                                <button
                                    className="btn btn-contained btn-primary btn-small"
                                    onClick={handleSavePosition}
                                    disabled={isUploading}
                                >
                                    Lưu
                                </button>
                                <button
                                    className="btn btn-outlined btn-secondary btn-small"
                                    onClick={handleCancelReposition}
                                    disabled={isUploading}
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Edit buttons (only when not repositioning) */}
                    {isOwnProfile && !isRepositioning && (
                        <div className="profile-cover-buttons">
                            <button
                                className="profile-cover-edit-btn"
                                onClick={() => coverInputRef.current?.click()}
                                disabled={isUploading}
                                title="Tải ảnh bìa mới"
                            >
                                <CameraIcon />
                            </button>
                            {profile.background && (
                                <button
                                    className="profile-cover-edit-btn profile-cover-reposition-btn"
                                    onClick={handleStartReposition}
                                    disabled={isUploading}
                                    title="Điều chỉnh vị trí"
                                >
                                    <MoveIcon />
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Profile Info */}
                <div className="profile-info">
                    {/* Avatar */}
                    <div className="profile-avatar-container">
                        {profile.avatar ? (
                            <img
                                src={profile.avatar}
                                alt={getDisplayName()}
                                className="profile-avatar"
                            />
                        ) : (
                            <div className="profile-avatar-placeholder">
                                {getAvatarInitial()}
                            </div>
                        )}
                        {isOwnProfile && (
                            <button
                                className="profile-avatar-edit-btn"
                                onClick={() => avatarInputRef.current?.click()}
                                disabled={isUploading}
                            >
                                <CameraIcon />
                            </button>
                        )}
                    </div>

                    {/* Name */}
                    <div className="profile-name-container">
                        <h1 className="profile-name">{getDisplayName()}</h1>
                    </div>

                    {/* Email */}
                    <p className="profile-email">{profile.email}</p>

                    {/* Bio */}
                    {profile.bio && (
                        <p className="profile-bio">{profile.bio}</p>
                    )}

                    {/* Verified badge */}
                    {profile.isVerified && (
                        <span className="profile-verified">✓ Đã xác minh</span>
                    )}
                </div>

                {/* Hidden file inputs */}
                <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="profile-file-input"
                    onChange={handleAvatarChange}
                />
                <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    className="profile-file-input"
                    onChange={handleCoverChange}
                />
            </div>

            {/* Profile Content */}
            <div className="profile-content">
                <div className="profile-sidebar">
                    {/* About Card */}
                    <div className="card card-elevation-1 profile-about-card">
                        <div className="card-header">
                            <div className="card-header-content">
                                <h3 className="card-title">Giới thiệu</h3>
                            </div>
                            {isOwnProfile && (
                                <button
                                    className="profile-about-edit-btn"
                                    onClick={() => setIsEditModalOpen(true)}
                                    title="Chỉnh sửa thông tin"
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                                    </svg>
                                </button>
                            )}
                        </div>
                        <div className="card-content profile-about-content">
                            {/* Bio */}
                            {profile.bio && (
                                <div className="profile-about-item profile-about-bio">
                                    <p>{profile.bio}</p>
                                </div>
                            )}

                            {/* Phone */}
                            {profile.phone && (
                                <div className="profile-about-item">
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                                    </svg>
                                    <span>{profile.phone}</span>
                                </div>
                            )}

                            {/* Address */}
                            {profile.address && (
                                <div className="profile-about-item">
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                    </svg>
                                    <span>{profile.address}</span>
                                </div>
                            )}

                            {/* Birth Date */}
                            {profile.birthDate && (
                                <div className="profile-about-item">
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                                        <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
                                    </svg>
                                    <span>{new Date(profile.birthDate).toLocaleDateString('vi-VN')}</span>
                                </div>
                            )}

                            {/* Gender */}
                            {profile.gender && (
                                <div className="profile-about-item">
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                                    </svg>
                                    <span>
                                        {profile.gender === 'MALE' ? 'Nam' : profile.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
                                    </span>
                                </div>
                            )}

                            {/* No info message */}
                            {!profile.bio && !profile.phone && !profile.address && !profile.birthDate && !profile.gender && (
                                <p className="profile-about-empty">
                                    {isOwnProfile ? 'Thêm thông tin giới thiệu về bạn' : 'Chưa có thông tin giới thiệu'}
                                </p>
                            )}

                            {/* Add info prompt for owner */}
                            {isOwnProfile && (!profile.bio || !profile.phone || !profile.address || !profile.birthDate || !profile.gender) && (
                                <button
                                    className="profile-about-add-btn"
                                    onClick={() => setIsEditModalOpen(true)}
                                >
                                    Chỉnh sửa chi tiết
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="profile-main">
                    {/* Posts placeholder */}
                    <div className="card card-elevation-1">
                        <div className="card-header">
                            <div className="card-header-content">
                                <h3 className="card-title">Bài viết</h3>
                            </div>
                        </div>
                        <div className="card-content">
                            <p style={{ color: "#6b7280", textAlign: "center" }}>
                                Chưa có bài viết nào
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                profile={profile}
                onProfileUpdated={(updatedProfile) => {
                    setProfile(updatedProfile);
                    if (refreshUser) {
                        refreshUser();
                    }
                }}
            />
        </div>
    );
};

export default ProfilePage;
