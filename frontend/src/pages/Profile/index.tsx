import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProfileById, uploadAvatar, uploadCover } from "../../services/profileService";
import { useCurrentUser } from "../../context/currentUserContext";
import type { User } from "../../types/user";
import "./ProfilePage.css";
import "../../components/ui/Button/Button.css";
import "../../components/ui/Card/Card.css";

// Camera Icon SVG
const CameraIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 15.2c1.8 0 3.2-1.4 3.2-3.2S13.8 8.8 12 8.8 8.8 10.2 8.8 12s1.4 3.2 3.2 3.2zm9-9.6h-2.4l-1.6-2.4H7l-1.6 2.4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2v-12c0-1.1-.9-2-2-2zM12 17c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z" />
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

    const avatarInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

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

    // Handle cover upload
    const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const updatedProfile = await uploadCover(file, 50); // Default position 50%
            setProfile(updatedProfile);
            if (refreshUser) {
                refreshUser();
            }
            setNotification({ type: "success", message: "Đã cập nhật ảnh bìa" });
        } catch (err) {
            console.error("Failed to upload cover:", err);
            setNotification({ type: "error", message: "Không thể cập nhật ảnh bìa" });
        } finally {
            setIsUploading(false);
            // Reset input
            if (coverInputRef.current) {
                coverInputRef.current.value = "";
            }
        }
    };

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
                <div className="profile-cover">
                    {profile.background && (
                        <img
                            src={profile.background}
                            alt="Cover"
                            className="profile-cover-img"
                            style={{
                                objectPosition: `center ${profile.backgroundPosition ?? 50}%`
                            }}
                        />
                    )}
                    {isOwnProfile && (
                        <button
                            className="profile-cover-edit-btn"
                            onClick={() => coverInputRef.current?.click()}
                            disabled={isUploading}
                        >
                            <CameraIcon />
                        </button>
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
                    <div className="card card-elevation-1">
                        <div className="card-header">
                            <div className="card-header-content">
                                <h3 className="card-title">Giới thiệu</h3>
                            </div>
                        </div>
                        <div className="card-content">
                            {profile.bio ? (
                                <p>{profile.bio}</p>
                            ) : (
                                <p style={{ color: "#6b7280" }}>Chưa có thông tin giới thiệu</p>
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
        </div>
    );
};

export default ProfilePage;
