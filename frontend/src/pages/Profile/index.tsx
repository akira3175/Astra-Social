import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProfileById, uploadAvatar, uploadCover, updateCoverPosition } from "../../services/profileService";
import { getPostsByUserId } from "../../services/postService";
import { useCurrentUser } from "../../context/currentUserContext";
import {
    getFriendshipStatus,
    sendFriendRequest,
    cancelFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    unfriend,
    blockUser,
    unblockUser,
} from "../../services/friendshipService";
import type { FriendshipRelationStatus } from "../../types/friendship";
import type { User } from "../../types/user";
import type { Post } from "../../types/post";
import EditProfileModal from "./components/EditProfileModal";
import PostList from "../Home/components/PostList";
import CreatePost from "../Home/components/CreatePost";
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
    const [isBlocked, setIsBlocked] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

    // Posts state
    const [posts, setPosts] = useState<Post[]>([]);
    const [isPostsLoading, setIsPostsLoading] = useState(true);
    const [isLoadingMorePosts, setIsLoadingMorePosts] = useState(false);
    const [hasMorePosts, setHasMorePosts] = useState(true);
    const postsPageRef = useRef(1);

    const POSTS_PER_PAGE = 10;

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

    // ── Friendship state ───────────────────────────────────────
    const [friendStatus, setFriendStatus] = useState<FriendshipRelationStatus | null>(null);
    const [activeMenu, setActiveMenu] = useState<'friends' | 'more' | null>(null);
    const [friendActionLoading, setFriendActionLoading] = useState(false);
    const moreMenuRef = useRef<HTMLDivElement>(null);
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
                setIsBlocked(false);
                const data = await getProfileById(userId);
                setProfile(data);
                setTempPosition(data.backgroundPosition ?? 50);
            } catch (err: any) {
                console.error("Failed to load profile:", err);
                if (err?.reason === 'blocked' || err?.status === 403) {
                    setIsBlocked(true);
                } else {
                    setError("Profile not found");
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadProfile();
    }, [userId]);

    // Fetch friendship status when viewing someone else's profile
    useEffect(() => {
        if (!userId || !currentUser) return;
        if (String(currentUser.id) === String(userId)) return;

        getFriendshipStatus(Number(userId))
            .then(setFriendStatus)
            .catch(() => setFriendStatus('none'));
    }, [userId, currentUser]);

    // Close more-menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
                setActiveMenu(null);
            }
        };
        if (activeMenu) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeMenu]);

    // ── Friendship action handlers ─────────────────────────────
    const handleFriendAction = useCallback(async (
        action: () => Promise<unknown>,
        nextStatus: FriendshipRelationStatus,
        successMsg: string,
    ) => {
        if (friendActionLoading) return;
        setFriendActionLoading(true);
        try {
            await action();
            setFriendStatus(nextStatus);
            setNotification({ type: 'success', message: successMsg });
        } catch {
            setNotification({ type: 'error', message: 'Có lỗi xảy ra, vui lòng thử lại.' });
        } finally {
            setFriendActionLoading(false);
        }
    }, [friendActionLoading]);

    const handleAddFriend = () =>
        handleFriendAction(() => sendFriendRequest(Number(userId)), 'pending_sent', 'Đã gửi lời mời kết bạn.');

    const handleCancelRequest = () =>
        handleFriendAction(() => cancelFriendRequest(Number(userId)), 'none', 'Đã hủy lời mời kết bạn.');

    const handleAccept = () =>
        handleFriendAction(() => acceptFriendRequest(Number(userId)), 'friends', 'Đã chấp nhận lời mời kết bạn!');

    const handleDecline = () =>
        handleFriendAction(() => declineFriendRequest(Number(userId)), 'none', 'Đã từ chối lời mời kết bạn.');

    const handleUnfriend = () => {
        setActiveMenu(null);
        handleFriendAction(() => unfriend(Number(userId)), 'none', 'Đã hủy kết bạn.');
    };

    const handleBlock = () => {
        setActiveMenu(null);
        handleFriendAction(() => blockUser(Number(userId)), 'blocked_by_me', 'Đã chặn người dùng.');
    };

    const handleUnblock = () => {
        setActiveMenu(null);
        handleFriendAction(() => unblockUser(Number(userId)), 'none', 'Đã bỏ chặn người dùng.');
    };

    const handleMessage = () => {
        navigate(`/messages?userId=${userId}`);
    };

    // Fetch posts for this user (page 1 / reset)
    const fetchUserPosts = useCallback(async () => {
        if (!userId) return;
        try {
            setIsPostsLoading(true);
            const response = await getPostsByUserId(userId, 1, POSTS_PER_PAGE);
            if (response.success) {
                setPosts(response.data);
                setHasMorePosts(
                    response.pagination
                        ? response.pagination.current_page < response.pagination.last_page
                        : response.data.length >= POSTS_PER_PAGE
                );
                postsPageRef.current = 1;
            }
        } catch (err) {
            console.error("Failed to load user posts:", err);
        } finally {
            setIsPostsLoading(false);
        }
    }, [userId]);

    // Load more posts (next page)
    const handleLoadMorePosts = useCallback(async () => {
        if (!userId || isLoadingMorePosts || !hasMorePosts) return;
        try {
            setIsLoadingMorePosts(true);
            const nextPage = postsPageRef.current + 1;
            const response = await getPostsByUserId(userId, nextPage, POSTS_PER_PAGE);
            if (response.success) {
                setPosts(prev => [...prev, ...response.data]);
                setHasMorePosts(
                    response.pagination
                        ? response.pagination.current_page < response.pagination.last_page
                        : response.data.length >= POSTS_PER_PAGE
                );
                postsPageRef.current = nextPage;
            }
        } catch (err) {
            console.error("Failed to load more posts:", err);
        } finally {
            setIsLoadingMorePosts(false);
        }
    }, [userId, isLoadingMorePosts, hasMorePosts]);

    useEffect(() => {
        fetchUserPosts();
    }, [fetchUserPosts]);

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

    // Blocked state
    if (isBlocked) {
        return (
            <div className="profile-page">
                <div className="profile-error">
                    <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚫</p>
                    <p className="profile-error-text">Bạn không thể xem hồ sơ này.</p>
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

                    {/* ── Friend Action Buttons (only on other profiles) ── */}
                    {!isOwnProfile && friendStatus && friendStatus !== 'self' && (
                        <div className="profile-friend-actions" ref={moreMenuRef}>
                            {/* none → Add Friend */}
                            {friendStatus === 'none' && (
                                <button
                                    className="profile-friend-btn profile-friend-btn--add"
                                    onClick={handleAddFriend}
                                    disabled={friendActionLoading}
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                        <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                    </svg>
                                    Thêm bạn bè
                                </button>
                            )}

                            {/* pending_sent → Waiting + Cancel */}
                            {friendStatus === 'pending_sent' && (
                                <>
                                    <button
                                        className="profile-friend-btn profile-friend-btn--pending"
                                        disabled
                                    >
                                        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                                        </svg>
                                        Đang chờ phản hồi
                                    </button>
                                    <button
                                        className="profile-friend-btn profile-friend-btn--cancel"
                                        onClick={handleCancelRequest}
                                        disabled={friendActionLoading}
                                    >
                                        Hủy yêu cầu
                                    </button>
                                </>
                            )}

                            {/* pending_received → Accept + Decline */}
                            {friendStatus === 'pending_received' && (
                                <>
                                    <button
                                        className="profile-friend-btn profile-friend-btn--accept"
                                        onClick={handleAccept}
                                        disabled={friendActionLoading}
                                    >
                                        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                        </svg>
                                        Đồng ý
                                    </button>
                                    <button
                                        className="profile-friend-btn profile-friend-btn--decline"
                                        onClick={handleDecline}
                                        disabled={friendActionLoading}
                                    >
                                        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                                        </svg>
                                        Từ chối
                                    </button>
                                </>
                            )}

                            {/* friends → Friends dropdown + Message */}
                            {friendStatus === 'friends' && (
                                <>
                                    <div className="profile-friend-dropdown">
                                        <button
                                            className="profile-friend-btn profile-friend-btn--friends"
                                            onClick={() => setActiveMenu(prev => prev === 'friends' ? null : 'friends')}
                                            disabled={friendActionLoading}
                                        >
                                            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                            </svg>
                                            Bạn bè
                                            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" style={{marginLeft: 4}}>
                                                <path d="M7 10l5 5 5-5z"/>
                                            </svg>
                                        </button>
                                        {activeMenu === 'friends' && (
                                            <div className="profile-more-menu">
                                                <button className="profile-more-menu-item profile-more-menu-item--danger" onClick={handleUnfriend}>
                                                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                                                        <path d="M14 8c0-2.21-1.79-4-4-4S6 5.79 6 8s1.79 4 4 4 4-1.79 4-4zm3 2v2h6v-2h-6zm-3 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                                    </svg>
                                                    Hủy kết bạn
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        className="profile-friend-btn profile-friend-btn--message"
                                        onClick={handleMessage}
                                    >
                                        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                                        </svg>
                                        Nhắn tin
                                    </button>
                                </>
                            )}

                            {/* blocked_by_me → Unblock */}
                            {friendStatus === 'blocked_by_me' && (
                                <button
                                    className="profile-friend-btn profile-friend-btn--blocked"
                                    onClick={handleUnblock}
                                    disabled={friendActionLoading}
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z"/>
                                    </svg>
                                    Đã chặn · Bỏ chặn?
                                </button>
                            )}

                            {/* Three-dot more menu (block option) – shown when not already blocked */}
                            {friendStatus !== 'blocked_by_me' && friendStatus !== 'blocked_by_them' && (
                                <div className="profile-friend-dropdown">
                                    <button
                                        className="profile-more-btn"
                                        onClick={() => setActiveMenu(prev => prev === 'more' ? null : 'more')}
                                        title="Tùy chọn khác"
                                    >
                                        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                                        </svg>
                                    </button>
                                    {activeMenu === 'more' && (
                                        <div className="profile-more-menu profile-more-menu--right">
                                            <button className="profile-more-menu-item profile-more-menu-item--danger" onClick={handleBlock}>
                                                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                                                    <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                                                </svg>
                                                Chặn người dùng
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
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
                    {isOwnProfile && (
                        <CreatePost onPostCreated={fetchUserPosts} />
                    )}
                    <PostList
                        posts={posts}
                        isLoading={isPostsLoading}
                        onPostUpdated={fetchUserPosts}
                        onPostDeleted={fetchUserPosts}
                        onLoadMore={handleLoadMorePosts}
                        hasMore={hasMorePosts}
                        isLoadingMore={isLoadingMorePosts}
                    />
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
