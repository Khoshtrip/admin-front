import React, { useEffect, useState } from "react";
import { Modal, Button, Carousel, ListGroup } from "react-bootstrap";
import { PackagesApi } from "../../apis/PackagesApi"; // API call to fetch package details
import Khoshpinner from "../core/Khoshpinner";

const PackageDetailModal = ({ show, onHide, packageId }) => {
    const [packageData, setPackageData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (packageId) {
            setLoading(true);
            PackagesApi.getPackageById(packageId)
                .then((data) => setPackageData(data.data))
                .finally(() => setLoading(false));
        }
    }, [packageId]);

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            {loading && <Khoshpinner />}
            <Modal.Header closeButton>
                <Modal.Title>{packageData?.name}</Modal.Title>
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
                                />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                )}
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <strong>Price:</strong> ${packageData?.price}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <strong>Start Date:</strong> {packageData?.start_date}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <strong>End Date:</strong> {packageData?.end_date}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <strong>Available Units:</strong>{" "}
                        {packageData?.available_units}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <strong>Description:</strong> {packageData?.description}
                    </ListGroup.Item>
                </ListGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PackageDetailModal;
