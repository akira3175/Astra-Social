import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendRegisterOtp, register, validateRegisterStep1 } from "../../services/authService";
import { useCurrentUser } from "../../context/currentUserContext";
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
    PersonAddIcon,
    WarningIcon,
} from "../../components/ui";
import logo from "../../assets/logo.png";
import "./RegisterPage.css";

type AxiosErrorResponse = {
    response?: {
        data?: {
            message?: string;
            errors?: Record<string, string[]>;
        };
    };
};

export default function RegisterPage() {
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const userContext = useCurrentUser();

    // Step 1 fields
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    // Step 2 fields
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [birthDate, setBirthDate] = useState("");

    // Step 3 - OTP
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [resendCooldown, setResendCooldown] = useState(0);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Resend cooldown timer
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (pastedData.length === 6) {
            const newOtp = pastedData.split("");
            setOtp(newOtp);
            otpRefs.current[5]?.focus();
        }
    };

    const handleStep1Submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setFieldErrors({});

        if (password !== passwordConfirmation) {
            setFieldErrors({ password_confirmation: "Mật khẩu xác nhận không khớp!" });
            return;
        }

        if (password.length < 6) {
            setFieldErrors({ password: "Mật khẩu phải có ít nhất 6 ký tự!" });
            return;
        }

        if (username.length < 3) {
            setFieldErrors({ username: "Tên người dùng phải có ít nhất 3 ký tự!" });
            return;
        }

        setIsLoading(true);
        try {
            await validateRegisterStep1({
                email,
                username,
                password,
                password_confirmation: passwordConfirmation,
            });
            setStep(2);
        } catch (err: unknown) {
            const axiosErr = err as AxiosErrorResponse;
            const serverErrors = axiosErr?.response?.data?.errors;
            if (serverErrors) {
                const newFieldErrors: Record<string, string> = {};
                for (const key in serverErrors) {
                    newFieldErrors[key] = serverErrors[key][0];
                }
                setFieldErrors(newFieldErrors);
            } else {
                setError(axiosErr?.response?.data?.message || "Đã có lỗi xảy ra! Vui lòng thử lại.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleStep2Submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await sendRegisterOtp({
                username,
                email,
                password,
                password_confirmation: passwordConfirmation,
                first_name: firstName,
                last_name: lastName,
                birth_date: birthDate,
            });
            setResendCooldown(60);
            setStep(3);
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

    const handleStep3Submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        const otpCode = otp.join("");
        if (otpCode.length !== 6) {
            setError("Vui lòng nhập đủ 6 chữ số OTP!");
            return;
        }

        setIsLoading(true);

        try {
            await register({ email, otp: otpCode });
            await userContext?.refreshUser();
            navigate("/");
        } catch (err: unknown) {
            const axiosErr = err as AxiosErrorResponse;
            setError(axiosErr?.response?.data?.message || "Mã OTP không hợp lệ hoặc đã hết hạn!");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendCooldown > 0) return;
        setError("");
        setIsLoading(true);

        try {
            await sendRegisterOtp({
                username,
                email,
                password,
                password_confirmation: passwordConfirmation,
                first_name: firstName,
                last_name: lastName,
                birth_date: birthDate,
            });
            setResendCooldown(60);
            setOtp(["", "", "", "", "", ""]);
        } catch (err: unknown) {
            const axiosErr = err as AxiosErrorResponse;
            setError(axiosErr?.response?.data?.message || "Không thể gửi lại OTP!");
        } finally {
            setIsLoading(false);
        }
    };

    const renderStepIndicator = () => (
        <Box className="step-indicator">
            {[1, 2, 3].map((s) => (
                <div
                    key={s}
                    className={`step-dot ${s === step ? "active" : ""} ${s < step ? "completed" : ""}`}
                />
            ))}
            <span className="step-label">
                {step === 1 && "Tài khoản"}
                {step === 2 && "Hồ sơ"}
                {step === 3 && "Xác thực"}
            </span>
        </Box>
    );

    const renderStep1 = () => (
        <form className="register-form" onSubmit={handleStep1Submit}>
            {error && (
                <Box className="register-error">
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
                onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: "" });
                }}
                required
                fullWidth
                autoComplete="email"
                error={!!fieldErrors.email}
                helperText={fieldErrors.email}
            />

            <TextField
                id="username"
                type="text"
                label="Tên người dùng"
                placeholder="Nhập tên người dùng"
                value={username}
                onChange={(e) => {
                    setUsername(e.target.value);
                    if (fieldErrors.username) setFieldErrors({ ...fieldErrors, username: "" });
                }}
                required
                fullWidth
                autoComplete="username"
                error={!!fieldErrors.username}
                helperText={fieldErrors.username}
            />

            <TextField
                id="password"
                type={showPassword ? "text" : "password"}
                label="Mật khẩu"
                placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: "" });
                }}
                required
                fullWidth
                autoComplete="new-password"
                endAdornment={
                    <IconButton onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">
                        {showPassword ? <VisibilityOffIcon size={20} /> : <VisibilityIcon size={20} />}
                    </IconButton>
                }
                error={!!fieldErrors.password}
                helperText={fieldErrors.password}
            />

            <TextField
                id="password_confirmation"
                type={showConfirmPassword ? "text" : "password"}
                label="Xác nhận mật khẩu"
                placeholder="Nhập lại mật khẩu"
                value={passwordConfirmation}
                onChange={(e) => {
                    setPasswordConfirmation(e.target.value);
                    if (fieldErrors.password_confirmation) setFieldErrors({ ...fieldErrors, password_confirmation: "" });
                }}
                required
                fullWidth
                autoComplete="new-password"
                endAdornment={
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} aria-label="Toggle confirm password visibility">
                        {showConfirmPassword ? <VisibilityOffIcon size={20} /> : <VisibilityIcon size={20} />}
                    </IconButton>
                }
                error={!!fieldErrors.password_confirmation}
                helperText={fieldErrors.password_confirmation}
            />

            <Button
                type="submit"
                fullWidth
                loading={isLoading}
            >
                Tiếp tục
            </Button>

            <Box className="register-login-link">
                Đã có tài khoản?
                <a href="/login" onClick={(e) => { e.preventDefault(); navigate("/login"); }}>
                    Đăng nhập
                </a>
            </Box>
        </form>
    );

    const renderStep2 = () => (
        <form className="register-form" onSubmit={handleStep2Submit}>
            {error && (
                <Box className="register-error">
                    <WarningIcon size={18} />
                    {error}
                </Box>
            )}

            <TextField
                id="last_name"
                type="text"
                label="Họ"
                placeholder="Nhập họ của bạn"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                fullWidth
            />

            <TextField
                id="first_name"
                type="text"
                label="Tên"
                placeholder="Nhập tên của bạn"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                fullWidth
            />

            <TextField
                id="birth_date"
                type="date"
                label="Ngày sinh"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
                fullWidth
            />

            <Box className="register-nav-buttons">
                <Button
                    type="button"
                    variant="outlined"
                    className="btn-back"
                    onClick={() => { setError(""); setStep(1); }}
                >
                    Quay lại
                </Button>
                <Button
                    type="submit"
                    fullWidth
                    loading={isLoading}
                >
                    Tiếp tục
                </Button>
            </Box>
        </form>
    );

    const renderStep3 = () => (
        <form className="register-form" onSubmit={handleStep3Submit}>
            {error && (
                <Box className="register-error">
                    <WarningIcon size={18} />
                    {error}
                </Box>
            )}

            <Typography variant="body1" className="otp-description">
                Mã xác thực đã được gửi đến email<br />
                <span className="otp-email">{email}</span>
            </Typography>

            <Box className="otp-input-container" onPaste={handleOtpPaste}>
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => { otpRefs.current[index] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        autoFocus={index === 0}
                    />
                ))}
            </Box>

            <Box className="otp-resend">
                <button
                    type="button"
                    disabled={resendCooldown > 0 || isLoading}
                    onClick={handleResendOtp}
                >
                    {resendCooldown > 0
                        ? `Gửi lại sau ${resendCooldown}s`
                        : "Gửi lại mã OTP"
                    }
                </button>
            </Box>

            <Box className="register-nav-buttons">
                <Button
                    type="button"
                    variant="outlined"
                    className="btn-back"
                    onClick={() => { setError(""); setStep(2); }}
                >
                    Quay lại
                </Button>
                <Button
                    type="submit"
                    fullWidth
                    loading={isLoading}
                    startIcon={<PersonAddIcon size={20} />}
                >
                    Đăng ký
                </Button>
            </Box>
        </form>
    );

    return (
        <Box className="register-container">
            <Box className="register-wrapper">
                {/* Left side - Branding */}
                <Box className="register-branding">
                    <Typography variant="h1" className="register-branding-title">
                        AstraSocial
                    </Typography>
                    <Typography variant="body1" className="register-branding-text">
                        Tham gia AstraSocial ngay hôm nay để kết nối với bạn bè và thế giới.
                    </Typography>
                </Box>

                {/* Right side - Register Form */}
                <Card elevation={3} style={{ maxWidth: 420, width: "100%" }}>
                    <CardContent>
                        <Box className="register-header">
                            <Typography variant="h4">Đăng ký</Typography>
                            <Typography variant="h5" className="register-header-brand">
                                AstraSocial
                            </Typography>
                        </Box>

                        {renderStepIndicator()}

                        <Box className="step-content" key={step}>
                            {step === 1 && renderStep1()}
                            {step === 2 && renderStep2()}
                            {step === 3 && renderStep3()}
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}
