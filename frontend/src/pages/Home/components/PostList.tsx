import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Avatar } from "../../../components/ui";
import { useCurrentUser } from "../../../context/currentUserContext";
import type { Post } from "../../../types/post";
import PostDetailModal from "./PostDetailModal";
import PostMenu from "./PostMenu";
import { toggleLike, sharePost } from "../../../services/postService";
import "./PostList.css";

interface PostListProps {
    posts: Post[];
    isLoading: boolean;
    onPostUpdated?: () => void;
    onPostDeleted?: () => void;
}

/**
 * Format relative time
 */
const formatRelativeTime = (dateString: string): string => {
    const localDateString = dateString.replace(/Z$/i, "");
    const date = new Date(localDateString);
    if (isNaN(date.getTime())) return dateString;
    const diffInSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diffInSeconds < 0) return "Vừa xong";
    if (diffInSeconds < 60) return "Vừa xong";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ`;
    return date.toLocaleDateString("vi-VN");
};

/**
 * Get display name from user object
 */
const getDisplayName = (user: Post["user"]): string => {
    if (user.profile?.first_name || user.profile?.last_name) {
        return `${user.profile.first_name || ""} ${user.profile.last_name || ""}`.trim();
    }
    return user.username;
};

/**
 * Media Grid Component
 */
const MediaGrid: React.FC<{ attachments: Post["attachments"] }> = ({ attachments }) => {
    const images = attachments.filter((a) => a.file_type === "IMAGE");
    if (images.length === 0) return null;

    const gridClass =
        images.length === 1 ? "post-media-grid single"
            : images.length === 2 ? "post-media-grid double"
                : images.length === 3 ? "post-media-grid triple"
                    : "post-media-grid quad";

    return (
        <div className={gridClass}>
            {images.slice(0, 4).map((img, index) => (
                <div key={img.id} className="post-media-item">
                    <img src={img.url} alt={`Media ${index + 1}`} />
                    {images.length > 4 && index === 3 && (
                        <div className="post-media-more">+{images.length - 4}</div>
                    )}
                </div>
            ))}
        </div>
    );
};

interface LikeState {
    liked: boolean;
    count: number;
}

const PostList: React.FC<PostListProps> = ({ posts, isLoading, onPostUpdated, onPostDeleted }) => {
    const { currentUser } = useCurrentUser() ?? {};
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [focusComment, setFocusComment] = useState(false);
    const [editingPostId, setEditingPostId] = useState<number | null>(null);
    const [deletingPostId, setDeletingPostId] = useState<number | null>(null);

    // Optimistic like state
    const [likeStates, setLikeStates] = useState<Record<number, LikeState>>({});

    // Local comment counts để sync sau khi comment trong modal
    const [commentCounts, setCommentCounts] = useState<Record<number, number>>({});

    // Chỉ khởi tạo state cho post chưa có, không ghi đè state hiện tại
    // — tránh mất optimistic state khi posts prop append thêm (load more / pagination)
    useEffect(() => {
        setLikeStates((prev) => {
            const next = { ...prev };
            posts.forEach((p) => {
                if (!(p.id in next)) {
                    next[p.id] = {
                        liked: p.is_liked ?? false,
                        count: p.likes_count ?? 0,
                    };
                }
            });
            return next;
        });

        // FIX 3: tương tự, chỉ khởi tạo commentCounts cho post chưa có
        setCommentCounts((prev) => {
            const next = { ...prev };
            posts.forEach((p) => {
                if (!(p.id in next)) {
                    next[p.id] = p.comments_count ?? 0;
                }
            });
            return next;
        });
    }, [posts]);

    const postIdFromUrl = searchParams.get("post");

    // Open modal when URL has post parameter
    useEffect(() => {
        if (postIdFromUrl && posts.length > 0) {
            const post = posts.find((p) => p.id.toString() === postIdFromUrl);
            if (post) setSelectedPost(post);
        }
    }, [postIdFromUrl, posts]);

    // Open modal normally and update URL
    const handlePostClick = (post: Post) => {
        setSelectedPost(post);
        setFocusComment(false);
        setSearchParams({ post: post.id.toString() });
    };

    // Open modal and focus on comment input
    const handleCommentClick = (post: Post, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedPost(post);
        setFocusComment(true);
        setSearchParams({ post: post.id.toString() });
    };

    // Close modal and remove URL param
    const handleCloseModal = () => {
        setSelectedPost(null);
        setFocusComment(false);
        setEditingPostId(null);
        setDeletingPostId(null);
        // Remove post param from URL
        searchParams.delete("post");
        setSearchParams(searchParams);
    };

    // Handle edit click from PostMenu - open modal in edit mode
    const handleEditClick = (post: Post) => {
        setSelectedPost(post);
        setEditingPostId(post.id);
        setSearchParams({ post: post.id.toString() });
    };

    // Handle delete click from PostMenu - open modal with delete confirm
    const handleDeleteClick = (post: Post) => {
        setSelectedPost(post);
        setDeletingPostId(post.id);
        setSearchParams({ post: post.id.toString() });
    };

    const handleLike = async (postId: number) => {
        const prev = likeStates[postId];
        if (!prev) return;

        const next: LikeState = {
            liked: !prev.liked,
            count: prev.liked ? prev.count - 1 : prev.count + 1,
        };
        setLikeStates((s) => ({ ...s, [postId]: next }));

        try {
            await toggleLike(postId);
        } catch (e) {
            setLikeStates((s) => ({ ...s, [postId]: prev }));
            console.error(e);
        }
    };

    const handleShare = async (postId: number) => {
        try {
            await sharePost(postId);
            onPostUpdated?.();
        } catch (e) {
            console.error(e);
        }
    };

    // Callback nhận từ modal khi comment được tạo thành công
    const handleCommentAdded = (postId: number) => {
        setCommentCounts((prev) => ({
            ...prev,
            [postId]: (prev[postId] ?? 0) + 1,
        }));
    };

    if (isLoading) {
        return (
            <div className="post-loading">
                <div className="loading-spinner" />
                <span>Đang tải bài viết...</span>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="post-empty">
                <div className="empty-icon">📝</div>
                <h3 className="empty-title">Chưa có bài viết nào</h3>
                <p className="empty-text">
                    Hãy tạo bài viết đầu tiên hoặc theo dõi bạn bè để xem tin tức mới nhất!
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="post-list">
                {posts.map((post) => {
                    const isOwner = currentUser?.id?.toString() === post.user_id?.toString();
                    const likeState = likeStates[post.id] ?? {
                        liked: post.is_liked ?? false,
                        count: post.likes_count ?? 0,
                    };
                    const commentsCount = commentCounts[post.id] ?? post.comments_count ?? 0;

                    return (
                        <article
                            key={post.id}
                            className="post-card"
                            onClick={() => handlePostClick(post)}
                            style={{ cursor: "pointer" }}
                        >
                            <div className="post-header">
                                <Avatar
                                    src={post.user.profile?.avatar_url || undefined}
                                    alt={post.user.username}
                                    width={44}
                                    height={44}
                                    className="post-avatar"
                                >
                                    {getDisplayName(post.user)[0]?.toUpperCase() || "U"}
                                </Avatar>
                                <div className="post-user-info">
                                    <span className="post-username">{getDisplayName(post.user)}</span>
                                    <span className="post-time">{formatRelativeTime(post.created_at)}</span>
                                </div>

                                {/* Reusable PostMenu component */}
                                <PostMenu
                                    isOwner={isOwner}
                                    onEdit={() => handleEditClick(post)}
                                    onDelete={() => handleDeleteClick(post)}
                                />
                            </div>

                            {post.content && (
                                <div className="post-content">
                                    <p className="post-text">{post.content}</p>
                                </div>
                            )}

                            {post.attachments && post.attachments.length > 0 && (
                                <MediaGrid attachments={post.attachments} />
                            )}

                            <div className="post-stats">
                                <span>{likeState.count} lượt thích</span>
                                <span>{commentsCount} bình luận</span>
                            </div>

                            <div className="post-actions" onClick={(e) => e.stopPropagation()}>
                                <button
                                    className={`post-action-btn ${likeState.liked ? "post-action-btn--liked" : ""}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleLike(post.id);
                                    }}
                                >
                                    <span>👍</span>
                                    <span>{likeState.liked ? "Đã thích" : "Thích"}</span>
                                </button>
                                <button
                                    className="post-action-btn"
                                    onClick={(e) => handleCommentClick(post, e)}
                                >
                                    <span>💬</span>
                                    <span>Bình luận</span>
                                </button>
                                <button
                                    className="post-action-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleShare(post.id);
                                    }}
                                >
                                    <span>↗️</span>
                                    <span>Chia sẻ</span>
                                </button>
                            </div>
                        </article>
                    );
                })}
            </div>

            <PostDetailModal
                open={selectedPost !== null}
                onClose={handleCloseModal}
                post={selectedPost}
                onPostUpdated={onPostUpdated}
                onPostDeleted={onPostDeleted}
                focusComment={focusComment}
                startEditing={editingPostId === selectedPost?.id}
                startDeleting={deletingPostId === selectedPost?.id}
                onCommentAdded={handleCommentAdded}
            />
        </>
    );
};

export default PostList;
