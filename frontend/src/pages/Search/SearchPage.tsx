import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getHashtagPosts } from "../../services/postService";
import PostList from "../Home/components/PostList";
import type { Post } from "../../types/post";

const SearchPage = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search).get("q") ?? "";

    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    useEffect(() => {
        if (!query) return;

        setLoading(true);
        setPosts([]);
        setPage(1);

        getHashtagPosts(query, 1, 10)
            .then((res) => {
                setPosts(res.data ?? []);
                setLastPage(res.pagination.total_pages);
            })
            .catch(() => setPosts([]))
            .finally(() => setLoading(false));
    }, [query]);

    const handleLoadMore = () => {
        if (page >= lastPage || loading) return;

        const nextPage = page + 1;
        setLoading(true);

        getHashtagPosts(query, nextPage, 10)
            .then((res) => {
                setPosts((prev) => [...prev, ...(res.data ?? [])]);
                setLastPage(res.pagination.total_pages);
                setPage(nextPage);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    return (
        <div style={{ maxWidth: 600, margin: "80px auto" }}>
            <h2 style={{ marginBottom: 16 }}>#{query}</h2>

            <PostList
                posts={posts}
                isLoading={loading && posts.length === 0}
                onPostUpdated={() => {
                    // reload từ đầu khi post được update
                    setLoading(true);
                    getHashtagPosts(query, 1, 10)
                        .then((res) => {
                            setPosts(res.data ?? []);
                            setLastPage(res.pagination.total_pages);
                            setPage(1);
                        })
                        .finally(() => setLoading(false));
                }}
            />

            {page < lastPage && (
                <div style={{ textAlign: "center", marginTop: 16 }}>
                    <button
                        onClick={handleLoadMore}
                        disabled={loading}
                        style={{
                            padding: "8px 24px",
                            borderRadius: 8,
                            border: "1px solid #ddd",
                            cursor: loading ? "not-allowed" : "pointer",
                            background: "#fff",
                        }}
                    >
                        {loading ? "Đang tải..." : "Xem thêm"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchPage;