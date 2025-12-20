import { ArrowLeft, CreditCard, Smartphone, Wallet, Shield } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useBookingStore } from '../../context/BookingContext';
import { createBooking } from '../../services/appointmentService';

/**
 * @intent Paper Planner styled payment screen with order summary
 */
const PaymentStep = () => {
    const { booking, setStep } = useBookingStore();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('credit');

    // Card details
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');

    const price = booking.service?.price || 0;
    const taxes = Math.round(price * 0.18); // 18% GST
    const total = price + taxes;

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        return parts.length ? parts.join(' ') : value;
    };

    const formatExpiry = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return v.slice(0, 2) + '/' + v.slice(2, 4);
        }
        return v;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            // Create booking after successful payment
            await createBooking({
                ...booking,
                paymentStatus: 'PAID',
                paymentMethod
            });

            toast.success('Payment successful! Appointment booked.');
            setStep(5); // Go to confirmation step
        } catch (error) {
            toast.error('Payment failed. Please try again.');
        }
        setLoading(false);
    };

    const paymentMethods = [
        { id: 'credit', label: 'Credit Card', icon: CreditCard },
        { id: 'debit', label: 'Debit Card', icon: CreditCard },
        { id: 'upi', label: 'UPI Pay', icon: Smartphone },
        { id: 'paypal', label: 'PayPal', icon: Wallet },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/20 rounded-full mb-4">
                    <CreditCard className="text-gold-dark" size={28} />
                </div>
                <h2 className="font-serif text-2xl text-ink">Payment</h2>
                <p className="text-ink/60 mt-1">Complete your booking</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left - Payment Form */}
                <div className="lg:col-span-2 card-planner p-6">
                    <h3 className="font-serif text-lg text-ink mb-4">Choose a payment method</h3>

                    {/* Payment Method Options */}
                    <div className="space-y-2 mb-6">
                        {paymentMethods.map((method) => {
                            const Icon = method.icon;
                            return (
                                <label
                                    key={method.id}
                                    className={`flex items-center gap-3 p-3 rounded-planner cursor-pointer transition-all ${paymentMethod === method.id
                                            ? 'bg-terracotta/10 border border-terracotta'
                                            : 'bg-paper border border-ink/10 hover:border-ink/20'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value={method.id}
                                        checked={paymentMethod === method.id}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-4 h-4 text-terracotta border-ink/30 focus:ring-terracotta"
                                    />
                                    <Icon size={18} className={paymentMethod === method.id ? 'text-terracotta' : 'text-ink/50'} />
                                    <span className={paymentMethod === method.id ? 'text-terracotta font-medium' : 'text-ink/70'}>
                                        {method.label}
                                    </span>
                                </label>
                            );
                        })}
                    </div>

                    {/* Card Form - Only show for credit/debit */}
                    {(paymentMethod === 'credit' || paymentMethod === 'debit') && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name on Card */}
                            <div>
                                <label className="block text-sm font-medium text-ink/70 mb-2">Name on Card</label>
                                <input
                                    type="text"
                                    value={cardName}
                                    onChange={(e) => setCardName(e.target.value)}
                                    placeholder="John Doe"
                                    required
                                    className="input-planner"
                                />
                            </div>

                            {/* Card Number */}
                            <div>
                                <label className="block text-sm font-medium text-ink/70 mb-2">Card Number</label>
                                <input
                                    type="text"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                    placeholder="•••• •••• •••• ••••"
                                    maxLength={19}
                                    required
                                    className="input-planner font-mono tracking-wider"
                                />
                            </div>

                            {/* Expiration Date & Security Code */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-ink/70 mb-2">Expiration Date</label>
                                    <input
                                        type="text"
                                        value={expiry}
                                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                                        placeholder="MM/YY"
                                        maxLength={5}
                                        required
                                        className="input-planner"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-ink/70 mb-2">CVV</label>
                                    <input
                                        type="text"
                                        value={cvv}
                                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                                        placeholder="•••"
                                        maxLength={3}
                                        required
                                        className="input-planner"
                                    />
                                </div>
                            </div>
                        </form>
                    )}

                    {/* UPI Form */}
                    {paymentMethod === 'upi' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-ink/70 mb-2">UPI ID</label>
                                <input
                                    type="text"
                                    placeholder="yourname@upi"
                                    className="input-planner"
                                />
                            </div>
                        </div>
                    )}

                    {/* Paypal */}
                    {paymentMethod === 'paypal' && (
                        <div className="text-center py-6 text-ink/50">
                            <Wallet className="mx-auto mb-2" size={32} />
                            You will be redirected to PayPal to complete payment
                        </div>
                    )}

                    {/* Security Badge */}
                    <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-ink/10">
                        <Shield className="text-sage" size={16} />
                        <span className="text-sm text-ink/50">Secured by 256-bit SSL encryption</span>
                    </div>
                </div>

                {/* Right - Order Summary */}
                <div className="lg:col-span-1">
                    <div className="card-planner p-4 sticky top-6">
                        <h4 className="font-serif text-lg text-ink mb-4">Order Summary</h4>

                        <div className="space-y-3">
                            {/* Service */}
                            <div className="flex justify-between text-ink/70">
                                <span>{booking.service?.name || 'Service'}</span>
                                <span className="font-medium">₹{price}</span>
                            </div>

                            <hr className="border-ink/10" />

                            {/* Subtotal */}
                            <div className="flex justify-between text-ink/70">
                                <span>Subtotal</span>
                                <span>₹{price}</span>
                            </div>

                            {/* Taxes */}
                            <div className="flex justify-between text-ink/70">
                                <span>GST (18%)</span>
                                <span>₹{taxes}</span>
                            </div>

                            <hr className="border-ink/10" />

                            {/* Total */}
                            <div className="flex justify-between text-ink font-serif text-lg">
                                <span>Total</span>
                                <span className="text-terracotta">₹{total}</span>
                            </div>

                            {/* Pay Now Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="btn-primary w-full mt-4"
                            >
                                {loading ? 'Processing...' : `Pay ₹${total}`}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Back Button */}
            <button
                type="button"
                onClick={() => setStep(4)}
                className="btn-secondary flex items-center gap-2"
            >
                <ArrowLeft size={18} />
                Back to Details
            </button>
        </div>
    );
};

export default PaymentStep;

