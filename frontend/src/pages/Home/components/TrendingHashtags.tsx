import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTrendingHashtags } from "../../../services/postService";
import "./TrendingHashtags.css";

interface TrendingHashtag {
    name: string;
    score: number;
}

const TrendingHashtags: React.FC = () => {
    const [trending, setTrending] = useState<TrendingHashtag[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const response = await getTrendingHashtags();
                if (response?.success && Array.isArray(response.data)) {
                    // response.data is an array of alternating names and scores from Redis WITHSCORES
                    const parsed: TrendingHashtag[] = [];
                    for (let i = 0; i < response.data.length; i += 2) {
                        parsed.push({
                            name: response.data[i],
                            score: parseFloat(response.data[i + 1]),
                        });
                    }
                    setTrending(parsed);
                }
            } catch (error) {
                console.error("Failed to fetch trending hashtags:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTrending();
    }, []);

    if (isLoading) {
        return (
            <div className="sidebar-section">
                <div className="section-header">
                    <h3 className="section-title">Thịnh hành</h3>
                </div>
                <div className="trending-loading">Đang tải...</div>
            </div>
        );
    }

    if (trending.length === 0) {
        return null;
    }

    return (
        <div className="sidebar-section">
            <div className="section-header">
                <h3 className="section-title">Thịnh hành</h3>
            </div>
            <div className="trending-list">
                {trending.map((tag, index) => (
                    <Link
                        key={tag.name}
                        to={`/search?q=%23${encodeURIComponent(tag.name)}`}
                        className="trending-item"
                    >
                        <div className="trending-rank">#{index + 1}</div>
                        <div className="trending-info">
                            <span className="trending-name">#{tag.name}</span>
                            <span className="trending-count">{tag.score} bài viết</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default TrendingHashtags;
