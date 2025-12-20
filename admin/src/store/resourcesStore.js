import { create } from 'zustand';

const API_URL = "http://localhost:3000/api";

/**
 * @intent Resources store with CRUD operations
 */
export const useResourcesStore = create((set, get) => ({
    resources: [],
    loading: false,
    error: null,

    // Get auth token from localStorage
    getAuthHeader: () => {
        const token = localStorage.getItem('adminToken');
        return token ? { Authorization: `Bearer ${token}` } : {};
    },

    // Fetch all resources
    fetchResources: async () => {
        set({ loading: true, error: null });
        try {
            const res = await fetch(`${API_URL}/resources`, {
                headers: {
                    "Content-Type": "application/json",
                    ...get().getAuthHeader(),
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to fetch resources");
            }

            set({ resources: data.resources, loading: false });
            return { success: true };
        } catch (error) {
            set({ error: error.message, loading: false });
            return { success: false, error: error.message };
        }
    },

    // Create a new resource
    createResource: async (resourceData) => {
        set({ loading: true, error: null });
        try {
            const res = await fetch(`${API_URL}/resources`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...get().getAuthHeader(),
                },
                body: JSON.stringify(resourceData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to create resource");
            }

            set((state) => ({
                resources: [data.resource, ...state.resources],
                loading: false,
            }));

            return { success: true, resource: data.resource };
        } catch (error) {
            set({ error: error.message, loading: false });
            return { success: false, error: error.message };
        }
    },

    // Update a resource
    updateResource: async (id, resourceData) => {
        set({ loading: true, error: null });
        try {
            const res = await fetch(`${API_URL}/resources/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...get().getAuthHeader(),
                },
                body: JSON.stringify(resourceData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to update resource");
            }

            set((state) => ({
                resources: state.resources.map((r) =>
                    r.id === id ? data.resource : r
                ),
                loading: false,
            }));

            return { success: true, resource: data.resource };
        } catch (error) {
            set({ error: error.message, loading: false });
            return { success: false, error: error.message };
        }
    },

    // Delete a resource
    deleteResource: async (id) => {
        try {
            const res = await fetch(`${API_URL}/resources/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    ...get().getAuthHeader(),
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to delete resource");
            }

            set((state) => ({
                resources: state.resources.filter((r) => r.id !== id),
            }));

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
}));
