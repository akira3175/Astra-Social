import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Avatar } from "../../../components/ui";
import { useCurrentUser } from "../../../context/currentUserContext";
import {
    updatePost,
    deletePost,
    toggleLike,
    getComments,
    createComment,
    toggleCommentLike,
    sharePost,
} from "../../../services/postService";
import type { Comment } from "../../../services/postService";
import type { Post } from "../../../types/post";
import PostMenu from "./PostMenu";
import "./PostDetailModal.css";

interface PostDetailModalProps {
    open: boolean;
    onClose: () => void;
    post: Post | null;
    onPostUpdated?: () => void;
    onPostDeleted?: () => void;
    onCommentAdded?: (postId: number) => void;
    focusComment?: boolean;
    startEditing?: boolean;
    startDeleting?: boolean;
}

const formatRelativeTime = (dateString: string): string => {
    // Giữ nguyên chuỗi, browser tự parse UTC và convert sang local timezone
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const diffInSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diffInSeconds < 0) return "Vừa xong";
    if (diffInSeconds < 60) return "Vừa xong";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    if (diffInSeconds < 86400 * 7) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
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
    onCommentAdded,
    focusComment = false,
    startEditing = false,
    startDeleting = false,
}) => {
    const { currentUser } = useCurrentUser() ?? {};

    // Edit state
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Lightbox
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    // Like state (optimistic) — FIX: bỏ state `liked` thừa, chỉ dùng likeState
    const [likeState, setLikeState] = useState({ liked: false, count: 0 });

    // Comments state
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [commentInput, setCommentInput] = useState("");
    const [submittingComment, setSubmittingComment] = useState(false);
    const [commentPage, setCommentPage] = useState(1);
    const [commentHasMore, setCommentHasMore] = useState(false);

    // Local comment count để tăng ngay sau khi submit thành công
    const [localCommentCount, setLocalCommentCount] = useState(post?.comments_count ?? 0);

    const commentInputRef = useRef<HTMLInputElement>(null);

    const isOwner = currentUser?.id?.toString() === post?.user_id?.toString();
    const images = post?.attachments?.filter((a) => a.file_type === "IMAGE") ?? [];
    const hasImages = images.length > 0;

    // Sync cả likeState lẫn localCommentCount khi post prop thay đổi
    useEffect(() => {
        if (post) {
            setLikeState({
                liked: post.is_liked ?? false,
                count: post.likes_count ?? 0,
            });
            setLocalCommentCount(post.comments_count ?? 0);
        }
    }, [post]);

    // Fetch comments when modal opens
    const fetchComments = useCallback(
        async (page = 1, append = false) => {
            if (!post) return;
            setCommentsLoading(true);
            try {
                const res = await getComments(post.id, page, 10);
                setComments((prev) => (append ? [...prev, ...res.data] : res.data));
                setCommentHasMore(page < res.pagination.last_page);
                setCommentPage(page);
            } catch (e) {
                console.error(e);
            } finally {
                setCommentsLoading(false);
            }
        },
        [post]
    );

    useEffect(() => {
        if (open && post) {
            fetchComments(1);

            if (startEditing && isOwner) {
                setEditContent(post.content || "");
                setIsEditing(true);
            }
            if (startDeleting && isOwner) {
                setShowDeleteConfirm(true);
            }
            if (focusComment) {
                setTimeout(() => commentInputRef.current?.focus(), 100);
            }
        }
    }, [open, post, startEditing, startDeleting, focusComment, isOwner]);

    // Reset state when modal closes
    useEffect(() => {
        if (!open) {
            setComments([]);
            setCommentInput("");
            setCommentPage(1);
            setCommentHasMore(false);
        }
    }, [open]);

    useEffect(() => {
        if (open) document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
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

    // Like (post)
    const handleLike = async () => {
        if (!post) return;
        const prev = { ...likeState };
        // Optimistic update
        setLikeState({
            liked: !prev.liked,
            count: prev.liked ? prev.count - 1 : prev.count + 1,
        });
        try {
            await toggleLike(post.id);
        } catch {
            setLikeState(prev); // rollback
        }
    };

    // Share
    const handleShare = async () => {
        if (!post) return;
        try {
            await sharePost(post.id);
            onPostUpdated?.();
        } catch (e) {
            console.error(e);
        }
    };

    // Edit
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

    // Delete
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

    // Comment
    const handleSubmitComment = async () => {
        if (!post || !commentInput.trim()) return;
        setSubmittingComment(true);
        try {
            const res = await createComment(post.id, commentInput.trim());
            setComments((prev) => [res.data, ...prev]);
            // Tăng counter local ngay lập tức, không chờ reload
            setLocalCommentCount((c) => c + 1);
            // Báo lên PostList để sync count trên card
            onCommentAdded?.(post.id);
            setCommentInput("");
        } catch (e) {
            console.error(e);
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleCommentKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmitComment();
        }
    };

    if (!open || !post) return null;

    const modalContent = (
        <div
            className="pdm-overlay"
            onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
            <div className={`pdm-container ${hasImages ? "pdm-with-images" : ""}`}>
                {/* Left: Images */}
                {hasImages && (
                    <div className="pdm-images-section">
                        {/* Close button on left side for posts with images */}
                        <button className="pdm-close-btn pdm-close-left" onClick={handleClose} aria-label="Đóng">
                            ✕
                        </button>
                        <div className={`pdm-gallery pdm-gallery-${Math.min(images.length, 4)}`}>
                            {images.slice(0, 4).map((img, i) => (
                                <div key={img.id} className="pdm-gallery-item" onClick={() => setLightboxIndex(i)}>
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
                                onEdit={() => {
                                    setEditContent(post.content || "");
                                    setIsEditing(true);
                                    setError(null);
                                }}
                                onDelete={() => setShowDeleteConfirm(true)}
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
                                    <button
                                        className="pdm-btn pdm-btn-ghost"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setEditContent("");
                                            setError(null);
                                        }}
                                        disabled={isLoading}
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        className="pdm-btn pdm-btn-primary"
                                        onClick={handleSaveEdit}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Đang lưu..." : "Lưu"}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            post.content && <p className="pdm-text">{post.content}</p>
                        )}
                    </div>

                    {/* Dùng localCommentCount */}
                    <div className="pdm-stats">
                        <span>👍 {likeState.count}</span>
                        <span>💬 {localCommentCount}</span>
                    </div>

                    {/* Actions */}
                    <div className="pdm-actions">
                        <button
                            className={`pdm-action-btn ${likeState.liked ? "pdm-action-btn--liked" : ""}`}
                            onClick={handleLike}
                        >
                            👍 {likeState.liked ? "Đã thích" : "Thích"}
                        </button>
                        <button
                            className="pdm-action-btn"
                            onClick={() => commentInputRef.current?.focus()}
                        >
                            💬 Bình luận
                        </button>
                        <button className="pdm-action-btn" onClick={handleShare}>
                            ↗️ Chia sẻ
                        </button>
                    </div>

                    {/* Error */}
                    {error && <div className="pdm-error">{error}</div>}

                    {/* Delete Confirm */}
                    {showDeleteConfirm && (
                        <div className="pdm-delete-confirm">
                            <p>Bạn có chắc chắn muốn xóa bài viết này?</p>
                            <div className="pdm-delete-actions">
                                <button
                                    className="pdm-btn pdm-btn-ghost"
                                    onClick={() => setShowDeleteConfirm(false)}
                                    disabled={isLoading}
                                >
                                    Hủy
                                </button>
                                <button
                                    className="pdm-btn pdm-btn-danger"
                                    onClick={handleConfirmDelete}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Đang xóa..." : "Xóa"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Comments Section */}
                    <div className="pdm-comments-section">
                        {/* Comment Input */}
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
                                value={commentInput}
                                onChange={(e) => setCommentInput(e.target.value)}
                                onKeyDown={handleCommentKeyDown}
                                disabled={submittingComment}
                            />
                            <button
                                className="pdm-comment-send"
                                onClick={handleSubmitComment}
                                disabled={submittingComment || !commentInput.trim()}
                                aria-label="Gửi"
                            >
                                {submittingComment ? "..." : "➤"}
                            </button>
                        </div>

                        {/* Comment List */}
                        <div className="pdm-comments-list">
                            {commentsLoading && comments.length === 0 ? (
                                <div className="pdm-comments-loading">Đang tải bình luận...</div>
                            ) : comments.length === 0 ? (
                                <div className="pdm-comments-empty">Chưa có bình luận nào.</div>
                            ) : (
                                <>
                                    {comments.map((comment) => (
                                        <CommentItem
                                            key={comment.id}
                                            comment={comment}
                                            postId={post.id}
                                            postAuthorId={post.user_id}
                                        />
                                    ))}
                                    {commentHasMore && (
                                        <button
                                            className="pdm-load-more"
                                            onClick={() => fetchComments(commentPage + 1, true)}
                                            disabled={commentsLoading}
                                        >
                                            {commentsLoading ? "Đang tải..." : "Xem thêm bình luận"}
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            {lightboxIndex !== null && images[lightboxIndex] && (
                <div className="pdm-lightbox" onClick={() => setLightboxIndex(null)}>
                    <button className="pdm-lightbox-close" onClick={() => setLightboxIndex(null)}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M18 6L6 18M6 6L18 18"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>

                    {images.length > 1 && (
                        <>
                            <button
                                className="pdm-lightbox-nav pdm-lightbox-prev"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
                                }}
                            >
                                ‹
                            </button>
                            <button
                                className="pdm-lightbox-nav pdm-lightbox-next"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setLightboxIndex((lightboxIndex + 1) % images.length);
                                }}
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

// Comment Item

interface CommentItemProps {
    comment: Comment;
    postId: number;
    postAuthorId?: number;
    onReplySubmitted?: (parentId: number, newReply: Comment) => void;
    depth?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({
    comment,
    postId,
    postAuthorId,
    onReplySubmitted,
    depth = 0,
}) => {
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [localReplies, setLocalReplies] = useState<Comment[]>(comment.replies ?? []);
    const replyRef = useRef<HTMLInputElement>(null);

    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(comment.likes_count ?? 0);

    const displayName =
        comment.user.profile?.first_name || comment.user.profile?.last_name
            ? `${comment.user.profile.first_name || ""} ${comment.user.profile.last_name || ""}`.trim()
            : comment.user.username;

    const isAuthor = postAuthorId !== undefined && comment.user_id === postAuthorId;

    const handleLike = async () => {
        const prevLiked = liked;
        const prevCount = likeCount;
        setLiked(!prevLiked);
        setLikeCount(prevLiked ? prevCount - 1 : prevCount + 1);
        try {
            await toggleCommentLike(comment.id);
        } catch (e) {
            setLiked(prevLiked);
            setLikeCount(prevCount);
            console.error(e);
        }
    };

    const handleReplyToggle = () => {
        setShowReplyInput((v) => !v);
        setTimeout(() => replyRef.current?.focus(), 50);
    };

    const handleSubmitReply = async () => {
        if (!replyContent.trim()) return;
        setSubmitting(true);
        try {
            const res = await createComment(postId, replyContent.trim(), comment.id);
            setLocalReplies((prev) => [...prev, res.data]);
            onReplySubmitted?.(comment.id, res.data);
            setReplyContent("");
            setShowReplyInput(false);
        } catch (e) {
            console.error(e);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={`pdm-comment-item ${depth > 0 ? "pdm-comment-item--reply" : ""}`}>
            <Avatar
                src={comment.user.profile?.avatar_url || undefined}
                alt={comment.user.username}
                width={depth > 0 ? 28 : 32}
                height={depth > 0 ? 28 : 32}
            >
                {displayName[0]?.toUpperCase() || "U"}
            </Avatar>

            <div className="pdm-comment-body">
                {/* Header: tên + badge tác giả + thời gian */}
                <div className="pdm-comment-header">
                    <span className="pdm-comment-author">{displayName}</span>
                    {isAuthor && (
                        <span className="pdm-comment-author-badge">Tác giả</span>
                    )}
                    <span className="pdm-comment-time">
                        {formatRelativeTime(comment.created_at)}
                    </span>
                </div>

                {/* Nội dung comment */}
                <p className="pdm-comment-text">{comment.content}</p>

                {/* Actions: like + trả lời */}
                <div className="pdm-comment-actions">
                    <button
                        className={`pdm-comment-action ${liked ? "pdm-comment-action--liked" : ""}`}
                        onClick={handleLike}
                    >
                        {liked ? "👍" : "👍"} {likeCount > 0 && <span>{likeCount}</span>} Thích
                    </button>
                    {depth === 0 && (
                        <button className="pdm-comment-action" onClick={handleReplyToggle}>
                            Trả lời
                        </button>
                    )}
                </div>

                {/* Reply input */}
                {showReplyInput && (
                    <div className="pdm-reply-input">
                        <input
                            ref={replyRef}
                            type="text"
                            placeholder={`Trả lời ${displayName}...`}
                            className="pdm-comment-field"
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmitReply();
                                }
                                if (e.key === "Escape") setShowReplyInput(false);
                            }}
                            disabled={submitting}
                        />
                        <button
                            className="pdm-comment-send"
                            onClick={handleSubmitReply}
                            disabled={submitting || !replyContent.trim()}
                        >
                            {submitting ? "..." : "➤"}
                        </button>
                    </div>
                )}

                {/* Replies */}
                {localReplies.length > 0 && (
                    <div className="pdm-replies">
                        {localReplies.map((reply) => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                postId={postId}
                                postAuthorId={postAuthorId}
                                depth={depth + 1}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostDetailModal;
