import React, { useState } from "react";
import { Row, Col, Form, Button, Collapse } from "react-bootstrap";
import { productCategories } from "../../utils/constants";

let kooft = {};
const FilterComponent = ({ showFilters, onFilterChange, onApplyFilters }) => {
    const [filters, setFilters] = useState({
        search: "",
        minPrice: 0,
        maxPrice: 1000,
        stockAvailable: true,
    });

    const handleFilterChange = (key, value) => {
        if (value === "") {
            delete kooft[key];
        }
        if (key === "minPrice" && value === 0) {
            delete kooft[key];
        }
        if (key === "maxPrice" && value === 1000) {
            delete kooft[key];
        }

        kooft[key] = value;
        onFilterChange(kooft);
        setFilters({ ...filters, [key]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onApplyFilters();
    };

    return (
        <>
            <Collapse in={showFilters}>
                <div className="mb-3 w-100">
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6} className="mb-3">
                                <Form.Label>Search</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Search "
                                    name="search"
                                    value={filters.search}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "search",
                                            e.target.value
                                        )
                                    }
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6} className="mb-3 d-flex flex-column">
                                <Form.Label>Min Price</Form.Label>
                                <Form.Range
                                    value={filters.minPrice}
                                    min={0}
                                    max={1000}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "minPrice",
                                            parseInt(e.target.value)
                                        )
                                    }
                                    style={{ border: "1px" }}
                                />
                                <Form.Text>{filters.minPrice}</Form.Text>
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Label>Max Price</Form.Label>
                                <Form.Range
                                    value={filters.maxPrice}
                                    min={0}
                                    max={1000}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "maxPrice",
                                            parseInt(e.target.value)
                                        )
                                    }
                                    style={{ border: "1px" }}
                                />
                                <Form.Text>{filters.maxPrice}</Form.Text>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6} className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    label="Stock Available"
                                    name="stockAvailable"
                                    checked={filters.stockAvailable}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "stockAvailable",
                                            e.target.checked
                                        )
                                    }
                                />
                                <Form.Check
                                    type="checkbox"
                                    label="Is Active"
                                    name="isActive"
                                    checked={filters.isActive}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "isActive",
                                            e.target.checked
                                        )
                                    }
                                />
                            </Col>
                            <Col md={6} className="mb-3">
                                <Button type="submit">Search</Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Collapse>
        </>
    );
};

const PackagesPageHeader = ({ onFilterChange, onApplyFilters }) => {
    const [showFilters, setShowFilters] = useState(false);

    return (
        <>
            <Row className="mb-1 d-flex" style={{ width: "100%" }}>
                <Col>
                    <h1 className="ms-4 float-start rounded-pill">Packages</h1>
                </Col>
                <Col>
                    <Button
                        variant="primary"
                        onClick={() => setShowFilters((prev) => !prev)}
                        className="float-end rounded-pill px-3 me-2"
                    >
                        Filters
                    </Button>
                </Col>
                <hr className="my-2 border-primary" />
            </Row>
            <FilterComponent
                onFilterChange={onFilterChange}
                showFilters={showFilters}
                onApplyFilters={onApplyFilters}
            />
        </>
    );
};

export default PackagesPageHeader;
