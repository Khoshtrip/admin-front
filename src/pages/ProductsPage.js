import React, { useEffect, useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { ProductCard } from "../components/products/ProcuctCard";
import ProductDetailModal from "../components/products/ProductDetailModal";
import ProductsPageHeader from "../components/products/ProductsPageHeader";
import CreateProductModal from "../components/products/CreateProdcutModal";
import { ProductsApi } from "../apis/ProductsApi";
import { showGlobalAlert } from "../components/core/KhoshAlert";
import "../styles/products/Products.css";
import Khoshpinner from "../components/core/Khoshpinner";
import PaginationItems from "../components/core/PaginationItems";

const ProductsPage = () => {
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [productDetailId, setProductDetailId] = useState(undefined);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [filters, setFilters] = useState({});
    const [products, setProducts] = useState([]);
    const [npages, setNpages] = useState(1);
    const [limit, setLimit] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);

    const onFilterChange = (filters) => {
        setFilters(filters);
    };

    const fetchProducts = async (page) => {
        setIsLoading(true);
        await ProductsApi.getProducts(filters, (page - 1) * limit, limit)
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

    const changeProoductStatus = (productId, isActive) => {
        const index = products.findIndex((item) => item.id === productId);
        if (index !== -1) {
            const product = products[index];
            product.isActive = isActive;
            setProducts(
                products.map((item, i) => (i === index ? product : item))
            );
        }
    };

    const onSelectProduct = (productId, isSelected) => {
        if (isSelected) {
            setSelectedProducts((prev) => [...prev, productId]);
        } else {
            setSelectedProducts((prev) =>
                prev.filter((id) => id !== productId)
            );
        }
    };

    const onBulkDelete = () => {
        ProductsApi.bulkDelete(selectedProducts)
            .then((response) => {
                setSelectedProducts([]);
                fetchProducts(1);
                showGlobalAlert({
                    title: "Products Deleted",
                    message: "Selected products have been deleted",
                    variant: "success",
                });
            })
            .catch((error) => {
                showGlobalAlert({
                    title: "Error",
                    message: "Failed to delete products",
                    variant: "danger",
                });
            });
    };

    const onBulkInventoryChange = (value) => {
        ProductsApi.buldChangeInventory(selectedProducts, value)
            .then((response) => {
                setSelectedProducts([]);
                fetchProducts(1);
                showGlobalAlert({
                    title: "Products Inventory Updated",
                    message: "Selected products inventory has been updated",
                    variant: "success",
                });
            })
            .catch((error) => {
                showGlobalAlert({
                    title: "Error",
                    message: "Failed to update products inventory",
                    variant: "danger",
                });
            });
    };

    return (
        <>
            <Container className="d-flex flex-column justify-content-center align-items-center mt-4 mb-2">
                <ProductsPageHeader
                    className="d-flex flex-column"
                    selectedProducts={selectedProducts}
                    onBulkDelete={onBulkDelete}
                    onBulkInventoryChange={onBulkInventoryChange}
                    onAddNewProductClick={() => {
                        setShowCreateModal(true);
                    }}
                    onFilterChange={onFilterChange}
                    onApplyFilters={() => {
                        fetchProducts(1);
                    }}
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
                                        onChangeProductStatus={
                                            changeProoductStatus
                                        }
                                        isSelected={
                                            selectedProducts.indexOf(
                                                product.id
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
            <CreateProductModal
                show={showCreateModal}
                onHide={(product) => {
                    if (product !== undefined) updateProducts(product);
                    setShowCreateModal(false);
                }}
                postCreate={() => {
                    fetchProducts(1);
                }}
            />
        </>
    );
};

export default ProductsPage;
