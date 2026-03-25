import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Avatar } from "../../../components/ui";
import { useCurrentUser } from "../../../context/currentUserContext";
import type { Post } from "../../../types/post";
import PostDetailModal from "./PostDetailModal";
import { createReport, CreateReportDto } from "../../../services/ReportService";
import PostMenu from "./PostMenu";
import { toggleLike } from "../../../services/postService";
import PostReportModal from "./PostReportModal";
import SharePostModal from "./SharePostModal";
import "./PostList.css";
import "./SharePostModal.css";
import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';

interface PostListProps {
    posts: Post[];
    isLoading: boolean;
    onPostUpdated?: () => void;
    onPostDeleted?: () => void;
    onPostReported?: ()=>void;
    onLoadMore?: () => void;
    hasMore?: boolean;
    isLoadingMore?: boolean;
}

/**
 * Format relative time
 */
const formatRelativeTime = (dateString: string): string => {
    // Ensure ISO format for Safari compatibility and preserve 'Z' for UTC
    let formattedString = dateString.replace(" ", "T");
    if (!formattedString.endsWith("Z") && !formattedString.includes("+")) {
        formattedString += "Z";
    }
    const date = new Date(formattedString);
    if (isNaN(date.getTime())) return "Gần đây";
    
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
        return `${user.profile.last_name || ""} ${user.profile.first_name || ""}`.trim();
    }
    return user.username;
};

/**
 * Render text with clickable hashtags
 */
const renderContentWithHashtags = (content: string) => {
    if (!content) return null;
    
    // Phân tách văn bản dựa trên hashtag (bắt đầu bằng #, theo sau là chữ Unicode, số hoặc dấu gạch dưới)
    // Sử dụng flag 'u' và \p{L} để hỗ trợ các ký tự Unicode (tiếng Việt)
    const hashtagRegex = /(#[\p{L}0-9_]+)/gu;
    const parts = content.split(hashtagRegex);
    
    return (
        <>
            {parts.map((part, i) => {
                // Kiểm tra xem part có phải là hashtag không (bắt đầu bằng #)
                if (part.startsWith('#') && part.match(/^#[\p{L}0-9_]+$/u)) {
                    const tagContent = part.slice(1); // Bỏ dấu # lúc truyền lên URL search
                    return (
                        <Link 
                            key={i} 
                            to={`/search?q=%23${encodeURIComponent(tagContent)}`}
                            className="post-hashtag"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {part}
                        </Link>
                    );
                }
                // Text bình thường có thể bao gồm xuống dòng
                return (
                    <span key={i} style={{ whiteSpace: "pre-wrap" }}>
                        {part}
                    </span>
                );
            })}
        </>
    );
};

/**
 * Embedded shared post preview — shown inside a post card when post.parent exists
 */
const SharedPostPreview: React.FC<{ post: Post }> = ({ post }) => {
    const firstImage = post.attachments?.find((a) => a.file_type === "IMAGE");
    return (
        <div className="shared-post-preview" onClick={(e) => e.stopPropagation()}>
            <div className="shared-preview-author">
                <Avatar
                    src={post.user.profile?.avatar_url || undefined}
                    alt={post.user.username}
                    width={30}
                    height={30}
                >
                    {getDisplayName(post.user)[0]?.toUpperCase() || "U"}
                </Avatar>
                <div className="shared-preview-meta">
                    <span className="shared-preview-name">{getDisplayName(post.user)}</span>
                    <span className="shared-preview-time">{formatRelativeTime(post.created_at)}</span>
                </div>
            </div>
            {post.content && (
                <p className="shared-preview-content">{post.content}</p>
            )}
            {firstImage && (
                <div className="shared-preview-image">
                    <img src={firstImage.url} alt="" />
                </div>
            )}
            {!post.content && !firstImage && (
                <p className="shared-preview-deleted">Bài viết gốc không có nội dung</p>
            )}
        </div>
    );
};

/**
 * Media Grid Component — supports IMAGE, VIDEO, FILE
 */
const MediaGrid: React.FC<{ attachments: Post["attachments"] }> = ({ attachments }) => {
    const images = attachments.filter((a) => a.file_type === "IMAGE");
    const videos = attachments.filter((a) => a.file_type === "VIDEO");
    const files  = attachments.filter((a) => a.file_type === "FILE");

    if (images.length === 0 && videos.length === 0 && files.length === 0) return null;

    const gridClass =
        images.length === 1 ? "post-media-grid single"
            : images.length === 2 ? "post-media-grid double"
                : images.length === 3 ? "post-media-grid triple"
                    : "post-media-grid quad";

    return (
        <div className="post-media-container">
            {/* Images */}
            {images.length > 0 && (
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
            )}

            {/* Videos */}
            {videos.map((vid) => (
                <div key={vid.id} className="post-video-item" onClick={(e) => e.stopPropagation()}>
                    <video
                        src={vid.url}
                        controls
                        preload="metadata"
                        className="post-video-player"
                    />
                </div>
            ))}

            {/* Files */}
            {files.length > 0 && (
                <div className="post-files-list">
                    {files.map((file) => {
                        const fileName = file.url.split('/').pop() || 'Tệp đính kèm';
                        return (
                            <a
                                key={file.id}
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="post-file-item"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" className="post-file-icon">
                                    <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
                                </svg>
                                <span className="post-file-name">{decodeURIComponent(fileName)}</span>
                                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" className="post-file-download">
                                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                                </svg>
                            </a>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

interface LikeState {
    liked: boolean;
    count: number;
}

const PostList: React.FC<PostListProps> = ({
    posts,
    isLoading,
    onPostUpdated,
    onPostDeleted,
    onLoadMore,
    hasMore,
    isLoadingMore,
}) => {
    const { currentUser } = useCurrentUser() ?? {};
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [showReportForm, setShowReportForm] = useState(false);
    const [focusComment, setFocusComment] = useState(false);
    const [editingPostId, setEditingPostId] = useState<number | null>(null);
    const [deletingPostId, setDeletingPostId] = useState<number | null>(null);
    const [reportingPost, setReportingPost] = useState<Post | null>(null);
    const [sharingPost, setSharingPost] = useState<Post | null>(null);

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

        // Chỉ khởi tạo commentCounts cho post chưa có
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

    const onLoadMoreRef = useRef(onLoadMore);
    const hasMoreRef = useRef(hasMore);
    const isLoadingMoreRef = useRef(isLoadingMore);
    const listRef = useRef<HTMLDivElement>(null);

    // Sync refs mỗi render
    onLoadMoreRef.current = onLoadMore;
    hasMoreRef.current = hasMore;
    isLoadingMoreRef.current = isLoadingMore;

    useEffect(() => {
        if (isLoading || !listRef.current) return;

        const findScrollParent = (el: HTMLElement | null): HTMLElement | Window => {
            while (el) {
                const style = window.getComputedStyle(el);
                if (/(auto|scroll)/.test(style.overflow + style.overflowY)) {
                    return el;
                }
                el = el.parentElement;
            }
            return window;
        };

        const scrollContainer = findScrollParent(listRef.current);

        const handleScroll = () => {
            if (!onLoadMoreRef.current || !hasMoreRef.current || isLoadingMoreRef.current) return;

            let scrollTop: number, scrollHeight: number, clientHeight: number;

            if (scrollContainer instanceof Window) {
                scrollTop = window.scrollY || document.documentElement.scrollTop;
                scrollHeight = document.documentElement.scrollHeight;
                clientHeight = window.innerHeight;
            } else {
                scrollTop = scrollContainer.scrollTop;
                scrollHeight = scrollContainer.scrollHeight;
                clientHeight = scrollContainer.clientHeight;
            }

            if (scrollTop + clientHeight >= scrollHeight - 300) {
                onLoadMoreRef.current();
            }
        };

        scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
        return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }, [isLoading]);

    const postIdFromUrl = searchParams.get("post");

    useEffect(() => {
        if (postIdFromUrl && posts.length > 0) {
            const post = posts.find((p) => p.id.toString() === postIdFromUrl);
            if (post) setSelectedPost(post);
        }
    }, [postIdFromUrl, posts]);

    const handlePostClick = (post: Post) => {
        setSelectedPost(post);
        setFocusComment(false);
        setSearchParams((prev) => { const next = new URLSearchParams(prev); next.set("post", post.id.toString()); return next; });
    };

    const handleProfileClick = (userId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/profile/${userId}`);
    };

    const handleCommentClick = (post: Post, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedPost(post);
        setFocusComment(true);
        setSearchParams((prev) => { const next = new URLSearchParams(prev); next.set("post", post.id.toString()); return next; });
    };

    const handleCloseModal = () => {
        setSelectedPost(null);
        setFocusComment(false);
        setEditingPostId(null);
        setDeletingPostId(null);
        setSearchParams((prev) => { const next = new URLSearchParams(prev); next.delete("post"); return next; });
    };

    const handleEditClick = (post: Post) => {
        setSelectedPost(post);
        setEditingPostId(post.id);
        setSearchParams((prev) => { const next = new URLSearchParams(prev); next.set("post", post.id.toString()); return next; });
    };

    const handleDeleteClick = (post: Post) => {
        setSelectedPost(post);
        setDeletingPostId(post.id);
        setSearchParams((prev) => { const next = new URLSearchParams(prev); next.set("post", post.id.toString()); return next; });
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

    const handleShare = (post: Post) => {
        setSharingPost(post);
    };

    // Callback nhận từ modal khi comment được tạo thành công
    const handleCommentAdded = (postId: number) => {
        setCommentCounts((prev) => ({
            ...prev,
            [postId]: (prev[postId] ?? 0) + 1,
        }));
    };

    const handleReportClick = (post: Post) => {
        setSelectedPost(null);
        setShowReportForm(true);
        setReportingPost(post);
    };

    const handleReportSubmit = async (reason: string, detail?: string) => {
        if (!reportingPost || !currentUser) return;

        const newReport: CreateReportDto = {
            reporter_id: Number(currentUser.id),
            target_author_id: reportingPost.user_id,
            target_type: 'POST',
            target_preview: detail ?? '', 
            target_id: reportingPost.id,
            reason: reason,
        };

        try {
            const result = await createReport(newReport);
            if (result.success) {
                Swal.fire({
                    title: 'Thành công',
                    text: 'Đã báo cáo thành công',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                });
                setShowReportForm(false);
            }
        } catch (e) {
            console.error(e);
        }
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
            {/* ✅ Thêm ref vào div wrapper */}
            <div className="post-list" ref={listRef}>
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
                                <div onClick={(e) => handleProfileClick(post.user.id, e)}>
                                    <Avatar
                                        src={post.user.profile?.avatar_url || undefined}
                                        alt={post.user.username}
                                        width={44}
                                        height={44}
                                        className="post-avatar"
                                    >
                                        {getDisplayName(post.user)[0]?.toUpperCase() || "U"}
                                    </Avatar>
                                </div>
                                <div className="post-user-info">
                                    <span 
                                        className="post-username"
                                        onClick={(e) => handleProfileClick(post.user.id, e)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        {getDisplayName(post.user)}
                                    </span>
                                    <span className="post-time">
                                        {formatRelativeTime(post.created_at)}
                                        <span 
                                            className="post-privacy-icon" 
                                            style={{ marginLeft: '4px', fontSize: '0.8em', color: '#64748b' }}
                                            title={post.privacy === "FRIENDS" ? "Bạn bè" : post.privacy === "ONLY_ME" ? "Chỉ mình tôi" : "Công khai"}
                                        >
                                            · {post.privacy === "FRIENDS" ? "👥" : post.privacy === "ONLY_ME" ? "🔒" : "🌎"}
                                        </span>
                                    </span>
                                </div>
                                <PostMenu
                                    isOwner={isOwner}
                                    onEdit={() => handleEditClick(post)}
                                    onDelete={() => handleDeleteClick(post)}
                                    onReport={() => handleReportClick(post)}
                                />
                            </div>

                            {post.content && (
                                <div className="post-content">
                                    <div className="post-text">{renderContentWithHashtags(post.content)}</div>
                                </div>
                            )}

                            {/* Embedded original post for shares */}
                            {post.parent && <SharedPostPreview post={post.parent} />}

                            {/* Attachments only on non-share posts */}
                            {!post.parent && post.attachments && post.attachments.length > 0 && (
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
                                        handleShare(post);
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

            {/* ✅ Chỉ render PostDetailModal 1 lần duy nhất */}
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
                initialLikeState={selectedPost ? likeStates[selectedPost.id] : undefined}
                onLikeChanged={(postId, liked, count) => {
                    setLikeStates((prev) => ({ ...prev, [postId]: { liked, count } }));
                }}
            />

            {isLoadingMore && (
                <div className="post-loading-more">
                    <div className="loading-spinner" />
                    <span>Đang tải thêm...</span>
                </div>
            )}

            {showReportForm && reportingPost && (
                <PostReportModal
                    open={showReportForm}
                    postId={reportingPost.id}
                    onClose={() => setShowReportForm(false)}
                    onSubmit={async (reason, detail) => handleReportSubmit(reason, detail)}
                />
            )}

            <SharePostModal
                open={sharingPost !== null}
                onClose={() => setSharingPost(null)}
                post={sharingPost}
                onPostShared={() => {
                    setSharingPost(null);
                    onPostUpdated?.();
                }}
            />
        </>
    );
};

export default PostList;