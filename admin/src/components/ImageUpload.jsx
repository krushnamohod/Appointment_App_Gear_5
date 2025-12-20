import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { useAdminAuthStore } from "@/store/authStore";

const API_URL = "http://localhost:3000/api";

export function ImageUpload({ onUploadSuccess, currentImage, label = "Upload Image" }) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(currentImage);
    const { token } = useAdminAuthStore();

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Preview locally
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Upload to server
        setUploading(true);
        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await fetch(`${API_URL}/upload/single`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                onUploadSuccess(data.url);
            } else {
                console.error("Upload failed");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                    {preview ? (
                        <>
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            <button
                                onClick={() => { setPreview(""); onUploadSuccess(""); }}
                                className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-bl-lg hover:bg-red-600"
                            >
                                <X size={12} />
                            </button>
                        </>
                    ) : (
                        <Upload className="text-gray-400" size={20} />
                    )}
                    {uploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Loader2 className="animate-spin text-white" size={20} />
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploading}
                    />
                    <label
                        htmlFor="file-upload"
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium border cursor-pointer transition-colors
                            ${uploading ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'}`}
                    >
                        {uploading ? "Uploading..." : (preview ? "Change Image" : "Select Image")}
                    </label>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG or WEBP up to 5MB</p>
                </div>
            </div>
        </div>
    );
}
