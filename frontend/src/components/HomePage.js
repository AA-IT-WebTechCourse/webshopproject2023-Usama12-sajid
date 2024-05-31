import React, { useState, useEffect } from 'react';
import ItemsList from './ItemsListComponent';
import SearchBarComponent from './SearchBarComponent';
import axiosClient from '../utils/axios';
import { useAuth } from '../utils/authUtils';
import CreateOrEditItemComponent from './CreateOrEditItemComponent';
import CartComponent from './CartComponent';

export default function HomePage() {
  const { isLoggedIn, signout } = useAuth();
  const [success, setSuccess] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [modalType, setModalType] = useState('create');
  const [itemId, setItemId] = useState('');
  const [itemTitle, setItemTitle] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [showCartModal, setShowCartModal] = useState(false);

  async function populateDatabase() {
    try {
      const response = await axiosClient.post('/populate');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
  
  async function fetchItems() {
    try {
      const response = await axiosClient.get('/items');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
  
  async function searchItem(title) {
    try {
      const response = await axiosClient.get(`/items?title=${title}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
  
  async function addItemToCart(itemId) {
    try {
      const response = await axiosClient.patch(`/cart-item/${itemId}`);
      return response.data;
    } catch (error) {
      console.error(error.response);
      throw error.response.data;
    }
  }
  
  async function handleAddToCart(itemId) {
    try {
      setError('');
      setSuccess(false);
      let response = await addItemToCart(itemId);
      if (response) {
        setSuccess(true);
        setSuccessMessage('Item added to cart successfully');
      }
    } catch (error) {
      setError(error.message || 'Failed to add item to cart. Please try again after some time!');
    }
  }
  
  async function handlePopulate() {
    try {
      setItems([]);
      setError('');
      setSuccess('');
      let response = await populateDatabase();
      if (response) {
        signout();
        fetchData();
        setSuccess(true);
        setSuccessMessage('DB Populated Successfully');
      }
    } catch (error) {
      setError(error.message || 'Failed to populate DB. Please try again after some time!');
    }
  }
  
  async function fetchData(event = null) {
    if (event) {
      event.preventDefault();
    }
  
    try {
      setItems([]);
      let response;
      if (searchValue.length) {
        console.log(searchValue);
        response = await searchItem(searchValue);
      } else {
        response = await fetchItems();
      }
      
      if (response && response.length) {
        setItems(response);
      } else {
        setError(error.message || `Item(s) not found.`);
      }
    } catch (error) {
      setError(error.message || 'Failed to load data. Please try again after some time!');
    }
  }
  
  function handleShowEditItem(itemData) {
    setModalType('edit');
    setItemId(itemData.id);
    setItemTitle(itemData.title);
    setItemDescription(itemData.description);
    setItemPrice(itemData.price);
    setShowAddItemModal(true);
  }  

  useEffect(() => {  
    fetchData();
  }, [error, success]);

  return (
    <div className="container">
      {success && <div className="alert alert-success">{successMessage}</div>}
      <h1 className="text-center">Available Items</h1>
      <div className="btn-toolbar justify-content-center" role="toolbar" aria-label="Toolbar with button groups">
        {isLoggedIn ? 
        <>
          <button className="btn btn-success mx-1" onClick={() => {
            setModalType('create');
            setShowAddItemModal(true);
          }}>Add an item</button>
          <button className="btn btn-info mx-1" onClick={() => setShowCartModal(true)}>View Cart</button>
        </> : 
        null}
        <button className="btn btn-dark" onClick={handlePopulate}>Populate Database</button>
      </div>
      <SearchBarComponent
        searchValue={searchValue} 
        setSearchValue={setSearchValue}
        handleSubmit={(e) => fetchData(e)}
        showAddItemModal={showAddItemModal}
        showCartModal={showCartModal}
      />
      {items.length ?
        <ItemsList items={items} handleShowEditItem={handleShowEditItem} handleAddToCart={handleAddToCart} />
      : !error ? (<div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div> ) : <div className="alert alert-danger" role="alert">{error}</div>}
      <CreateOrEditItemComponent modalType={modalType} showAddItemModal={showAddItemModal} setShowAddItemModal={setShowAddItemModal} setSuccess={setSuccess} setSuccessMessage={setSuccessMessage} ItemId={itemId} Title={itemTitle} Description={itemDescription} Price={itemPrice} />
      <CartComponent showCartModal={showCartModal} setShowCartModal={setShowCartModal} setPaymentSuccess={setSuccess} setSuccessMessage={setSuccessMessage} /> 
    </div>
  );
};