import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../services/authService";
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    IconButton,
    VisibilityIcon,
    VisibilityOffIcon,
    WarningIcon,
} from "../../components/ui";
import logo from "../../assets/logo.png";
import "./ResetPasswordPage.css";

type AxiosErrorResponse = {
    response?: {
        data?: {
            message?: string;
            errors?: Record<string, string[]>;
        };
    };
};

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") || "";
    const email = searchParams.get("email") || "";

    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    // Check if token and email are present
    const isValidLink = token && email;

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        if (password.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự!");
            return;
        }

        if (password !== passwordConfirmation) {
            setError("Mật khẩu xác nhận không khớp!");
            return;
        }

        setIsLoading(true);

        try {
            await resetPassword({
                email,
                token,
                password,
                password_confirmation: passwordConfirmation,
            });
            setIsSuccess(true);
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
        <Box className="reset-password-container">
            <Box className="reset-password-wrapper">
                {/* Left side - Branding */}
                <Box className="reset-password-branding">
                    <Typography variant="h1" className="reset-password-branding-title">
                        AstraSocial
                    </Typography>
                    <Box className="logo-container">
                        <img src={logo} alt="AstraSocial Logo" />
                    </Box>
                    <Typography variant="body1" className="reset-password-branding-text">
                        Kết nối với bạn bè và thế giới xung quanh trên AstraSocial.
                    </Typography>
                </Box>

                {/* Right side - Reset Password Form */}
                <Card elevation={3} style={{ maxWidth: 420, width: "100%" }}>
                    <CardContent>
                        <Box className="reset-password-header">
                            <Typography variant="h4">Đặt lại mật khẩu</Typography>
                            <Typography variant="h5" className="reset-password-header-brand">
                                AstraSocial
                            </Typography>
                        </Box>

                        {!isValidLink ? (
                            /* Invalid link */
                            <Box className="reset-password-invalid">
                                <div className="invalid-icon">✕</div>
                                <Typography className="invalid-title">
                                    Link không hợp lệ
                                </Typography>
                                <Typography className="invalid-message">
                                    Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.
                                    Vui lòng yêu cầu gửi lại link mới.
                                </Typography>
                                <Button
                                    fullWidth
                                    onClick={() => navigate("/forgot-password")}
                                >
                                    Yêu cầu link mới
                                </Button>
                            </Box>
                        ) : isSuccess ? (
                            /* Success state */
                            <Box className="reset-password-success">
                                <div className="success-icon">✓</div>
                                <Typography className="success-title">
                                    Đặt lại mật khẩu thành công!
                                </Typography>
                                <Typography className="success-message">
                                    Mật khẩu của bạn đã được cập nhật. Bạn có thể đăng nhập bằng mật khẩu mới.
                                </Typography>
                                <Button
                                    fullWidth
                                    onClick={() => navigate("/login")}
                                >
                                    Đăng nhập ngay
                                </Button>
                            </Box>
                        ) : (
                            /* Form state */
                            <form className="reset-password-form" onSubmit={handleSubmit}>
                                <Typography className="reset-password-description">
                                    Nhập mật khẩu mới cho tài khoản <strong>{email}</strong>.
                                </Typography>

                                {error && (
                                    <Box className="reset-password-error">
                                        <WarningIcon size={18} />
                                        {error}
                                    </Box>
                                )}

                                <TextField
                                    id="new-password"
                                    type={showPassword ? "text" : "password"}
                                    label="Mật khẩu mới"
                                    placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    fullWidth
                                    autoComplete="new-password"
                                    endAdornment={
                                        <IconButton onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">
                                            {showPassword ? <VisibilityOffIcon size={20} /> : <VisibilityIcon size={20} />}
                                        </IconButton>
                                    }
                                />

                                <TextField
                                    id="confirm-password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    label="Xác nhận mật khẩu"
                                    placeholder="Nhập lại mật khẩu mới"
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    required
                                    fullWidth
                                    autoComplete="new-password"
                                    endAdornment={
                                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} aria-label="Toggle confirm password visibility">
                                            {showConfirmPassword ? <VisibilityOffIcon size={20} /> : <VisibilityIcon size={20} />}
                                        </IconButton>
                                    }
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    loading={isLoading}
                                >
                                    Đặt lại mật khẩu
                                </Button>

                                <Box className="reset-password-back-link">
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
