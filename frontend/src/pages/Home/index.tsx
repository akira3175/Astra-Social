import React, { useEffect, useLayoutEffect, useState, useCallback } from "react";
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

const HomePage: React.FC = () => {
    const isMobile = useMediaQuery("(max-width: 900px)");
    const isSmallScreen = useMediaQuery("(max-width: 1200px)");

    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLayoutReady, setIsLayoutReady] = useState(false);

    const fetchPosts = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await getMyPosts(1, 20);
            if (response.success) {
                setPosts(response.data);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useLayoutEffect(() => {
        setIsLayoutReady(true);
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handlePostCreated = useCallback(() => {
        fetchPosts();
    }, [fetchPosts]);

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
