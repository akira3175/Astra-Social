# 5. Phân hệ Hệ thống & Báo cáo (System & Admin Module)

## 5.1. Quy trình Báo cáo vi phạm (Report)
**Mô tả**: User báo cáo một bài viết xấu.

### Luồng xử lý:
1. Insert vào bảng `Reports`:
    - `reporter_id` = User đang báo cáo.
    - `target_type` = POST.
    - `target_id` = ID bài viết.
    - `reason` = "Nội dung phản động/spam...".
    - `status` = PENDING.

**Tables ảnh hưởng**: `reports`.

## 5.2. Quy trình Xử lý báo cáo (Admin Action)
**Mô tả**: Admin xem báo cáo và xóa bài.

### Luồng xử lý:
1. Admin gọi API duyệt Report.
2. Update bảng `Reports`: `status` = RESOLVED, `resolved_by` = Admin ID.
3. Thực hiện hành động: Update cột `deleted_at` trong bảng `Posts` (Soft delete).
4. Gửi `Notifications` cho người bị báo cáo ("Bài viết của bạn đã bị gỡ...").

**Tables ảnh hưởng**: `reports`, `posts`, `notifications`.

## 5.3. Cơ chế Phân quyền & Vai trò mặc định (Dynamic RBAC)
**Mô tả**: Hệ thống hỗ trợ phân quyền động, cho phép tạo mới/chỉnh sửa vai trò và quyền hạn.

### Các vai trò mặc định (Default Roles):
1.  **DEV (Developer)**: Có toàn quyền hệ thống (Super Admin). Luôn truy cập được mọi tính năng.
2.  **ADMIN**: Quản lý toàn bộ người dùng, bài đăng, và cấu hình hệ thống (trừ các quyền chuyên sâu của Dev).
3.  **MOD (Moderator)**: Kiểm duyệt nội dung (xử lý báo cáo, xóa bài vi phạm).
4.  **USER**: Người dùng thông thường, không có quyền truy cập Dashboard quản trị.

### Điều kiện truy cập Dashboard:
-   User phải có ít nhất **1 quyền quản trị** (hoặc thuộc nhóm Dev/Admin/Mod) để đăng nhập vào trang Admin Dashboard.
-   Giao diện Dashboard chỉ hiển thị các module mà User đó có quyền truy cập.

## 5.4. Quy trình Quản lý Người dùng (User Management)
**Mô tả**: Admin thực hiện CRUD trên danh sách người dùng.

### Luồng xử lý:
1.  **Xem danh sách (Read)**: Hiển thị list Users, filter theo Role, Status.
2.  **Khóa/Mở khóa (Update Status)**:
    -   Admin chọn User -> Ban/Unban.
    -   Update trường `is_active` trong bảng `Users`.
3.  **Gán vai trò (Assign Role)**:
    -   Admin đổi Role cho User (VD: User -> Mod).
    -   Update trường `role_id` trong bảng `Users`.

**Tables ảnh hưởng**: `users`, `roles`.

## 5.5. Quy trình Quản lý Bài đăng (Post Management)
**Mô tả**: Admin/Mod xem và xóa bài viết vi phạm (ngoài luồng Report).

### Luồng xử lý:
1.  **Xem danh sách (Read)**: Hiển thị list Posts (bao gồm cả công khai và riêng tư - tùy policy).
2.  **Xóa bài (Delete)**:
    -   Admin chọn Post -> Xóa.
    -   Soft delete: Update `deleted_at` = now().
3.  **Khôi phục (Restore)**: Update `deleted_at` = null.

**Tables ảnh hưởng**: `posts`.

## 5.6. Quy trình Quản lý Quyền chi tiết (Role & Permission Management)
**Mô tả**: Dev/Admin cấu hình các Role và Permission động.

### Luồng xử lý:
1.  **Tạo Vai trò mới (Create Role)**:
    -   Insert vào bảng `Roles` (VD: "Content Writer").
2.  **Gán quyền cho Vai trò (Update Permissions)**:
    -   Chọn Role.
    -   Chọn danh sách Permissions (từ bảng `Permissions`).
    -   Update bảng trung gian `Role_Permissions` (Xóa cũ, Insert mới).
3.  **Xóa Vai trò (Delete Role)**:
    -   Kiểm tra có User nào đang giữ Role này không. Nếu có -> Báo lỗi hoặc yêu cầu chuyển User sang Role khác.
    -   Xóa bản ghi trong `Roles` và `Role_Permissions`.

**Tables ảnh hưởng**: `roles`, `permissions`, `role_permissions`.

## 5.7. Quy trình Kiểm tra quyền (Check Permission - Middleware)
**Mô tả**: Hệ thống kiểm tra User có được phép làm hành động X không.

### Luồng xử lý:
1.  Nếu là **DEV**: Auto Pass (Bỏ qua check).
2.  Lấy `role_id` từ bảng `Users`.
3.  Join bảng `Role_Permissions` và `Permissions`.
4.  Kiểm tra xem User có quyền cụ thể (ví dụ: `user.ban`, `post.delete`) hay không.
5.  Nếu không có quyền -> Trả về 403 Forbidden.

**Tables ảnh hưởng**: `users`, `roles`, `permissions`, `role_permissions`.
