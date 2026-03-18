<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đặt lại mật khẩu</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f7; padding: 40px 0;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 32px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">
                                AstraSocial
                            </h1>
                        </td>
                    </tr>
                    <!-- Body -->
                    <tr>
                        <td style="padding: 40px 32px;">
                            <h2 style="color: #1a1a2e; margin: 0 0 16px; font-size: 22px; font-weight: 700;">
                                Đặt lại mật khẩu
                            </h2>
                            <p style="color: #4a4a68; font-size: 15px; line-height: 1.7; margin: 0 0 28px;">
                                Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản liên kết với email <strong>{{ $email }}</strong>. Nhấn nút bên dưới để đặt lại mật khẩu của bạn:
                            </p>
                            <!-- Reset Button -->
                            <div style="text-align: center; margin: 0 0 28px;">
                                <a href="{{ $resetLink }}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 12px; font-size: 16px; font-weight: 700; letter-spacing: 0.5px;">
                                    Đặt lại mật khẩu
                                </a>
                            </div>
                            <p style="color: #4a4a68; font-size: 14px; line-height: 1.7; margin: 0 0 8px;">
                                ⏰ Link này sẽ hết hạn sau <strong>60 phút</strong>.
                            </p>
                            <p style="color: #9a9ab0; font-size: 13px; line-height: 1.6; margin: 0 0 20px;">
                                Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này. Mật khẩu của bạn sẽ không bị thay đổi.
                            </p>
                            <!-- Fallback link -->
                            <div style="background-color: #f8f8fc; border-radius: 8px; padding: 12px 16px;">
                                <p style="color: #9a9ab0; font-size: 12px; margin: 0 0 4px;">Nếu nút không hoạt động, copy link sau vào trình duyệt:</p>
                                <p style="color: #667eea; font-size: 12px; margin: 0; word-break: break-all;">{{ $resetLink }}</p>
                            </div>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f8fc; padding: 20px 32px; text-align: center; border-top: 1px solid #ececf1;">
                            <p style="color: #9a9ab0; font-size: 12px; margin: 0;">
                                © {{ date('Y') }} AstraSocial. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
