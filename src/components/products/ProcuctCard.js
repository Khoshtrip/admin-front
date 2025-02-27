import { Card, Badge, ListGroup, Stack } from "react-bootstrap";
import { useState } from "react";
import { productCategories } from "../../utils/constants";

export const ProductCard = ({
    product,
    onProductClick,
    isSelected,
    onSelectProduct,
}) => {
    const [isHovered, setIsHoverd] = useState(false);

    const newPrice =
        product.discount > 0
            ? (product.price * (1 - product.discount / 100)).toFixed(2)
            : product.price;

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
                        onSelectProduct(
                            product.id,
                            product.name,
                            product.category,
                            event.target.checked
                        );
                    }}
                />
            )}
            <Card.Img
                variant="top"
                src={product.imageUrl}
                style={{
                    minBlockSize: "200px",
                    maxBlockSize: "200px",
                    objectFit: "contain",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
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
                    Stocks Available: {product.stock}
                </ListGroup.Item>
            </ListGroup>
            <Card.Footer className="justify-content-center">
                <Badge
                    pill
                    bg="dark"
                    className="p-2 px-4"
                    style={{ width: "100%" }}
                >
                    {productCategories[product.category]}
                </Badge>
            </Card.Footer>
        </Card>
    );
};
