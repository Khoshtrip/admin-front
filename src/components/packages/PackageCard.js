import React, { useState } from "react";
import { Card, Badge, Carousel, ListGroup, Stack } from "react-bootstrap";

const PackageCard = ({ pkg, onPackageClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };
    return (
        <Card
            className="h-100"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ width: "18rem", transition: "0.3s", cursor: "pointer" }}
            onClick={() => onPackageClick(pkg.id)}
        >
            <Carousel
                activeIndex={index}
                onSelect={handleSelect}
                controls={isHovered}
                indicators={isHovered}
            >
                {pkg.photos.length > 0 ? (
                    pkg.photos.map((photo, i) => (
                        <Carousel.Item key={i}>
                            <Card.Img
                                variant="top"
                                src={photo}
                                alt="Package Image"
                                sizes="(max-width: 600px) 150px"
                            />
                        </Carousel.Item>
                    ))
                ) : (
                    <Carousel.Item>
                        <Card.Img
                            variant="top"
                            src="/default.jpg"
                            alt="Default Package Image"
                            sizes="(max-width: 600px) 150px"
                        />
                    </Carousel.Item>
                )}
            </Carousel>

            <Card.Body>
                <Stack direction="vertical" gap={1}>
                    <Card.Title className="text-center">{pkg.name}</Card.Title>
                    <Stack direction="horizontal">
                        <strong>Start Date:</strong>
                        <div className="ms-auto">{pkg.start_date}</div>
                    </Stack>
                    <Stack direction="horizontal">
                        <strong>End Date:</strong>
                        <div className="ms-auto">{pkg.end_date}</div>
                    </Stack>
                    <Badge bg="primary mt-2">${pkg.price}</Badge>
                </Stack>
                <hr />
                <Stack direction="vertical" gap={1}>
                    <strong>Flight:</strong>
                    <div>{pkg.flight.name}</div>
                    <strong>Hotel:</strong>
                    <div>{pkg.hotel.name}</div>
                    <strong>Activities:</strong>
                    {pkg.activities.length > 0 ? (
                        pkg.activities.map((activity) => (
                            <div key={activity.id}>{activity.name}</div>
                        ))
                    ) : (
                        <div>No Activities</div>
                    )}
                </Stack>
            </Card.Body>
            <Card.Footer>
                <small className="text-muted">
                    Available: {pkg.available_units}
                </small>
            </Card.Footer>
        </Card>
    );
};

export default PackageCard;
