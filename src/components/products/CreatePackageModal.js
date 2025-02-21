import React, { useState } from "react";
import "../../styles/core/Login.css";
import { Form, Modal, Button, Col, Row } from "react-bootstrap";
import { ProductsApi } from "../../apis/ProductsApi";
import { ImagesApi } from "../../apis/ImagesApi";
import Khoshpinner from "../core/Khoshpinner";
import { showGlobalAlert } from "../core/KhoshAlert";

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

const CreatePackageModal = ({ show, onHide, postCreate, selectedProducts }) => {
    const [productData, setProductData] = useState({
        name: "",
        photos: [],
        description: "",
        price: "",
        discount: "",
        available_units: "",
        selectedImages: [],
    });
    const [touch, setTouch] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

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
        setIsLoading(true);
        const { selectedImages } = productData;

        setProductData((prev) => ({
            ...prev,

            hotel: selectedProducts.find(
                (product) => product.category === "hotel"
            ).id,

            flight: selectedProducts.find(
                (product) => product.category === "flight"
            ).id,

            activities: selectedProducts
                .filter(
                    (product) =>
                        product.category !== "hotel" ||
                        product.category !== "flight"
                )
                .map((product) => product.id),
        }));

        uploadImagesHelper(selectedImages)
            .then(async (imageIds) => {
                setProductData((prev) => ({ ...prev, images: imageIds }));

                await ProductsApi.createProduct({
                    ...productData,
                    images: imageIds,
                })
                    .then((response) => {
                        showGlobalAlert({
                            variant: "success",
                            message: "Product updated successfully",
                        });
                        onClose(response);
                        postCreate();
                    })
                    .catch((error) => {
                        showGlobalAlert({
                            variant: "danger",
                            message: "Error updating product",
                        });
                    })
                    .finally(() => {
                        setIsLoading(false);
                    });
            })
            .catch((error) => {
                showGlobalAlert({
                    variant: "danger",
                    message: "Error uploading product",
                });
            });
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
            case "stock":
                newErrors.stock = isNaN(value) ? "Stock must be a number" : "";
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
        setProductData({
            name: "",
            description: "",
            price: "",
            discount: "",
            stock: "",
            category: "",
            start_date: "",
            end_date: "",
            selectedImages: [],
            photos: [],
            hotel: 0,
            flight: 0,
            activities: [],
            available_units: 0,
        });
    };

    const onClose = (product) => {
        onHide(product);
        resetState();
    };

    return (
        <Modal show={show} onHide={onClose} fullscreen="md-down" centered>
            <Modal.Header closeButton>
                <Modal.Title>New Package</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="Name" as={Row}>
                        <Form.Label column sm="2">
                            Name*
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control
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
                            Description*
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control
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
                            Price*
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control
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

                    {/* <Form.Group controlId="Discount" as={Row}>
                        <Form.Label column sm="2">
                            Discount*
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control
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
                    </Form.Group> */}

                    <Form.Group controlId="Stock" as={Row}>
                        <Form.Label column sm="2">
                            Stock*
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control
                                type="text"
                                name="stock"
                                value={productData.stock}
                                onChange={handleChange}
                                isValid={touch.stock && !errors.stock}
                                isInvalid={!!errors.stock}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.stock}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>

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

                    <Form.Group controlId="StartDate" as={Row}>
                        <Form.Label column sm="2">
                            Start Date*
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control
                                type="date"
                                name="start_date"
                                value={productData.start_date}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group controlId="EndDate" as={Row}>
                        <Form.Label column sm="2">
                            End Date*
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control
                                type="date"
                                name="end_date"
                                value={productData.end_date}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                    </Form.Group>

                    <Modal.Footer as={Row} className="mb-0 pb-0">
                        <Button
                            variant="outline-success"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? <Khoshpinner /> : "Save"}
                        </Button>
                        <Button
                            variant="outline-primary"
                            onClick={() => {
                                onClose();
                            }}
                        >
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default CreatePackageModal;
