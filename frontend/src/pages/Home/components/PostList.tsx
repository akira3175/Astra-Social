import React from "react";
import "./PostList.css";

interface Post {
    id: number;
    content: string;
}

interface PostListProps {
    posts: Post[];
    isLoading: boolean;
}

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
                        <div className="post-avatar">👤</div>
                        <div className="post-user-info">
                            <span className="post-username">User</span>
                            <span className="post-time">Vừa xong</span>
                        </div>
                        <button className="post-menu-btn">⋯</button>
                    </div>
                    <div className="post-content">
                        <p className="post-text">{post.content}</p>
                    </div>
                    <div className="post-stats">
                        <span>0 lượt thích</span>
                        <span>0 bình luận</span>
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
