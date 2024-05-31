import React, { useState, useEffect } from 'react';
import axiosClient from '../utils/axios';
import ItemsList from './ItemsListComponent';
import { useAuth } from '../utils/authUtils';
import CreateOrEditItemComponent from './CreateOrEditItemComponent';

export default function InventoryPage() {
  const { isLoggedIn } = useAuth();
  const [success, setSuccess] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [modalType, setModalType] = useState('create');
  const [itemId, setItemId] = useState('');
  const [itemTitle, setItemTitle] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  
  async function fetchInventory() {
    try {
      const response = await axiosClient.get('/myitems');
      return response.data;
    } catch (error) {
      throw error.response.data;
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
  
  async function fetchData(event = null) {
    if (event) {
      event.preventDefault();
    }
  
    try {
      setItems([]);
      const response = await fetchInventory();
      if (response && response.length) {
        setItems(response);
      } else {
        setError('Your inventory is empty.');
      }
    } catch (error) {
      setError(error.message || 'Failed to load data. Please try again after some time!');
    }
  }
  

  useEffect(() => {  
    fetchData();
  }, [error, success]);

  return (
    <div className="container">
      {success && <div className="alert alert-success">{successMessage}</div>}
      <h1 className="text-center">My Items</h1>
      <div className="btn-toolbar justify-content-center" role="toolbar" aria-label="Toolbar with button groups">
        {isLoggedIn ? <button className="btn btn-success mb-2" onClick={() => {
          setModalType('create');
          setShowAddItemModal(true);
        }}>Add an item</button> : null}
      </div>
      {items.length ?
        <ItemsList items={items} showStatus={true} handleShowEditItem={handleShowEditItem} />
      : !error ? (<div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div> ) : <div className="alert alert-danger" role="alert">{error}</div>}
      <CreateOrEditItemComponent modalType={modalType} showAddItemModal={showAddItemModal} setShowAddItemModal={setShowAddItemModal} setSuccess={setSuccess} setSuccessMessage={setSuccessMessage} ItemId={itemId} Title={itemTitle} Description={itemDescription} Price={itemPrice} />
    </div>
  );
};