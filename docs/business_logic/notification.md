# 6. Phân hệ Thông báo (Notification Module)

## 6.1. Tổng quan các loại thông báo
Hệ thống hỗ trợ các loại thông báo sau:
-   **LIKE**: Khi có người thả cảm xúc vào bài viết hoặc bình luận.
-   **COMMENT**: Khi có người bình luận vào bài viết.
-   **REPLY**: Khi có người trả lời bình luận.
-   **FRIEND_REQ**: Khi có lời mời kết bạn.
-   **FRIEND_ACCEPT**: Khi lời mời kết bạn được chấp nhận.
-   **SYSTEM**: Thông báo từ hệ thống (bảo trì, chào mừng, cảnh báo vi phạm).

## 6.2. Quy trình Thông báo Tương tác (Like/Reaction)
**Mô tả**: User A thả tim bài viết hoặc bình luận của User B.

### Luồng xử lý:
1.  **Kiểm tra trùng lặp**:
    -   Kiểm tra xem User A đã từng thả tim vào đối tượng này chưa.
    -   Nếu đã có thông báo chưa đọc (`is_read` = false) từ A về hành động này -> Không tạo mới (debounce).
2.  **Tạo thông báo**:
    -   `receiver_id`: User B (Chủ sở hữu bài viết/comment).
    -   `actor_id`: User A.
    -   `entity_type`: POST (hoặc COMMENT).
    -   `entity_id`: ID của bài viết/comment.
    -   `message`: "User A đã thả cảm xúc vào bài viết của bạn."
3.  **Real-time Push**: Bắn socket event tới User B.

## 6.3. Quy trình Thông báo Bình luận (Comment & Reply)
**Mô tả**: User A bình luận vào bài của B, hoặc trả lời comment của C.

### Luồng xử lý:
1.  **Trường hợp Comment vào Post**:
    -   Kiểm tra `user_id` của Post (User B).
    -   Nếu A != B -> Tạo thông báo cho B.
    -   `entity_type`: POST.
    -   `message`: "User A đã bình luận về bài viết của bạn."
2.  **Trường hợp Reply Comment**:
    -   Kiểm tra `user_id` của Comment cha (User C).
    -   Nếu A != C -> Tạo thông báo cho C.
    -   (Tùy chọn) Notify cả chủ bài viết (User B) nếu B != C và B != A.
    -   `entity_type`: COMMENT (hoặc POST tùy thiết kế FE link vào đâu).
    -   `message`: "User A đã trả lời bình luận của bạn."

## 6.4. Cơ chế Gom nhóm Thông báo (Aggregation)
**Mô tả**: Khi một bài viết quá "hot", tránh spam thông báo cho user (VD: 100 người like).

### Luồng xử lý:
1.  Khi tạo thông báo mới, kiểm tra `receiver_id` và `entity_id` (cùng 1 bài viết).
2.  Nếu tồn tại thông báo cũ chưa đọc (`is_read` = false, `type` = LIKE):
    -   Không insert dòng mới.
    -   Update `message`: "User A và 99 người khác đã thích bài viết của bạn."
    -   Update `created_at` = now() để đẩy lên đầu.
3.  Nếu không có -> Insert mới.

**Tables ảnh hưởng**: `notifications`.
