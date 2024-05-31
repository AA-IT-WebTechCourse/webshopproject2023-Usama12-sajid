import React, { useEffect, useState } from 'react';
import axiosClient from '../utils/axios'
import Modal from 'react-modal';
Modal.setAppElement('#root');

export default function CartComponent({showCartModal, setShowCartModal, setPaymentSuccess, setSuccessMessage}) {
  const [cartItems, setCartItems] = useState([]);
  const [cartValue, setCartValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function removeItemFromCart(itemId) {
    try {
      const response = await axiosClient.delete(`/cart-item/${itemId}`);
      return response.data;
    } catch (error) {
      console.error(error.response);
      throw error.response.data;
    }
  }
  
  async function showCartItems() {
    try {
      const response = await axiosClient.get('/view-cart');
      return response.data;
    } catch (error) {
      console.error(error.response);
      throw error.response.data;
    }
  }
  
  async function confirmOrder() {
    try {
      const response = await axiosClient.post('/confirm-order');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
  
  async function fetchCartData() {
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      let response = await showCartItems();
      if (response) {
        setCartItems(response.items);
        setCartValue(response.total_price);
      } else {
        setError('');
      }
    } catch (error) {
      setError(error.message || 'Some Error Occured. Try again later. . .');
    } finally {
      setLoading(false);
    }
  }  

  useEffect(() => {
    return () => {
        fetchCartData();
    };
  }, [showCartModal]);

  // Handle form submission
  const handleSubmit = async (event) => {
    setLoading(true);
    setSuccess('');
    setError('');
    try {
        let response = await confirmOrder();
        if (response) {
            setPaymentSuccess(true);
            setSuccessMessage('Item(s) purchased successfully');
            setShowCartModal(false);
        } else {
            setError('');
        }
    } catch (error) {
        setError(error.message || 'Failed to process payment. Please try again after some time!');
    } finally {
        setLoading(false);
    }
  };

  async function handleRemoveFromCart(itemId) {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
        let response = await removeItemFromCart(itemId);
        if (response) {
            response = await showCartItems();
            if (response) {
                setCartItems(response.items);
                setCartValue(response.total_price);
                setSuccess('Item removed from cart!');
                setPaymentSuccess(false);
                setSuccessMessage('');
            }
        }
    } catch (error) {
        setError(error.message || 'Failed to remove item. Please try again after some time!');
    } finally {
        setLoading(false);
    }
  };

  return (
    <Modal isOpen={showCartModal} onRequestClose={() => setShowCartModal(false)} className="auth-wrapper">
    <div className="auth-inner">
      {loading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">{error}</div>
      ) : (
        <form onSubmit={handleSubmit}>
          {success && <div className="alert alert-primary" role="alert">{success}</div>}
          {cartItems.length ? (
            <>
              <h3>Cart Details</h3>
              <div className="modal-body">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Price</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map(item => (
                      <tr key={item.id}>
                        <td>{item.title}</td>
                        <td>{item.price} Euros</td>
                        <td><a className="icon-link link-danger" onClick={() => handleRemoveFromCart(item.id)}>Remove Item</a></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="total-price text-center">Total Price: {cartValue} Euros</div>
              </div>
              <div className="btn-toolbar mt-2 justify-content-center">
                <button className="btn btn-primary mx-1">Buy Items</button>
                <button className="btn btn-danger" onClick={() => setShowCartModal(false)}>Close</button>
              </div>
            </>
          ) : (
            <div className="btn-toolbar justify-content-center">
              <h4>No items in the cart!</h4>
              <button className="btn btn-danger ml-2" onClick={() => setShowCartModal(false)}>Close</button>
            </div>
          )}
        </form>
      )}
    </div>
  </Modal>
  );
};