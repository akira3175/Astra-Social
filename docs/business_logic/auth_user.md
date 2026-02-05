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
