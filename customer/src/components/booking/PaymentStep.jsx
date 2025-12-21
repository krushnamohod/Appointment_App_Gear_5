import { ArrowLeft, CreditCard, Loader2, Shield, Smartphone } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useBookingStore } from '../../context/BookingContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * @intent Payment step with PhonePe integration
 */
const PaymentStep = () => {
    const { booking, setStep } = useBookingStore();
    const [loading, setLoading] = useState(false);

    // Get token directly from localStorage
    const token = localStorage.getItem('token');

    const price = booking.service?.price || 0;
    const capacity = booking.numberOfPeople || 1;
    const subtotal = price * capacity;
    const taxes = Math.round(subtotal * 0.18); // 18% GST
    const total = subtotal + taxes;

    const handlePhonePePay = async () => {
        if (!booking.slotId) {
            toast.error('Please select a time slot first');
            setStep(3);
            return;
        }

        if (!token) {
            toast.error('Please login to continue');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/payments/initiate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    serviceId: booking.service?.id,
                    slotId: booking.slotId,
                    capacity: booking.numberOfPeople || 1,
                    answers: booking.answers || {}
                })
            });

            const data = await response.json();

            if (data.success && data.paymentUrl) {
                // Redirect to PhonePe payment page
                window.location.href = data.paymentUrl;
            } else {
                throw new Error(data.message || 'Failed to initiate payment');
            }
        } catch (error) {
            console.error('Payment error:', error);
            toast.error(error.message || 'Failed to initiate payment');
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/20 rounded-full mb-4">
                    <CreditCard className="text-gold-dark" size={28} />
                </div>
                <h2 className="font-serif text-2xl text-ink">Complete Payment</h2>
                <p className="text-ink/60 mt-1">Secure payment via PhonePe</p>
            </div>

            {/* Order Summary Card */}
            <div className="card-planner p-6">
                <h3 className="font-serif text-lg text-ink mb-4">Order Summary</h3>

                <div className="space-y-3">
                    {/* Service */}
                    <div className="flex justify-between text-ink/70">
                        <span>{booking.service?.name || 'Service'}</span>
                        <span className="font-medium">₹{price}</span>
                    </div>

                    {/* Quantity */}
                    {capacity > 1 && (
                        <div className="flex justify-between text-ink/70">
                            <span>× {capacity} people</span>
                            <span>₹{subtotal}</span>
                        </div>
                    )}

                    <hr className="border-ink/10" />

                    {/* Subtotal */}
                    <div className="flex justify-between text-ink/70">
                        <span>Subtotal</span>
                        <span>₹{subtotal}</span>
                    </div>

                    {/* Taxes */}
                    <div className="flex justify-between text-ink/70">
                        <span>GST (18%)</span>
                        <span>₹{taxes}</span>
                    </div>

                    <hr className="border-ink/10" />

                    {/* Total */}
                    <div className="flex justify-between text-ink font-serif text-xl">
                        <span>Total</span>
                        <span className="text-terracotta">₹{total}</span>
                    </div>
                </div>

                {/* Date/Time Summary */}
                <div className="mt-4 p-3 bg-paper rounded-planner border border-ink/10">
                    <div className="text-sm text-ink/60">
                        <p><strong>Date:</strong> {booking.date}</p>
                        <p><strong>Time:</strong> {booking.time}</p>
                        {booking.provider && <p><strong>With:</strong> {booking.provider.name}</p>}
                        {booking.resource && <p><strong>Resource:</strong> {booking.resource.name}</p>}
                    </div>
                </div>
            </div>

            {/* PhonePe Pay Button */}
            <div className="card-planner p-6">
                <button
                    onClick={handlePhonePePay}
                    disabled={loading}
                    className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-lg"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={24} />
                            Redirecting to PhonePe...
                        </>
                    ) : (
                        <>
                            <Smartphone size={24} />
                            Pay ₹{total} with PhonePe
                        </>
                    )}
                </button>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-ink/10">
                    <Shield className="text-sage" size={16} />
                    <span className="text-sm text-ink/50">Secured by PhonePe Payment Gateway</span>
                </div>
            </div>

            {/* Back Button */}
            <button
                type="button"
                onClick={() => setStep(4)}
                disabled={loading}
                className="btn-secondary flex items-center gap-2"
            >
                <ArrowLeft size={18} />
                Back to Details
            </button>
        </div>
    );
};

export default PaymentStep;
