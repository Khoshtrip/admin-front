import api from "../utils/api";

export const ProductsApi = {
    createProduct: async (productData) => {
        try {
            const response = await api.post("/product/", productData);
            return response.data;
        } catch (error) {
            console.error("Error creating product:", error);
            throw error;
        }
    },
    getProducts: async (filters = {}, offset = 0, limit = 10) => {
        try {
            const response = await api.get("/products/", {
                params: { ...filters, offset, limit },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching products:", error);
            throw error;
        }
    },
    getProductById: async (productId) => {
        try {
            const response = await api.get(`/product/${productId}`);
            return response.data;
        } catch (error) {
            console.error(
                `Error fetching product with ID ${productId}:`,
                error
            );
            throw error;
        }
    },
    updateProduct: async (productId, productData) => {
        try {
            const response = await api.put(
                `/product/${productId}/`,
                productData
            );
            return response.data;
        } catch (error) {
            console.error(
                `Error updating product with ID ${productId}:`,
                error
            );
            throw error;
        }
    },
    deleteProduct: async (productId) => {
        try {
            const response = await api.delete(`/product/${productId}/`);
            return response.data;
        } catch (error) {
            console.error(
                `Error deleting product with ID ${productId}:`,
                error
            );
            throw error;
        }
    },
    activateProduct: async (productId) => {
        try {
            const response = await api.post(`/product/${productId}/activate`);
            return response.data;
        } catch (error) {
            console.error(
                `Error activating product with ID ${productId}:`,
                error
            );
            throw error;
        }
    },
    deactivateProduct: async (productId) => {
        try {
            const response = await api.post(`/product/${productId}/deactivate`);
            return response.data;
        } catch (error) {
            console.error(
                `Error deactivating product with ID ${productId}:`,
                error
            );
            throw error;
        }
    },
    bulkDelete: async (productIds) => {
        try {
            const csIDs = productIds.map((id) => id.toString()).join(",");
            console.log(csIDs);
            const response = await api.delete("/product/delete", {
                productIds: csIDs,
            });
            return response.data;
        } catch (error) {
            console.error("Error bulk deleting products:", error);
            throw error;
        }
    },
    buldChangeInventory: async (productIds, value) => {
        try {
            const body = productIds.map((id) => {
                {
                    productId: id.toString();
                }
            });
            const response = await api.patch(
                "/product/changeProductsAmountBy",
                {
                    updates: body,
                    stockChange: value,
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error bulk changing inventory:", error);
            throw error;
        }
    },
};
