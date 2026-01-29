import React from "react";
import { Avatar } from "../../../components/ui";
import type { Post } from "../../../types/post";
import "./PostList.css";

interface PostListProps {
    posts: Post[];
    isLoading: boolean;
}

/**
 * Format relative time (e.g., "2 giờ trước")
 */
const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return "Vừa xong";
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} phút trước`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} giờ trước`;
    } else if (diffInSeconds < 604800) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} ngày trước`;
    } else {
        return date.toLocaleDateString("vi-VN");
    }
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
        images.length === 1
            ? "post-media-grid single"
            : images.length === 2
                ? "post-media-grid double"
                : images.length === 3
                    ? "post-media-grid triple"
                    : "post-media-grid quad";

    return (
        <div className={gridClass}>
            {images.slice(0, 4).map((img, index) => (
                <div key={img.id} className="post-media-item">
                    <img src={img.url} alt={`Media ${index + 1}`} />
                    {images.length > 4 && index === 3 && (
                        <div className="post-media-more">
                            +{images.length - 4}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

const PostList: React.FC<PostListProps> = ({ posts, isLoading }) => {
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
        <div className="post-list">
            {posts.map((post) => (
                <article key={post.id} className="post-card">
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
                        <button className="post-menu-btn">⋯</button>
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
                        <span>{post.likes_count} lượt thích</span>
                        <span>{post.comments_count} bình luận</span>
                    </div>
                    <div className="post-actions">
                        <button className="post-action-btn">
                            <span>👍</span>
                            <span>Thích</span>
                        </button>
                        <button className="post-action-btn">
                            <span>💬</span>
                            <span>Bình luận</span>
                        </button>
                        <button className="post-action-btn">
                            <span>↗️</span>
                            <span>Chia sẻ</span>
                        </button>
                    </div>
                </article>
            ))}
        </div>
    );
};

export default PostList;
