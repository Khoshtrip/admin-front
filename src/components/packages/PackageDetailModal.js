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
                    {packageData?.flight && (
                        <ListGroup.Item>
                            <strong>Flight:</strong> {packageData.flight.name}
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
                                    <li key={activity.id}>{activity.name}</li>
                                ))}
                            </ul>
                        </ListGroup.Item>
                    )}
                </ListGroup>
            </Modal.Body>
        </Modal>
    );
};

export default PackageDetailModal;
