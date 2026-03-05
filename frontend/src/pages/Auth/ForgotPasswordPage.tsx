import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../services/authService";
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    WarningIcon,
} from "../../components/ui";
import logo from "../../assets/logo.png";
import "./ForgotPasswordPage.css";

type AxiosErrorResponse = {
    response?: {
        data?: {
            message?: string;
            errors?: Record<string, string[]>;
        };
    };
};

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await forgotPassword({ email });
            setIsSent(true);
        } catch (err: unknown) {
            const axiosErr = err as AxiosErrorResponse;
            const serverErrors = axiosErr?.response?.data?.errors;
            if (serverErrors) {
                const firstError = Object.values(serverErrors)[0]?.[0];
                setError(firstError || "Đã có lỗi xảy ra!");
            } else {
                setError(axiosErr?.response?.data?.message || "Đã có lỗi xảy ra! Vui lòng thử lại.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box className="forgot-password-container">
            <Box className="forgot-password-wrapper">
                {/* Left side - Branding */}
                <Box className="forgot-password-branding">
                    <Typography variant="h1" className="forgot-password-branding-title">
                        AstraSocial
                    </Typography>
                    <Box className="logo-container">
                        <img src={logo} alt="AstraSocial Logo" />
                    </Box>
                    <Typography variant="body1" className="forgot-password-branding-text">
                        Kết nối với bạn bè và thế giới xung quanh trên AstraSocial.
                    </Typography>
                </Box>

                {/* Right side - Forgot Password Form */}
                <Card elevation={3} style={{ maxWidth: 420, width: "100%" }}>
                    <CardContent>
                        <Box className="forgot-password-header">
                            <Typography variant="h4">Quên mật khẩu</Typography>
                            <Typography variant="h5" className="forgot-password-header-brand">
                                AstraSocial
                            </Typography>
                        </Box>

                        {isSent ? (
                            /* Success state */
                            <Box className="forgot-password-success">
                                <div className="success-icon">✉</div>
                                <Typography className="success-title">
                                    Đã gửi email!
                                </Typography>
                                <Typography className="success-message">
                                    Link đặt lại mật khẩu đã được gửi đến{" "}
                                    <span className="success-email">{email}</span>.
                                    Vui lòng kiểm tra hộp thư (và thư rác) của bạn.
                                </Typography>
                                <Button
                                    fullWidth
                                    onClick={() => navigate("/login")}
                                >
                                    Quay lại đăng nhập
                                </Button>
                            </Box>
                        ) : (
                            /* Form state */
                            <form className="forgot-password-form" onSubmit={handleSubmit}>
                                <Typography className="forgot-password-description">
                                    Nhập email đã đăng ký tài khoản. Chúng tôi sẽ gửi link đặt lại mật khẩu đến email của bạn.
                                </Typography>

                                {error && (
                                    <Box className="forgot-password-error">
                                        <WarningIcon size={18} />
                                        {error}
                                    </Box>
                                )}

                                <TextField
                                    id="forgot-email"
                                    type="email"
                                    label="Email"
                                    placeholder="Nhập email của bạn"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    fullWidth
                                    autoComplete="email"
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    loading={isLoading}
                                >
                                    Gửi link đặt lại mật khẩu
                                </Button>

                                <Box className="forgot-password-back-link">
                                    Nhớ mật khẩu rồi?
                                    <a href="/login" onClick={(e) => { e.preventDefault(); navigate("/login"); }}>
                                        Đăng nhập
                                    </a>
                                </Box>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}
