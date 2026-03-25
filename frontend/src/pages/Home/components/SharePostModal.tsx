import React, { useState, useRef, useEffect } from "react";
import { Modal, Avatar, SendIcon } from "../../../components/ui";
import { useCurrentUser } from "../../../context/currentUserContext";
import { sharePost } from "../../../services/postService";
import type { Post } from "../../../types/post";
import "./SharePostModal.css";

interface SharePostModalProps {
    open: boolean;
    onClose: () => void;
    post: Post | null;
    onPostShared?: () => void;
}

const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString.replace(/Z$/i, ""));
    if (isNaN(date.getTime())) return dateString;
    const diffInSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return "Vừa xong";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    if (diffInSeconds < 86400 * 7) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
    return date.toLocaleDateString("vi-VN");
};

const getAuthorName = (user: Post["user"]): string => {
    if (user.profile?.first_name || user.profile?.last_name) {
        return `${user.profile.last_name || ""} ${user.profile.first_name || ""}`.trim();
    }
    return user.username;
};

const SharePostModal: React.FC<SharePostModalProps> = ({
    open,
    onClose,
    post,
    onPostShared,
}) => {
    const { currentUser } = useCurrentUser() ?? {};
    const [caption, setCaption] = useState("");
    const [privacy, setPrivacy] = useState<"PUBLIC" | "FRIENDS" | "ONLY_ME">("PUBLIC");
    const [showPrivacyDropdown, setShowPrivacyDropdown] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const privacyRef = useRef<HTMLDivElement>(null);

    // The original post to share (follow chain to root)
    const originalPost = post?.parent ?? post;

    useEffect(() => {
        if (!open) {
            setCaption("");
            setError(null);
            setPrivacy("PUBLIC");
        }
    }, [open]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (privacyRef.current && !privacyRef.current.contains(e.target as Node)) {
                setShowPrivacyDropdown(false);
            }
        };
        if (showPrivacyDropdown) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showPrivacyDropdown]);

    const handleShare = async () => {
        if (!post) return;
        setIsSubmitting(true);
        setError(null);
        try {
            await sharePost(post.id, caption.trim() || undefined);
            setCaption("");
            onClose();
            onPostShared?.();
        } catch (err: any) {
            setError(err?.response?.data?.message || "Không thể chia sẻ bài viết.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!open || !post || !originalPost) return null;

    const firstImage = originalPost.attachments?.find((a) => a.file_type === "IMAGE");

    return (
        <Modal open={open} onClose={onClose} title="Chia sẻ bài viết" maxWidth="sm" fullWidth>
            <div className="spm-content">
                {/* Header: current user + privacy */}
                <div className="spm-header">
                    <Avatar
                        src={currentUser?.avatar}
                        alt={currentUser?.username || ""}
                        width={44}
                        height={44}
                        className="spm-avatar"
                    >
                        {!currentUser?.avatar && (currentUser?.firstName?.[0] || currentUser?.username?.[0] || "U")}
                    </Avatar>
                    <div className="spm-user-info">
                        <span className="spm-username">
                            {currentUser?.firstName || currentUser?.lastName
                                ? `${currentUser?.lastName || ""} ${currentUser?.firstName || ""}`.trim()
                                : currentUser?.username}
                        </span>
                        {/* Privacy selector */}
                        <div className="spm-privacy-container" ref={privacyRef}>
                            <button
                                className="spm-privacy-btn"
                                onClick={() => setShowPrivacyDropdown(!showPrivacyDropdown)}
                                type="button"
                            >
                                {privacy === "PUBLIC" ? "🌎 Công khai" : privacy === "FRIENDS" ? "👥 Bạn bè" : "🔒 Chỉ mình tôi"}
                                <span className="spm-privacy-caret">▼</span>
                            </button>
                            {showPrivacyDropdown && (
                                <div className="spm-privacy-menu">
                                    {[
                                        { key: "PUBLIC" as const, icon: "🌎", label: "Công khai", desc: "Mọi người đều thấy" },
                                        { key: "FRIENDS" as const, icon: "👥", label: "Bạn bè", desc: "Chỉ bạn bè mới thấy" },
                                        { key: "ONLY_ME" as const, icon: "🔒", label: "Chỉ mình tôi", desc: "Chỉ bạn mới thấy" },
                                    ].map((opt) => (
                                        <div
                                            key={opt.key}
                                            className={`spm-privacy-item ${privacy === opt.key ? "active" : ""}`}
                                            onClick={() => { setPrivacy(opt.key); setShowPrivacyDropdown(false); }}
                                        >
                                            <span className="icon">{opt.icon}</span>
                                            <div className="text">
                                                <strong>{opt.label}</strong>
                                                <span>{opt.desc}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Caption textarea */}
                <textarea
                    className="spm-textarea"
                    placeholder="Viết gì đó về bài viết này..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    rows={3}
                    disabled={isSubmitting}
                    autoFocus
                />

                {/* Embedded original post preview */}
                <div className="spm-original-preview">
                    {/* Original author */}
                    <div className="spm-original-author">
                        <Avatar
                            src={originalPost.user.profile?.avatar_url || undefined}
                            alt={originalPost.user.username}
                            width={32}
                            height={32}
                        >
                            {getAuthorName(originalPost.user)[0]?.toUpperCase() || "U"}
                        </Avatar>
                        <div className="spm-original-meta">
                            <span className="spm-original-name">{getAuthorName(originalPost.user)}</span>
                            <span className="spm-original-time">{formatRelativeTime(originalPost.created_at)}</span>
                        </div>
                    </div>

                    {/* Original content */}
                    {originalPost.content && (
                        <p className="spm-original-content">{originalPost.content}</p>
                    )}

                    {/* First image thumbnail */}
                    {firstImage && (
                        <div className="spm-original-image">
                            <img src={firstImage.url} alt="Ảnh bài viết gốc" />
                        </div>
                    )}

                    {/* No content placeholder */}
                    {!originalPost.content && !firstImage && (
                        <p className="spm-original-empty">Bài viết không có nội dung</p>
                    )}
                </div>

                {/* Error */}
                {error && <div className="spm-error">{error}</div>}

                {/* Divider */}
                <div className="spm-divider" />

                {/* Actions */}
                <div className="spm-actions">
                    <button
                        className="spm-btn-ghost"
                        onClick={onClose}
                        disabled={isSubmitting}
                        type="button"
                    >
                        Hủy
                    </button>
                    <button
                        className="spm-btn-primary"
                        onClick={handleShare}
                        disabled={isSubmitting}
                        type="button"
                    >
                        <SendIcon size={16} />
                        {isSubmitting ? "Đang đăng..." : "Đăng"}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default SharePostModal;
