import { create } from 'zustand';

const API_URL = "http://localhost:3000/api";

/**
 * @intent Admin authentication store with real API integration
 */
export const useAdminAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('adminUser')) || null,
    isAuthenticated: !!localStorage.getItem('adminToken'),
    role: localStorage.getItem('adminRole') || null,
    token: localStorage.getItem('adminToken') || null,

    login: async (email, password) => {
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                return { success: false, error: data.message || "Login failed" };
            }

            const { user, token } = data;

            // Only allow ADMIN or ORGANISER to login to admin panel
            if (user.role !== "ADMIN" && user.role !== "ORGANISER") {
                return { success: false, error: "Access denied. Admin only." };
            }

            localStorage.setItem('adminToken', token);
            localStorage.setItem('adminRole', user.role);
            localStorage.setItem('adminUser', JSON.stringify(user));

            set({ user, isAuthenticated: true, role: user.role, token });
            return { success: true, user };
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, error: "Network error. Please try again." };
        }
    },

    logout: () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminRole');
        localStorage.removeItem('adminUser');
        set({ user: null, isAuthenticated: false, role: null, token: null });
    }
}));
