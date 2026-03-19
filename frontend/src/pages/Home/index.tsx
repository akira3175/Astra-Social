import React, { useEffect, useLayoutEffect, useState, useCallback, useRef } from "react";
import { Outlet } from "react-router-dom";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import LeftSidebar from "./components/LeftSidebar";
import RightSidebar from "./components/RightSidebar";
import CreatePost from "./components/CreatePost";
import PostList from "./components/PostList";
import MobileBottomNav from "./components/MobileBottomNav";
import { getMyPosts } from "../../services/postService";
import type { Post } from "../../types/post";
import "./HomePage.css";

const PER_PAGE = 10;

const HomePage: React.FC = () => {
    const isMobile = useMediaQuery("(max-width: 900px)");
    const isSmallScreen = useMediaQuery("(max-width: 1200px)");

    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isLayoutReady, setIsLayoutReady] = useState(false);
    const pageRef = useRef(1);

    const fetchPosts = useCallback(async (page: number, append: boolean = false) => {
        try {
            if (append) {
                setIsLoadingMore(true);
            } else {
                setIsLoading(true);
            }
            const response = await getMyPosts(page, PER_PAGE);
            if (response.success) {
                if (append) {
                    setPosts(prev => [...prev, ...response.data]);
                } else {
                    setPosts(response.data);
                }
                setHasMore(
                    response.pagination
                        ? response.pagination.current_page < response.pagination.last_page
                        : response.data.length >= PER_PAGE
                );
                pageRef.current = page;
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }, []);

    useLayoutEffect(() => {
        setIsLayoutReady(true);
    }, []);

    useEffect(() => {
        fetchPosts(1);
    }, [fetchPosts]);

    const handlePostCreated = useCallback(() => {
        pageRef.current = 1;
        setHasMore(true);
        fetchPosts(1);
    }, [fetchPosts]);

    const handleLoadMore = useCallback(() => {
        if (isLoadingMore || !hasMore) return;
        fetchPosts(pageRef.current + 1, true);
    }, [fetchPosts, isLoadingMore, hasMore]);

    if (!isLayoutReady) {
        return <div className="home-layout" style={{ visibility: "hidden" }} />;
    }

    return (
        <>
            <div className="home-layout">
                {/* Left sidebar */}
                {!isMobile && (
                    <div className="sidebar-container sidebar-left">
                        <LeftSidebar onToggleChat={() => { }} />
                    </div>
                )}

                {/* Main feed */}
                <div className="main-feed">
                    <CreatePost onPostCreated={handlePostCreated} />
                    <PostList
                        posts={posts}
                        isLoading={isLoading}
                        onPostUpdated={handlePostCreated}
                        onPostDeleted={handlePostCreated}
                        onLoadMore={handleLoadMore}
                        hasMore={hasMore}
                        isLoadingMore={isLoadingMore}
                    />
                </div>

                {/* Right sidebar */}
                {!isSmallScreen && (
                    <div className="sidebar-container sidebar-right">
                        <RightSidebar />
                    </div>
                )}
            </div>

            {isMobile && <MobileBottomNav />}
            <Outlet />
        </>
    );
};

export default HomePage;

