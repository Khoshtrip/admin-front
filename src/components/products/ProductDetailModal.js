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
        <Carousel>
            {images?.map((image, index) => (
                <Carousel.Item key={index}>
                    <img
                        className="d-block w-100 h-100"
                        src={image}
                        alt={image || "ax"}
                        style={{
                            minBlockSize: "400px",
                            maxBlockSize: "400px",
                            objectFit: "contain",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "white",
                            overflow: "hidden",
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
                        `http://api.khosh-trip.ir/api/image/${image}/download/`
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
                        <div>
                            <strong>Name: </strong> {productData.name}
                        </div>
                        <div>
                            <strong>Description: </strong>{" "}
                            {productData.description}
                        </div>
                        <div>
                            <strong>Price: </strong> {productData.price}
                        </div>
                        <div>
                            <strong>Discount: </strong> {productData.discount}
                        </div>
                        <div>
                            <strong>Category:</strong>{" "}
                            {productCategories[productData.category]}
                        </div>

                        <div>
                            <strong>Summary: </strong> {productData.summary}
                        </div>
                    </Stack>
                </Modal.Body>
            )}
            {isLoading && <Khoshpinner />}
        </Modal>
    );
};

export default ProductDetailModal;
