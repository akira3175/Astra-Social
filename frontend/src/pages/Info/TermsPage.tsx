import React from "react";
import "./InfoPages.css";

const TermsPage: React.FC = () => {
    return (
        <div className="info-page-container">
            <div className="info-content-card">
                <div className="info-header">
                    <h1>Điều khoản Dịch vụ</h1>
                    <p>Các quy định và thỏa thuận khi bạn sử dụng Astra Social.</p>
                </div>

                <div className="info-body">
                    <h2>1. Chấp nhận các điều khoản</h2>
                    <p>
                        Bằng việc truy cập hoặc sử dụng ứng dụng <strong>Astra Social</strong>, bạn đồng ý bị ràng buộc bởi các Điều khoản Dịch vụ này. Nếu bạn không đồng ý với bất kỳ phần nào của điều khoản, bạn không được phép tiếp tục sử dụng dịch vụ của chúng tôi.
                    </p>

                    <h2>2. Thay đổi điều khoản</h2>
                    <p>
                        Chúng tôi có toàn quyền sửa đổi hoặc thay thế các Điều khoản này bất kỳ lúc nào. Nếu nội dung sửa đổi là quan trọng, chúng tôi sẽ cố gắng thông báo ít nhất 30 ngày trước khi bất kỳ điều khoản mới nào có hiệu lực.
                    </p>

                    <h2>3. Trách nhiệm người dùng</h2>
                    <p>Khi sử dụng nền tảng của chúng tôi, bạn cam kết rằng:</p>
                    <ul>
                        <li>Mọi thông tin bạn cung cấp khi đăng ký phải chính xác, đầy đủ và được cập nhật thường xuyên.</li>
                        <li>Bạn có trách nhiệm bảo vệ tài khoản và mật khẩu của mình một cách an toàn nhất.</li>
                        <li>Bạn không được sử dụng Astra Social vào bất kỳ mục đích bất hợp pháp hay trái quy định pháp luật nào.</li>
                        <li>Nội dung mà bạn đăng tải không được chứa hình ảnh phản cảm, bạo lực, vi phạm bản quyền hay ngôn từ thù ghét.</li>
                    </ul>

                    <h2>4. Quyền sở hữu trí tuệ</h2>
                    <p>
                        Dịch vụ này, bao gồm toàn bộ thiết kế, mã nguồn gốc và các tính năng, tài sản độc quyền (không bao gồm Nội dung do người dùng tạo) đều thuộc quyền sở hữu của Astra Social và được bảo vệ bởi luật bản quyền.
                    </p>
                    <p>
                        Bạn vẫn giữ mọi bản quyền đối với Nội dung bạn xuất bản trên Astra Social, nhưng bạn cấp cho chúng tôi giấy phép phân phối, sao chép và hiển thị nội dung đó trên toàn hệ thống mạng xã hội của chúng tôi.
                    </p>

                    <h2>5. Chấm dứt dịch vụ</h2>
                    <p>
                        Chúng tôi có quyền chấm dứt hoặc đình chỉ quyền truy cập vào tài khoản của bạn ngay lập tức, mà không cần thông báo trước hay chịu bất kỳ trách nhiệm pháp lý nào đối với bạn, vì bất kỳ lý do gì, đặc biệt là nếu bạn vi phạm Điều khoản Dịch vụ này.
                    </p>

                    <h2>6. Trách nhiệm pháp lý</h2>
                    <p>
                        Astra Social không chịu bất kì thiệt hại gián tiếp, thiệt hại ngẫu nhiên, hoặc bất kỳ tổn thất lợi nhuận và dữ liệu nào gây ra bởi việc bạn sử dụng dịch vụ của chúng tôi ngoài tầm kiểm soát kĩ thuật hợp lý.
                    </p>

                    <h2>7. Liên hệ</h2>
                    <p>
                        Nếu có thắc mắc liên quan tới Điều khoản dịch vụ này, vui lòng gửi email cho chúng tôi qua <a href="mailto:legal@astrasocial.com">legal@astrasocial.com</a>.
                    </p>
                </div>
                
                <div className="info-footer">
                    Bản cập nhật cuối cùng: Tháng 3, 2026
                </div>
            </div>
        </div>
    );
};

export default TermsPage;
