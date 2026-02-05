/**
 * Mock data for Search feature
 */

import type { Post, MediaAttachment } from "../../types/post";

export interface MockUser {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    bio: string | null;
    isVerified: boolean;
    mutualFriends: number;
}

// Mock users data
export const mockUsers: MockUser[] = [
    {
        id: 1,
        username: "nguyenvana",
        firstName: "Văn A",
        lastName: "Nguyễn",
        avatarUrl: "https://i.pravatar.cc/150?img=1",
        bio: "Lập trình viên Full-stack | Yêu thích công nghệ",
        isVerified: true,
        mutualFriends: 12,
    },
    {
        id: 2,
        username: "tranthib",
        firstName: "Thị B",
        lastName: "Trần",
        avatarUrl: "https://i.pravatar.cc/150?img=2",
        bio: "Designer | Coffee lover ☕",
        isVerified: false,
        mutualFriends: 5,
    },
    {
        id: 3,
        username: "lequangc",
        firstName: "Quang C",
        lastName: "Lê",
        avatarUrl: "https://i.pravatar.cc/150?img=3",
        bio: "Sinh viên CNTT | Đam mê AI và Machine Learning",
        isVerified: false,
        mutualFriends: 8,
    },
    {
        id: 4,
        username: "phamthid",
        firstName: "Thị D",
        lastName: "Phạm",
        avatarUrl: "https://i.pravatar.cc/150?img=4",
        bio: "Content Creator | Travel Blogger 🌍",
        isVerified: true,
        mutualFriends: 20,
    },
    {
        id: 5,
        username: "hoanganhe",
        firstName: "Anh E",
        lastName: "Hoàng",
        avatarUrl: null,
        bio: "Marketing Manager tại ABC Corp",
        isVerified: false,
        mutualFriends: 3,
    },
    {
        id: 6,
        username: "vutrongg",
        firstName: "Trọng G",
        lastName: "Vũ",
        avatarUrl: "https://i.pravatar.cc/150?img=6",
        bio: "Photographer | Yêu thiên nhiên",
        isVerified: true,
        mutualFriends: 15,
    },
    {
        id: 7,
        username: "dangthih",
        firstName: "Thị H",
        lastName: "Đặng",
        avatarUrl: "https://i.pravatar.cc/150?img=7",
        bio: "Giáo viên tiếng Anh | IELTS 8.0",
        isVerified: false,
        mutualFriends: 7,
    },
    {
        id: 8,
        username: "buivanl",
        firstName: "Văn I",
        lastName: "Bùi",
        avatarUrl: "https://i.pravatar.cc/150?img=8",
        bio: "Fitness Trainer | Healthy Lifestyle",
        isVerified: false,
        mutualFriends: 11,
    },
];

// Mock posts data (matching Post type from types/post.ts)
export const mockPosts: Post[] = [
    {
        id: 101,
        user_id: 1,
        parent_id: null,
        content: "Hôm nay mình học được một kỹ thuật mới về React Hooks! Chia sẻ với mọi người nhé. useReducer kết hợp với useContext thực sự rất mạnh mẽ cho state management.",
        privacy: "PUBLIC",
        likes_count: 45,
        comments_count: 12,
        created_at: "2026-02-05T08:30:00Z",
        deleted_at: null,
        user: {
            id: 1,
            username: "nguyenvana",
            profile: {
                first_name: "Văn A",
                last_name: "Nguyễn",
                avatar_url: "https://i.pravatar.cc/150?img=1",
            },
        },
        attachments: [],
    },
    {
        id: 102,
        user_id: 2,
        parent_id: null,
        content: "Just finished a new design project! 🎨 Cảm thấy rất hài lòng với kết quả. Design thinking là quá trình tuyệt vời.",
        privacy: "PUBLIC",
        likes_count: 89,
        comments_count: 23,
        created_at: "2026-02-05T07:15:00Z",
        deleted_at: null,
        user: {
            id: 2,
            username: "tranthib",
            profile: {
                first_name: "Thị B",
                last_name: "Trần",
                avatar_url: "https://i.pravatar.cc/150?img=2",
            },
        },
        attachments: [
            { id: 1, url: "https://picsum.photos/800/600?random=1", file_type: "IMAGE", entity_type: "POST", entity_id: 102, created_at: "2026-02-05T07:15:00Z" },
        ],
    },
    {
        id: 103,
        user_id: 3,
        parent_id: null,
        content: "Học xong khóa Machine Learning trên Coursera! 🎓 Cảm ơn Andrew Ng đã có những bài giảng tuyệt vời.",
        privacy: "PUBLIC",
        likes_count: 156,
        comments_count: 34,
        created_at: "2026-02-04T22:00:00Z",
        deleted_at: null,
        user: {
            id: 3,
            username: "lequangc",
            profile: {
                first_name: "Quang C",
                last_name: "Lê",
                avatar_url: "https://i.pravatar.cc/150?img=3",
            },
        },
        attachments: [],
    },
    {
        id: 104,
        user_id: 4,
        parent_id: null,
        content: "Chuyến du lịch Đà Nẵng thật tuyệt vời! Bãi biển Mỹ Khê đẹp quá 🏖️ Highly recommend cho ai chưa đi!",
        privacy: "PUBLIC",
        likes_count: 234,
        comments_count: 56,
        created_at: "2026-02-04T18:30:00Z",
        deleted_at: null,
        user: {
            id: 4,
            username: "phamthid",
            profile: {
                first_name: "Thị D",
                last_name: "Phạm",
                avatar_url: "https://i.pravatar.cc/150?img=4",
            },
        },
        attachments: [
            { id: 2, url: "https://picsum.photos/800/600?random=2", file_type: "IMAGE", entity_type: "POST", entity_id: 104, created_at: "2026-02-04T18:30:00Z" },
            { id: 3, url: "https://picsum.photos/800/600?random=3", file_type: "IMAGE", entity_type: "POST", entity_id: 104, created_at: "2026-02-04T18:30:00Z" },
        ],
    },
    {
        id: 105,
        user_id: 5,
        parent_id: null,
        content: "Tips Marketing hiệu quả: Content is King but Consistency is Queen 👑. Đừng bỏ cuộc chỉ sau vài tuần!",
        privacy: "PUBLIC",
        likes_count: 78,
        comments_count: 19,
        created_at: "2026-02-04T14:00:00Z",
        deleted_at: null,
        user: {
            id: 5,
            username: "hoanganhe",
            profile: {
                first_name: "Anh E",
                last_name: "Hoàng",
                avatar_url: null,
            },
        },
        attachments: [],
    },
    {
        id: 106,
        user_id: 6,
        parent_id: null,
        content: "Sáng nay chụp được hoàng hôn tuyệt đẹp tại Hội An! 📸 Golden hour is the best hour.",
        privacy: "PUBLIC",
        likes_count: 312,
        comments_count: 67,
        created_at: "2026-02-04T06:30:00Z",
        deleted_at: null,
        user: {
            id: 6,
            username: "vutrongg",
            profile: {
                first_name: "Trọng G",
                last_name: "Vũ",
                avatar_url: "https://i.pravatar.cc/150?img=6",
            },
        },
        attachments: [
            { id: 4, url: "https://picsum.photos/800/600?random=4", file_type: "IMAGE", entity_type: "POST", entity_id: 106, created_at: "2026-02-04T06:30:00Z" },
        ],
    },
    {
        id: 107,
        user_id: 7,
        parent_id: null,
        content: "IELTS Writing tips: Practice makes perfect! Mỗi ngày viết ít nhất 1 essay sẽ giúp bạn cải thiện đáng kể. 📝",
        privacy: "PUBLIC",
        likes_count: 167,
        comments_count: 45,
        created_at: "2026-02-03T20:00:00Z",
        deleted_at: null,
        user: {
            id: 7,
            username: "dangthih",
            profile: {
                first_name: "Thị H",
                last_name: "Đặng",
                avatar_url: "https://i.pravatar.cc/150?img=7",
            },
        },
        attachments: [],
    },
    {
        id: 108,
        user_id: 8,
        parent_id: null,
        content: "Workout của sáng nay: 5km chạy bộ + 30 phút strength training 💪. No pain, no gain!",
        privacy: "PUBLIC",
        likes_count: 89,
        comments_count: 21,
        created_at: "2026-02-03T07:00:00Z",
        deleted_at: null,
        user: {
            id: 8,
            username: "buivanl",
            profile: {
                first_name: "Văn I",
                last_name: "Bùi",
                avatar_url: "https://i.pravatar.cc/150?img=8",
            },
        },
        attachments: [],
    },
    {
        id: 109,
        user_id: 1,
        parent_id: null,
        content: "TypeScript tips: Luôn sử dụng strict mode để tránh bugs không đáng có! #coding #typescript",
        privacy: "PUBLIC",
        likes_count: 134,
        comments_count: 28,
        created_at: "2026-02-02T16:00:00Z",
        deleted_at: null,
        user: {
            id: 1,
            username: "nguyenvana",
            profile: {
                first_name: "Văn A",
                last_name: "Nguyễn",
                avatar_url: "https://i.pravatar.cc/150?img=1",
            },
        },
        attachments: [],
    },
    {
        id: 110,
        user_id: 4,
        parent_id: null,
        content: "Đã book vé đi Nhật Bản tháng sau! 🇯🇵 Ai có tips gì cho first-time traveler không ạ?",
        privacy: "PUBLIC",
        likes_count: 198,
        comments_count: 87,
        created_at: "2026-02-02T10:00:00Z",
        deleted_at: null,
        user: {
            id: 4,
            username: "phamthid",
            profile: {
                first_name: "Thị D",
                last_name: "Phạm",
                avatar_url: "https://i.pravatar.cc/150?img=4",
            },
        },
        attachments: [],
    },
];

/**
 * Search users by query
 */
export const searchUsers = (query: string): MockUser[] => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    return mockUsers.filter(user =>
        user.username.toLowerCase().includes(lowerQuery) ||
        user.firstName.toLowerCase().includes(lowerQuery) ||
        user.lastName.toLowerCase().includes(lowerQuery) ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(lowerQuery) ||
        `${user.lastName} ${user.firstName}`.toLowerCase().includes(lowerQuery) ||
        (user.bio && user.bio.toLowerCase().includes(lowerQuery))
    );
};

/**
 * Search posts by query
 */
export const searchPosts = (query: string): Post[] => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    return mockPosts.filter(post =>
        (post.content && post.content.toLowerCase().includes(lowerQuery)) ||
        post.user.username.toLowerCase().includes(lowerQuery) ||
        `${post.user.profile?.first_name || ''} ${post.user.profile?.last_name || ''}`.toLowerCase().includes(lowerQuery)
    );
};
