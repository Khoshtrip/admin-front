import api from "../utils/api";

export const ImagesApi = {
    uploadImage: async (formData) => {
        try {
            const response = await api.post("/image/upload/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error uploading image:", error);
            throw error;
        }
    },
    deleteImage: async (imageId) => {
        try {
            const response = await api.delete(`/image/${imageId}/`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting image with ID ${imageId}:`, error);
            throw error;
        }
    },
    downloadImage: async (imageId) => {
        try {
            const response = await api.get(`/image/${imageId}/download/`, {
                responseType: "blob", // Ensures response is treated as binary data
            });
            return response.data;
        } catch (error) {
            console.error(`Error downloading image with ID ${imageId}:`, error);
            throw error;
        }
    },
};
