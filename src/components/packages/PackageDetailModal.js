import React, { useEffect, useState } from "react";
import {
    Form,
    Modal,
    Button,
    Col,
    Row,
    Carousel,
    ListGroup,
} from "react-bootstrap";
import { PackagesApi } from "../../apis/PackagesApi"; // API call to fetch package details
import Khoshpinner from "../core/Khoshpinner";
import { showGlobalAlert } from "../core/KhoshAlert";

const PackageModalModes = {
    EDIT: "edit",
    VIEW: "view",
};

const PackageDetailModal = ({ show, onHide, packageId }) => {
    const [packageData, setPackageData] = useState({
        name: "",
        description: "",
        price: "",
        photos: [],
    });
    const [backupData, setBackupData] = useState({});
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState(PackageModalModes.VIEW);
    const [touch, setTouch] = useState({});
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const value =
            e.target.name === "selectedImages"
                ? e.target.files
                : e.target.value.replace(/[۰-۹]/g, (d) =>
                      "۰۱۲۳۴۵۶۷۸۹".indexOf(d)
                  );
        setPackageData({ ...packageData, [e.target.name]: value });
        validateField(e.target.name, value);
        setTouch({ ...touch, [e.target.name]: true });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (backupData !== packageData) {
            await PackagesApi.updatePackage(packageId, packageData)
                .then(() => {
                    showGlobalAlert({
                        variant: "success",
                        message: "Package updated successfully",
                    });
                    onClose(packageData);
                })
                .catch((error) => {
                    showGlobalAlert({
                        shouldShow: true,
                        variant: "danger",
                        message: "Error updating package",
                    });
                });
        }
        setLoading(false);
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
            default:
                break;
        }
        setErrors(newErrors);
    };

    const fetchPackage = async () => {
        try {
            setLoading(true);
            PackagesApi.getPackageById(packageId)
                .then((data) =>
                    setPackageData({
                        ...data.data,
                        photos: data.data.photos.map(
                            (image) =>
                                `http://localhost:8000/api/image/${image}/download/`
                        ),
                    })
                )
                .finally(() => setLoading(false));
        } catch (error) {
            setLoading(false);
            showGlobalAlert({
                variant: "danger",
                message: "Error fetching packages",
            });
        }
    };

    const onDeletePackage = async (packageId) => {
        try {
            setLoading(true);
            await PackagesApi.deletePackage(packageId);
            showGlobalAlert({
                variant: "success",
                message: "Package deleted successfully",
            });
            onClose(packageData, true);
        } catch (error) {
            setLoading(false);
            showGlobalAlert({
                variant: "danger",
                message: "Error deleting package",
            });
        } finally {
            setLoading(false);
        }
    };

    const resetState = () => {
        setErrors({});
        setTouch({});
        setViewMode(PackageModalModes.VIEW);
    };

    const onClose = (packageData, isDelete) => {
        onHide(packageData, isDelete);
        resetState();
    };

    useEffect(() => {
        if (packageId) {
            fetchPackage();
        }
    }, [packageId]);

    return (
        <Modal show={show} onHide={onHide} fullscreen="md-down" centered>
            {loading && <Khoshpinner />}
            <Modal.Header closeButton>
                <Modal.Title>Package Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {packageData?.photos.length > 0 && (
                    <Carousel>
                        {packageData.photos.map((photo, index) => (
                            <Carousel.Item key={index}>
                                <img
                                    className="d-block w-100"
                                    src={photo}
                                    alt="Package"
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
                )}

                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="Name" as={Row}>
                        <Form.Label column sm="2">
                            Name
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control
                                plaintext={viewMode === PackageModalModes.VIEW}
                                readOnly={viewMode === PackageModalModes.VIEW}
                                type="text"
                                name="name"
                                value={packageData.name}
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
                                plaintext={viewMode === PackageModalModes.VIEW}
                                readOnly={viewMode === PackageModalModes.VIEW}
                                type="text"
                                name="description"
                                value={packageData.description}
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
                                plaintext={viewMode === PackageModalModes.VIEW}
                                readOnly={viewMode === PackageModalModes.VIEW}
                                type="text"
                                name="price"
                                value={packageData.price}
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

                    <Form.Group controlId="Stock" as={Row}>
                        <Form.Label column sm="2">
                            Stock
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control
                                plaintext={viewMode === PackageModalModes.VIEW}
                                readOnly={viewMode === PackageModalModes.VIEW}
                                type="text"
                                name="available_units"
                                value={packageData.available_units}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group controlId="StartDate" as={Row}>
                        <Form.Label column sm="2">
                            Start Date
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control
                                plaintext={viewMode === PackageModalModes.VIEW}
                                readOnly={viewMode === PackageModalModes.VIEW}
                                type="date"
                                name="start_date"
                                value={packageData.start_date}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group controlId="EndDate" as={Row}>
                        <Form.Label column sm="2">
                            Start Date
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control
                                plaintext={viewMode === PackageModalModes.VIEW}
                                readOnly={viewMode === PackageModalModes.VIEW}
                                type="date"
                                name="end_date"
                                value={packageData.end_date}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                    </Form.Group>

                    <ListGroup variant="flush">
                        <hr/>
                        {packageData?.flight && (
                            <ListGroup.Item>
                                <strong>Flight:</strong>{" "}
                                {packageData.flight.name}
                            </ListGroup.Item>
                        )}
                        {packageData?.hotel && (
                            <ListGroup.Item>
                                <strong>Hotel:</strong> {packageData.hotel.name}
                            </ListGroup.Item>
                        )}
                        {packageData?.activities?.length > 0 && (
                            <ListGroup.Item>
                                <strong>Activities:</strong>
                                <ul className="m-0 ps-3">
                                    {packageData.activities.map((activity) => (
                                        <li key={activity.id}>
                                            {activity.name}
                                        </li>
                                    ))}
                                </ul>
                            </ListGroup.Item>
                        )}
                    </ListGroup>

                    <Modal.Footer as={Row}>
                        {viewMode === PackageModalModes.EDIT ? (
                            <>
                                <Button variant="outline-success" type="submit">
                                    Save
                                </Button>
                                <Button
                                    variant="outline-primary"
                                    onClick={() => {
                                        onClose();
                                        setPackageData(backupData);
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
                                        setViewMode(PackageModalModes.EDIT);
                                        setBackupData(packageData);
                                    }}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    onClick={() => {
                                        onDeletePackage(packageData.id);
                                    }}
                                >
                                    Delete Package
                                </Button>
                            </>
                        )}
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default PackageDetailModal;
