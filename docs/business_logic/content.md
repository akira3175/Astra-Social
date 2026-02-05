# 3. Phân hệ Nội dung (Content Module)

## 3.1. Quy trình Đăng bài viết mới (Create Post)
**Mô tả**: User đăng bài gồm Text, Ảnh và Hashtag.
**Input**: User ID, Content, Privacy, List Images (Files), List Hashtags (String).

### Luồng xử lý:
1. Lưu bài viết: Insert vào bảng `Posts`. Lấy được `post_id`.
2. Xử lý Hashtag: Với mỗi hashtag trong nội dung (VD: #Java):
    - Kiểm tra bảng `Hashtags`, nếu chưa có thì Insert, nếu có thì tăng `usage_count`.
    - Insert vào bảng `Post_Hashtags` (`post_id`, `hashtag_id`).
3. Xử lý Ảnh/Video: Upload file lên Cloud (S3/MinIO), lấy URL.
    - Insert vào bảng `Media_Attachments`: `entity_type` = POST, `entity_id` = `post_id`, `url` = ...
4. Thông báo: Nếu Privacy = Public/Friends, tìm list bạn bè từ bảng `Friendships` và tạo `Notifications` cho họ (Job chạy ngầm - Background Worker).

**Tables ảnh hưởng**: `posts`, `hashtags`, `post_hashtags`, `media_attachments`, `notifications`.

## 3.2. Quy trình Thả cảm xúc (Reaction)
**Mô tả**: User A thả tim bài viết/comment của B.

### Luồng xử lý:
1. Kiểm tra bảng `Reactions`:
    - Nếu đã tồn tại (`user_id`, `entity_id`, `entity_type`): Update lại type mới (VD: Like -> Love) hoặc Xóa (Unlike).
    - Nếu chưa tồn tại: Insert dòng mới.
2. Cập nhật Cache Count: Update bảng `Posts` (cộng/trừ 1 vào `likes_count`).
3. Thông báo: Insert `Notifications` cho chủ bài viết (User B) với `type` = LIKE.

**Tables ảnh hưởng**: `reactions`, `posts`, `notifications`.

## 3.3. Quy trình Bình luận & Trả lời bình luận (Comment & Reply)
**Mô tả**: User A bình luận vào bài của B hoặc trả lời bình luận của C.

### Luồng xử lý:
1. Insert vào bảng `Comments`:
    - Nếu là bình luận gốc: `parent_id` = NULL.
    - Nếu là trả lời (Reply): `parent_id` = ID của bình luận cha.
2. Nếu có ảnh đính kèm, Insert thêm vào `Media_Attachments` (`entity_type` = COMMENT).
3. Cập nhật Cache Count: Tăng `comments_count` trong bảng `Posts`.
4. Thông báo:
    - Nếu comment vào bài: Notify chủ bài viết.
    - Nếu reply comment: Notify người viết comment cha (và cả chủ bài viết nếu cần).

**Tables ảnh hưởng**: `comments`, `media_attachments`, `posts`, `notifications`.

## 3.4. Quy trình Tìm kiếm (Search)
**Mô tả**: Tìm kiếm User, Post, Hashtag theo từ khóa.

### Luồng xử lý:
1. **Tìm kiếm User**:
    - Query bảng `Users` joining `Profiles`.
    - Điều kiện: `username` LIKE %key% OR `first_name` + `last_name` LIKE %key%.
2. **Tìm kiếm Post**:
    - Query bảng `Posts`.
    - Điều kiện: `content` LIKE %key% AND (`privacy` = PUBLIC OR (`privacy` = FRIENDS AND là bạn bè)).
3. **Tìm kiếm Hashtag**:
    - Query bảng `Hashtags`.
    - Điều kiện: `name` LIKE %key%.
    - Sắp xếp theo `usage_count` giảm dần (phổ biến nhất lên đầu).

**Tables ảnh hưởng**: `users`, `profiles`, `posts`, `hashtags`.

## 3.5. Thuật toán Đề xuất Hatahg (Hashtag Recommendation)
**Mô tả**: Gợi ý Hashtag cho User khi đăng bài hoặc xem Trending.

### Logic thuật toán:
1. **Trending Global (Top phổ biến)**:
    - Query Top 10 hashtags từ bảng `Hashtags` có `usage_count` cao nhất trong 24h/7 ngày qua (nếu có log lịch sử) hoặc tổng `usage_count`.
2. **Contextual (Theo ngữ cảnh)**:
    - Nếu User đang gõ nội dung post, gợi ý hashtag khớp với từ đang gõ.
3. **Personalized (Cá nhân hóa - Nâng cao)**:
    - Gợi ý hashtag mà bạn bè hay dùng.
    - Gợi ý hashtag User đã từng dùng nhiều trong quá khứ.

**Ưu tiên hiển thị**: Trending > Khớp từ khóa.
