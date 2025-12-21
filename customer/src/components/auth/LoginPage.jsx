import { ArrowRight, Calendar, Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../context/AuthContext';
import { login, loginWithOTP, sendOTP } from '../../services/authService';

/**
 * @intent Paper Planner themed login/signup page with warm, stationery-inspired design
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const { login: storeLogin } = useAuthStore();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [useOTPLogin, setUseOTPLogin] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        if (useOTPLogin) {
          // OTP Login flow
          if (!otpSent) {
            await sendOTP(email);
            setOtpSent(true);
            toast.success('OTP sent to your email!');
          } else {
            const res = await loginWithOTP(email, otp);
            storeLogin(res.data.user, res.data.token);
            toast.success('Welcome back!');
            navigate('/');
          }
        } else {
          // Password login
          const res = await login(email, password);
          storeLogin(res.data.user, res.data.token);
          toast.success('Welcome back!');
          navigate('/');
        }
      } else {
        // Signup - send OTP first
        await sendOTP(email);
        toast.success('OTP sent! Please verify your email.');
        navigate('/verify-otp', { state: { email, name, password, phone } });
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      storeLogin(
        { id: 999, name: 'Google User', email: 'google@user.com' },
        'google-mock-token'
      );
      toast.success('Logged in with Google!');
      navigate('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4">
      {/* Paper texture background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Main Card */}
      <div className="relative w-full max-w-4xl flex overflow-hidden rounded-card"
        style={{ boxShadow: '4px 4px 0px rgba(45, 45, 45, 0.1)' }}>

        {/* Left Panel - Decorative */}
        <div className="hidden lg:flex lg:w-1/2 bg-white border border-ink/10 flex-col justify-center p-12 relative">
          {/* Planner lines decoration */}
          <div className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'repeating-linear-gradient(transparent, transparent 39px, rgba(45,45,45,0.08) 39px, rgba(45,45,45,0.08) 40px)',
              backgroundSize: '100% 40px'
            }}
          />

          <div className="relative z-10">
            {/* Logo */}
            <img
              src="/logo.jpg"
              alt="Syncra Logo"
              className="h-10 w-10 rounded-lg object-contain bg-white"
              style={{ boxShadow: '2px 2px 0px rgba(45, 45, 45, 0.1)' }}
            />

            {/* Brand */}
            <h1 className="font-serif text-4xl text-ink mb-4">
              Appointment<br />Planner
            </h1>
            <p className="text-ink/60 text-lg mb-8">
              Your personal scheduling companion.<br />
              Simple. Elegant. Reliable.
            </p>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-planner bg-sage/20 flex items-center justify-center">
                  <span className="text-sage-dark">✓</span>
                </div>
                <span className="text-ink/70">Easy appointment booking</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-planner bg-gold/30 flex items-center justify-center">
                  <span className="text-gold-dark">✓</span>
                </div>
                <span className="text-ink/70">Real-time availability</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-planner bg-terracotta/20 flex items-center justify-center">
                  <span className="text-terracotta">✓</span>
                </div>
                <span className="text-ink/70">Instant confirmations</span>
              </div>
            </div>
          </div>

          {/* Corner decoration */}
          <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-ink/10"></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-ink/10"></div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full lg:w-1/2 bg-white border border-ink/10 border-l-0 p-8 lg:p-12">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-terracotta rounded-planner flex items-center justify-center">
              <Calendar className="text-white" size={24} />
            </div>
            <span className="font-serif text-2xl text-ink">Planner</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="font-serif text-3xl text-ink mb-2">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-ink/60">
              {isLogin ? 'Sign in to manage your appointments' : 'Join us to start booking'}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-planner text-error text-sm">
              {error}
            </div>
          )}

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-ink/15 rounded-planner text-ink hover:bg-paper transition-colors disabled:opacity-50"
            style={{ boxShadow: '2px 2px 0px rgba(45, 45, 45, 0.06)' }}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-ink/10"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-ink/40 text-sm">or</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30" size={18} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required={!isLogin}
                    className="input-planner pl-11"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-ink/70 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="input-planner pl-11"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30" size={18} />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="1234567890"
                    required={!isLogin}
                    className="input-planner pl-11"
                  />
                </div>
              </div>
            )}

            {/* Password field - only show for password login and signup */}
            {(!isLogin || !useOTPLogin) && !otpSent && (
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required={!useOTPLogin}
                    className="input-planner pl-11 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink/60"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {/* OTP input field - show after OTP is sent for OTP login */}
            {isLogin && useOTPLogin && otpSent && (
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-2">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  maxLength={6}
                  required
                  className="input-planner text-center text-2xl tracking-widest"
                />
                <p className="text-sm text-ink/50 mt-2 text-center">Check your email for the 6-digit code</p>
              </div>
            )}

            {isLogin && (
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => {
                    setUseOTPLogin(!useOTPLogin);
                    setOtpSent(false);
                    setOtp('');
                  }}
                  className="text-sm text-terracotta hover:text-terracotta-dark transition-colors"
                >
                  {useOTPLogin ? 'Use password instead' : 'Login with OTP'}
                </button>
                {!useOTPLogin && (
                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="text-sm text-terracotta hover:text-terracotta-dark transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? 'Please wait...' : (
                <>
                  {isLogin
                    ? (useOTPLogin && !otpSent ? 'Send OTP' : (useOTPLogin ? 'Verify & Login' : 'Sign in'))
                    : 'Create account'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Toggle */}
          <p className="text-center mt-8 text-ink/60">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="ml-2 text-terracotta hover:text-terracotta-dark font-medium transition-colors"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>

          {/* Test Credentials */}
          {isLogin && (
            <div className="mt-8 p-4 bg-paper border border-ink/10 rounded-planner">
              <p className="text-xs font-medium text-ink/50 mb-1">Test Credentials</p>
              <p className="text-sm text-ink/70">
                <span className="font-medium">Email:</span> test@test.com
                <span className="mx-2">|</span>
                <span className="font-medium">Password:</span> Test@123
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
