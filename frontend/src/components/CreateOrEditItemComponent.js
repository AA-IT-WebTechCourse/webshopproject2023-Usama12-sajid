import React, { useEffect, useState } from 'react';
import axiosClient from '../utils/axios';
import Modal from 'react-modal';
Modal.setAppElement('#root');

export default function CreateOrEditItemComponent({ modalType, showAddItemModal, setShowAddItemModal, setSuccess, setSuccessMessage, ItemId = null, Title, Description, Price }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [itemId, setItemId] = useState('');

  async function addItem(data) {
    try {
      const response = await axiosClient.post('/items', data);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
  
  async function editItem(itemId, data) {
    try {
      const response = await axiosClient.patch(`/items/${itemId}`, data);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
  
  useEffect(function() {
    if (modalType === 'edit') {
      setTitle(Title);
      setDescription(Description);
      setPrice(Price);
      setItemId(ItemId);
    } else {
      setTitle('');
      setDescription('');
      setPrice('');
      setItemId(null);
    }
  }, [showAddItemModal]);
  
  async function handleSubmit(event) {
    event.preventDefault();
    setSuccess(false);
    setError('');
    setLoading(true);
    try {
      const data = {
        title,
        description,
        price
      };
  
      if (modalType === 'create') {
        await addItem(data);
        setSuccessMessage("New item listed successfully");
      } else {
        await editItem(itemId, data);
        setSuccessMessage("Item details modified successfully");
      }
      setSuccess(true);
      setShowAddItemModal(false);
    } catch (error) {
      setError(error.message || 'Some error occurred. Try again after sometime.');
    } finally {
      setLoading(false);
    }
  }  

  return (
    <Modal isOpen={showAddItemModal} onRequestClose={() => setShowAddItemModal(false)} className="auth-wrapper">
      <div className="auth-inner">
        {loading ? (
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (<>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <form onSubmit={handleSubmit}>
          <h3>{modalType == 'create' ? "Add Item" : "Edit Item Details"}</h3>
          <div className="mb-3">
            <label>Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="Please enter item title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>Description</label>
            <input
              type="description"
              className="form-control"
              placeholder="Please enter item description"
              value={description}
              required
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>Price</label>
            <input
              type="price"
              className="form-control"
              placeholder="Enter price"
              value={price}
              required
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="btn-toolbar justify-content-center">
            <button className="btn btn-primary mx-1">
            {modalType == 'create' ? "Add Item" : "Edit Item Details"}
            </button>
            <button className="btn btn-danger" onClick={() => setShowAddItemModal(false)}>Close</button>
          </div>
        </form>
        </>
      )}
      </div>
    </Modal>
  );
};
