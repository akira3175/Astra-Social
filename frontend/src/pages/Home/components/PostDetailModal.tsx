import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Avatar } from "../../../components/ui";
import { useCurrentUser } from "../../../context/currentUserContext";
import { updatePost, deletePost } from "../../../services/postService";
import type { Post } from "../../../types/post";
import PostMenu from "./PostMenu";
import "./PostDetailModal.css";

interface PostDetailModalProps {
    open: boolean;
    onClose: () => void;
    post: Post | null;
    onPostUpdated?: () => void;
    onPostDeleted?: () => void;
    focusComment?: boolean;
    startEditing?: boolean;
    startDeleting?: boolean;
}

const formatRelativeTime = (dateString: string): string => {
    // Server returns local time with "Z" suffix (incorrectly marked as UTC)
    const localDateString = dateString.replace(/Z$/i, '');
    const date = new Date(localDateString);

    if (isNaN(date.getTime())) return dateString;

    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);

    if (diffInSeconds < 0) return "Vừa xong";
    if (diffInSeconds < 60) return "Vừa xong";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ`;
    return date.toLocaleDateString("vi-VN");
};

const getDisplayName = (user: Post["user"]): string => {
    if (user.profile?.first_name || user.profile?.last_name) {
        return `${user.profile.first_name || ""} ${user.profile.last_name || ""}`.trim();
    }
    return user.username;
};

const PostDetailModal: React.FC<PostDetailModalProps> = ({
    open,
    onClose,
    post,
    onPostUpdated,
    onPostDeleted,
    focusComment = false,
    startEditing = false,
    startDeleting = false,
}) => {
    const { currentUser } = useCurrentUser() ?? {};
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const commentInputRef = useRef<HTMLInputElement>(null);

    const isOwner = currentUser?.id?.toString() === post?.user_id?.toString();
    const hasImages = post?.attachments?.some(a => a.file_type === "IMAGE") ?? false;
    const images = post?.attachments?.filter(a => a.file_type === "IMAGE") ?? [];

    // Handle initial states from props
    useEffect(() => {
        if (open && post) {
            if (startEditing && isOwner) {
                setEditContent(post.content || "");
                setIsEditing(true);
            }
            if (startDeleting && isOwner) {
                setShowDeleteConfirm(true);
            }
            if (focusComment) {
                setTimeout(() => {
                    commentInputRef.current?.focus();
                }, 100);
            }
        }
    }, [open, post, startEditing, startDeleting, focusComment, isOwner]);

    useEffect(() => {
        if (open) document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                if (lightboxIndex !== null) setLightboxIndex(null);
                else onClose();
            }
        };
        if (open) document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [open, onClose, lightboxIndex]);

    const handleClose = () => {
        setIsEditing(false);
        setEditContent("");
        setError(null);
        setShowDeleteConfirm(false);
        setLightboxIndex(null);
        onClose();
    };

    const handleEditClick = () => {
        if (post) {
            setEditContent(post.content || "");
            setIsEditing(true);
            setError(null);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditContent("");
        setError(null);
    };

    const handleSaveEdit = async () => {
        if (!post) return;
        setIsLoading(true);
        setError(null);
        try {
            await updatePost(post.id, { content: editContent.trim() || undefined });
            setIsEditing(false);
            onPostUpdated?.();
        } catch (err: any) {
            setError(err?.response?.data?.message || "Không thể cập nhật bài viết.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (!post) return;
        setIsLoading(true);
        setError(null);
        try {
            await deletePost(post.id);
            handleClose();
            onPostDeleted?.();
        } catch (err: any) {
            setError(err?.response?.data?.message || "Không thể xóa bài viết.");
            setShowDeleteConfirm(false);
        } finally {
            setIsLoading(false);
        }
    };

    if (!open || !post) return null;

    const modalContent = (
        <div className="pdm-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
            <div className={`pdm-container ${hasImages ? "pdm-with-images" : ""}`}>
                {/* Left: Images Gallery */}
                {hasImages && (
                    <div className="pdm-images-section">
                        {/* Close button on left side for posts with images */}
                        <button className="pdm-close-btn pdm-close-left" onClick={handleClose} aria-label="Đóng">
                            ✕
                        </button>

                        <div className={`pdm-gallery pdm-gallery-${Math.min(images.length, 4)}`}>
                            {images.slice(0, 4).map((img, i) => (
                                <div
                                    key={img.id}
                                    className="pdm-gallery-item"
                                    onClick={() => setLightboxIndex(i)}
                                >
                                    <img src={img.url} alt={`Ảnh ${i + 1}`} />
                                    {i === 3 && images.length > 4 && (
                                        <div className="pdm-more-overlay">+{images.length - 4}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Right: Content Panel */}
                <div className="pdm-content-panel">
                    {/* Close button on right for posts without images */}
                    {!hasImages && (
                        <button className="pdm-close-btn pdm-close-right" onClick={handleClose} aria-label="Đóng">
                            ✕
                        </button>
                    )}

                    {/* Header */}
                    <div className="pdm-header">
                        <Avatar
                            src={post.user.profile?.avatar_url || undefined}
                            alt={post.user.username}
                            width={40}
                            height={40}
                        >
                            {getDisplayName(post.user)[0]?.toUpperCase() || "U"}
                        </Avatar>
                        <div className="pdm-user-info">
                            <span className="pdm-username">{getDisplayName(post.user)}</span>
                            <span className="pdm-time">{formatRelativeTime(post.created_at)}</span>
                        </div>

                        {/* Post Menu - now uses shared component */}
                        {!isEditing && !showDeleteConfirm && (
                            <PostMenu
                                isOwner={isOwner}
                                onEdit={handleEditClick}
                                onDelete={handleDeleteClick}
                            />
                        )}
                    </div>

                    {/* Body */}
                    <div className="pdm-body">
                        {isEditing ? (
                            <div className="pdm-edit-form">
                                <textarea
                                    className="pdm-edit-textarea"
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    rows={4}
                                    placeholder="Nội dung bài viết..."
                                    autoFocus
                                />
                                <div className="pdm-edit-actions">
                                    <button className="pdm-btn pdm-btn-ghost" onClick={handleCancelEdit} disabled={isLoading}>
                                        Hủy
                                    </button>
                                    <button className="pdm-btn pdm-btn-primary" onClick={handleSaveEdit} disabled={isLoading}>
                                        {isLoading ? "Đang lưu..." : "Lưu"}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            post.content && <p className="pdm-text">{post.content}</p>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="pdm-stats">
                        <span>👍 {post.likes_count}</span>
                        <span>💬 {post.comments_count}</span>
                    </div>

                    {/* Actions */}
                    <div className="pdm-actions">
                        <button className="pdm-action-btn">👍 Thích</button>
                        <button className="pdm-action-btn" onClick={() => commentInputRef.current?.focus()}>
                            💬 Bình luận
                        </button>
                        <button className="pdm-action-btn">↗️ Chia sẻ</button>
                    </div>

                    {/* Error */}
                    {error && <div className="pdm-error">{error}</div>}

                    {/* Delete Confirm */}
                    {showDeleteConfirm && (
                        <div className="pdm-delete-confirm">
                            <p>Bạn có chắc chắn muốn xóa bài viết này?</p>
                            <div className="pdm-delete-actions">
                                <button className="pdm-btn pdm-btn-ghost" onClick={() => setShowDeleteConfirm(false)} disabled={isLoading}>
                                    Hủy
                                </button>
                                <button className="pdm-btn pdm-btn-danger" onClick={handleConfirmDelete} disabled={isLoading}>
                                    {isLoading ? "Đang xóa..." : "Xóa"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Comments */}
                    <div className="pdm-comments-section">
                        <div className="pdm-comment-input">
                            <Avatar
                                src={currentUser?.avatar || undefined}
                                width={32}
                                height={32}
                            >
                                {currentUser?.firstName?.[0] || currentUser?.username?.[0] || "U"}
                            </Avatar>
                            <input
                                ref={commentInputRef}
                                type="text"
                                placeholder="Viết bình luận..."
                                className="pdm-comment-field"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox for full-size image */}
            {lightboxIndex !== null && images[lightboxIndex] && (
                <div className="pdm-lightbox" onClick={() => setLightboxIndex(null)}>
                    <button className="pdm-lightbox-close" onClick={() => setLightboxIndex(null)}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>

                    {images.length > 1 && (
                        <>
                            <button
                                className="pdm-lightbox-nav pdm-lightbox-prev"
                                onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + images.length) % images.length); }}
                            >
                                ‹
                            </button>
                            <button
                                className="pdm-lightbox-nav pdm-lightbox-next"
                                onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % images.length); }}
                            >
                                ›
                            </button>
                        </>
                    )}

                    <img
                        src={images[lightboxIndex].url}
                        alt="Full size"
                        className="pdm-lightbox-img"
                        onClick={(e) => e.stopPropagation()}
                    />

                    <div className="pdm-lightbox-counter">
                        {lightboxIndex + 1} / {images.length}
                    </div>
                </div>
            )}
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default PostDetailModal;
