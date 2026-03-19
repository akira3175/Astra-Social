# 4. Phân hệ Chat (Messaging Module)

## 4.1. Quy trình Gửi tin nhắn cá nhân (Private Chat)
**Mô tả**: A gửi tin nhắn cho B.

### Luồng xử lý:
1. Tìm hội thoại: Query bảng `Conversation_Members` để tìm `conversation_id` chung giữa A và B mà `type` = PRIVATE.
2. Nếu chưa có:
    - Tạo dòng mới trong `Conversations` (`type` = PRIVATE).
    - Insert 2 dòng vào `Conversation_Members` (cho A và B).
3. Lưu tin nhắn: Insert vào bảng `Messages`.
4. Update Metadata: Update `last_message_at` trong bảng `Conversations` (để đoạn chat này nhảy lên đầu danh sách).

**Tables ảnh hưởng**: `conversations`, `conversation_members`, `messages`.

## 4.2. Quy trình Tạo nhóm chat (Group Chat)
**Mô tả**: A tạo nhóm chat với B, C.

### Luồng xử lý:
1. Insert vào `Conversations` (`type` = GROUP, `name` = "Tên nhóm").
2. Insert 3 dòng vào `Conversation_Members`:
    - User A: `role` = ADMIN.
    - User B, C: `role` = MEMBER.
3. Insert tin nhắn hệ thống vào `Messages` ("A đã tạo nhóm").

**Tables ảnh hưởng**: `conversations`, `conversation_members`, `messages`.

## 4.3. Quy trình Đổi tên nhóm (Rename Group)
**Mô tả**: Admin hoặc thành viên (tùy quyền) đổi tên nhóm chat.

### Luồng xử lý:
1. Kiểm tra quyền của User trong bảng `Conversation_Members`.
2. Update trường `name` trong bảng `Conversations`.
3. Insert tin nhắn hệ thống vào `Messages` ("A đã đổi tên nhóm thành...").

**Tables ảnh hưởng**: `conversations`, `messages`.

## 4.4. Quy trình Rời nhóm (Leave Group)
**Mô tả**: Thành viên tự thoát khỏi nhóm.

### Luồng xử lý:
1. Xóa dòng tương ứng của User trong bảng `Conversation_Members`.
2. Insert tin nhắn hệ thống vào `Messages` ("A đã rời nhóm").
3. Nếu Admin rời nhóm:
    - Kiểm tra xem còn Admin nào khác không.
    - Nếu không, hệ thống tự động chỉ định một Member khác làm Admin (hoặc nhóm chả còn ai thì có thể xóa nhóm - tùy logic Business).

**Tables ảnh hưởng**: `conversation_members`, `messages`.

## 4.5. Quy trình Nhắn tin trong nhóm (Send Group Message)
**Mô tả**: Thành viên gửi tin nhắn vào nhóm.

### Luồng xử lý:
1. Kiểm tra User có phải là thành viên của nhóm không (trong bảng `Conversation_Members`).
2. Insert tin nhắn vào bảng `Messages` (`conversation_id` = ID nhóm).
3. Update `last_message_at` trong bảng `Conversations`.

**Tables ảnh hưởng**: `messages`, `conversations`.

## 4.6. Quy trình Thêm Admin nhóm (Add Group Admin)
**Mô tả**: Admin hiện tại chỉ định một thành viên khác làm Admin.

### Luồng xử lý:
1. Kiểm tra User thực hiện có phải là Admin của nhóm không (check `role` = ADMIN trong `Conversation_Members`).
2. Update dòng của User được chỉ định: set `role` = ADMIN.
3. Insert tin nhắn hệ thống vào `Messages` ("A đã chỉ định B làm quản trị viên").

**Tables ảnh hưởng**: `conversation_members`, `messages`.

## 4.7. Quy trình Xóa thành viên (Remove Group Member)
**Mô tả**: Admin xóa một thành viên ra khỏi nhóm.

### Luồng xử lý:
1. Kiểm tra User thực hiện có phải là Admin của nhóm không.
2. Kiểm tra User bị xóa có phải là Admin không (nếu logic yêu cầu không được xóa Admin cùng cấp).
3. Xóa dòng tương ứng của User bị xóa trong bảng `Conversation_Members`.
4. Insert tin nhắn hệ thống vào `Messages` ("A đã xóa B khỏi nhóm").

**Tables ảnh hưởng**: `conversation_members`, `messages`.
