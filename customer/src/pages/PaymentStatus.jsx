import { Calendar, CheckCircle, Home, Loader2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * @intent Payment status page - shows after PhonePe redirect
 */
const PaymentStatus = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Get token directly from localStorage (persists across redirects)
    const token = localStorage.getItem('token');

    const [status, setStatus] = useState('checking'); // checking, success, failed
    const [message, setMessage] = useState('Verifying your payment...');

    const txnId = searchParams.get('txnId');

    useEffect(() => {
        if (!txnId) {
            setStatus('failed');
            setMessage('Invalid payment reference');
            return;
        }

        const checkStatus = async () => {
            try {
                const response = await fetch(`${API_URL}/payments/status/${txnId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (data.success && data.status === 'SUCCESS') {
                    setStatus('success');
                    setMessage('Payment successful! Your booking is confirmed.');
                } else {
                    setStatus('failed');
                    setMessage(data.message || 'Payment failed. Please try again.');
                }
            } catch (error) {
                console.error('Status check error:', error);
                setStatus('failed');
                setMessage('Could not verify payment status');
            }
        };

        // Check status after a short delay to allow webhook to process
        const timer = setTimeout(checkStatus, 2000);
        return () => clearTimeout(timer);
    }, [txnId, token]);

    return (
        <div className="min-h-screen bg-paper flex items-center justify-center p-6">
            <div className="card-planner p-8 max-w-md w-full text-center">
                {/* Status Icon */}
                <div className="mb-6">
                    {status === 'checking' && (
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gold/20 rounded-full">
                            <Loader2 className="text-gold-dark animate-spin" size={40} />
                        </div>
                    )}
                    {status === 'success' && (
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-sage/20 rounded-full">
                            <CheckCircle className="text-sage-dark" size={40} />
                        </div>
                    )}
                    {status === 'failed' && (
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full">
                            <XCircle className="text-red-500" size={40} />
                        </div>
                    )}
                </div>

                {/* Title */}
                <h1 className="font-serif text-2xl text-ink mb-2">
                    {status === 'checking' && 'Verifying Payment'}
                    {status === 'success' && 'Payment Successful!'}
                    {status === 'failed' && 'Payment Failed'}
                </h1>

                {/* Message */}
                <p className="text-ink/60 mb-8">{message}</p>

                {/* Transaction ID */}
                {txnId && (
                    <div className="bg-paper border border-ink/10 rounded-planner p-3 mb-6">
                        <p className="text-xs text-ink/50">Transaction ID</p>
                        <p className="font-mono text-sm text-ink">{txnId}</p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                    {status === 'success' && (
                        <>
                            <button
                                onClick={() => navigate('/profile')}
                                className="btn-primary w-full flex items-center justify-center gap-2"
                            >
                                <Calendar size={18} />
                                View My Bookings
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="btn-secondary w-full flex items-center justify-center gap-2"
                            >
                                <Home size={18} />
                                Back to Home
                            </button>
                        </>
                    )}
                    {status === 'failed' && (
                        <>
                            <button
                                onClick={() => navigate('/')}
                                className="btn-primary w-full flex items-center justify-center gap-2"
                            >
                                <Home size={18} />
                                Back to Home
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentStatus;
