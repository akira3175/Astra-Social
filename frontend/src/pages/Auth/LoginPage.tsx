import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
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
    LoginIcon,
    WarningIcon,
} from "../../components/ui";
import logo from "../../assets/logo.png";
import "./LoginPage.css";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await login({ email, password });
            navigate("/");
        } catch {
            setError("Đăng nhập thất bại! Vui lòng kiểm tra lại email và mật khẩu.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box className="login-container">
            <Box className="login-wrapper">
                {/* Left side - Branding */}
                <Box className="login-branding">
                    <Typography variant="h1" className="login-branding-title">
                        AstraSocial
                    </Typography>
                    <Box className="logo-container">
                        <img src={logo} alt="AstraSocial Logo" />
                    </Box>
                    <Typography variant="body1" className="login-branding-text">
                        Kết nối với bạn bè và thế giới xung quanh trên AstraSocial.
                    </Typography>
                </Box>

                {/* Right side - Login Form */}
                <Card elevation={3} style={{ maxWidth: 420, width: "100%" }}>
                    <CardContent>
                        <Box className="login-header">
                            <Typography variant="h4">Đăng nhập</Typography>
                            <Typography variant="h5" className="login-header-brand">
                                AstraSocial
                            </Typography>
                        </Box>

                        <form className="login-form" onSubmit={handleLogin}>
                            {error && (
                                <Box className="login-error">
                                    <WarningIcon size={18} />
                                    {error}
                                </Box>
                            )}

                            <TextField
                                id="email"
                                type="email"
                                label="Email"
                                placeholder="Nhập email của bạn"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                fullWidth
                                autoComplete="email"
                            />

                            <TextField
                                id="password"
                                type={showPassword ? "text" : "password"}
                                label="Mật khẩu"
                                placeholder="Nhập mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                fullWidth
                                autoComplete="current-password"
                                endAdornment={
                                    <IconButton onClick={handleClickShowPassword} aria-label="Toggle password visibility">
                                        {showPassword ? <VisibilityOffIcon size={20} /> : <VisibilityIcon size={20} />}
                                    </IconButton>
                                }
                            />

                            <Box className="login-forgot-link">
                                <a href="/forgot-password">Quên mật khẩu?</a>
                            </Box>

                            <Button
                                type="submit"
                                fullWidth
                                loading={isLoading}
                                startIcon={<LoginIcon size={20} />}
                            >
                                Đăng nhập
                            </Button>

                            <Box className="login-register-link">
                                Chưa có tài khoản?
                                <a href="/register" onClick={(e) => { e.preventDefault(); navigate("/register"); }}>
                                    Đăng ký ngay
                                </a>
                            </Box>
                        </form>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}
