import React, { useState, useEffect } from "react";
import PackageCard from "../components/packages/PackageCard";
import PackageDetailModal from "../components/packages/PackageDetailModal";
import { PackagesApi } from "../apis/PackagesApi";
import { Row, Col, Container } from "react-bootstrap";
import PaginationItems from "../components/core/PaginationItems";
import Khoshpinner from "../components/core/Khoshpinner";
import { showGlobalAlert } from "../components/core/KhoshAlert";
import PackagesPageHeader from "../components/packages/PackagesPageHeader";

const PackageList = ({ packages, onPackageClick }) => {
    return (
        <Row className="pt-2 mb-3 g-4 justify-content-mx-center" md="auto">
            {packages.map((pkg) => (
                <Col key={pkg.id} className="mb-3">
                    <PackageCard pkg={pkg} onPackageClick={onPackageClick} />
                </Col>
            ))}
            {packages.length === 0 && (
                <h1 className="text-center">No packages found</h1>
            )}
        </Row>
    );
};

const PackagesPage = () => {
    const [packages, setPackages] = useState([]);
    const [selectedPackageId, setSelectedPackageId] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [filters, setFilters] = useState({});
    const [npages, setNpages] = useState(1);
    const [limit, setLimit] = useState(10);
    const [isLoading, setIsLoading] = useState(false);

    const onFilterChange = (filters) => {
        setFilters(filters);
    };

    const fetchPackages = async (page) => {
        setIsLoading(true);
        await PackagesApi.getPackages(filters, (page - 1) * limit, limit)
            .then((response) => {
                console.log(response);
                setPackages(
                    response.data.packages.map((pkg) => {
                        return {
                            ...pkg,
                            photos: pkg.photos.map((id) => 
                                `http://localhost:8000/api/image/${id}/download/`),
                        };
                    })
                );
                setNpages(Math.ceil(response.data.count / limit));
            })
            .catch((error) => {
                showGlobalAlert({
                    variant: "danger",
                    message: "Error fetching packages",
                });
            })
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        fetchPackages(1);
    }, []);

    const updatePackages = (pkg, isDelete = false) => {
        if (isDelete) {
            setPackages(packages.filter((item, _) => item.id !== pkg.id));
            setSelectedPackageId(undefined);
        } else {
            setPackages(
                packages.map((item) => (item.id === pkg.id ? pkg : item))
            );
        }
    };

    if (isLoading) {
        return <Khoshpinner />;
    }
    return (
        <>
            <Container className="d-flex flex-column justify-content-center align-items-center mt-4 mb-2">
                <PackagesPageHeader
                    className="d-flex flex-column pt-4"
                    onFilterChange={onFilterChange}
                    onApplyFilters={fetchPackages}
                />
                <PackageList
                    packages={packages}
                    onPackageClick={(id) => {
                        setSelectedPackageId(id);
                        setShowDetailModal(true);
                    }}
                />
                {packages.length !== 0 && (
                    <PaginationItems
                        onPageClick={(page) => {
                            fetchPackages(page);
                        }}
                        pageCount={npages}
                        className="text-center align-items-center"
                    />
                )}
            </Container>
            <PackageDetailModal
                show={showDetailModal}
                onHide={(packageData, isDelete) => {
                    if (packageData !== undefined)
                        updatePackages(packageData, isDelete);
                    setShowDetailModal(false);
                }}
                packageId={selectedPackageId}
            />
        </>
    );
};

export default PackagesPage;
