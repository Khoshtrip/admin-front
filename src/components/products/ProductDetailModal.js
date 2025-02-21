import React, { useState, useEffect } from "react";
import "../../styles/core/Login.css";
import {
    Form,
    Modal,
    Button,
    Col,
    Row,
    Carousel,
    Image,
    Stack,
} from "react-bootstrap";
import { ProductsApi } from "../../apis/ProductsApi";
import { ImagesApi } from "../../apis/ImagesApi";
import Khoshpinner from "../core/Khoshpinner";
import { showGlobalAlert } from "../core/KhoshAlert";
import { productCategories } from "../../utils/constants";

const ImageCarousels = ({ images }) => {
    return (
        <Carousel data-bs-theme="dark" className="mb-3 mt-3">
            {images?.map((image, index) => (
                <Carousel.Item
                    key={index}
                    className="justify-content-center"
                    style={{ height: "300px", textAlign: "center" }}
                >
                    <Image
                        src={image}
                        alt={image || "ax"}
                        style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            minHeight: "100%",
                            objectFit: "contain",
                        }}
                    />
                </Carousel.Item>
            ))}
        </Carousel>
    );
};

const ProductDetailModal = ({ show, onHide, productId }) => {
    const [productData, setProductData] = useState({
        name: "",
        description: "",
        price: "",
        discount: "",
        category: "",
        summary: "",
        selectedImages: [],
    });
    const [isLoading, setIsLoading] = useState(false);

    const fetchProduct = async () => {
        try {
            setIsLoading(true);
            const product = await ProductsApi.getProductById(productId);
            setProductData({
                ...product.data,
                imageUrls: product.data.images.map(
                    (image) =>
                        `http://localhost:8000/api/image/${image}/download/`
                ),
            });
        } catch (error) {
            setIsLoading(false);
            showGlobalAlert({
                variant: "danger",
                message: "Error fetching product",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (productId != undefined || productId != null) fetchProduct();
    }, [show]);

    const onClose = (product, isDelete) => {
        onHide(product, isDelete);
    };

    return (
        <Modal show={show} onHide={onClose} fullscreen="md-down" centered>
            <Modal.Header closeButton>
                <Modal.Title>Product Details</Modal.Title>
            </Modal.Header>
            {!isLoading && (
                <Modal.Body>
                    {productData.imageUrls && (
                        <ImageCarousels images={productData.imageUrls} />
                    )}
                    <Stack gap={3}>
                        <strong>Name: {productData.name}</strong>

                        <strong>Description: {productData.description}</strong>

                        <strong>Price: {productData.price}</strong>

                        <strong>Discount: {productData.discount}</strong>

                        <strong>
                            Category: {productCategories[productData.category]}
                        </strong>

                        <strong>Summary: {productData.summary}</strong>
                    </Stack>
                </Modal.Body>
            )}
            {isLoading && <Khoshpinner />}
        </Modal>
    );
};

export default ProductDetailModal;
