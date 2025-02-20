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
} from "react-bootstrap";
import { ProductsApi } from "../../apis/ProductsApi";
import { ImagesApi } from "../../apis/ImagesApi";
import Khoshpinner from "../core/Khoshpinner";
import { showGlobalAlert } from "../core/KhoshAlert";
import { productCategories } from "../../utils/constants";

function uploadImagesHelper(selectedImages) {
    return new Promise((resolve, reject) => {
        if (!selectedImages || selectedImages.length === 0) {
            return resolve([]); // Resolve with an empty array if no images are provided
        }

        const imageIds = [];
        const uploadPromises = selectedImages.map(async (image) => {
            const formData = new FormData();
            formData.append("file", image);

            return ImagesApi.uploadImage(formData)
                .then((response) => {
                    imageIds.push(response.imageId);
                })
                .catch((error) => {
                    reject(new Error("Error uploading product")); // Reject with a specific error
                });
        });

        // Wait for all uploads to complete
        Promise.all(uploadPromises)
            .then(() => resolve(imageIds))
            .catch((error) => reject(error)); // Pass through the error if one occurs
    });
}

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

const ProductModalModes = {
    EDIT: "edit",
    VIEW: "view",
};

const ProductDetailModal = ({ show, onHide, productId }) => {
    const [backupData, setBackupData] = useState({});
    const [viewMode, setViewMode] = useState(ProductModalModes.VIEW);
    const [productData, setProductData] = useState({
        name: "",
        description: "",
        price: "",
        discount: "",
        category: "",
        summary: "",
        selectedImages: [],
    });
    const [touch, setTouch] = useState({});
    const [isLoading, setIsLoading] = useState({
        CTA: false,
        fetch: true,
    });
    const [errors, setErrors] = useState({});

    const fetchProduct = async () => {
        try {
            setIsLoading({ ...isLoading, fetch: true });
            const product = await ProductsApi.getProductById(productId);
            setProductData({
                ...product.data,
                imageUrls: product.data.images.map(
                    (image) =>
                        `http://localhost:8000/api/image/${image}/download/`
                ),
            });
        } catch (error) {
            setIsLoading({ ...isLoading, fetch: false });
            showGlobalAlert({
                variant: "danger",
                message: "Error fetching product",
            });
        } finally {
            setIsLoading({ ...isLoading, fetch: false });
        }
    };

    useEffect(() => {
        if (productId != undefined || productId != null) fetchProduct();
    }, [show]);

    const onDeleteProduct = async (productId) => {
        try {
            setIsLoading({ ...isLoading, CTA: true });
            await ProductsApi.deleteProduct(productId);
            showGlobalAlert({
                variant: "success",
                message: "Product deleted successfully",
            });
            onClose(productData, true);
        } catch (error) {
            setIsLoading({ ...isLoading, CTA: false });
            showGlobalAlert({
                variant: "danger",
                message: "Error deleting product",
            });
        } finally {
            setIsLoading({ ...isLoading, CTA: false });
        }
    };

    const handleChange = (e) => {
        const value =
            e.target.name === "selectedImages"
                ? e.target.files
                : e.target.value.replace(/[۰-۹]/g, (d) =>
                      "۰۱۲۳۴۵۶۷۸۹".indexOf(d)
                  );
        setProductData({ ...productData, [e.target.name]: value });
        validateField(e.target.name, value);
        setTouch({ ...touch, [e.target.name]: true });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading({ ...isLoading, CTA: true });
        const { selectedImages } = productData;
        if (selectedImages && selectedImages.length > 0) {
            const formData = new FormData();
            selectedImages.forEach((image) => {
                formData.append("file", image);
            });
            await ImagesApi.uploadImage(formData)
                .then(() => {
                    showGlobalAlert({
                        variant: "success",
                        message: "Images uploaded successfully",
                    });
                })
                .catch((error) => {
                    showGlobalAlert({
                        variant: "danger",
                        message: "Error uploading product",
                    });
                });
        }
        if (backupData !== productData) {
            await ProductsApi.updateProduct(productId, productData)
                .then(() => {
                    showGlobalAlert({
                        variant: "success",
                        message: "Product updated successfully",
                    });
                    onClose(productData);
                })
                .catch((error) => {
                    showGlobalAlert({
                        shouldShow: true,
                        variant: "danger",
                        message: "Error updating product",
                    });
                });
        }
        setIsLoading({ ...isLoading, CTA: false });
    };

    const validateField = (fieldName, value) => {
        let newErrors = { ...errors };
        switch (fieldName) {
            case "price":
                newErrors.price = isNaN(value)
                    ? "Price must be a number"
                    : value < 0 ||
                      value > 1000000 ||
                      value === "" ||
                      value === null
                    ? "Price must be between 0 and 1000000"
                    : "";
                break;
            case "discount":
                newErrors.discount = isNaN(value)
                    ? "Discount must be a number"
                    : value < 0 || value > 100 || value === "" || value === null
                    ? "Discount must be between 0 and 100"
                    : "";
                break;

            case "selectedImages":
                const files = Array.from(value);
                const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
                const validFiles = files.filter((file) =>
                    allowedTypes.includes(file.type)
                );

                if (validFiles.length !== files.length) {
                    newErrors.selectedImages =
                        "Only .png and .jpg files are allowed.";
                } else {
                    newErrors.selectedImages = "";
                    setProductData((prev) => ({
                        ...prev,
                        selectedImages: files,
                    }));
                }
                break;
            default:
                break;
        }
        setErrors(newErrors);
    };

    const resetState = () => {
        setErrors({});
        setTouch({});
        setViewMode(ProductModalModes.VIEW);
    };

    const onClose = (product, isDelete) => {
        onHide(product, isDelete);
        resetState();
    };

    return (
        <Modal show={show} onHide={onClose} fullscreen="md-down" centered>
            <Modal.Header closeButton>
                <Modal.Title>Product Details</Modal.Title>
            </Modal.Header>
            {!isLoading.fetch && (
                <Modal.Body>
                    {productData.imageUrls && (
                        <ImageCarousels images={productData.imageUrls} />
                    )}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="Name" as={Row}>
                            <Form.Label column sm="2">
                                Name
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control
                                    plaintext={
                                        viewMode === ProductModalModes.VIEW
                                    }
                                    readOnly={
                                        viewMode === ProductModalModes.VIEW
                                    }
                                    type="text"
                                    name="name"
                                    value={productData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group controlId="Description" as={Row}>
                            <Form.Label column sm="2">
                                Description
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control
                                    plaintext={
                                        viewMode === ProductModalModes.VIEW
                                    }
                                    readOnly={
                                        viewMode === ProductModalModes.VIEW
                                    }
                                    type="text"
                                    name="description"
                                    value={productData.description}
                                    onChange={handleChange}
                                    required
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group controlId="Price" as={Row}>
                            <Form.Label column sm="2">
                                Price
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control
                                    plaintext={
                                        viewMode === ProductModalModes.VIEW
                                    }
                                    readOnly={
                                        viewMode === ProductModalModes.VIEW
                                    }
                                    type="text"
                                    name="price"
                                    value={productData.price}
                                    onChange={handleChange}
                                    isValid={touch.price && !errors.price}
                                    isInvalid={!!errors.price}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.price}
                                </Form.Control.Feedback>
                            </Col>
                        </Form.Group>

                        <Form.Group controlId="Discount" as={Row}>
                            <Form.Label column sm="2">
                                Discount
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control
                                    plaintext={
                                        viewMode === ProductModalModes.VIEW
                                    }
                                    readOnly={
                                        viewMode === ProductModalModes.VIEW
                                    }
                                    type="text"
                                    name="discount"
                                    value={productData.discount}
                                    onChange={handleChange}
                                    isValid={touch.discount && !errors.discount}
                                    isInvalid={!!errors.discount}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.discount}
                                </Form.Control.Feedback>
                            </Col>
                        </Form.Group>

                        <Form.Group controlId="Category" as={Row}>
                            <Form.Label column sm="2">
                                Category
                            </Form.Label>
                            <Col sm="10">
                                {viewMode === ProductModalModes.VIEW ? (
                                    <Form.Control
                                        plaintext
                                        readOnly
                                        name="category"
                                        value={
                                            productCategories[
                                                productData.category
                                            ]
                                        }
                                    ></Form.Control>
                                ) : (
                                    <Form.Select
                                        name="category"
                                        value={productData.category || ""}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">
                                            Select a Category
                                        </option>
                                        {Object.entries(productCategories).map(
                                            ([key, value]) => (
                                                <option key={key} value={key}>
                                                    {value}
                                                </option>
                                            )
                                        )}
                                    </Form.Select>
                                )}
                            </Col>
                        </Form.Group>

                        <Form.Group controlId="Summary" as={Row}>
                            <Form.Label column sm="2">
                                Summary
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control
                                    plaintext={
                                        viewMode === ProductModalModes.VIEW
                                    }
                                    readOnly={
                                        viewMode === ProductModalModes.VIEW
                                    }
                                    as="textarea"
                                    rows={3}
                                    name="summary"
                                    value={productData.summary}
                                    onChange={handleChange}
                                    required
                                />
                            </Col>
                        </Form.Group>

                        {/* {viewMode === ProductModalModes.EDIT && (
                            <Form.Group controlId="SelectedImages" as={Row}>
                                <Form.Label column sm="2">
                                    Select Images
                                </Form.Label>
                                <Col sm="10">
                                    <Form.Control
                                        type="file"
                                        name="selectedImages"
                                        accept=".png,.jpg,.jpeg"
                                        onChange={handleChange}
                                        multiple
                                        isValid={
                                            touch.selectedImages &&
                                            !errors.selectedImages
                                        }
                                        isInvalid={!!errors.selectedImages}
                                    />
                                </Col>
                                <Form.Control.Feedback type="invalid">
                                    {errors.selectedImages}
                                </Form.Control.Feedback>
                            </Form.Group>
                        )} */}

                        <Modal.Footer as={Row}>
                            {viewMode === ProductModalModes.EDIT ? (
                                <>
                                    <Button
                                        variant="outline-success"
                                        type="submit"
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        variant="outline-primary"
                                        onClick={() => {
                                            onClose();
                                            setProductData(backupData);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        variant="outline-primary"
                                        onClick={() => {
                                            setViewMode(ProductModalModes.EDIT);
                                            setBackupData(productData);
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        onClick={() => {
                                            onDeleteProduct(productData.id);
                                        }}
                                    >
                                        Delete Product
                                    </Button>
                                </>
                            )}
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            )}
            {isLoading.fetch && <Khoshpinner />}
        </Modal>
    );
};

export default ProductDetailModal;
