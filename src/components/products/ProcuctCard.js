import {
    Card,
    Badge,
    ListGroup,
    Stack,
    Button,
    Col,
    Row,
} from "react-bootstrap";
import { useState } from "react";
import { ProductsApi } from "../../apis/ProductsApi";
import { productCategories } from "../../utils/constants";
import { showGlobalAlert } from "../core/KhoshAlert";

export const ProductCard = ({
    product,
    onProductClick,
    onChangeProductStatus,
    isSelected,
    onSelectProduct,
}) => {
    const [isHovered, setIsHoverd] = useState(false);

    const newPrice =
        product.discount > 0
            ? (product.price * (1 - product.discount / 100)).toFixed(2)
            : product.price;

    const onChangeStatusClick = (productId, status) => {
        if (status === true) {
            ProductsApi.deactivateProduct(productId)
                .then((response) => {
                    onChangeProductStatus(product.id, false);
                    showGlobalAlert({
                        title: "Product Deactivated",
                        message: "Product has been deactivated successfully",
                        variant: "success",
                    });
                })
                .catch((error) => {
                    showGlobalAlert({
                        title: "Error",
                        message: "Failed to deactivate product",
                        variant: "danger",
                    });
                });
        } else {
            ProductsApi.activateProduct(productId)
                .then((response) => {
                    onChangeProductStatus(product.id, true);
                    showGlobalAlert({
                        title: "Product Activated",
                        message: "Product has been activated successfully",
                        variant: "success",
                    });
                })
                .catch((error) => {
                    showGlobalAlert({
                        title: "Error",
                        message: "Failed to activate product",
                        variant: "danger",
                    });
                });
        }
    };

    return (
        <Card
            style={{ width: "18rem" }}
            onMouseEnter={() => setIsHoverd(true)}
            onMouseLeave={() => setIsHoverd(false)}
        >
            {(isHovered || isSelected) && (
                <input
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        cursor: "pointer",
                    }}
                    type="checkbox"
                    checked={isSelected}
                    onChange={(event) => {
                        event.stopPropagation();
                        onSelectProduct(product.id, event.target.checked);
                    }}
                />
            )}
            <Card.Img
                variant="top"
                src={product.imageUrl}
                sizes="(max-width: 600px) 150px"
            />

            <Card.Body
                onClick={() => onProductClick(product.id)}
                style={{ cursor: "pointer" }}
            >
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>{product.description}</Card.Text>
            </Card.Body>
            <ListGroup
                className="list-group-flush"
                onClick={() => onProductClick(product.id)}
                style={{ cursor: "pointer" }}
            >
                <ListGroup.Item>
                    <Stack direction="horizontal" gap={2}>
                        <strong>Price:</strong>
                        <span>
                            {product.discount > 0 ? (
                                <>
                                    <del>{product.price}$</del>
                                    <strong className="ms-2">
                                        {newPrice}$
                                    </strong>
                                    <Badge
                                        pill
                                        bg="danger"
                                        className="ms-2 p-1 px-4"
                                    >
                                        {product.discount}% OFF
                                    </Badge>
                                </>
                            ) : (
                                <strong className="ms-2">{newPrice}$</strong>
                            )}
                        </span>
                    </Stack>
                </ListGroup.Item>
                <ListGroup.Item>
                    {product.stock > 0
                        ? product.stock < 10
                            ? "Less Than 10 remaining"
                            : "In stock"
                        : "Out of stock"}
                </ListGroup.Item>
            </ListGroup>
            <Card.Footer>
                <Row className="justify-content-between align-items-center">
                    <Col>
                        <Badge pill bg="dark" className="p-2 px-3">
                            {productCategories[product.category]}
                        </Badge>
                    </Col>
                    <Col>
                        <Button
                            className="ms-5"
                            size="sm"
                            onClick={(event) => {
                                event.stopPropagation();
                                onChangeStatusClick(
                                    product.id,
                                    product.isActive
                                );
                            }}
                        >
                            {product.isActive ? "Deactivate" : "Ativate"}
                        </Button>
                    </Col>
                </Row>
            </Card.Footer>
        </Card>
    );
};
