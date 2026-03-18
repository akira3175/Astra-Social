<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mã xác thực OTP</title>
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
                                Xin chào {{ $username }},
                            </h2>
                            <p style="color: #4a4a68; font-size: 15px; line-height: 1.7; margin: 0 0 28px;">
                                Bạn đã yêu cầu mã xác thực để đăng ký tài khoản trên AstraSocial. Vui lòng sử dụng mã OTP bên dưới:
                            </p>
                            <!-- OTP Code -->
                            <div style="text-align: center; margin: 0 0 28px;">
                                <div style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 16px 40px; border-radius: 12px;">
                                    <span style="color: #ffffff; font-size: 36px; font-weight: 800; letter-spacing: 10px; font-family: 'Courier New', monospace;">
                                        {{ $otp }}
                                    </span>
                                </div>
                            </div>
                            <p style="color: #4a4a68; font-size: 14px; line-height: 1.7; margin: 0 0 8px;">
                                ⏰ Mã này sẽ hết hạn sau <strong>10 phút</strong>.
                            </p>
                            <p style="color: #9a9ab0; font-size: 13px; line-height: 1.6; margin: 0;">
                                Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.
                            </p>
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
