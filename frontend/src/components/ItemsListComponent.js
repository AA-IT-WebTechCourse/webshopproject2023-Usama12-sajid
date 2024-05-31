import React, { useState } from 'react';
import ItemComponent from './ItemComponent';

export default function ItemsListComponent({ items, showStatus = false, handleShowEditItem, handleAddToCart }) {
    const itemsPerPage = 8;
    const [currentPage, setCurrentPage] = useState(0);

    const pageCount = Math.ceil(items.length / itemsPerPage);
    const startOffset = currentPage * itemsPerPage;
    const currentItems = items.slice(startOffset, startOffset + itemsPerPage);

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="container">
            <div className="row">
                {currentItems.map(item => (
                    <ItemComponent
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        description={item.description}
                        price={item.price}
                        created_at={item.created_at}
                        seller={item.seller}
                        status={item.status}
                        showStatus={showStatus}
                        handleAddToCart={handleAddToCart}
                        handleShowEditItem={handleShowEditItem}
                    />
                ))}
            </div>
            <nav className="d-flex justify-content-center">
                <ul className="pagination mx-auto">
                    {[...Array(pageCount)].map((_, i) => (
                        <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
                            <a className="page-link" onClick={(e) => {
                                e.preventDefault();
                                handlePageClick(i);
                            }}>
                                {i + 1}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};