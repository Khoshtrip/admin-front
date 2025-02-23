import React, { useEffect, useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { ProductCard } from "../components/products/ProcuctCard";
import ProductDetailModal from "../components/products/ProductDetailModal";
import ProductsPageHeader from "../components/products/ProductsPageHeader";
import { ProductsApi } from "../apis/ProductsApi";
import { showGlobalAlert } from "../components/core/KhoshAlert";
import "../styles/products/Products.css";
import Khoshpinner from "../components/core/Khoshpinner";
import PaginationItems from "../components/core/PaginationItems";
import CreatePackageModal from "../components/packages/CreatePackageModal";

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [npages, setNpages] = useState(1);
    const [limit, setLimit] = useState(10);
    const [isLoading, setIsLoading] = useState(false);

    const [showDetailModal, setShowDetailModal] = useState(false);
    const [productDetailId, setProductDetailId] = useState(undefined);

    const [showCreateModal, setShowCreateModal] = useState(false);

    const [filters, setFilters] = useState({});

    const [selectedProducts, setSelectedProducts] = useState([]);

    const onFilterChange = (filters) => {
        setFilters(filters);
    };

    const fetchProducts = async (page) => {
        setIsLoading(true);
        await ProductsApi.getAllProducts(filters, (page - 1) * limit, limit)
            .then((response) => {
                setProducts(
                    response.data.products.map((product) => {
                        if (product.images.length > 0) {
                            product.imageUrl = `http://localhost:8000/api/image/${product.images[0]}/download/`;
                        } else {
                            product.imageUrl =
                                "https://via.placeholder.com/150";
                        }
                        return product;
                    })
                );
                setNpages(Math.ceil(response.data.total / response.data.limit));
            })
            .catch((error) => {
                // TODO: change to display message better
                showGlobalAlert({
                    variant: "danger",
                    message: "Error fetching products",
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchProducts(1);
    }, []);

    const updateProducts = (product, isDelete = false) => {
        if (isDelete) {
            setProducts(products.filter((item, _) => item.id !== product.id));
            setProductDetailId(undefined);
        } else {
            const index = products.findIndex((item) => item.id === product.id);
            if (index !== -1) {
                setProducts(
                    products.map((item, i) => (i === index ? product : item))
                );
            } else if (products.length < limit) {
                setProducts([...products, product]);
            }
        }
    };

    const onSelectProduct = (
        productId,
        productTitle,
        productType,
        isSelected
    ) => {
        if (isSelected) {
            setSelectedProducts((prev) => [
                ...prev,
                { id: productId, title: productTitle, type: productType },
            ]);
        } else {
            setSelectedProducts((prev) =>
                prev.filter((it) => it.id !== productId)
            );
        }
    };

    const checkSelectedProducts = () => {
        return (
            selectedProducts.length !== 0 &&
            selectedProducts.findIndex((it) => it.type === "flight") !== -1 &&
            selectedProducts.findIndex((it) => it.type === "hotel") !== -1
        );
    };

    const onCreatePackage = () => {
        if (!checkSelectedProducts()) {
            showGlobalAlert({
                variant: "danger",
                message: "You must specify flight + hotel at least.",
            });
        } else {
            setShowCreateModal(true);
        }
    };

    return (
        <>
            <Container className="d-flex flex-column justify-content-center align-items-center mt-4 mb-2">
                <ProductsPageHeader
                    className="d-flex flex-column"
                    selectedProducts={selectedProducts}
                    onFilterChange={onFilterChange}
                    onApplyFilters={() => {
                        fetchProducts(1);
                    }}
                    onCreatePackage={onCreatePackage}
                    onSelectProduct={onSelectProduct}
                />

                {isLoading && <Khoshpinner />}
                {!isLoading && (
                    <>
                        <Row
                            className="mb-3 justify-content-mx-center"
                            md="auto"
                        >
                            {products.map((product, index) => (
                                <Col key={index} className="mb-3">
                                    <ProductCard
                                        product={product}
                                        onProductClick={(id) => {
                                            setProductDetailId(id);
                                            setShowDetailModal(true);
                                        }}
                                        isSelected={
                                            selectedProducts.findIndex(
                                                (it) => it.id === product.id
                                            ) !== -1
                                        }
                                        onSelectProduct={onSelectProduct}
                                    />
                                </Col>
                            ))}
                            {products.length === 0 && (
                                <h1 className="text-center">
                                    No products found
                                </h1>
                            )}
                        </Row>
                    </>
                )}
                {products.length !== 0 && (
                    <PaginationItems
                        onPageClick={(page) => {
                            fetchProducts(page);
                        }}
                        pageCount={npages}
                        className="text-center align-items-center"
                    />
                )}
            </Container>
            <ProductDetailModal
                show={showDetailModal}
                onHide={(product, isDelete) => {
                    if (product !== undefined)
                        updateProducts(product, isDelete);
                    setShowDetailModal(false);
                }}
                productId={productDetailId}
            />
            <CreatePackageModal
                show={showCreateModal}
                onHide={(product) => {
                    if (product !== undefined) updateProducts(product);
                    setShowCreateModal(false);
                }}
                postCreate={() => {
                    fetchProducts(1);
                }}
                selectedProducts={selectedProducts}
            />
        </>
    );
};

export default ProductsPage;
