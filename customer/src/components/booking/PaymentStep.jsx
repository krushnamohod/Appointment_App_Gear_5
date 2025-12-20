import { ArrowLeft, CreditCard, Smartphone, Wallet } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useBookingStore } from '../../context/BookingContext';
import { createBooking } from '../../services/appointmentService';

/**
 * @intent Payment screen with payment method selection and order summary
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
    const taxes = Math.round(price * 0.1); // 10% tax
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

        // Create booking after successful payment
        await createBooking({
            ...booking,
            paymentStatus: 'PAID',
            paymentMethod
        });

        toast.success('Payment successful! Appointment booked.');
        setStep(5); // Go to confirmation step
        setLoading(false);
    };

    const paymentMethods = [
        { id: 'credit', label: 'Credit Card', icon: CreditCard },
        { id: 'debit', label: 'Debit Card', icon: CreditCard },
        { id: 'upi', label: 'UPI Pay', icon: Smartphone },
        { id: 'paypal', label: 'Paypal', icon: Wallet },
    ];

    return (
        <div className="border-2 border-red-400 rounded-lg overflow-hidden bg-white">
            <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left - Payment Form */}
                    <div className="lg:col-span-2">
                        <h3 className="text-red-500 font-medium mb-4">Choose a payment method</h3>

                        {/* Payment Method Options */}
                        <div className="space-y-2 mb-6">
                            {paymentMethods.map((method) => (
                                <label
                                    key={method.id}
                                    className="flex items-center gap-3 cursor-pointer"
                                >
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value={method.id}
                                        checked={paymentMethod === method.id}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-4 h-4 text-red-500 border-gray-300 focus:ring-red-500"
                                    />
                                    <span className="text-red-500">{method.label}</span>
                                </label>
                            ))}
                        </div>

                        {/* Card Form - Only show for credit/debit */}
                        {(paymentMethod === 'credit' || paymentMethod === 'debit') && (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Name on Card */}
                                <div>
                                    <label className="block text-sm text-red-500 mb-1">Name on Card</label>
                                    <input
                                        type="text"
                                        value={cardName}
                                        onChange={(e) => setCardName(e.target.value)}
                                        placeholder="Placeholder"
                                        required
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-400 outline-none transition-colors"
                                    />
                                </div>

                                {/* Card Number */}
                                <div>
                                    <label className="block text-sm text-red-500 mb-1">Card Number</label>
                                    <input
                                        type="text"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                        placeholder="•••• •••• •••• ••••"
                                        maxLength={19}
                                        required
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-400 outline-none transition-colors font-mono"
                                    />
                                </div>

                                {/* Expiration Date & Security Code */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-red-500 mb-1">Expiration Date</label>
                                        <input
                                            type="text"
                                            value={expiry}
                                            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                                            placeholder="•••• •••• •••• ••••"
                                            maxLength={5}
                                            required
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-400 outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-red-500 mb-1">Security Code</label>
                                        <input
                                            type="text"
                                            value={cvv}
                                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                                            placeholder="CVV"
                                            maxLength={3}
                                            required
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-400 outline-none transition-colors"
                                        />
                                    </div>
                                </div>
                            </form>
                        )}

                        {/* UPI Form */}
                        {paymentMethod === 'upi' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-red-500 mb-1">UPI ID</label>
                                    <input
                                        type="text"
                                        placeholder="yourname@upi"
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-400 outline-none transition-colors"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Paypal */}
                        {paymentMethod === 'paypal' && (
                            <div className="text-center py-6 text-gray-500">
                                You will be redirected to PayPal to complete payment
                            </div>
                        )}
                    </div>

                    {/* Right - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="border-2 border-red-400 rounded-lg overflow-hidden">
                            <div className="bg-gray-50 px-4 py-3 border-b border-red-400">
                                <h4 className="font-medium text-gray-800">Order Summary</h4>
                            </div>

                            <div className="p-4 space-y-3">
                                {/* Service */}
                                <div className="flex justify-between text-gray-700">
                                    <span>{booking.service?.name || 'Service'}</span>
                                    <span className="text-red-500 font-medium">{price}</span>
                                </div>

                                <hr className="border-red-400" />

                                {/* Subtotal */}
                                <div className="flex justify-between text-gray-700">
                                    <span>Subtotal</span>
                                    <span className="text-red-500 font-medium">{price}</span>
                                </div>

                                {/* Taxes */}
                                <div className="flex justify-between text-gray-700">
                                    <span>Taxes</span>
                                    <span className="text-red-500 font-medium">{taxes}</span>
                                </div>

                                <hr className="border-red-400" />

                                {/* Total */}
                                <div className="flex justify-between text-gray-800 font-bold">
                                    <span>Total</span>
                                    <span className="text-red-500">{total}</span>
                                </div>

                                {/* Pay Now Button */}
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="w-full mt-4 py-3 bg-red-100 text-red-500 font-medium rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Processing...' : 'Pay Now'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back Button */}
                <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mt-6"
                >
                    <ArrowLeft size={18} />
                    <span>Back to Details</span>
                </button>
            </div>
        </div>
    );
};

export default PaymentStep;
