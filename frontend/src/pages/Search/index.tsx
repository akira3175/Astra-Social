import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserCard } from "../../components/common";
import PostList from "../Home/components/PostList";
import { searchUsers, searchPosts, type MockUser } from "./mockData";
import type { Post } from "../../types/post";
import "./SearchPage.css";

type SearchTab = "all" | "users" | "posts";

/**
 * Search Page Component
 */
const SearchPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // Get query from URL parameter
    const query = searchParams.get("q") || "";
    const initialTab = (searchParams.get("tab") as SearchTab) || "all";
    const [activeTab, setActiveTab] = useState<SearchTab>(initialTab);

    // Search results
    const { users, posts } = useMemo(() => {
        return {
            users: searchUsers(query),
            posts: searchPosts(query),
        };
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

    return (
        <div className="search-page">
            {/* Search Header */}
            {query && (
                <div className="search-header">
                    <h1 className="search-title">Kết quả tìm kiếm cho "{query}"</h1>
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

            {/* No Results */}
            {query.trim() && totalResults === 0 && (
                <div className="search-empty">
                    <div className="search-empty-icon">😕</div>
                    <h3 className="search-empty-title">Không tìm thấy kết quả</h3>
                    <p className="search-empty-text">
                        Thử tìm kiếm với từ khóa khác
                    </p>
                </div>
            )}

            {/* Search Results */}
            {query.trim() && totalResults > 0 && (
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
                                {(activeTab === "all" ? users.slice(0, 3) : users).map(user => (
                                    <UserCard
                                        key={user.id}
                                        user={user}
                                        onClick={() => handleUserClick(user.id)}
                                    />
                                ))}
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
                                isLoading={false}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchPage;
