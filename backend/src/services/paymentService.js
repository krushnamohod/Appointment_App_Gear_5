import axios from "axios";
import crypto from "crypto";

/**
 * PhonePe Payment Gateway Service
 * Using Standard PG API with Salt Key authentication (UAT Sandbox)
 */

// UAT Test Credentials - Replace with your own when going live
const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || 'PGTESTPAYUAT86';
const SALT_KEY = process.env.PHONEPE_SALT_KEY || '96434309-7796-489d-8924-ab56988a6076';
const SALT_INDEX = process.env.PHONEPE_SALT_INDEX || '1';
const PHONEPE_ENV = process.env.PHONEPE_ENV || 'SANDBOX';

// API Base URLs
const BASE_URL = PHONEPE_ENV === 'PRODUCTION'
    ? 'https://api.phonepe.com/apis/hermes'
    : 'https://api-preprod.phonepe.com/apis/pg-sandbox';

/**
 * Generate X-VERIFY header for PhonePe
 */
function generateChecksum(payload, endpoint) {
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    const string = base64Payload + endpoint + SALT_KEY;
    const sha256Hash = crypto.createHash('sha256').update(string).digest('hex');
    return sha256Hash + '###' + SALT_INDEX;
}

/**
 * Initiate Payment
 */
export async function initiatePhonePePayment({
    amount,
    merchantTransactionId,
    merchantUserId,
    mobileNumber,
    redirectUrl,
    callbackUrl
}) {
    try {
        const payload = {
            merchantId: MERCHANT_ID,
            merchantTransactionId,
            merchantUserId,
            amount: Math.round(amount * 100), // Amount in paise
            redirectUrl,
            redirectMode: "REDIRECT",
            callbackUrl,
            mobileNumber: mobileNumber || "9999999999",
            paymentInstrument: {
                type: "PAY_PAGE"
            }
        };

        const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
        const endpoint = "/pg/v1/pay";
        const checksum = generateChecksum(payload, endpoint);

        const response = await axios.post(
            `${BASE_URL}${endpoint}`,
            { request: base64Payload },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-VERIFY': checksum
                }
            }
        );

        console.log("✅ PhonePe Payment Response:", response.data);

        if (response.data.success) {
            return {
                success: true,
                data: response.data.data
            };
        } else {
            throw new Error(response.data.message || "Payment initiation failed");
        }
    } catch (error) {
        console.error("❌ PhonePe Pay Error:", error.response?.data || error.message);
        throw new Error("Failed to initiate payment");
    }
}

/**
 * Check Payment Status
 */
export async function checkPhonePeStatus(merchantTransactionId) {
    try {
        const endpoint = `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}`;
        const string = endpoint + SALT_KEY;
        const sha256Hash = crypto.createHash('sha256').update(string).digest('hex');
        const checksum = sha256Hash + '###' + SALT_INDEX;

        const response = await axios.get(
            `${BASE_URL}${endpoint}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-VERIFY': checksum,
                    'X-MERCHANT-ID': MERCHANT_ID
                }
            }
        );

        console.log("✅ PhonePe Status Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ PhonePe Status Error:", error.response?.data || error.message);
        throw new Error("Failed to fetch payment status");
    }
}

/**
 * Initiate Refund
 */
export async function initiateRefund({ merchantTransactionId, originalTransactionId, amount }) {
    try {
        const payload = {
            merchantId: MERCHANT_ID,
            merchantUserId: "refund_user",
            originalTransactionId,
            merchantTransactionId,
            amount: Math.round(amount * 100)
        };

        const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
        const endpoint = "/pg/v1/refund";
        const checksum = generateChecksum(payload, endpoint);

        const response = await axios.post(
            `${BASE_URL}${endpoint}`,
            { request: base64Payload },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-VERIFY': checksum
                }
            }
        );

        console.log("✅ PhonePe Refund Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ PhonePe Refund Error:", error.response?.data || error.message);
        throw new Error("Failed to initiate refund");
    }
}