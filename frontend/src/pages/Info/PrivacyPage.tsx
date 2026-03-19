import React from "react";
import "./InfoPages.css";

const PrivacyPage: React.FC = () => {
    return (
        <div className="info-page-container">
            <div className="info-content-card">
                <div className="info-header">
                    <h1>Chính sách Quyền riêng tư</h1>
                    <p>Khám phá cách Astra Social thu thập và bảo vệ thông tin cá nhân của bạn.</p>
                </div>

                <div className="info-body">
                    <h2>Mở đầu</h2>
                    <p>
                        Astra Social coi trọng sự riêng tư của bạn. Chính sách này mô tả cách chúng tôi thu thập, sử dụng, lưu trữ và chia sẻ thông tin mà bạn cung cấp khi sử dụng dịch vụ thông qua ứng dụng và trang web của chúng tôi.
                    </p>

                    <h2>1. Thông tin chúng tôi thu thập</h2>
                    <ul>
                        <li><strong>Thông tin bạn cung cấp:</strong> Tên, địa chỉ email, ảnh đại diện, tiểu sử, ngày sinh, và các thông tin cá nhân khác trong hồ sơ tài khoản.</li>
                        <li><strong>Nội dung:</strong> Tất cả bài viết, hình ảnh, bình luận, tin nhắn, và nội dung mà bạn đăng tải trên Astra Social.</li>
                        <li><strong>Dữ liệu tự động:</strong> Địa chỉ IP, loại thiết bị, hệ điều hành, thời gian sử dụng, trình duyệt và thông tin cấu hình qua Cookie.</li>
                        <li><strong>Dữ liệu vị trí:</strong> Với sự cho phép từ bạn, chúng tôi thu thập tọa độ địa lý để đề xuất khu vực, POI và bản đồ.</li>
                    </ul>

                    <h2>2. Cách thức chúng tôi sử dụng thông tin</h2>
                    <ul>
                        <li>Cung cấp và duy trì các tính năng xã hội cốt lõi, từ việc hiển thị bảng tin cho đến kết bạn, nhắn tin thời gian thực.</li>
                        <li>Cải thiện ứng dụng, nghiên cứu trải nghiệm nhằm thiết kế những thay đổi tốt nhất cho nền tảng.</li>
                        <li>Thông báo qua Email để gửi nhắc nhở, bảo mật tài khoản (OTP) và lấy lại mật khẩu.</li>
                        <li>Đảm bảo an toàn cộng đồng bằng thuật toán phát hiện và ngăn chặn nội dung sai phép, quấy rối, thu thập dữ liệu bất minh.</li>
                    </ul>

                    <h2>3. Chia sẻ dữ liệu</h2>
                    <p>
                        Chúng tôi <strong>không bán</strong> dữ liệu cá nhân của bạn cho bất kỳ bên thứ ba nào. Thông tin có thể được chia sẻ cho:
                    </p>
                    <ul>
                        <li><strong>Tổ chức cung cấp dịch vụ:</strong> Máy chủ lưu trữ đám mây, dịch vụ gửi email, dịch vụ phân tích hệ thống.</li>
                        <li><strong>Cơ quan pháp luật:</strong> Nếu có yêu cầu chính đáng để điều tra và xử lý theo khuôn khổ pháp luật nhà nước.</li>
                        <li><strong>Người dùng khác:</strong> Dựa trên quyền riêng tư do bạn tùy chỉnh cho từng bài viết và thông tin trên trang cá nhân.</li>
                    </ul>

                    <h2>4. Lưu trữ dữ liệu</h2>
                    <p>
                        Thông tin tài khoản của bạn trên máy chủ Astra Social được lưu giữ trọn đời cho tới khi bạn có thao tác tự xóa hoặc liên hệ quản trị viên xóa vĩnh viễn dữ liệu. Các nội dung xóa tạm thời sẽ vào thùng rác 30 ngày trước khi bị hủy hoàn toàn.
                    </p>

                    <h2>5. Quyền của bạn</h2>
                    <p>
                        Bạn có quyền xem lại, bổ sung, điều chỉnh thông tin cá nhân của mình từ trang "Cài đặt & Hồ sơ". Bạn hoàn toàn toàn quyền từ chối cung cấp dữ liệu ảnh, video, email (kéo theo việc ngừng các tính năng tương ứng).
                    </p>

                    <h2>6. Trẻ em dưới 13 tuổi</h2>
                    <p>
                        Ứng dụng không hướng đến người dùng dưới hạn mức nhỏ tủi. Chúng tôi không cố ý thu thập thông tin cá nhân của trẻ em. Bất kỳ tài khoản chưa đủ 13 tuổi sẽ tự động bị đình chỉ nếu vi phạm tiêu chuẩn thiết lập.
                    </p>
                </div>

                <div className="info-footer">
                    Chính sách có hiệu lực từ: Tháng 3, 2026
                </div>
            </div>
        </div>
    );
};

export default PrivacyPage;
