import React from 'react';
import { formatDate } from '../utils/moment';
import { useAuth } from '../utils/authUtils';

export default function ItemComponent({ id, title, description, price, created_at, seller, status = null, showStatus, handleShowEditItem, handleAddToCart }) {
    const userId = localStorage.getItem('user_id');
    const { isLoggedIn } = useAuth();

    // Check if the item's seller ID matches the user ID
    const isOwnItem = seller == userId;

    function getItemStatus() {
        if (isOwnItem) {
            if (status == "0") {
                return "Sold";
            } else {
                return "On Sale";
            }
        } else {
            return "Purchased";
        }
    }

    return (
        <div key={id} className="col-sm-12 col-md-6 col-lg-4 col-xl-3 mb-4 mx-4">
            <div className="card" style={{ width: '18rem' }}>
                <img className="card-img-top" src="/assets/img/card-img.jpg" alt="Item" />
                <div className="card-body">
                    <h5 className="card-title">{title}</h5>
                    <p className="card-text"><b>Description</b>:<br/>{description}</p>
                    <h6 className="card-title">Price: {price} Euros</h6>
                    {showStatus ? <p>Status: {getItemStatus()}</p> : <></>}
                    <p>Added On: {formatDate(created_at)}</p>
                    {isLoggedIn ? 
                        status == "1" ? (
                            isOwnItem ? 
                            <button className="btn btn-primary" onClick={() => handleShowEditItem({id, title, description, price})}>Modify Item Details</button> : 
                            <button className="btn btn-primary" onClick={() => handleAddToCart(id)}>Add Item To Cart</button>
                        ) :  <></> : <></>
                    }
                </div>
            </div>
        </div>
    );
}