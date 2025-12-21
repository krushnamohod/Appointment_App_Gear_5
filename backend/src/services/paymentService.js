import prisma from "../../prisma/client.js";
import axios from "axios"; // I will use axios as it's cleaner for this
import crypto from "crypto";

const PHONEPE_CLIENT_ID = process.env.PHONEPE_CLIENT_ID || 'TEST-M236TI3XC0H0D_25052';
const PHONEPE_CLIENT_SECRET = process.env.PHONEPE_CLIENT_SECRET || 'MjE0OTdlZWItNzA2MS00YmZkLWI1MTMtYzU3MTI4OWE1OWU2';
const PHONEPE_CLIENT_VERSION = process.env.PHONEPE_CLIENT_VERSION || '1';
const PHONEPE_ENV = process.env.PHONEPE_ENV || 'SANDBOX';

const BASE_URL = PHONEPE_ENV === 'PRODUCTION'
    ? 'https://api.phonepe.com/apis/pg'
    : 'https://api-preprod.phonepe.com/apis/pg-sandbox';

/**
 * Get OAuth Token from PhonePe
 */
export async function getPhonePeToken() {
    try {
        const auth = Buffer.from(`${PHONEPE_CLIENT_ID}:${PHONEPE_CLIENT_SECRET}`).toString('base64');
        const response = await axios.post(`${BASE_URL}/v1/oauth/token`,
            'grant_type=client_credentials',
            {
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        return response.data.access_token;
    } catch (error) {
        console.error("❌ PhonePe Token Error:", error.response?.data || error.message);
        throw new Error("Failed to authenticate with payment gateway");
    }
}

/**
 * Initiate Payment
 */
export async function initiatePhonePePayment({ amount, merchantTransactionId, merchantUserId, mobileNumber, redirectUrl, callbackUrl }) {
    try {
        const token = await getPhonePeToken();

        const payload = {
            merchantId: PHONEPE_CLIENT_ID, // Often the same in UAT
            merchantTransactionId,
            merchantUserId,
            amount: amount * 100, // Amount in paise
            redirectUrl,
            redirectMode: "REDIRECT",
            callbackUrl,
            mobileNumber,
            paymentInstrument: {
                type: "PAY_PAGE"
            }
        };

        const response = await axios.post(`${BASE_URL}/pg/v1/pay`, payload, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'X-CALLBACK-URL': callbackUrl
            }
        });

        return response.data;
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
        const token = await getPhonePeToken();
        const response = await axios.get(`${BASE_URL}/pg/v1/status/${PHONEPE_CLIENT_ID}/${merchantTransactionId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error("❌ PhonePe Status Error:", error.response?.data || error.message);
        throw new Error("Failed to fetch payment status");
    }
}
鼓
