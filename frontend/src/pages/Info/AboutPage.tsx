import React from "react";
import "./InfoPages.css";

const AboutPage: React.FC = () => {
    return (
        <div className="info-page-container">
            <div className="info-content-card">
                <div className="info-header">
                    <h1>Giới thiệu về Astra Social</h1>
                    <p>Khám phá không gian kết nối mới chia sẻ khoảnh khắc, kết bạn bốn phương.</p>
                </div>

                <div className="info-body">
                    <h2>Sứ mệnh của chúng tôi</h2>
                    <p>
                        Tại <strong>Astra Social</strong>, sứ mệnh của chúng tôi là mang mọi người lại gần nhau hơn trong một không gian mạng xã hội trực tuyến tích cực, an toàn và tràn đầy cảm hứng. Chúng tôi tin rằng công nghệ nên phục vụ cho việc kết nối thực sự, giúp mọi người dễ dàng chia sẻ những câu chuyện, hình ảnh và video ý nghĩa mỗi ngày.
                    </p>

                    <h2>Tầm nhìn</h2>
                    <p>
                        Astra Social hướng tới việc trở thành một nền tảng mạng xã hội hiện đại, nơi mọi tính năng đều được tối ưu cho trải nghiệm người dùng mượt mà nhất. Chúng tôi không chỉ xây dựng một ứng dụng, mà còn tạo ra một <strong>cộng đồng</strong> - nơi sự tôn trọng và sáng tạo được đặt lên hàng đầu.
                    </p>

                    <h2>Giá trị cốt lõi</h2>
                    <ul>
                        <li><strong>Kết nối chân thực:</strong> Khuyến khích sự tương tác sâu sắc thay vì chỉ những cái lướt qua.</li>
                        <li><strong>Bảo mật riêng tư:</strong> Luôn đặt quyền lợi và thông tin cá nhân của người dùng vào hàng bảo mật cao nhất.</li>
                        <li><strong>Cải tiến không ngừng:</strong> Đội ngũ Astra luôn lắng nghe ý kiến cộng đồng để mang tới các bản cập nhật ngày một tốt hơn.</li>
                        <li><strong>Giao diện thân thiện:</strong> Thiết kế cao cấp, mượt mà và tập trung vào nội dung của chính bạn.</li>
                    </ul>

                    <h2>Liên hệ với chúng tôi</h2>
                    <p>
                        Nếu bạn có bất kỳ câu hỏi, góp ý hay vấn đề cần hỗ trợ, đừng ngần ngại liên hệ với đội ngũ Astra Social thông qua địa chỉ email: <a href="mailto:support@astrasocial.com">support@astrasocial.com</a>. Chúng tôi luôn sẵn sàng lắng nghe!
                    </p>
                </div>

                <div className="info-footer">
                    &copy; {new Date().getFullYear()} Astra Social. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
