import { useAdminAuthStore } from "@/store/authStore";
import { ArrowLeft, ArrowRight, Calendar, Eye, EyeOff, KeyRound, Lock, Mail } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * @intent Utility function to merge class names
 */
const cn = (...classes) => classes.filter(Boolean).join(" ");

/**
 * @intent Animated dot map background showing travel routes
 */
const DotMap = () => {
    const canvasRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const routes = [
        { start: { x: 100, y: 150, delay: 0 }, end: { x: 200, y: 80, delay: 2 }, color: "#7c3aed" },
        { start: { x: 200, y: 80, delay: 2 }, end: { x: 260, y: 120, delay: 4 }, color: "#7c3aed" },
        { start: { x: 50, y: 50, delay: 1 }, end: { x: 150, y: 180, delay: 3 }, color: "#7c3aed" },
        { start: { x: 280, y: 60, delay: 0.5 }, end: { x: 180, y: 180, delay: 2.5 }, color: "#7c3aed" },
    ];

    const generateDots = (width, height) => {
        const dots = [];
        const gap = 12;
        for (let x = 0; x < width; x += gap) {
            for (let y = 0; y < height; y += gap) {
                const isInMapShape =
                    ((x < width * 0.25 && x > width * 0.05) && (y < height * 0.4 && y > height * 0.1)) ||
                    ((x < width * 0.25 && x > width * 0.15) && (y < height * 0.8 && y > height * 0.4)) ||
                    ((x < width * 0.45 && x > width * 0.3) && (y < height * 0.35 && y > height * 0.15)) ||
                    ((x < width * 0.5 && x > width * 0.35) && (y < height * 0.65 && y > height * 0.35)) ||
                    ((x < width * 0.7 && x > width * 0.45) && (y < height * 0.5 && y > height * 0.1)) ||
                    ((x < width * 0.8 && x > width * 0.65) && (y < height * 0.8 && y > height * 0.6));
                if (isInMapShape && Math.random() > 0.3) {
                    dots.push({ x, y, radius: 1, opacity: Math.random() * 0.5 + 0.2 });
                }
            }
        }
        return dots;
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const resizeObserver = new ResizeObserver(entries => {
            const { width, height } = entries[0].contentRect;
            setDimensions({ width, height });
            canvas.width = width;
            canvas.height = height;
        });
        resizeObserver.observe(canvas.parentElement);
        return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
        if (!dimensions.width || !dimensions.height) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dots = generateDots(dimensions.width, dimensions.height);
        let animationFrameId;
        let startTime = Date.now();

        function animate() {
            ctx.clearRect(0, 0, dimensions.width, dimensions.height);
            dots.forEach(dot => {
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(124, 58, 237, ${dot.opacity})`;
                ctx.fill();
            });

            const currentTime = (Date.now() - startTime) / 1000;
            routes.forEach(route => {
                const elapsed = currentTime - route.start.delay;
                if (elapsed <= 0) return;
                const progress = Math.min(elapsed / 3, 1);
                const x = route.start.x + (route.end.x - route.start.x) * progress;
                const y = route.start.y + (route.end.y - route.start.y) * progress;

                ctx.beginPath();
                ctx.moveTo(route.start.x, route.start.y);
                ctx.lineTo(x, y);
                ctx.strokeStyle = route.color;
                ctx.lineWidth = 1.5;
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(route.start.x, route.start.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = route.color;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fillStyle = "#8b5cf6";
                ctx.fill();

                ctx.beginPath();
                ctx.arc(x, y, 6, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(139, 92, 246, 0.4)";
                ctx.fill();

                if (progress === 1) {
                    ctx.beginPath();
                    ctx.arc(route.end.x, route.end.y, 3, 0, Math.PI * 2);
                    ctx.fillStyle = route.color;
                    ctx.fill();
                }
            });

            if (currentTime > 15) startTime = Date.now();
            animationFrameId = requestAnimationFrame(animate);
        }

        animate();
        return () => cancelAnimationFrame(animationFrameId);
    }, [dimensions]);

    return (
        <div className="relative w-full h-full overflow-hidden">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
    );
};

/**
 * @intent Syncra Admin Login with animated map and forgot password OTP flow
 * Hardcoded OTP: 123456
 */
const SyncraLoginPage = () => {
    const { login } = useAdminAuthStore();

    // View states: 'login' | 'forgot' | 'otp' | 'reset'
    const [view, setView] = useState('login');

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // OTP states
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [success, setSuccess] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        const result = await login(email, password);
        if (!result.success) {
            setError(result.error);
        }
        setLoading(false);
    };

    const handleForgotSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setError("Please enter your email");
            return;
        }
        setError("");
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setSuccess("OTP sent to your email!");
        setView('otp');
        setLoading(false);
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        // Hardcoded OTP: 123456
        if (otp === "123456") {
            setSuccess("OTP verified!");
            setView('reset');
        } else {
            setError("Invalid OTP. Use: 123456");
        }
        setLoading(false);
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }
        setError("");
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setSuccess("Password reset successfully!");
        setTimeout(() => {
            setView('login');
            setSuccess("");
            setEmail("");
            setOtp("");
            setNewPassword("");
            setConfirmPassword("");
        }, 1500);
        setLoading(false);
    };

    const renderLoginForm = () => (
        <form onSubmit={handleLogin} className="space-y-5">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-purple-500">*</span>
                </label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@admin.com"
                        required
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password <span className="text-purple-500">*</span>
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type={isPasswordVisible ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    />
                    <button
                        type="button"
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
                {loading ? "Signing in..." : <>Sign in <ArrowRight size={18} /></>}
            </button>

            <div className="text-center">
                <button
                    type="button"
                    onClick={() => { setView('forgot'); setError(""); setSuccess(""); }}
                    className="text-purple-600 hover:text-purple-700 text-sm transition-colors"
                >
                    Forgot password?
                </button>
            </div>
        </form>
    );

    const renderForgotForm = () => (
        <form onSubmit={handleForgotSubmit} className="space-y-5">
            <button
                type="button"
                onClick={() => { setView('login'); setError(""); setSuccess(""); }}
                className="flex items-center gap-1 text-gray-600 hover:text-gray-800 text-sm mb-4"
            >
                <ArrowLeft size={16} /> Back to login
            </button>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-purple-500">*</span>
                </label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-70"
            >
                {loading ? "Sending..." : "Send OTP"}
            </button>
        </form>
    );

    const renderOtpForm = () => (
        <form onSubmit={handleOtpSubmit} className="space-y-5">
            <button
                type="button"
                onClick={() => { setView('forgot'); setError(""); setSuccess(""); }}
                className="flex items-center gap-1 text-gray-600 hover:text-gray-800 text-sm mb-4"
            >
                <ArrowLeft size={16} /> Back
            </button>

            <p className="text-sm text-gray-600 mb-4">
                Enter the 6-digit OTP sent to <span className="font-medium">{email}</span>
            </p>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    OTP Code <span className="text-purple-500">*</span>
                </label>
                <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="123456"
                        required
                        maxLength={6}
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-center text-lg tracking-widest"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-70"
            >
                {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <p className="text-xs text-gray-500 text-center">Hardcoded OTP: <span className="font-mono font-medium">123456</span></p>
        </form>
    );

    const renderResetForm = () => (
        <form onSubmit={handleResetSubmit} className="space-y-5">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password <span className="text-purple-500">*</span>
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        required
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password <span className="text-purple-500">*</span>
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        required
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-70"
            >
                {loading ? "Resetting..." : "Reset Password"}
            </button>
        </form>
    );

    const getTitle = () => {
        switch (view) {
            case 'forgot': return 'Forgot Password';
            case 'otp': return 'Verify OTP';
            case 'reset': return 'Reset Password';
            default: return 'Welcome back';
        }
    };

    const getSubtitle = () => {
        switch (view) {
            case 'forgot': return 'Enter your email to receive OTP';
            case 'otp': return 'Enter the verification code';
            case 'reset': return 'Create a new password';
            default: return 'Sign in to your account';
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
            <div className="w-full max-w-4xl overflow-hidden rounded-2xl flex bg-white shadow-xl">
                {/* Left side - Animated Map */}
                <div className="hidden md:block w-1/2 h-[600px] relative overflow-hidden border-r border-gray-100">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-indigo-100">
                        <DotMap />

                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10">
                            <div className="mb-6">
                                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-200">
                                    <Calendar className="text-white h-8 w-8" />
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                                Syncra
                            </h2>
                            <p className="text-sm text-center text-gray-600 max-w-xs">
                                Odoo's appointment booking module - Manage your appointments seamlessly
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right side - Forms */}
                <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center bg-white">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold mb-1 text-gray-800">{getTitle()}</h1>
                        <p className="text-gray-500 mb-8">{getSubtitle()}</p>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm mb-6">
                                {success}
                            </div>
                        )}

                        {view === 'login' && renderLoginForm()}
                        {view === 'forgot' && renderForgotForm()}
                        {view === 'otp' && renderOtpForm()}
                        {view === 'reset' && renderResetForm()}

                        {view === 'login' && (
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                <p className="text-xs font-medium text-gray-500 mb-2">Test Credentials:</p>
                                <div className="space-y-1 text-xs text-gray-600">
                                    <p><span className="font-medium">Admin:</span> admin@admin.com / Admin@123</p>
                                    <p><span className="font-medium">Organiser:</span> org@org.com / Org@123</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SyncraLoginPage;
