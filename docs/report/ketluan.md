# KẾT LUẬN & HƯỚNG PHÁT TRIỂN

## 1. Kết quả đạt được
Sau thời gian nghiên cứu, phân tích và triển khai, nhóm đã xây dựng thành công mạng xã hội **Astra Social** đáp ứng được các mục tiêu ban đầu đề ra:

**Về mặt Chức năng (Functional):**
- **Dành cho Người dùng (End-user):** Hoàn thiện phân hệ đăng ký, đăng nhập an toàn với JWT token. Người dùng có thể cập nhật thông tin cá nhân trơn tru. Tính năng cốt lõi là **Feed** hoạt động ổn định với cơ chế tải dữ liệu tự động theo chiều sâu (Infinite Scroll) không gây giật lag. Hoàn thiện việc đăng Status kèm ảnh, kết hợp cơ chế quét tự động chuỗi văn bản để tạo ra **Hashtag** hỗ trợ việc phân loại xu hướng. Các tính năng tương tác như Thích, Bình luận, Kết bạn và **Nhắn tin Thời gian thực (Chat)** đều phản hồi nhanh chóng, kèm hệ thống **Thông báo** đầy đủ thông tin cần thiết.
- **Dành cho Quản trị viên (Admin):** Xây dựng trang Dashboard tách biệt, quản lý danh sách người dùng, theo dõi và xử lý triệt để các bài viết vi phạm được Report.

**Về mặt Công nghệ và Hiệu năng (Non-functional):**
- Vận hành mượt mà kiến trúc API-first phân tách Backend (PHP/Laravel) và Frontend (React/Vite).
- Giao diện (UI/UX) đạt tính thẩm mỹ cao, tốc độ phản hồi tối ưu (Sử dụng Optimistic UI Updates khi thả tim để không phải chờ Server trả kết quả).
- Cấu trúc Database có chuẩn hóa cao, liên kết chặt chẽ hỗ trợ truy vấn phức tạp kết hợp xóa mềm (Soft delete) cẩn thận.

## 2. Hạn chế còn tồn đọng
Dù dự án đã đi vào hoạt động trơn tru với các tính năng cơ bản, Astra Social vẫn còn một số điểm giới hạn:
- **Xử lý Real-time (Thời gian thực) ở một số module:** Hệ thống Chat và Thông báo đã hoạt động ổn ở Backend, nhưng Frontend đôi điểm vẫn cần F5 trang hoặc tự gọi lại định kỳ (Polling) thay vì mở kết nối Websocket thuần túy như Socket.io hay Pusher, khiến trải nghiệm Chat tại một thời điểm chưa tối đa hóa độ "tức thời".
- **Giao diện đa thiết bị:** Dù đã Responsive trên màn hình điện thoại, tuy nhiên một số thành phần bảng Admin hiển thị chưa triệt để trên màn hình có kích thước quá nhỏ.
- **Khả năng chiụ tải (Load Testing):** Chưa có kịch bản giả lập lưu lượng lớn người dùng cùng đăng một lúc để đo độ trễ truy xuất CSDL của Database, nhất là bảng Messages phải gánh tải nặng nề khi phát sinh Group Chat.
- **Hệ thống lọc ngôn ngữ nhạy cảm:** Chưa tích hợp AI để tự động phát hiện trước hình ảnh và từ ngữ độc hại trong các bài đăng, phụ thuộc hoàn toàn vào chức năng Report thủ công từ User.

## 3. Hướng phát triển trong tương lai
Dựa trên những hạn chế và tiềm năng mở rộng không ngừng của cộng đồng mạng xã hội, dự án vạch ra lộ trình phát triển:
1. **Tích hợp WebSockets / Laravel Reverb:** Đồng bộ hóa 100% ứng dụng (Chat, Notification, Lượt xem bài viết, Trạng thái Online) một cách tức thời nhờ công nghệ truyền WebSockets mà không cần tải lại luồng.
2. **Nâng cấp Đa phương tiện:** Tích hợp gọi Video trực tuyến (WebRTC) trên hệ thống Chat, và tính năng Phát Trực Tiếp (Livestream) lên News Feed.
3. **Thuật toán Đề xuất Bài viết:** Cải tiến lại truy vấn hiện tại để ngoài việc lấy bài của người theo dõi/bạn bè, hệ thống tự đề xuất (AI Suggestion) dựa theo các thẻ Hashtag và nội dung User hay tương tác và dừng lại xem nhiều nhất (Time spent on screen).
4. **Auto-translate và AI Moderation:** Kích hoạt tính năng Dịch thông minh tự động đa ngôn ngữ, và áp dụng mô hình phân loại để tự động chặn các hình ảnh nhạy cảm khi tải lên nội dung mới.
5. **Đóng gói và Triển khai (CI/CD):** Đóng gói toàn bộ sản phẩm bằng Docker thay vì thiết lập môi trường bằng tay, triển khai hệ thống lên nền tảng AWS/Digital Ocean gắn SSL chuyên nghiệp.
