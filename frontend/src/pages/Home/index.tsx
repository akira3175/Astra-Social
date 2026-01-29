import React, { useEffect, useLayoutEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import BasePage from "../Base";
import { Box } from "../../components/ui";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import LeftSidebar from "./components/LeftSidebar";
import RightSidebar from "./components/RightSidebar";
import CreatePost from "./components/CreatePost";
import PostList from "./components/PostList";
import MobileBottomNav from "./components/MobileBottomNav";
import "./HomePage.css";

const HomePage: React.FC = () => {
    const isMobile = useMediaQuery("(max-width: 900px)");
    const isSmallScreen = useMediaQuery("(max-width: 1200px)");

    // Mock data for now
    const [posts, setPosts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLayoutReady, setIsLayoutReady] = useState(false);

    useLayoutEffect(() => {
        setIsLayoutReady(true);
    }, []);

    useEffect(() => {
        setIsLoading(false);
        setPosts([]);
    }, []);

    if (!isLayoutReady) {
        return (
            <BasePage>
                <div className="home-layout" style={{ visibility: "hidden" }} />
            </BasePage>
        );
    }

    return (
        <>
            <BasePage>
                <div className="home-layout">
                    {/* Left sidebar */}
                    {!isMobile && (
                        <div className="sidebar-container sidebar-left">
                            <LeftSidebar onToggleChat={() => { }} />
                        </div>
                    )}

                    {/* Main feed */}
                    <div className="main-feed">
                        <CreatePost />
                        <PostList posts={posts} isLoading={isLoading} />
                    </div>

                    {/* Right sidebar */}
                    {!isSmallScreen && (
                        <div className="sidebar-container sidebar-right">
                            <RightSidebar />
                        </div>
                    )}
                </div>

                {isMobile && <MobileBottomNav />}
            </BasePage>
            <Outlet />
        </>
    );
};

export default HomePage;
