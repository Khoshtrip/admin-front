import React, { useState } from "react";
import { Pagination } from "react-bootstrap";

const PaginationItems = ({ onPageClick, pageCount }) => {
    const items = [];
    const [activePage, setActivePage] = useState(1);
    for (
        let number = Math.max(activePage - 3, 1);
        number <= Math.min(activePage + 3, pageCount);
        number++
    ) {
        items.push(
            <Pagination.Item
                key={number}
                active={number === activePage}
                onClick={() => {
                    onPageClick(number);
                    setActivePage(number);
                }}
            >
                {number}
            </Pagination.Item>
        );
    }

    return (
        <Pagination>
            {activePage !== 1 && (
                <Pagination.Prev
                    onClick={() => {
                        onPageClick(activePage - 1);
                        setActivePage(activePage - 1);
                    }}
                />
            )}
            {activePage > 5 && <Pagination.Ellipsis />}
            {items}
            {activePage < pageCount - 5 && <Pagination.Ellipsis />}
            {activePage < pageCount && (
                <Pagination.Next
                    onClick={() => {
                        onPageClick(activePage + 1);
                        setActivePage(activePage + 1);
                    }}
                />
            )}
        </Pagination>
    );
};

export default PaginationItems;
