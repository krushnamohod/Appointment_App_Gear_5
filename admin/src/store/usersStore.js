import { create } from 'zustand';

const API_URL = "http://localhost:3000/api";

/**
 * @intent User management store with API integration
 */
export const useUsersStore = create((set, get) => ({
    users: [],
    loading: false,
    error: null,

    // Get auth token from localStorage
    getAuthHeader: () => {
        const token = localStorage.getItem('adminToken');
        return token ? { Authorization: `Bearer ${token}` } : {};
    },

    // Fetch all users
    fetchUsers: async () => {
        set({ loading: true, error: null });
        try {
            const res = await fetch(`${API_URL}/users`, {
                headers: {
                    "Content-Type": "application/json",
                    ...get().getAuthHeader(),
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to fetch users");
            }

            set({ users: data.users, loading: false });
            return { success: true };
        } catch (error) {
            set({ error: error.message, loading: false });
            return { success: false, error: error.message };
        }
    },

    // Create a new user
    createUser: async (userData) => {
        set({ loading: true, error: null });
        try {
            const res = await fetch(`${API_URL}/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...get().getAuthHeader(),
                },
                body: JSON.stringify(userData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to create user");
            }

            // Add new user to the list
            set((state) => ({
                users: [data.user, ...state.users],
                loading: false,
            }));

            return { success: true, user: data.user };
        } catch (error) {
            set({ error: error.message, loading: false });
            return { success: false, error: error.message };
        }
    },

    // Toggle user active status
    toggleUserStatus: async (userId) => {
        try {
            const res = await fetch(`${API_URL}/users/${userId}/toggle`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    ...get().getAuthHeader(),
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to toggle user status");
            }

            // Update user in the list
            set((state) => ({
                users: state.users.map((user) =>
                    user.id === userId ? data.user : user
                ),
            }));

            return { success: true, user: data.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Update user role
    updateUserRole: async (userId, role) => {
        try {
            const res = await fetch(`${API_URL}/users/${userId}/role`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    ...get().getAuthHeader(),
                },
                body: JSON.stringify({ role }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to update user role");
            }

            // Update user in the list
            set((state) => ({
                users: state.users.map((user) =>
                    user.id === userId ? data.user : user
                ),
            }));

            return { success: true, user: data.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Delete user
    deleteUser: async (userId) => {
        try {
            const res = await fetch(`${API_URL}/users/${userId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    ...get().getAuthHeader(),
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to delete user");
            }

            // Remove user from the list
            set((state) => ({
                users: state.users.filter((user) => user.id !== userId),
            }));

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Update user profile (name and email)
    updateUserProfile: async (userId, profileData) => {
        try {
            const res = await fetch(`${API_URL}/users/${userId}/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...get().getAuthHeader(),
                },
                body: JSON.stringify(profileData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to update user profile");
            }

            // Update user in the list
            set((state) => ({
                users: state.users.map((user) =>
                    user.id === userId ? data.user : user
                ),
            }));

            return { success: true, user: data.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
}));
