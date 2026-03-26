import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserCard } from "../../components/common";
import PostList from "../Home/components/PostList";
import postService from "../../services/postService";
import { sendFriendRequest } from "../../services/friendshipService";
import { useCurrentUser } from "../../context/currentUserContext";
import type { Post } from "../../types/post";
import type { UserCardData } from "../../components/common/UserCard/UserCard";
import "./SearchPage.css";

type SearchTab = "all" | "users" | "posts";

/**
 * Search Page Component
 */
const SearchPage: React.FC = () => {
    const navigate = useNavigate();
    const { currentUser } = useCurrentUser() ?? {};
    const [searchParams, setSearchParams] = useSearchParams();

    // Get query from URL parameter
    const query = searchParams.get("q") || "";
    const initialTab = (searchParams.get("tab") as SearchTab) || "all";
    const [activeTab, setActiveTab] = useState<SearchTab>(initialTab);

    // Search results state
    const [users, setUsers] = useState<UserCardData[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query.trim()) {
            setUsers([]);
            setPosts([]);
            return;
        }

        setLoading(true);
        postService.searchAll(query, 1, 50)
            .then(res => {
                if (res.success) {
                    const mappedUsers: UserCardData[] = (res.data.users || [])
                        .filter(u => u.id !== Number(currentUser?.id))
                        .map(u => ({
                            id: u.id,
                            username: u.username,
                            firstName: u.profile?.first_name || '',
                            lastName: u.profile?.last_name || '',
                            avatarUrl: u.profile?.avatar_url || null,
                            bio: null,
                            friendshipStatus: (u as any).friendship_status || 'none',
                        }));
                    setUsers(mappedUsers);
                    setPosts(res.data.posts || []);
                }
            })
            .catch(err => {
                console.error("Search error:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [query]);

    // Total results
    const totalResults = users.length + posts.length;

    // Handle tab change
    const handleTabChange = (tab: SearchTab) => {
        setActiveTab(tab);
        if (query) {
            setSearchParams({ q: query, tab });
        }
    };

    // Handle user click
    const handleUserClick = (userId: number) => {
        navigate(`/profile/${userId}`);
    };

    const handleAddFriend = async (userId: number) => {
        try {
            await sendFriendRequest(userId);
            setUsers(prev => prev.map(u => 
                u.id === userId ? { ...u, friendshipStatus: 'pending_sent' } : u
            ));
        } catch (err) {
            console.error("Friend request error:", err);
        }
    };

    return (
        <div className="search-page">
            {/* Search Header */}
            {query && (
                <div className="search-header">
                    <h1 className="search-title">
                        Kết quả tìm kiếm cho {query.startsWith('#') ? (
                            <span className="search-hashtag-badge">{query}</span>
                        ) : (
                            `"${query}"`
                        )}
                    </h1>
                </div>
            )}

            {/* Search Tabs */}
            {query.trim() && (
                <div className="search-tabs">
                    <button
                        className={`search-tab ${activeTab === "all" ? "active" : ""}`}
                        onClick={() => handleTabChange("all")}
                    >
                        Tất cả ({totalResults})
                    </button>
                    <button
                        className={`search-tab ${activeTab === "users" ? "active" : ""}`}
                        onClick={() => handleTabChange("users")}
                    >
                        Người dùng ({users.length})
                    </button>
                    <button
                        className={`search-tab ${activeTab === "posts" ? "active" : ""}`}
                        onClick={() => handleTabChange("posts")}
                    >
                        Bài đăng ({posts.length})
                    </button>
                </div>
            )}

            {/* Empty State - No Query */}
            {!query.trim() && (
                <div className="search-empty">
                    <div className="search-empty-icon">🔍</div>
                    <h3 className="search-empty-title">Tìm kiếm trên Astra Social</h3>
                    <p className="search-empty-text">
                        Nhập từ khóa vào thanh tìm kiếm để tìm bài viết, người dùng và nhiều hơn nữa
                    </p>
                </div>
            )}

            {/* Loading State */}
            {query.trim() && loading && (
                <div className="search-empty">
                    <div className="search-empty-icon" style={{ animation: 'spin 1s linear infinite' }}>⏳</div>
                    <h3 className="search-empty-title">Đang tìm kiếm...</h3>
                </div>
            )}

            {/* No Results */}
            {query.trim() && !loading && totalResults === 0 && (
                <div className="search-empty">
                    <div className="search-empty-icon">😕</div>
                    <h3 className="search-empty-title">Không tìm thấy kết quả</h3>
                    <p className="search-empty-text">
                        Thử tìm kiếm với từ khóa khác
                    </p>
                </div>
            )}

            {/* Search Results */}
            {query.trim() && !loading && totalResults > 0 && (
                <div className="search-results">
                    {/* Users Section */}
                    {(activeTab === "all" || activeTab === "users") && users.length > 0 && (
                        <div className="search-section">
                            {activeTab === "all" && (
                                <div className="search-section-header">
                                    <h2 className="search-section-title">Người dùng</h2>
                                    {users.length > 3 && (
                                        <button
                                            className="search-section-more"
                                            onClick={() => handleTabChange("users")}
                                        >
                                            Xem tất cả
                                        </button>
                                    )}
                                </div>
                            )}
                            <div className="user-list">
                                {(activeTab === "all" ? users.slice(0, 3) : users).map(user => {
                                    let label = "Kết bạn";
                                    let disabled = false;
                                    
                                    if (user.friendshipStatus === 'friends') {
                                        label = "Bạn bè";
                                        disabled = true;
                                    } else if (user.friendshipStatus === 'pending_sent') {
                                        label = "Đã gửi lời mời";
                                        disabled = true;
                                    } else if (user.friendshipStatus === 'pending_received') {
                                        label = "Chờ phản hồi";
                                        disabled = true;
                                    }

                                    return (
                                        <UserCard
                                            key={user.id}
                                            user={user}
                                            onClick={() => handleUserClick(user.id)}
                                            onPrimaryAction={() => handleAddFriend(user.id)}
                                            primaryActionLabel={label}
                                            primaryActionDisabled={disabled}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Posts Section */}
                    {(activeTab === "all" || activeTab === "posts") && posts.length > 0 && (
                        <div className="search-section">
                            {activeTab === "all" && (
                                <div className="search-section-header">
                                    <h2 className="search-section-title">Bài đăng</h2>
                                    {posts.length > 3 && (
                                        <button
                                            className="search-section-more"
                                            onClick={() => handleTabChange("posts")}
                                        >
                                            Xem tất cả
                                        </button>
                                    )}
                                </div>
                            )}
                            <PostList
                                posts={activeTab === "all" ? posts.slice(0, 3) : posts}
                                isLoading={loading}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchPage;
