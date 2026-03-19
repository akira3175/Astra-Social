# 1. Phân hệ Xác thực & Người dùng (Auth & User Module)

## 1.1. Quy trình Đăng ký tài khoản (Register)
**Mô tả**: Người dùng tạo tài khoản mới.
**Input**: Username, Email, Password, First Name, Last Name.

### Luồng xử lý:
1. Hệ thống kiểm tra email hoặc username đã tồn tại trong bảng `Users` chưa.
2. Nếu chưa, mã hóa Password (BCrypt/Argon2).
3. Insert dữ liệu vào bảng `Users` (`is_active` = true, `is_verified` = false).
4. Tự động Insert 1 bản ghi vào bảng `Profiles` với `user_id` vừa tạo.
5. Sinh mã OTP ngẫu nhiên, Insert vào bảng `Auth_Tokens` (`type` = OTP_EMAIL).
6. Gửi email chứa OTP cho người dùng.

**Tables ảnh hưởng**: `users`, `profiles`, `auth_tokens`.

## 1.2. Quy trình Đăng nhập (Login)
**Mô tả**: Người dùng truy cập hệ thống bằng tài khoản đã tạo.
**Input**: Username/Email, Password.

### Luồng xử lý:
1. Tìm user trong bảng `Users` theo email/username.
2. So khớp mật khẩu hash.
3. Nếu đúng:
    - Cập nhật trường `last_login` = now() trong bảng `Users`.
    - Sinh Access Token (JWT - không lưu DB) và Refresh Token.
    - Lưu Refresh Token vào bảng `Auth_Tokens` (`type` = REFRESH).
    - Trả về Token và thông tin User cơ bản.

**Tables ảnh hưởng**: `users`, `auth_tokens`.

## 1.3. Quy trình Lấy thông tin người dùng hiện tại (Get Current User / Me)
**Mô tả**: Lấy thông tin chi tiết của user đang đăng nhập.
**Input**: Bearer Token (Header).

### Luồng xử lý:
1. Middleware giải mã Token (JWT) để lấy `user_id`.
2. Truy vấn bảng `Users` kết hợp (Join) với bảng `Profiles`.
3. Trả về thông tin User (trừ password) và Profile tương ứng.

**Tables ảnh hưởng**: `users`, `profiles`.

## 1.4. Quy trình Quên mật khẩu (Forgot Password)
**Mô tả**: User yêu cầu đặt lại mật khẩu khi bị quên.
**Input**: Email.

### Luồng xử lý:
1.  **Yêu cầu mã (Request OTP)**:
    -   User nhập Email đăng ký.
    -   Kiểm tra Email có tồn tại trong hệ thống.
    -   Sinh mã OTP/Token, lưu vào bảng `Auth_Tokens` (`type` = OTP_PASS).
    -   Gửi Email chứa mã xác thực cho User.
2.  **Đặt lại mật khẩu (Reset Password)**:
    -   User nhập: Email, Mã xác thực (OTP), Mật khẩu mới.
    -   Kiểm tra OTP trong bảng `Auth_Tokens` (đúng Email, chưa hết hạn, chưa dùng).
    -   Mã hóa mật khẩu mới và Update vào bảng `Users`.
    -   Đánh dấu OTP là đã sử dụng (`is_used` = true).
    -   (Tùy chọn) Xóa các Refresh Token cũ để đăng xuất các phiên đăng nhập khác.

**Tables ảnh hưởng**: `users`, `auth_tokens`.
