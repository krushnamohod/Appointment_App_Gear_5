import { create } from 'zustand';

/**
 * @intent Admin authentication store with hardcoded credentials
 * Admin: admin@admin.com / Admin@123
 * Organiser: org@org.com / Org@123
 */
export const useAdminAuthStore = create((set) => ({
    user: null,
    isAuthenticated: !!localStorage.getItem('adminToken'),
    role: localStorage.getItem('adminRole') || null,

    login: (email, password) => {
        // Hardcoded admin credentials
        const ADMINS = [
            {
                email: 'admin@admin.com',
                password: 'Admin@123',
                name: 'Admin User',
                role: 'admin'
            },
            {
                email: 'org@org.com',
                password: 'Org@123',
                name: 'Organiser User',
                role: 'organiser'
            }
        ];

        const user = ADMINS.find(u => u.email === email && u.password === password);

        if (user) {
            const { password: _, ...userWithoutPassword } = user;
            localStorage.setItem('adminToken', 'admin-jwt-token-12345');
            localStorage.setItem('adminRole', user.role);
            set({ user: userWithoutPassword, isAuthenticated: true, role: user.role });
            return { success: true, user: userWithoutPassword };
        }

        return { success: false, error: 'Invalid email or password' };
    },

    logout: () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminRole');
        set({ user: null, isAuthenticated: false, role: null });
    }
}));
