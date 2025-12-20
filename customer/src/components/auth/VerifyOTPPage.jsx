import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, ArrowRight, RefreshCw } from 'lucide-react';
import { useAuthStore } from '../../context/AuthContext';
import { verifyOTP, signupWithOTP, sendOTP } from '../../services/authService';

/**
 * @intent OTP Verification page for email verification during signup
 */
const VerifyOTPPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login: storeLogin } = useAuthStore();

    const { email, name, password, phone } = location.state || {};

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendTimer, setResendTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    // Redirect if no email in state
    useEffect(() => {
        if (!email) {
            navigate('/login');
        }
    }, [email, navigate]);

    // Resend timer countdown
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [resendTimer]);

    const handleOtpChange = (index, value) => {
        if (value.length > 1) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handleResend = async () => {
        try {
            setLoading(true);
            await sendOTP(email);
            toast.success('OTP resent!');
            setResendTimer(60);
            setCanResend(false);
        } catch (err) {
            toast.error('Failed to resend OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        const otpString = otp.join('');

        if (otpString.length !== 6) {
            setError('Please enter the complete 6-digit code');
            return;
        }

        setError('');
        setLoading(true);

        try {
            // First verify the OTP
            await verifyOTP(email, otpString);

            // Then complete signup
            const res = await signupWithOTP({ name, email, password, phone });

            storeLogin(res.data.user, res.data.token);
            toast.success('Account created successfully!');
            navigate('/');
        } catch (err) {
            setError(err?.response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-paper flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white border border-ink/10 rounded-card p-8"
                style={{ boxShadow: '4px 4px 0px rgba(45, 45, 45, 0.1)' }}>

                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-terracotta/10 rounded-full flex items-center justify-center">
                        <Mail className="text-terracotta" size={32} />
                    </div>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="font-serif text-2xl text-ink mb-2">Verify your email</h2>
                    <p className="text-ink/60">
                        We sent a 6-digit code to<br />
                        <span className="font-medium text-ink">{email}</span>
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-planner text-error text-sm text-center">
                        {error}
                    </div>
                )}

                {/* OTP Input */}
                <form onSubmit={handleVerify}>
                    <div className="flex justify-center gap-3 mb-6">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                id={`otp-${index}`}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-14 text-center text-2xl font-bold border border-ink/20 rounded-planner focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all"
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                        {loading ? 'Verifying...' : (
                            <>
                                Verify & Create Account
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                {/* Resend */}
                <div className="text-center mt-6">
                    {canResend ? (
                        <button
                            onClick={handleResend}
                            disabled={loading}
                            className="text-terracotta hover:text-terracotta-dark font-medium transition-colors flex items-center justify-center gap-2 mx-auto"
                        >
                            <RefreshCw size={16} />
                            Resend Code
                        </button>
                    ) : (
                        <p className="text-ink/50 text-sm">
                            Resend code in <span className="font-medium">{resendTimer}s</span>
                        </p>
                    )}
                </div>

                {/* Back to login */}
                <p className="text-center mt-6 text-ink/60 text-sm">
                    Wrong email?{' '}
                    <button
                        onClick={() => navigate('/login')}
                        className="text-terracotta hover:text-terracotta-dark font-medium"
                    >
                        Go back
                    </button>
                </p>
            </div>
        </div>
    );
};

export default VerifyOTPPage;
