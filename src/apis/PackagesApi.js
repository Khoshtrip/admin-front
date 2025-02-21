import api from "../utils/api";

export const createPackage = async (packageData) => {
    try {
        const response = await api.post("/package", packageData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getPackages = async (filters = {}, offset = 0, limit = 10) => {
    try {
        const response = await api.get("/packages", {
            params: { ...filters, offset, limit },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getPackageById = async (packageId) => {
    try {
        const response = await api.get(`/packages/${packageId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updatePackage = async (packageId, packageData) => {
    try {
        const response = await api.put(`/packages/${packageId}`, packageData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deletePackage = async (packageId) => {
    try {
        await api.delete(`/packages/${packageId}`);
        return { status: "success", message: "Package deleted successfully" };
    } catch (error) {
        throw error.response?.data || error;
    }
};


// Example Fixtures
export const examplePackage = {
    name: "Istanbul Adventure Package",
    photos: [3],
    flight: 1,
    hotel: 2,
    activities: [3],
    price: 599.99,
    start_date: "2025-03-01",
    end_date: "2025-03-05",
    available_units: 20,
    published: false,
    description: "Experience the best of Istanbul with this comprehensive package including flights, luxury hotel stay, city tour, and authentic Turkish dining."
};

export const exampleUpdatedPackage = {
    name: "Updated Istanbul Package",
    price: 699.99,
    start_date: "2025-03-01",
    end_date: "2025-03-05",
    flight: 1,
    hotel: 2,
    activities: [3],
    available_units: 20,
    published: true,
    description: "Experience the best of Istanbul with this comprehensive package."
};

export const getAllPackagesFixture = {
    "status": "success",
    "data": {
        "total": 2,
        "page": 1,
        "per_page": 10,
        "packages": [
            {
                "id": 1,
                "name": "Istanbul Adventure Package",
                "photos": [3],
                "flight": {
                    "id": 1,
                    "name": "Tehran to Istanbul Flight",
                    "summary": "Direct flight from Tehran to Istanbul",
                    "description": "Comfortable direct flight from Tehran IKA to Istanbul IST",
                    "price": "299.99",
                    "category": "flight"
                },
                "hotel": {
                    "id": 2,
                    "name": "Hilton Istanbul",
                    "summary": "Luxury 5-star hotel in Istanbul",
                    "description": "A luxury stay with top-tier amenities and excellent city views",
                    "price": "250.00",
                    "category": "hotel"
                },
                "activities": [
                    {
                        "id": 3,
                        "name": "City Tour",
                        "summary": "Guided tour of Istanbul",
                        "description": "Explore Istanbul's most famous landmarks with an experienced guide",
                        "price": "50.00",
                        "category": "tourism"
                    }
                ],
                "price": "599.99",
                "start_date": "2025-03-01",
                "end_date": "2025-03-05",
                "published": true,
                "available_units": 20
            },
            {
                "id": 2,
                "name": "Dubai Luxury Getaway",
                "photos": [5],
                "flight": {
                    "id": 2,
                    "name": "Tehran to Dubai Flight",
                    "summary": "Direct flight from Tehran to Dubai",
                    "description": "Business-class direct flight from Tehran IKA to Dubai DXB",
                    "price": "350.00",
                    "category": "flight"
                },
                "hotel": {
                    "id": 3,
                    "name": "Burj Al Arab",
                    "summary": "7-star hotel experience in Dubai",
                    "description": "The world's most luxurious hotel with breathtaking ocean views",
                    "price": "1000.00",
                    "category": "hotel"
                },
                "activities": [
                    {
                        "id": 4,
                        "name": "Desert Safari",
                        "summary": "Exciting desert adventure",
                        "description": "Experience dune bashing, camel rides, and a traditional Arabian dinner",
                        "price": "100.00",
                        "category": "tourism"
                    }
                ],
                "price": "1499.99",
                "start_date": "2025-04-10",
                "end_date": "2025-04-15",
                "published": true,
                "available_units": 15
            }
        ]
    }
}
