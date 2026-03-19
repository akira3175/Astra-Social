# 2. Phân hệ Mạng xã hội (Social Graph Module)

## 2.1. Quy trình Gửi lời mời kết bạn (Send Friend Request)
**Mô tả**: User A gửi lời mời cho User B.

### Luồng xử lý:
1. Kiểm tra bảng `Friendships` xem đã tồn tại quan hệ giữa A và B chưa.
2. Nếu chưa, Insert vào `Friendships`:
    - `requester_id` = A, `receiver_id` = B.
    - `status` = PENDING.
3. Tạo thông báo: Insert vào bảng `Notifications` (`receiver_id` = B, `type` = FRIEND_REQ).

**Tables ảnh hưởng**: `friendships`, `notifications`.

## 2.2. Quy trình Chấp nhận kết bạn (Accept Friend Request)
**Mô tả**: User B đồng ý lời mời của A.

### Luồng xử lý:
1. Update bảng `Friendships` tại dòng tương ứng:
    - `status` = ACCEPTED.
    - `accepted_at` = now().
2. Tạo thông báo gửi lại cho A: Insert `Notifications` (`receiver_id` = A, `type` = SYSTEM, content="B đã chấp nhận lời mời...").
3. (Tùy chọn) Tự động Follow chéo nhau: Insert 2 dòng vào bảng `Follows`.

**Tables ảnh hưởng**: `friendships`, `notifications`, `follows`.

## 2.3. Quy trình Từ chối kết bạn / Hủy kết bạn (Decline / Unfriend)
**Mô tả**: User A từ chối lời mời của B hoặc hủy kết bạn với B.

### Luồng xử lý:
1. Xóa bản ghi trong bảng `Friendships` liên quan đến A và B.
2. Xóa bản ghi trong bảng `Follows` (nếu có) giữa 2 người cho cả 2 chiều (A follow B và B follow A).

**Tables ảnh hưởng**: `friendships`, `follows`.

## 2.4. Quy trình Chặn người dùng (Block User)
**Mô tả**: User A chặn User B.

### Luồng xử lý:
1. Kiểm tra/Tạo bản ghi trong `Friendships`:
    - Nếu chưa có: Insert mới (`requester_id` = A, `receiver_id` = B, `status` = BLOCKED).
    - Nếu đã có: Update dòng hiện tại thành `status` = BLOCKED. Đảm bảo `requester_id` là A (người thực hiện chặn).
2. Xóa toàn bộ quan hệ `Follows` giữa 2 người.

**Tables ảnh hưởng**: `friendships`, `follows`.

## 2.5. Quy trình Gỡ chặn (Unblock User)
**Mô tả**: User A bỏ chặn User B.

### Luồng xử lý:
1. Tìm bản ghi trong `Friendships` có `requester_id` = A, `receiver_id` = B và `status` = BLOCKED.
2. Xóa bản ghi đó (hoặc chuyển trạng thái, nhưng xóa sạch sẽ hơn cho việc reset quan hệ).

**Tables ảnh hưởng**: `friendships`.
