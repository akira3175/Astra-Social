import React, { useEffect, useState } from "react";
import {
    PersonIcon,
    FileTextIcon,
    CommentIcon,
    FlagIcon,
    TrendUpIcon,
} from "../../components/ui";
import {
    getDashboardStats,
    getDailyActivity,
    getRecentReports,
    getRecentPosts,
} from "../../services/adminService";
import type { DashboardStats, DailyActivity, AdminReport, AdminPost } from "../../types/admin";
import "./AdminDashboard.css";

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [activity, setActivity] = useState<DailyActivity[]>([]);
    const [recentReports, setRecentReports] = useState<AdminReport[]>([]);
    const [recentPosts, setRecentPosts] = useState<AdminPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [statsData, activityData, reportsData, postsData] =
                    await Promise.all([
                        getDashboardStats(),
                        getDailyActivity(),
                        getRecentReports(5),
                        getRecentPosts(5),
                    ]);
                setStats(statsData);
                setActivity(activityData);
                setRecentReports(reportsData);
                setRecentPosts(postsData);
            } catch (error) {
                console.error("Error loading dashboard:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const formatNumber = (num: number) => {
        if (num >= 1000) return (num / 1000).toFixed(1) + "K";
        return num.toString();
    };

    const getTimeAgo = (dateStr: string) => {
        const now = new Date();
        const date = new Date(dateStr);
        const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
        if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
        return `${Math.floor(diff / 86400)} ngày trước`;
    };

    const maxActivity = Math.max(
        ...activity.map((d) => Math.max(d.posts, d.comments, d.reports))
    );

    if (loading) {
        return (
            <div>
                <div className="dashboard-stats">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="stat-card">
                            <div className="stat-card-info">
                                <div className="dashboard-skeleton" style={{ width: 80, height: 14, marginBottom: 8 }} />
                                <div className="dashboard-skeleton" style={{ width: 120, height: 32 }} />
                            </div>
                            <div className="dashboard-skeleton" style={{ width: 48, height: 48, borderRadius: 14 }} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div>
            {/* Stat Cards */}
            <div className="dashboard-stats">
                <div className="stat-card">
                    <div className="stat-card-info">
                        <span className="stat-card-label">Người dùng</span>
                        <span className="stat-card-value">{formatNumber(stats.total_users)}</span>
                        <span className={`stat-card-trend ${stats.user_growth >= 0 ? "up" : "down"}`}>
                            <TrendUpIcon size={14} />
                            {stats.user_growth > 0 ? "+" : ""}{stats.user_growth}%
                        </span>
                    </div>
                    <div className="stat-card-icon users">
                        <PersonIcon size={24} />
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-info">
                        <span className="stat-card-label">Bài viết</span>
                        <span className="stat-card-value">{formatNumber(stats.total_posts)}</span>
                        <span className={`stat-card-trend ${stats.post_growth >= 0 ? "up" : "down"}`}>
                            <TrendUpIcon size={14} />
                            {stats.post_growth > 0 ? "+" : ""}{stats.post_growth}%
                        </span>
                    </div>
                    <div className="stat-card-icon posts">
                        <FileTextIcon size={24} />
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-info">
                        <span className="stat-card-label">Bình luận</span>
                        <span className="stat-card-value">{formatNumber(stats.total_comments)}</span>
                        <span className={`stat-card-trend ${stats.comment_growth >= 0 ? "up" : "down"}`}>
                            <TrendUpIcon size={14} />
                            {stats.comment_growth > 0 ? "+" : ""}{stats.comment_growth}%
                        </span>
                    </div>
                    <div className="stat-card-icon comments">
                        <CommentIcon size={24} />
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-info">
                        <span className="stat-card-label">Báo cáo chờ xử lý</span>
                        <span className="stat-card-value">{stats.pending_reports}</span>
                        <span className={`stat-card-trend ${stats.report_change >= 0 ? "down" : "up"}`}>
                            <TrendUpIcon size={14} style={stats.report_change >= 0 ? { transform: "scaleY(-1)" } : {}} />
                            {stats.report_change > 0 ? "+" : ""}{stats.report_change}%
                        </span>
                    </div>
                    <div className="stat-card-icon reports">
                        <FlagIcon size={24} />
                    </div>
                </div>
            </div>

            {/* Bottom Grid */}
            <div className="dashboard-grid">
                {/* Activity Chart */}
                <div className="dashboard-card">
                    <div className="dashboard-card-header">
                        <div>
                            <h3 className="dashboard-card-title">Hoạt động 7 ngày qua</h3>
                            <p className="dashboard-card-subtitle">Thống kê bài viết, bình luận và báo cáo</p>
                        </div>
                    </div>
                    <div className="activity-chart">
                        {activity.map((day) => (
                            <div key={day.day} className="chart-column">
                                <div className="chart-bars">
                                    <div
                                        className="chart-bar posts"
                                        style={{ height: `${(day.posts / maxActivity) * 100}%` }}
                                        data-value={`${day.posts} bài`}
                                    />
                                    <div
                                        className="chart-bar comments"
                                        style={{ height: `${(day.comments / maxActivity) * 100}%` }}
                                        data-value={`${day.comments} BL`}
                                    />
                                    <div
                                        className="chart-bar reports"
                                        style={{ height: `${(day.reports / maxActivity) * 100}%` }}
                                        data-value={`${day.reports} BC`}
                                    />
                                </div>
                                <span className="chart-day">{day.day}</span>
                            </div>
                        ))}
                    </div>
                    <div className="chart-legend">
                        <div className="chart-legend-item">
                            <div className="chart-legend-dot posts" />
                            Bài viết
                        </div>
                        <div className="chart-legend-item">
                            <div className="chart-legend-dot comments" />
                            Bình luận
                        </div>
                        <div className="chart-legend-item">
                            <div className="chart-legend-dot reports" />
                            Báo cáo
                        </div>
                    </div>
                </div>

                {/* Recent Reports */}
                <div className="dashboard-card">
                    <div className="dashboard-card-header">
                        <div>
                            <h3 className="dashboard-card-title">Báo cáo gần đây</h3>
                            <p className="dashboard-card-subtitle">Các báo cáo chờ xử lý</p>
                        </div>
                    </div>
                    <div className="recent-list">
                        {recentReports.map((report) => (
                            <div key={report.id} className="recent-item">
                                <div className="recent-item-avatar report">
                                    <FlagIcon size={16} />
                                </div>
                                <div className="recent-item-info">
                                    <div className="recent-item-text">
                                        {report.target_preview}
                                    </div>
                                    <div className="recent-item-meta">
                                        Báo cáo bởi @{report.reporter.username} · {getTimeAgo(report.created_at)}
                                    </div>
                                </div>
                                <span className="recent-item-status pending">
                                    Chờ xử lý
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Posts */}
                <div className="dashboard-card" style={{ gridColumn: "1 / -1" }}>
                    <div className="dashboard-card-header">
                        <div>
                            <h3 className="dashboard-card-title">Bài viết mới nhất</h3>
                            <p className="dashboard-card-subtitle">5 bài viết gần đây nhất</p>
                        </div>
                    </div>
                    <div className="recent-list">
                        {recentPosts.map((post) => (
                            <div key={post.id} className="recent-item">
                                <div className="recent-item-avatar post">
                                    {post.user.first_name?.[0] || post.user.username[0].toUpperCase()}
                                </div>
                                <div className="recent-item-info">
                                    <div className="recent-item-text">
                                        {post.content}
                                    </div>
                                    <div className="recent-item-meta">
                                        @{post.user.username} · {post.likes_count} lượt thích · {post.comments_count} bình luận · {getTimeAgo(post.created_at)}
                                    </div>
                                </div>
                                <span className="recent-item-status" style={{
                                    background: post.privacy === "PUBLIC" ? "#dbeafe" : post.privacy === "FRIENDS" ? "#d1fae5" : "#f1f5f9",
                                    color: post.privacy === "PUBLIC" ? "#2563eb" : post.privacy === "FRIENDS" ? "#059669" : "#64748b",
                                }}>
                                    {post.privacy === "PUBLIC" ? "Công khai" : post.privacy === "FRIENDS" ? "Bạn bè" : "Riêng tư"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
